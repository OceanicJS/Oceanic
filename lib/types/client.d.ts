/** @module Types/Client */
import type { AllowedMentions } from "./channels";
import type { GatewayOptions } from "./gateway";
import type { ImageFormat } from "../Constants";
import type { Agent } from "undici";

export interface ClientOptions {
    /**
     * The default allowed mentions object.
     * @defaultValue { everyone: false, repliedUser: false, roles: true, users: true }
     */
    allowedMentions?: AllowedMentions;
    /** Fully qualified authorization string (e.x. Bot [TOKEN]) - you MUST prefix it yourself */
    auth?: string | null;
    /** The maximum number of items that can be present in various collections. */
    collectionLimits?: CollectionLimitsOptions;
    /**
     * The default image format to use.
     * @defaultValue png
     */
    defaultImageFormat?: ImageFormat;
    /**
     * The default image size to use.
     * @defaultValue 4096
     */
    defaultImageSize?: number;
    /**
     * When member limits are set on guilds, the limit is automatically raised if needed when requesting members from the gateway. This can be buggy and may not function correctly.
     * @defaultValue false
     */
    disableMemberLimitScaling?: boolean;
    /** The gateway options. */
    gateway?: GatewayOptions;
    /** The options for the request handler. */
    rest?: RESTOptions;
}
type ClientInstanceOptions = Required<Omit<ClientOptions, "rest" | "gateway" | "collectionLimits">> & { collectionLimits: Required<CollectionLimitsOptions>; };

export interface RESTOptions {
    /**
     * The agent to use for requests.
     * @defaultValue null
     */
    agent?: Agent | null;
    /**
     * The base URL to use for requests - must be a fully qualified url.
     * @defaultValue https://discordapp.com/api/v\{REST_VERSION\}
     */
    baseURL?: string;
    /**
     * If the built-in latency compensator should be disabled.
     * @defaultValue false
     */
    disableLatencyCompensation?: boolean;
    /**
     * The `Host` header to use for requests.
     * @defaultValue Parsed from `baseURL`
     */
    host?: string;
    /**
     * In milliseconds, the average request latency at which to start emitting latency errors.
     * @defaultValue 30000
     */
    latencyThreshold?: number;
    /**
     * In milliseconds, the time to offset ratelimit calculations by.
     * @defaultValue 0
     */
    ratelimiterOffset?: number;
    /**
     * In milliseconds, how long to wait until a request is timed out.
     * @defaultValue 15000
     */
    requestTimeout?: number;
    /**
     * The `User-Agent` header to use for requests.
     * @defaultValue Oceanic/\{VERSION\} (https://github.com/OceanicJS/Oceanic)
     */
    userAgent?: string;
}

export interface CollectionLimitsOptions {
    /**
     * The maximum number of members to cache. A number to apply to all guilds individually, or a dictionary of guild IDs to member limits. The key `unknown` can be used to set the limit for all guilds not specified.
     *
     * Note: If you request members from the gateway, this will be increased (on the specific guild) as needed to accommodate those members.
     * @defaultValue Infinity
     */
    members?: number | Record<string, number>;
    /**
     * The maximum number of messages to cache.
     * @defaultValue 100
     */
    messages?: number;
    /**
     * The maximum number of users to cache globally.
     * @defaultValue Infinity
     */
    users?: number;
}
