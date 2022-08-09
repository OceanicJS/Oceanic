import Properties from "./util/Properties";
import type { ImageFormat } from "./Constants";
import { MAX_IMAGE_SIZE, MIN_IMAGE_SIZE, ImageFormats } from "./Constants";
import { CDN_URL } from "./util/Routes";
import RESTManager from "./rest/RESTManager";
import Collection from "./util/Collection";
import type { RawPrivateChannel as RawPrivateChannel, RawGroupChannel } from "./routes/Channels";
import PrivateChannel from "./structures/PrivateChannel";
import GroupChannel from "./structures/GroupChannel";
import type { RawUser } from "./routes/Users";
import type User from "./structures/User";
import type { Agent } from "undici";

const BASE64URL_REGEX = /^data:image\/(?:jpeg|png|gif);base64,(?:[A-Za-z0-9+/]{2}[A-Za-z0-9+/]{2})*(?:[A-Za-z0-9+/]{2}(==)?|[A-Za-z0-9+/]{3}=?)?$/;
/** A REST based client, nothing will be cached. */
export default class Client {
	groupChannels: Collection<string, RawGroupChannel, GroupChannel>;
	options: InstanceOptions;
	privateChannels: Collection<string, RawPrivateChannel, PrivateChannel>;
	rest: RESTManager;
	users: Collection<string, RawUser, User>;
	constructor(options?: ClientOptions) {
		Properties.new(this)
			.define("options", {
				auth:               options?.auth || null,
				defaultImageFormat: options?.defaultImageFormat || "png",
				defaultImageSize:   options?.defaultImageSize || 4096
			})
			.define("groupChannels", new Collection(GroupChannel, this))
			.define("privateChannels", new Collection(PrivateChannel, this))
			.define("rest", new RESTManager(this, options?.rest));
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
}

export interface ClientOptions {
	/** Fully qualified authorization string (e.x. Bot [TOKEN]) - you MUST prefix it yourself */
	auth?: string | null;
	/** The default image format to use. */
	defaultImageFormat?: ImageFormat;
	/** The default image size to use. */
	defaultImageSize?: number;
	/** The options to pass to the request handler. */
	rest?: RESTOptions;
}
type InstanceOptions = Required<Omit<ClientOptions, "rest">>;

export interface RESTOptions {
	agent?: Agent | null;
	/** the base url for requests - must be fully qualified (default: `https://discord.com/api/v[REST_VERSION]`) */
	baseURL?: string;
	/** If the built in latency compensator should be disabled (default: false) */
	disableLatencyCompensation?: boolean;
	/** the host to use with requests (default: domain from `baseURL`) */
	host?: string;
	/** in milliseconds, the average request latency at which to start emitting latency errors (default: 30000) */
	latencyThreshold?: number;
	/** in milliseconds, the time to offset ratelimit calculations by (default: 0) */
	ratelimiterOffset?: number;
	/** in milliseconds, how long to wait until a request is timed out (default: 15000) */
	requestTimeout?: number;
	/** the user agent to use for requests (default: `Oceanic/VERSION (https://github.com/DonovanDMC/Oceanic)`) */
	userAgent?: string;
}
