import type { RawUser } from "./users";
import type { AutoModerationAction, RawAutoModerationAction } from "./auto-moderation";
import type { AnyGuildTextChannel } from "./channels";
import type { Uncached } from "./shared";
import type { ActivityTypes, AutoModerationTriggerTypes, IntentNames } from "../Constants";
import type AutoModerationRule from "../structures/AutoModerationRule";
import type User from "../structures/User";
import type { ClientOptions as WSClientOptions } from "ws";

export type ReconnectDelayFunction = (lastDelay: number, attempts: number) => number;
interface GatewayOptions {
    autoReconnect?: boolean;
    compress?: boolean;
    concurrency?: number | "auto";
    connectionProperties?: {
        browser?: string;
        device?: string;
        os?: string;
    };
    connectionTimeout?: number;
    firstShardID?: number;
    getAllUsers?: boolean;
    guildCreateTimeout?: number;
    intents?: number | Array<IntentNames | "ALL" | number>;
    largeThreshold?: number;
    lastShardID?: number;
    maxReconnectAttempts?: number;
    maxResumeAttempts?: number;
    maxShards?: number | "auto";
    presence?: UpdatePreseneOptions;
    reconnectDelay?: ReconnectDelayFunction;
    seedVoiceConnections?: boolean;
    shardIDs?: Array<number>;
    ws?: WSClientOptions;
}

export interface ShardManagerInstanceOptions extends Required<Pick<GatewayOptions, "autoReconnect" | "compress" | "connectionTimeout" | "firstShardID" | "getAllUsers" | "guildCreateTimeout" | "largeThreshold" | "lastShardID" | "maxReconnectAttempts" | "maxResumeAttempts" | "reconnectDelay" | "seedVoiceConnections" | "shardIDs" | "ws">> {
    concurrency: number;
    connectionProperties: Required<GatewayOptions["connectionProperties"]>;
    intents: number;
    maxShards: number;
    presence: Required<UpdatePreseneOptions>;
}

export interface GetGatewayResponse {
    url: string;
}

export interface RawGetBotGatewayResponse extends GetGatewayResponse {
    max_concurrency?: number;
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
    maxConcurrency?: number;
    sessionStartLimit: SessionStartLimit;
    shards: number;
}

export interface RequestGuildMembersOptions {
    limit?: number;
    presences?: boolean;
    query?: string;
    timeout?: number;
    userIDs?: Array<string>;
}

export type MutualStatuses = "online" | "dnd" | "idle";
export type SendStatuses = MutualStatuses | "invisible";
export type RecieveStatuses = MutualStatuses | "offline";

export interface UpdatePreseneOptions {
    activities?: Array<BotActivity>;
    afk?: boolean;
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
    status: RecieveStatuses;
    user: { id: string; } & Partial<Omit<RawUser, "id">>;
}
export type Presence = Omit<PresenceUpdate, "user">;

export interface ClientStatus {
    desktop?: string;
    mobile?: string;
    web?: string;
}

export interface UpdateVoiceStateOptions {
    selfDeaf?: boolean;
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
    channelID?: AnyGuildTextChannel | Uncached;
    content: string;
    matchedContent: string;
    matchedKeyword: string | null;
    messageID?: string;
    rule: AutoModerationRule | Uncached;
    ruleTriggerType: AutoModerationTriggerTypes;
    user: User | Uncached;
}

export type ShardStatus = "connecting" | "disconnected" | "handshaking" | "identifying" | "ready" | "resuming";
