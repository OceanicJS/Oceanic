/// <reference types="node" />
import type Client from "../Client";
import TypedEmitter from "../util/TypedEmitter";
import type { ShardEvents } from "../types/client";
import Bucket from "../rest/Bucket";
import { GatewayOPCodes } from "../Constants";
import type { UpdatePresenceOptions, RequestGuildMembersOptions, UpdateVoiceStateOptions, SendStatuses, BotActivity, ShardStatus } from "../types/gateway";
import Member from "../structures/Member";
import Base from "../structures/Base";
import { WebSocket } from "ws";
import { inspect } from "util";
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
    presence: Required<UpdatePresenceOptions>;
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
     * @param status - The status.
     * @param activities - An array of activities.
     */
    editStatus(status: SendStatuses, activities?: Array<BotActivity>): Promise<void>;
    hardReset(): void;
    heartbeat(requested?: boolean): void;
    identify(): void;
    [inspect.custom](): Base;
    /**
     * Request the members of a guild.
     * @param guild - The ID of the guild to request the members of.
     * @param options - The options for requesting the members.
     */
    requestGuildMembers(guild: string, options?: RequestGuildMembersOptions): Promise<Member[]>;
    reset(): void;
    resume(): void;
    send(op: GatewayOPCodes, data: unknown, priority?: boolean): void;
    toString(): string;
    /**
     * Update the voice state of this shard.
     * @param guildID - The ID of the guild to update the voice state of.
     * @param channelID - The ID of the voice channel to join. Null to disconnect.
     * @param options - The options for updating the voice state.
     */
    updateVoiceState(guildID: string, channelID: string | null, options?: UpdateVoiceStateOptions): void;
}
