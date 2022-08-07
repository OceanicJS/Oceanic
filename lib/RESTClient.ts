import type { File, RequestHandlerOptions } from "./rest/RequestHandler";
import RequestHandler from "./rest/RequestHandler";
import Users from "./routes/Users";
import Properties from "./util/Properties";
import type { ImageFormat, RESTMethod } from "./Constants";
import { MAX_IMAGE_SIZE, MIN_IMAGE_SIZE, ImageFormats } from "./Constants";
import { CDN_URL } from "./util/Routes";
import Guilds from "./routes/Guilds";
import Channels from "./routes/Channels";

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

const BASE64URL_REGEX = /^data:image\/(?:jpeg|png|gif);base64,(?:[A-Za-z0-9+/]{2}[A-Za-z0-9+/]{2})*(?:[A-Za-z0-9+/]{2}(==)?|[A-Za-z0-9+/]{3}=?)?$/;
/** A REST based client, nothing will be cached. */
export default class RESTClient {
	private _handler: RequestHandler;
	channels: Channels;
	guilds: Guilds;
	options: InstanceOptions;
	users: Users;
	constructor(options?: RESTClientOptions) {
		Properties.new(this)
			.define("_handler", new RequestHandler(this, options?.rest))
			.define("channels", new Channels(this))
			.define("guilds", new Guilds(this))
			.define("users", new Users(this))
			.define("options", {
				auth:               options?.auth || null,
				defaultImageFormat: options?.defaultImageFormat || "png",
				defaultImageSize:   options?.defaultImageSize || 4096
			});
	}

	/** @hidden intentionally not documented - this is an internal function */
	_convertImage(img: Buffer | string) {
		if (Buffer.isBuffer(img)) {
			const b64 = img.toString("base64");
			let mime: string | undefined;
			const magic = [...new Uint8Array(img.subarray(0, 4))].map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
			switch (magic) {
				case "47494638": mime = "image/gif"; break;
				case "89504E47": mime = "image/png"; break;
				case "FFD8FFDB": case "FFD8FFE0": case "49460001": case "FFD8FFEE": case "69660000": mime = "image/jpeg"; break;
			}
			if (!mime) throw new Error(`Failed to determine image format. (magic: ${magic})`);
			img = `data:${mime};base64,${b64}`;
		}
		if (!BASE64URL_REGEX.test(img)) throw new Error("Invalid image provided. Ensure you are providing a valid, fully-qualified base64 url.");
		return img;
	}

	/** @hidden intentionally not documented - this is an internal function */
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
