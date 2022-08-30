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
     * Make a request. `null` will be returned if the request results in a `204 NO CONTENT`.
     * @param options - The options for the request.
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
                    const retryAfter = Number(res.headers.get("x-ratelimit-reset-after") || res.headers.get("retry-after") || 0) * 1000;
                    if (retryAfter >= 0) {
                        if (res.headers.has("x-ratelimit-global")) {
                            this.globalBlock = true;
                            setTimeout(this.globalUnblock.bind(this), retryAfter || 1);
                        }
                        else
                            this.ratelimits[route].reset = (retryAfter || 1) + now;
                    }
                    else if (res.headers.has("x-ratelimit-reset")) {
                        let resetTime = Number(res.headers.get("x-ratelimit-reset")) * 1000;
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
                                    delay = resBody.retry_after * 1000;
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
                                return;
                            }
                            else {
                                cb();
                                this.request(options).then(resolve).catch(reject);
                                return;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVxdWVzdEhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvcmVzdC9SZXF1ZXN0SGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDBFQUFrRDtBQUNsRCwwRUFBa0Q7QUFDbEQsMEVBQWtEO0FBR2xELDRDQUFnRTtBQUNoRSw4REFBc0M7QUFDdEMsb0VBQTRDO0FBRzVDLG1DQUF3RDtBQUV4RDs7O0dBR0c7QUFFSCxnRUFBZ0U7QUFDaEUsTUFBcUIsY0FBYztJQUN2QixRQUFRLENBQWM7SUFDOUIsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUNwQixVQUFVLENBQWE7SUFDdkIsT0FBTyxDQUFnQztJQUN2QyxVQUFVLEdBQXFDLEVBQUUsQ0FBQztJQUNsRCxVQUFVLEdBQXNCLEVBQUUsQ0FBQztJQUNuQyxZQUFZLE9BQW9CLEVBQUUsVUFBdUIsRUFBRTtRQUN2RCxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztZQUFFLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEgsb0JBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO2FBQ2YsV0FBVyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUM7YUFDaEMsTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUNmLEtBQUssRUFBdUIsT0FBTyxDQUFDLEtBQUs7WUFDekMsT0FBTyxFQUFxQixPQUFPLENBQUMsT0FBTyxJQUFJLG1CQUFPO1lBQ3RELDBCQUEwQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsMEJBQTBCO1lBQ2hFLElBQUksRUFBd0IsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENB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