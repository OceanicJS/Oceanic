import type { AllowedMentions } from "./channels";
import type { ImageFormat } from "../Constants";
import type { Agent } from "undici";

export interface ClientOptions {
	/** The default allowed mentions. */
	allowedMentions?: AllowedMentions;
	/** Fully qualified authorization string (e.x. Bot [TOKEN]) - you MUST prefix it yourself */
	auth?: string | null;
	/** The default image format to use. */
	defaultImageFormat?: ImageFormat;
	/** The default image size to use. */
	defaultImageSize?: number;
	/** The options to pass to the request handler. */
	rest?: RESTOptions;
}
type ClientInstanceOptions = Required<Omit<ClientOptions, "rest">>;

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
