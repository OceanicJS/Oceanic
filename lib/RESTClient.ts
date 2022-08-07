import type { File, RequestHandlerOptions } from "./rest/RequestHandler";
import RequestHandler from "./rest/RequestHandler";
import Users from "./routes/Users";
import Properties from "./util/Properties";
import type { ImageFormat, RESTMethod } from "./Constants";
import { MAX_IMAGE_SIZE, MIN_IMAGE_SIZE, ImageFormats } from "./Constants";
import { CDN_URL } from "./util/Routes";
import Guilds from "./routes/Guilds";

export interface RESTClientOptions {
	/** Fully qualified authorization string (e.x. Bot [TOKEN]) - you MUST prefix it yourself */
	auth?: string | null;
	/** The default image format to use. */
	defaultImageFormat?: ImageFormat;
	/** The default image size to use. */
	defaultImageSize?: number;
	/** The options to pass to the request handler. */
	rest?: RequestHandlerOptions;
}
type InstanceOptions = Required<Omit<RESTClientOptions, "rest">>;

/** A REST based client, nothing will be cached. */
export default class RESTClient {
	private _handler: RequestHandler;
	guilds: Guilds;
	options: InstanceOptions;
	users: Users;
	constructor(options?: RESTClientOptions) {
		Properties.new(this)
			.define("_handler", new RequestHandler(this, options?.rest))
			.define("guilds", new Guilds(this))
			.define("users", new Users(this))
			.define("options", {
				auth:               options?.auth || null,
				defaultImageFormat: options?.defaultImageFormat || "png",
				defaultImageSize:   options?.defaultImageSize || 4096
			});
	}

	/** @hidden intentionally not documented */
	_formatImage(url: string, format?: ImageFormat, size?: number) {
		if (!format || !ImageFormats.includes(format.toLowerCase() as ImageFormat)) format = url.includes("/a_") ? "gif" : this.options.defaultImageFormat;
		if (!size || size < MIN_IMAGE_SIZE || size > MAX_IMAGE_SIZE) size = this.options.defaultImageSize;
		return `${CDN_URL}${url}.${format}?size=${size}`;
	}

	/** Alias for {@link RequestHandler#authRequest} */
	async authRequest<T = unknown>(method: RESTMethod, path: string, body?: unknown, files?: Array<File>, reason?: string, priority = false, route?: string) {
		return this._handler.authRequest<T>(method, path, body, files, reason, priority, route);
	}

	/** Alias for {@link RequestHandler#request} */
	async request<T = unknown>(method: RESTMethod, path: string, body?: unknown, files?: Array<File>, reason?: string, auth: boolean | string = false, priority = false, route?: string) {
		return this._handler.request<T>(method, path, body, files, reason, auth, priority, route);
	}
}
