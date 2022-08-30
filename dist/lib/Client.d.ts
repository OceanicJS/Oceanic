import RESTManager from "./rest/RESTManager";
import Collection from "./util/Collection";
import PrivateChannel from "./structures/PrivateChannel";
import GroupChannel from "./structures/GroupChannel";
import User from "./structures/User";
import Guild from "./structures/Guild";
import type { AnyChannel, RawGroupChannel, RawPrivateChannel } from "./types/channels";
import type { RawGuild, RawUnavailableGuild } from "./types/guilds";
import type { RawUser } from "./types/users";
import type { ClientEvents, ClientInstanceOptions, ClientOptions } from "./types/client";
import TypedEmitter from "./util/TypedEmitter";
import type ClientApplication from "./structures/ClientApplication";
import ShardManager from "./gateway/ShardManager";
import type { BotActivity, SendStatuses, UpdateVoiceStateOptions } from "./types/gateway";
import UnavailableGuild from "./structures/UnavailableGuild";
import VoiceConnectionManager from "./voice/VoiceConnectionManager";
import type ExtendedUser from "./structures/ExtendedUser";
import Util from "./util/Util";
/** The primary class for interfacing with Discord. */
export default class Client extends TypedEmitter<ClientEvents> {
    /** The client's partial application (only set when using a gateway connection, at least one shard must be READY for this to be set). */
    application: ClientApplication;
    channelGuildMap: Record<string, string>;
    gatewayURL: string;
    groupChannels: Collection<string, RawGroupChannel, GroupChannel>;
    guildShardMap: Record<string, number>;
    guilds: Collection<string, RawGuild, Guild>;
    options: ClientInstanceOptions;
    privateChannels: Collection<string, RawPrivateChannel, PrivateChannel>;
    ready: boolean;
    rest: RESTManager;
    shards: ShardManager;
    startTime: number;
    threadGuildMap: Record<string, string>;
    unavailableGuilds: Collection<string, RawUnavailableGuild, UnavailableGuild>;
    /** The client's user (only set when using a gateway connection, at least one shard must be READY for this to be set). */
    user: ExtendedUser;
    users: Collection<string, RawUser, User>;
    util: Util;
    voiceConnections: VoiceConnectionManager;
    /**
     * @constructor
     * @param {Object} [options]
     * @param {Object} [options.allowedMentions] - The default allowed mentions object.
     * @param {Boolean} [options.allowedMentions.everyone=false] - If `@everyone`/`@here` mentions should be allowed.
     * @param {Boolean} [options.allowedMentions.repliedUser=false] - If the replied user (`messageReference`) should be mentioned.
     * @param {(Boolean | String[])} [options.allowedMentions.roles=true] - An array of role ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {(Boolean | String[])} [options.allowedMentions.users=true] - An array of user ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {String?} [options.auth] - Fully qualified authorization string (e.x. Bot [TOKEN]) - you MUST prefix it yourself
     * @param {ImageFormat} [options.defaultImageFormat="png"] - The default image format to use.
     * @param {Number} [options.defaultImageSize=4096] - The default image size to use.
     * @param {Object} [options.gateway] - The gateway options.
     * @param {Boolean} [options.gateway.autoReconnect=true] - If dropped connections should be automatically reconnected.
     * @param {Number} [options.gateway.compress] - If packets to and from Discord should be compressed.
     * @param {(Number | "auto")} [options.gateway.concurrency] - The concurrency for shard connections. If you don't know what this is, don't mess with it. Only bots in >150,000 servers can use any non-default value.
     * @param {Object} [options.gateway.connectionProperties] - The `properties` used when identifying.
     * @param {String} [options.gateway.connectionProperties.browser="Oceanic"] - The browser of the client.
     * @param {String} [options.gateway.connectionProperties.device="Oceanic"] - The device of the client.
     * @param {String} [options.gateway.connectionProperties.os=process.platform] - The operating system of the client.
     * @param {Number} [options.gateway.connectionTimeout=30000] - The maximum amount of time in milliseconds to wait for a connection to be established.
     * @param {Number} [options.gateway.firstShardID=0] - The ID of the first shard to run for this client. Mutually exclusive with `shardIDs`.
     * @param {Number} [options.gateway.getAllUsers=false] - The ID of the first shard to run for this client. Mutually exclusive with `shardIDs`.
     * @param {Number} [options.gateway.guildCreateTimeout=2000] - The number of milliseconds to wait before considering guild creations to be new guilds.
     * @param {(Number | IntentNames[] | Number[])} [options.gateway.intents] - The [intents](https://discord.com/developers/docs/topics/gateway#list-of-intents) to use. Either a number, array of intent names, array of numbers, or "ALL". All non privileged intents are used by default.
     * @param {Number} [options.gateway.largeThreshold=250] - The threshold at which guilds are considered "large" (after which offline members will not be loaded).
     * @param {Number} [options.gateway.lastShardID=maxShards - 1] - The ID of the last shard to run for this client. Mutually exclusive with `shardIDs`.
     * @param {Number} [options.gateway.maxReconnectAttempts=Infinity] - The maximum number of attempts to reconnect.
     * @param {Number} [options.gateway.maxResumeAttempts=10] - The maximum number of attempts to resume.
     * @param {(Number | "auto")} [options.gateway.maxShards=1] - The total number of shards across all running clients. Limit the number of shards per client via `firstShardID` & `lastShardID`.
     * @param {Object} [options.gateway.presence] - The intiial presence to use when connecting.
     * @param {Object[]} [options.gateway.presence.activities]
     * @param {String} options.gateway.presence.activities[].name - The name of the activity.
     * @param {BotActivityTypes} options.gateway.presence.activities[].type - The name of the activity.
     * @param {String} [options.gateway.presence.activities[].url] - The name of the activity.
     * @param {Boolean} [options.gateway.presence.afk] - If the client is afk.
     * @param {SendStatuses} [options.gateway.presence.status] - The [status](https://discord.com/developers/docs/topics/gateway#update-presence-status-types) to use..
     * @param {Function} [options.gateway.reconnectDelay] - A function to calculate the delay between reconnect attempts.
     * @param {Boolean} [options.gateway.seedVoiceConnections=false] - If exisitng voice connections should be populated. This will disconnect connections from other sessions.
     * @param {Number[]} [option.gateway.shardIDs=[]] - An array of shard IDs to run for this client. Mutually exclusive with `firstShardID` & `lastShardID`.
     * @param {Object} [options.gateway.ws] - The options to pass to constructed websockets.
     * @param {Object} [options.rest] - The options for the request handler.
     * @param {Agent?} [options.rest.agent=null] - The agent to use for requests.
     * @param {String} [options.rest.baseURL="https://discordapp.com/api/v\{REST_VERSION\}"] - The base URL to use for requests - must be a fully qualified url.
     * @param {Boolean} [options.rest.disableLatencyCompensation] - If the built in latency compensator should be disabled
     * @param {String} [options.rest.host="discord.com"] - The `Host` header to use for requests. By default, this is parsed from `baseURL`.
     * @param {Number} [options.rest.latencyThreshold=30000] - In milliseconds, the average request latency at which to start emitting latency errors.
     * @param {Number} [options.rest.ratelimiterOffset=0] - In milliseconds, the time to offset ratelimit calculations by.
     * @param {Number} [options.rest.requestTimeout=15000] - In milliseconds, how long to wait until a request is timed out.
     * @param {String} [options.rest.userAgent="Oceanic/\{VERSION\} (https://github.com/DonovanDMC/Oceanic)"] - The `User-Agent` header to use for requests.
     */
    constructor(options?: ClientOptions);
    connect(): Promise<void>;
    /**
     * Edit the client's status across all shards.
     *
     * @param {SendStatuses} status - The status.
     * @param {BotActivity[]} [activities] - An array of activities.
     * @param {BotActivityTypes} [activities[].type] - The activity type.
     * @param {String} [activities[].name] - The activity name.
     * @param {String} [activities[].url] - The activity url.
     * @returns
     */
    editStatus(status: SendStatuses, activities?: Array<BotActivity>): Promise<void>;
    getChannel<T extends AnyChannel = AnyChannel>(id: string): T | undefined;
    /**
     * Join a voice channel.
     *
     * @param {String?} channelID - The ID of the voice channel to join. Null to disconnect.
     * @param {Object} [options]
     * @param {Boolean} [options.selfDeaf] - If the client should join deafened.
     * @param {Boolean} [options.selfMute] - If the client should join muted.
     * @returns {Promise<void>}
     */
    joinVoiceChannel(channelID: string, options?: UpdateVoiceStateOptions): Promise<void>;
    /**
     * Leave a voice channel.
     *
     * @param {String} channelID - The ID of the voice channel to leave.
     * @returns {Promise<void>}
     */
    leaveVoiceChannel(channelID: string): Promise<void>;
}
