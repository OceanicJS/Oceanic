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
const undici_1 = require("undici");
/**
 * Latency & ratelimit related things lovingly borrowed from eris
 * https://github.com/abalabahaha/eris/blob/dev/lib/rest/RequestHandler.js (eb403730855714eafa36c541dbe2cb84c9979158)
 */
/** The primary means of communicating with Discord via rest. */
class RequestHandler {
    globalBlock = false;
    latencyRef;
    #manager;
    options;
    ratelimits = {};
    readyQueue = [];
    constructor(manager, options = {}) {
        if (options && options.baseURL && options.baseURL.endsWith("/"))
            options.baseURL = options.baseURL.slice(0, -1);
        this.#manager = manager;
        this.options = {
            agent: options.agent,
            baseURL: options.baseURL || Constants_1.API_URL,
            disableLatencyCompensation: !!options.disableLatencyCompensation,
            host: options.host ? options.host : options.baseURL ? new URL(options.baseURL).host : new URL(Constants_1.API_URL).host,
            latencyThreshold: options.latencyThreshold ?? 30000,
            ratelimiterOffset: options.ratelimiterOffset ?? 0,
            requestTimeout: options.requestTimeout ?? 15000,
            userAgent: options.userAgent || Constants_1.USER_AGENT
        };
        this.latencyRef = {
            lastTimeOffsetCheck: 0,
            latency: options.ratelimiterOffset || 0,
            raw: new Array(10).fill(options.ratelimiterOffset),
            timeOffsets: new Array(10).fill(0),
            timeoffset: 0
        };
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
     * @param options The options for the request.
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
                    else if (options.auth && this.#manager.client.options.auth)
                        headers.Authorization = this.#manager.client.options.auth;
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
                                this.#manager.client.emit("error", err);
                                resBody = b;
                            }
                        }
                        else
                            resBody = Buffer.from(await res.arrayBuffer());
                    }
                    this.#manager.client.emit("request", {
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
                            this.#manager.client.emit("warn", `Your clock is ${this.latencyRef.timeoffset}ms behind Discord's server clock. Please check your connection and system time.`);
                        }
                        this.latencyRef.timeoffset = this.latencyRef.timeoffset - ~~(this.latencyRef.timeOffsets.shift() / 10) + ~~(timeOffset / 10);
                        this.latencyRef.timeOffsets.push(timeOffset);
                    }
                    if (res.headers.has("x-ratelimit-limit"))
                        this.ratelimits[route].limit = Number(res.headers.get("x-ratelimit-limit"));
                    if (options.method !== "GET" && (!res.headers.has("x-ratelimit-remaining") || !res.headers.has("x-ratelimit-limit")) && this.ratelimits[route].limit !== 1) {
                        this.#manager.client.emit("debug", [`Missing ratelimit headers for SequentialBucket(${this.ratelimits[route].remaining}/${this.ratelimits[route].limit}) with non-default limit\n`,
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
                        this.#manager.client.emit("debug", `${now} ${route} ${res.status}: ${latency}ms (${this.latencyRef.latency}ms avg) | ${this.ratelimits[route].remaining}/${this.ratelimits[route].limit} left | Reset ${this.ratelimits[route].reset} (${this.ratelimits[route].reset - now}ms left)`);
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
                            this.#manager.client.emit("debug", `${res.headers.has("x-ratelimit-global") ? "Global" : "Unexpected"} RateLimit: ${JSON.stringify(resBody)}\n${now} ${route} ${res.status}: ${latency}ms (${this.latencyRef.latency}ms avg) | ${this.ratelimits[route].remaining}/${this.ratelimits[route].limit} left | Reset ${delay} (${this.ratelimits[route].reset - now}ms left) | Scope ${res.headers.get("x-ratelimit-scope")}`);
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
                            this.#manager.client.emit("debug", `Unexpected 502 on ${options.method} ${route}`);
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
                    this.#manager.client.emit("error", err);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVxdWVzdEhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvcmVzdC9SZXF1ZXN0SGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDBFQUFrRDtBQUNsRCwwRUFBa0Q7QUFDbEQsMEVBQWtEO0FBR2xELDRDQUFnRTtBQUNoRSw4REFBc0M7QUFHdEMsbUNBQXdEO0FBRXhEOzs7R0FHRztBQUVILGdFQUFnRTtBQUNoRSxNQUFxQixjQUFjO0lBQy9CLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDcEIsVUFBVSxDQUFhO0lBQ3ZCLFFBQVEsQ0FBYztJQUN0QixPQUFPLENBQWdDO0lBQ3ZDLFVBQVUsR0FBcUMsRUFBRSxDQUFDO0lBQ2xELFVBQVUsR0FBc0IsRUFBRSxDQUFDO0lBQ25DLFlBQVksT0FBb0IsRUFBRSxVQUF1QixFQUFFO1FBQ3ZELElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO1lBQUUsT0FBTyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoSCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ1gsS0FBSyxFQUF1QixPQUFPLENBQUMsS0FBSztZQUN6QyxPQUFPLEVBQXFCLE9BQU8sQ0FBQyxPQUFPLElBQUksbUJBQU87WUFDdEQsMEJBQTBCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQywwQkFBMEI7WUFDaEUsSUFBSSxFQUF3QixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxD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