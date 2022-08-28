import SequentialBucket from "./SequentialBucket";
import type RESTManager from "./RESTManager";
import type { LatencyRef, RequestHandlerInstanceOptions, RequestOptions } from "../types/request-handler";
import type { RESTOptions } from "../types/client";
/**
 * Latency & ratelimit related things lovingly borrowed from eris
 * https://github.com/abalabahaha/eris/blob/dev/lib/rest/RequestHandler.js (eb403730855714eafa36c541dbe2cb84c9979158)
 */
/** The primary means of communicating with Discord via rest. */
export default class RequestHandler {
    private _manager;
    globalBlock: boolean;
    latencyRef: LatencyRef;
    options: RequestHandlerInstanceOptions;
    ratelimits: Record<string, SequentialBucket>;
    readyQueue: Array<() => void>;
    constructor(manager: RESTManager, options?: RESTOptions);
    private getRoute;
    private globalUnblock;
    /** same as `request`, but with `auth` always set to `true`. */
    authRequest<T = unknown>(options: Omit<RequestOptions, "auth">): Promise<T>;
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
    request<T = unknown>(options: RequestOptions): Promise<T>;
}
