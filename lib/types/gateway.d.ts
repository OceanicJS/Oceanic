/** @module Types/Gateway */
import type { RawUser } from "./users";
import type { AutoModerationAction, RawAutoModerationAction } from "./auto-moderation";
import type { ActivityTypes, AutoModerationTriggerTypes, ChannelTypes, IntentNames } from "../Constants";
import type AutoModerationRule from "../structures/AutoModerationRule";
import type { ClientOptions as WSClientOptions } from "ws";

export type ReconnectDelayFunction = (lastDelay: number, attempts: number) => number;
interface GatewayOptions {
    /**
     * If dropped connections should be automatically reconnected.
     * @defaultValue true
     */
    autoReconnect?: boolean;
    /**
     * If packets to and from Discord should be compressed.
     * @defaultValue false
     */
    compress?: boolean;
    /**
     * The concurrency for shard connections. If you don't know what this is, don't mess with it. Only bots in >150,000 servers can use any non-default value.
     * @defaultValue 1
     */
    concurrency?: number | "auto";
    /**
     * The `properties` used when identifying.
     */
    connectionProperties?: {
        /**
         * The browser of the client.
         * @defaultValue Oceanic
         */
        browser?: string;
        /**
         * The device of the client.
         * @defaultValue Oceanic
         */
        device?: string;
        /**
         * The operating system of the client.
         * @defaultValue `process.platform()`
         */
        os?: string;
    };
    /**
     * The maximum amount of time in milliseconds to wait for a connection to be established.
     * @defaultValue 30000
     */
    connectionTimeout?: number;
    /**
     * The ID of the first shard to run for this client. Mutually exclusive with `shardIDs`.
     * @defaultValue 0
     */
    firstShardID?: number;
    /**
     * If the members of all guilds should be requested. Requires the `GUILD_MEMBERS` intent.
     * @defaultValue false
     */
    getAllUsers?: boolean;
    /**
     * The time in milliseconds after which the client will consider all guilds to have been received.
     * @defaultValue 2000
     */
    guildCreateTimeout?: number;
    /**
     * The [intents](https://discord.com/developers/docs/topics/gateway#list-of-intents) to use. Either a number, array of intent names, array of numbers, or "ALL". All non privileged intents are used by default.
     * @defaultValue {@link Constants~AllNonPrivilegedIntents | All Non Privileged Intents}
     */
    intents?: number | Array<IntentNames | "ALL" | number>;
    /**
     * The threshold at which guilds are considered "large" (after which offline members will not be loaded).
     * @defaultValue 250
     */
    largeThreshold?: number;
    /**
     * The ID of the last shard to run for this client. Mutually exclusive with `shardIDs`.
     * @defaultValue maxShards - 1
     */
    lastShardID?: number;
    /**
     * The maximum number of attempts to reconnect.
     * @defaultValue Infinity
     */
    maxReconnectAttempts?: number;
    /**
     * The maximum number of attempts to resume a lost connection.
     * @defaultValue 10
     */
    maxResumeAttempts?: number;
    /**
     * The total number of shards across all running clients. Limit the number of shards per client via `firstShardID` & `lastShardID`.
     * @defaultValue 1
     */
    maxShards?: number | "auto";
    /** The initial presence to use when connecting. */
    presence?: UpdatePresenceOptions;
    /**
     * A function to calculate the delay between reconnect attempts.
     * @defaultValue (lastDelay, attempts) => Math.pow(attempts + 1, 0.7) * 20000
     */
    reconnectDelay?: ReconnectDelayFunction;
    /**
     * If existing voice connections should be populated. This will disconnect connections from other sessions.
     * @defaultValue false
     */
    seedVoiceConnections?: boolean;
    /**
     * An array of shard IDs to run for this client. Mutually exclusive with `firstShardID` & `lastShardID`.
     * @defaultValue based on `firstShardID` & `lastShardID`
     */
    shardIDs?: Array<number>;
    /** The options to pass to constructed websockets. */
    ws?: WSClientOptions;
}

export interface ShardManagerInstanceOptions extends Required<Pick<GatewayOptions, "autoReconnect" | "compress" | "connectionTimeout" | "firstShardID" | "getAllUsers" | "guildCreateTimeout" | "largeThreshold" | "lastShardID" | "maxReconnectAttempts" | "maxResumeAttempts" | "reconnectDelay" | "seedVoiceConnections" | "shardIDs" | "ws">> {
    concurrency: number;
    connectionProperties: Required<GatewayOptions["connectionProperties"]>;
    intents: number;
    maxShards: number;
    presence: Required<UpdatePresenceOptions>;
}

export interface GetGatewayResponse {
    url: string;
}

export interface RawGetBotGatewayResponse extends GetGatewayResponse {
    session_start_limit: RawSessionStartLimit;
    shards: number;
}

export interface RawSessionStartLimit {
    max_concurrency: number;
    remaining: number;
    reset_after: number;
    total: number;
}

export interface SessionStartLimit {
    maxConcurrency: number;
    remaining: number;
    resetAfter: number;
    total: number;
}


export interface GetBotGatewayResponse extends GetGatewayResponse {
    sessionStartLimit: SessionStartLimit;
    shards: number;
}

export interface RequestGuildMembersOptions {
    /** The maximum number of members to request. */
    limit?: number;
    /**
     * If presences should be requested. Requires the `GUILD_PRESENCES` intent.
     * @defaultValue false
     */
    presences?: boolean;
    /** If provided, only members with a username that starts with this string will be returned. If empty or not provided, requires the `GUILD_MEMBERS` intent. */
    query?: string;
    /**
     * The maximum amount of time in milliseconds to wait.
     * @defaultValue `client.rest.options.requestTimeout`
     */
    timeout?: number;
    /** The IDs of up to 100 users to specifically request. */
    userIDs?: Array<string>;
}

export type MutualStatuses = "online" | "dnd" | "idle";
export type SendStatuses = MutualStatuses | "invisible";
export type ReceiveStatuses = MutualStatuses | "offline";

export interface UpdatePresenceOptions {
    /** An array of activities. */
    activities?: Array<BotActivity>;
    /** If the client is afk. */
    afk?: boolean;
    /** The [status](https://discord.com/developers/docs/topics/gateway#update-presence-status-types). */
    status: SendStatuses;
}

export interface Activity {
    application_id?: string;
    assets?: Partial<Record<"large_image" | "large_text" | "small_image" | "small_text", string>>;
    buttons?: Array<ActivityButton>;
    created_at: number;
    details?: string | null;
    emoji?: ActivityEmoji | null;
    flags?: number;
    instance?: boolean;
    name: string;
    party?: ActivityParty;
    secrets?: Partial<Record<"join" | "spectate" | "match", string>>;
    state?: string | null;
    timestamps?: Partial<Record<"end" | "start", number>>;
    type: ActivityTypes;
    url?: string | null;
}
export type BotActivity = Pick<Activity, "name" | "url"> & { type: BotActivityTypes; };

export interface ActivityEmoji {
    animated?: boolean;
    id?: string;
    name: string;
}

export interface ActivityParty {
    id?: string;
    size?: [currentSize: number, maxSize: number];
}

export interface ActivityButton {
    label: string;
    url: string;
}

export type BotActivityTypes = ActivityTypes.GAME | ActivityTypes.STREAMING | ActivityTypes.LISTENING | ActivityTypes.WATCHING | ActivityTypes.COMPETING;

export interface PresenceUpdate {
    activities?: Array<Activity>;
    client_status: ClientStatus;
    guild_id: string;
    status: ReceiveStatuses;
    user: { id: string; } & Partial<Omit<RawUser, "id">>;
}

export interface ClientStatus {
    desktop?: string;
    mobile?: string;
    web?: string;
}

export interface UpdateVoiceStateOptions {
    /** If the client should be self deafened. */
    selfDeaf?: boolean;
    /** If the client should be self muted. */
    selfMute?: boolean;
}

export interface RawAutoModerationActionExecution {
    action: RawAutoModerationAction;
    alert_system_message_id?: string;
    channel_id?: string;
    content: string;
    guild_id: string;
    matched_content: string;
    matched_keyword: string | null;
    message_id?: string;
    rule_id: string;
    rule_trigger_type: AutoModerationTriggerTypes;
    user_id: string;
}

export interface AutoModerationActionExecution {
    action: AutoModerationAction;
    alertSystemMessageID?: string;
    content: string;
    matchedContent: string;
    matchedKeyword: string | null;
    messageID?: string;
    rule?: AutoModerationRule;
    ruleID: string;
    ruleTriggerType: AutoModerationTriggerTypes;
}

export type ShardStatus = "connecting" | "disconnected" | "handshaking" | "identifying" | "ready" | "resuming";

export interface RawDeletedPrivateChannel {
    flags: number;
    id: string;
    last_message_id: string | null;
    type: ChannelTypes.DM;
}

export interface DeletedPrivateChannel {
    flags: number;
    id: string;
    lastMessageID: string | null;
    type: ChannelTypes.DM;
}
