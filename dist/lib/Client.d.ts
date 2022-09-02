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
    private _application?;
    private _user?;
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
    users: Collection<string, RawUser, User>;
    util: Util;
    voiceConnections: VoiceConnectionManager;
    /**
     * @constructor
     * @param options The options to create the client with.
     */
    constructor(options?: ClientOptions);
    /** The client's partial application. This will throw an error if not using a gateway connection or no shard is READY. **/
    get application(): ClientApplication;
    /** The client's user application. This will throw an error if not using a gateway connection or no shard is READY. **/
    get user(): ExtendedUser;
    connect(): Promise<void>;
    /**
     * Edit the client's status across all shards.
     * @param status The status.
     * @param activities An array of activities.
     */
    editStatus(status: SendStatuses, activities?: Array<BotActivity>): Promise<void>;
    getChannel<T extends AnyChannel = AnyChannel>(id: string): T | undefined;
    /**
     * Join a voice channel.
     * @param channelID The ID of the voice channel to join. Null to disconnect.
     * @param options The options for joining the voice channel.
     */
    joinVoiceChannel(channelID: string, options?: UpdateVoiceStateOptions): Promise<void>;
    /**
     * Leave a voice channel.
     * @param channelID The ID of the voice channel to leave.
     */
    leaveVoiceChannel(channelID: string): Promise<void>;
}
