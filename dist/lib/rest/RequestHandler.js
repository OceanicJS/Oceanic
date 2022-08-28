"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SequentialBucket_1 = __importDefault(require("./SequentialBucket"));
const DiscordRESTError_1 = __importDefault(require("./DiscordRESTError"));
const DiscordHTTPError_1 = __importDefault(require("./DiscordHTTPError"));
const Constants_1 = require("../Constants");
const Base_1 = __importDefault(require("../structures/Base"));
const Properties_1 = __importDefault(require("../util/Properties"));
const undici_1 = require("undici");
/**
 * Latency & ratelimit related things lovingly borrowed from eris
 * https://github.com/abalabahaha/eris/blob/dev/lib/rest/RequestHandler.js (eb403730855714eafa36c541dbe2cb84c9979158)
 */
/** The primary means of communicating with Discord via rest. */
class RequestHandler {
    _manager;
    globalBlock = false;
    latencyRef;
    options;
    ratelimits = {};
    readyQueue = [];
    constructor(manager, options = {}) {
        if (options && options.baseURL && options.baseURL.endsWith("/"))
            options.baseURL = options.baseURL.slice(0, -1);
        Properties_1.default.new(this)
            .looseDefine("_manager", manager)
            .define("options", {
            agent: options.agent,
            baseURL: options.baseURL || Constants_1.API_URL,
            disableLatencyCompensation: !!options.disableLatencyCompensation,
            host: options.host || options.baseURL ? new URL(this.options.baseURL).host : new URL(Constants_1.API_URL).host,
            latencyThreshold: options.latencyThreshold ?? 30000,
            ratelimiterOffset: options.ratelimiterOffset ?? 0,
            requestTimeout: options.requestTimeout ?? 15000,
            userAgent: options.userAgent || Constants_1.USER_AGENT
        })
            .define("latencyRef", {
            lastTimeOffsetCheck: 0,
            latency: options.ratelimiterOffset || 0,
            raw: new Array(10).fill(options.ratelimiterOffset),
            timeOffsets: new Array(10).fill(0),
            timeoffset: 0
        });
    }
    getRoute(path, method) {
        let route = path.replace(/\/([a-z-]+)\/(?:[\d]{15,21})/g, function (match, p) {
            return p === "channels" || p === "guilds" || p === "webhooks" ? match : `/${p}/:id`;
        }).replace(/\/reactions\/[^/]+/g, "/reactions/:id").replace(/\/reactions\/:id\/[^/]+/g, "/reactions/:id/:userID").replace(/^\/webhooks\/(\d+)\/[A-Za-z0-9-_]{64,}/, "/webhooks/$1/:token");
        if (method === "DELETE" && route.endsWith("/messages/:id")) {
            const messageID = path.slice(path.lastIndexOf("/") + 1);
            const createdAt = Base_1.default.getCreatedAt(messageID).getTime();
            if (Date.now() - this.latencyRef.latency - createdAt >= 1000 * 60 * 60 * 24 * 14)
                method += "_OLD";
            else if (Date.now() - this.latencyRef.latency - createdAt <= 1000 * 10)
                method += "_NEW";
            route = method + route;
        }
        else if (method === "GET" && /\/guilds\/[0-9]+\/channels$/.test(route)) {
            route = "/guilds/:id/channels";
        }
        if (method === "PUT" || method === "DELETE") {
            const index = route.indexOf("/reactions");
            if (index !== -1)
                route = "MODIFY" + route.slice(0, index + 10);
        }
        return route;
    }
    globalUnblock() {
        this.globalBlock = false;
        while (this.readyQueue.length > 0)
            this.readyQueue.shift()();
    }
    /** same as `request`, but with `auth` always set to `true`. */
    async authRequest(options) {
        return this.request({
            ...options,
            auth: true
        });
    }
    /**
     * Make a request
     *
     * @template T
     * @param {Object} options
     * @param {(Boolean | String)} [options.auth=false] - True to use global auth if specified, false for no auth, and a string value for specific authorization (must be prefixed).
     * @param {File[]} [options.files] - The files to send with this request.
     * @param {FormData} [options.form] - The form body to send with the request. Mutually exclusive with `json`.
     * @param {Object} [options.json] - The json body to send with the request. Mutually exclusive with `form`.
     * @param {RESTMethod} options.method - The method of this request.
     * @param {String} options.path - The path of this request - will be combined with baseURL.
     * @param {Boolean} [options.priority=false] - If this request should be considered a priority.
     * @param {String} [options.reason] - The value to pass in `X-Audit-Log-Reason`, if applicable.
     * @param {String} [options.route] - The route path (with placeholders).
     * @returns {Promise<T>} - The result body, null if no content
     */
    async request(options) {
        options.method = options.method.toUpperCase();
        if (!Constants_1.RESTMethods.includes(options.method))
            throw new Error(`Invalid method "${options.method}.`);
        const _stackHolder = {};
        Error.captureStackTrace(_stackHolder);
        if (!options.path.startsWith("/"))
            options.path = `/${options.path}`;
        const route = options.route || this.getRoute(options.path, options.method);
        if (!this.ratelimits[route])
            this.ratelimits[route] = new SequentialBucket_1.default(1, this.latencyRef);
        let attempts = 0;
        return new Promise((resolve, reject) => {
            async function attempt(cb) {
                const headers = {};
                try {
                    if (typeof options.auth === "string")
                        headers.Authorization = options.auth;
                    else if (options.auth && this._manager.client.options.auth)
                        headers.Authorization = this._manager.client.options.auth;
                    if (options.reason)
                        headers["X-Audit-Log-Reason"] = encodeURIComponent(options.reason);
                    let reqBody;
                    if (options.method !== "GET") {
                        let stringBody;
                        if (options.json)
                            stringBody = JSON.stringify(options.json, (k, v) => typeof v === "bigint" ? v.toString() : v);
                        if (options.form)
                            reqBody = options.form;
                        if (options.files && options.files.length > 0) {
                            const data = reqBody && reqBody instanceof undici_1.FormData ? reqBody : new undici_1.FormData();
                            options.files.forEach((file, index) => {
                                if (!file.contents)
                                    return;
                                data.set(`files[${index}]`, new undici_1.File([file.contents], file.name));
                            });
                            if (stringBody)
                                data.set("payload_json", stringBody);
                            reqBody = data;
                        }
                        else if (options.json) {
                            reqBody = stringBody;
                            headers["Content-Type"] = "application/json";
                        }
                    }
                    if (this.options.host)
                        headers.Host = this.options.host;
                    const url = `${this.options.baseURL}${options.path}${options.query && Array.from(options.query.keys()).length > 0 ? `?${options.query.toString()}` : ""}`;
                    let latency = Date.now();
                    const controller = new AbortController();
                    let timeout;
                    if (this.options.requestTimeout > 0 && this.options.requestTimeout !== Infinity)
                        timeout = setTimeout(() => controller.abort(), this.options.requestTimeout);
                    const res = await (0, undici_1.fetch)(url, {
                        method: options.method,
                        headers,
                        body: reqBody,
                        dispatcher: this.options.agent || undefined,
                        signal: controller.signal
                    });
                    if (timeout)
                        clearTimeout(timeout);
                    latency = Date.now() - latency;
                    if (!this.options.disableLatencyCompensation) {
                        this.latencyRef.raw.push(latency);
                        this.latencyRef.latency = this.latencyRef.latency - ~~(this.latencyRef.raw.shift() / 10) + ~~(latency / 10);
                    }
                    let resBody;
                    if (res.status === 204)
                        resBody = null;
                    else {
                        if (res.headers.get("content-type") === "application/json") {
                            const b = await res.text();
                            try {
                                resBody = JSON.parse(b);
                            }
                            catch (err) {
                                this._manager.client.emit("error", err);
                                resBody = b;
                            }
                        }
                        else
                            resBody = Buffer.from(await res.arrayBuffer());
                    }
                    this._manager.client.emit("request", {
                        method: options.method,
                        path: options.path,
                        route,
                        withAuth: !!options.auth,
                        requestBody: reqBody,
                        responseBody: resBody
                    });
                    const headerNow = Date.parse(res.headers.get("date"));
                    const now = Date.now();
                    if (this.latencyRef.lastTimeOffsetCheck < (Date.now() - 5000)) {
                        const timeOffset = headerNow + 500 - (this.latencyRef.lastTimeOffsetCheck = Date.now());
                        if (this.latencyRef.timeoffset - this.latencyRef.latency >= this.options.latencyThreshold && timeOffset - this.latencyRef.latency >= this.options.latencyThreshold) {
                            this._manager.client.emit("warn", `Your clock is ${this.latencyRef.timeoffset}ms behind Discord's server clock. Please check your connection and system time.`);
                        }
                        this.latencyRef.timeoffset = this.latencyRef.timeoffset - ~~(this.latencyRef.timeOffsets.shift() / 10) + ~~(timeOffset / 10);
                        this.latencyRef.timeOffsets.push(timeOffset);
                    }
                    if (res.headers.has("x-ratelimit-limit"))
                        this.ratelimits[route].limit = Number(res.headers.get("x-ratelimit-limit"));
                    if (options.method !== "GET" && (!res.headers.has("x-ratelimit-remaining") || !res.headers.has("x-ratelimit-limit")) && this.ratelimits[route].limit !== 1) {
                        this._manager.client.emit("debug", [`Missing ratelimit headers for SequentialBucket(${this.ratelimits[route].remaining}/${this.ratelimits[route].limit}) with non-default limit\n`,
                            `${res.status} ${res.headers.get("content-type")}: ${options.method} ${route} | ${res.headers.get("cf-ray")}\n`,
                            `content-type = ${res.headers.get("content-type")}\n`,
                            `x-ratelimit-remaining = " + ${res.headers.get("x-ratelimit-remaining")}\n`,
                            `x-ratelimit-limit = " + ${res.headers.get("x-ratelimit-limit")}\n`,
                            `x-ratelimit-reset = " + ${res.headers.get("x-ratelimit-reset")}\n`,
                            `x-ratelimit-global = " + ${res.headers.get("x-ratelimit-global")}`].join("\n"));
                    }
                    this.ratelimits[route].remaining = !res.headers.has("x-ratelimit-remaining") ? 1 : Number(res.headers.get("x-ratelimit-remaining")) || 0;
                    const retryAfter = Number(res.headers.get("x-ratelimit-reset-after") || res.headers.get("retry-after") || 0);
                    if (retryAfter >= 0) {
                        if (res.headers.has("x-ratelimit-global")) {
                            this.globalBlock = true;
                            setTimeout(this.globalUnblock.bind(this), retryAfter || 1);
                        }
                        else
                            this.ratelimits[route].reset = (retryAfter || 1) + now;
                    }
                    else if (res.headers.has("x-ratelimit-reset")) {
                        let resetTime = Number(res.headers.get("x-ratelimit-reset")) * 100;
                        if (route.endsWith("/reactions/:id") && (resetTime - headerNow) === 1000)
                            resetTime = now + 250;
                        this.ratelimits[route].reset = Math.max(resetTime - this.latencyRef.latency, now);
                    }
                    else
                        this.ratelimits[route].reset = now;
                    if (res.status !== 429)
                        this._manager.client.emit("debug", `${now} ${route} ${res.status}: ${latency}ms (${this.latencyRef.latency}ms avg) | ${this.ratelimits[route].remaining}/${this.ratelimits[route].limit} left | Reset ${this.ratelimits[route].reset} (${this.ratelimits[route].reset - now}ms left)`);
                    if (res.status > 300) {
                        if (res.status === 429) {
                            let delay = retryAfter;
                            if (res.headers.get("x-ratelimit-scope") === "shared") {
                                try {
                                    delay = resBody.retry_after;
                                }
                                catch (err) {
                                    reject(err);
                                }
                            }
                            this._manager.client.emit("debug", `${res.headers.has("x-ratelimit-global") ? "Global" : "Unexpected"} RateLimit: ${JSON.stringify(resBody)}\n${now} ${route} ${res.status}: ${latency}ms (${this.latencyRef.latency}ms avg) | ${this.ratelimits[route].remaining}/${this.ratelimits[route].limit} left | Reset ${delay} (${this.ratelimits[route].reset - now}ms left) | Scope ${res.headers.get("x-ratelimit-scope")}`);
                            if (delay) {
                                setTimeout(() => {
                                    cb();
                                    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, prefer-spread
                                    this.request(options).then(resolve).catch(reject);
                                }, delay);
                            }
                            else {
                                cb();
                                this.request(options).then(resolve).catch(reject);
                            }
                        }
                        else if (res.status === 502 && ++attempts < 4) {
                            this._manager.client.emit("debug", `Unexpected 502 on ${options.method} ${route}`);
                            setTimeout(() => {
                                this.request(options).then(resolve).catch(reject);
                            }, Math.floor(Math.random() * 1900 + 100));
                            return cb();
                        }
                        cb();
                        let { stack } = _stackHolder;
                        if (stack.startsWith("Error\n"))
                            stack = stack.substring(6);
                        let err;
                        if (resBody && typeof resBody === "object" && "code" in resBody) {
                            err = new DiscordRESTError_1.default(res, resBody, options.method, stack);
                        }
                        else {
                            err = new DiscordHTTPError_1.default(res, resBody, options.method, stack);
                        }
                        reject(err);
                        return;
                    }
                    cb();
                    resolve(resBody);
                }
                catch (err) {
                    if (err instanceof Error && err.constructor.name === "DOMException" && err.name === "AbortError") {
                        cb();
                        reject(new Error(`Request Timed Out (>${this.options.requestTimeout}ms) on ${options.method} ${options.path}`));
                    }
                    this._manager.client.emit("error", err);
                }
            }
            if (this.globalBlock && options.auth) {
                (options.priority ? this.readyQueue.unshift.bind(this.readyQueue) : this.readyQueue.push.bind(this.readyQueue))(() => {
                    this.ratelimits[route].queue(attempt.bind(this), options.priority);
                });
            }
            else
                this.ratelimits[route].queue(attempt.bind(this), options.priority);
        });
    }
}
exports.default = RequestHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVxdWVzdEhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvcmVzdC9SZXF1ZXN0SGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDBFQUFrRDtBQUNsRCwwRUFBa0Q7QUFDbEQsMEVBQWtEO0FBR2xELDRDQUFnRTtBQUNoRSw4REFBc0M7QUFDdEMsb0VBQTRDO0FBRzVDLG1DQUF3RDtBQUV4RDs7O0dBR0c7QUFFSCxnRUFBZ0U7QUFDaEUsTUFBcUIsY0FBYztJQUMxQixRQUFRLENBQWM7SUFDOUIsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUNwQixVQUFVLENBQWE7SUFDdkIsT0FBTyxDQUFnQztJQUN2QyxVQUFVLEdBQXFDLEVBQUUsQ0FBQztJQUNsRCxVQUFVLEdBQXNCLEVBQUUsQ0FBQztJQUNuQyxZQUFZLE9BQW9CLEVBQUUsVUFBdUIsRUFBRTtRQUMxRCxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztZQUFFLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEgsb0JBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO2FBQ2xCLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDO2FBQ2hDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7WUFDbEIsS0FBSyxFQUF1QixPQUFPLENBQUMsS0FBSztZQUN6QyxPQUFPLEVBQXFCLE9BQU8sQ0FBQyxPQUFPLElBQUksbUJBQU87WUFDdEQsMEJBQTBCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQywwQkFBMEI7WUFDaEUsSUFBSSxFQUF3QixPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUks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