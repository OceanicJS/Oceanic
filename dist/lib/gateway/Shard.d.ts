/// <reference types="node" />
import type Client from "../Client";
import TypedEmitter from "../util/TypedEmitter";
import type { ShardEvents } from "../types/client";
import Bucket from "../rest/Bucket";
import { GatewayOPCodes } from "../Constants";
import type { UpdatePreseneOptions, RequestGuildMembersOptions, UpdateVoiceStateOptions, SendStatuses, BotActivity } from "../types/gateway";
import type Member from "../structures/Member";
import Base from "../structures/Base";
import { WebSocket } from "ws";
import { inspect } from "util";
export declare type ShardStatus = "connecting" | "disconnected" | "handshaking" | "identifying" | "ready" | "resuming";
export default class Shard extends TypedEmitter<ShardEvents> {
    private _client;
    private _connectTimeout;
    private _getAllUsersCount;
    private _getAllUsersQueue;
    private _guildCreateTimeout;
    private _heartbeatInterval;
    private _requestMembersPromise;
    private _sharedZLib;
    connectAttempts: number;
    connecting: boolean;
    globalBucket: Bucket;
    id: number;
    lastHeartbeatAck: boolean;
    lastHeartbeatReceived: number;
    lastHeartbeatSent: number;
    latency: number;
    preReady: boolean;
    presence: Required<UpdatePreseneOptions>;
    presenceUpdateBucket: Bucket;
    ready: boolean;
    reconnectInterval: number;
    resumeURL: string | null;
    sequence: number;
    sessionID: string | null;
    status: ShardStatus;
    ws: WebSocket | null;
    constructor(id: number, client: Client);
    private checkReady;
    private createGuild;
    private initialize;
    private onDispatch;
    private onPacket;
    private onWSClose;
    private onWSError;
    private onWSMessage;
    private onWSOpen;
    private restartGuildCreateTimeout;
    private sendPresenceUpdate;
    private get _token();
    /** Connect this shard. */
    connect(): void;
    disconnect(reconnect?: boolean, error?: Error): void;
    /**
     * Edit this shard's status.
     *
     * @param {SendStatuses} status - The status.
     * @param {BotActivity[]} [activities] - An array of activities.
     * @param {BotActivityTypes} [activities[].type] - The activity type.
     * @param {String} [activities[].name] - The activity name.
     * @param {String} [activities[].url] - The activity url.
     * @returns
     */
    editStatus(status: SendStatuses, activities?: Array<BotActivity>): Promise<void>;
    hardReset(): void;
    heartbeat(requested?: boolean): void;
    identify(): void;
    [inspect.custom](): Base;
    /**
     * Request the members of a guild.
     *
     * @param {string} guildID - The ID of the guild to request the members of.
     * @param {Object} options
     * @param {Number} [options.limit] - The maximum number of members to request.
     * @param {Boolean} [options.presences=false] - If presences should be requested. Requires the `GUILD_PRESENCES` intent.
     * @param {String} [options.query] - If provided, only members with a username that starts with this string will be returned. If empty or not provided, requires the `GUILD_MEMBERS` intent.
     * @param {Number} [options.timeout=client.rest.options.requestTimeout] - The maximum amount of time in milliseconds to wait.
     * @param {String[]} [options.userIDs] - The IDs of up to 100 users to specifically request.
     * @returns {Promise<Member[]>}
     */
    requestGuildMembers(guild: string, options?: RequestGuildMembersOptions): Promise<Member[]>;
    reset(): void;
    resume(): void;
    send(op: GatewayOPCodes, data: unknown, priority?: boolean): void;
    toString(): string;
    /**
     * Update the voice state of this shard.
     *
     * @param {String} guildID - The ID of the guild to update the voice state of.
     * @param {String?} channelID - The ID of the voice channel to join. Null to disconnect.
     * @param {Object} [options]
     * @param {Boolean} [options.selfDeaf] - If the client should join deafened.
     * @param {Boolean} [options.selfMute] - If the client should join muted.
     * @returns {void}
     */
    updateVoiceState(guildID: string, channelID: string | null, options?: UpdateVoiceStateOptions): void;
}
