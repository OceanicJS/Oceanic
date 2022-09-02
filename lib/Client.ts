import { ChannelTypes, GATEWAY_VERSION } from "./Constants";
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
import type { BotActivity, GetBotGatewayResponse, SendStatuses, UpdateVoiceStateOptions } from "./types/gateway";
import UnavailableGuild from "./structures/UnavailableGuild";
import VoiceConnectionManager from "./voice/VoiceConnectionManager";
import type ExtendedUser from "./structures/ExtendedUser";
import type VoiceChannel from "./structures/VoiceChannel";
import type StageChannel from "./structures/StageChannel";
import Util from "./util/Util";

/* eslint-disable */
let Erlpack: typeof import("erlpack") | undefined;
try {
    Erlpack = require("erlpack");
} catch {}
/* eslint-enable */

/** The primary class for interfacing with Discord. */
export default class Client extends TypedEmitter<ClientEvents> {
    private _application?: ClientApplication;
    private _user?: ExtendedUser;
    channelGuildMap: Record<string, string>;
    gatewayURL!: string;
    groupChannels: Collection<string, RawGroupChannel, GroupChannel>;
    guildShardMap: Record<string, number>;
    guilds: Collection<string, RawGuild, Guild>;
    options: ClientInstanceOptions;
    privateChannels: Collection<string, RawPrivateChannel, PrivateChannel>;
    ready: boolean;
    rest: RESTManager;
    shards: ShardManager;
    startTime = 0;
    threadGuildMap: Record<string, string>;
    unavailableGuilds: Collection<string, RawUnavailableGuild, UnavailableGuild>;
    users: Collection<string, RawUser, User>;
    util: Util;
    voiceConnections: VoiceConnectionManager;
    /**
     * @constructor
     * @param options The options to create the client with.
     */
    constructor(options?: ClientOptions) {
        super();
        this.options = {
            allowedMentions: options?.allowedMentions || {
                everyone:    false,
                repliedUser: false,
                users:       true,
                roles:       true
            },
            auth:               options?.auth || null,
            defaultImageFormat: options?.defaultImageFormat || "png",
            defaultImageSize:   options?.defaultImageSize || 4096
        };
        this.channelGuildMap = {};
        this.groupChannels = new Collection(GroupChannel, this);
        this.guilds = new Collection(Guild, this);
        this.privateChannels = new Collection(PrivateChannel, this);
        this.ready = false;
        this.guildShardMap = {};
        this.rest = new RESTManager(this, options?.rest);
        this.shards = new ShardManager(this, options?.gateway);
        this.threadGuildMap = {};
        this.unavailableGuilds = new Collection(UnavailableGuild, this);
        this.users = new Collection(User, this);
        this.util = new Util(this);
        this.voiceConnections = new VoiceConnectionManager(this);
    }

    /** The client's partial application. This will throw an error if not using a gateway connection or no shard is READY. **/
    get application() {
        if (!this._application) throw new Error("Can only access `client.application` when using a gateway connection and having at least one shard marked as READY.");
        else return this._application;
    }

    /** The client's user application. This will throw an error if not using a gateway connection or no shard is READY. **/
    get user() {
        if (!this._user) throw new Error("Can only access `client.user` when using a gateway connection and having at least one shard marked as READY.");
        else return this._user;
    }

    async connect() {
        if (!this.options.auth || !this.options.auth.startsWith("Bot ")) throw new Error("You must provide a bot token to connect. Make sure it has been prefixed with `Bot `.");
        let url: string, data: GetBotGatewayResponse | undefined;
        try {
            if (this.shards.options.maxShards === -1 || this.shards.options.concurrency === -1) {
                data = await this.rest.getBotGateway();
                url = data.url;
            } else url = (await this.rest.getGateway()).url;
        } catch (err) {
            throw new Error("Failed to get gateway information.", { cause: err as Error });
        }
        if (url.includes("?")) url = url.slice(0, url.indexOf("?"));
        if (!url.endsWith("/")) url += "/";
        this.gatewayURL = `${url}?v=${GATEWAY_VERSION}&encoding=${Erlpack ? "etf" : "json"}`;
        if (this.shards.options.compress) this.gatewayURL += "&compress=zlib-stream";

        if (this.shards.options.maxShards === -1) {
            if (!data || !data.shards) throw new Error("AutoSharding failed, missing required information from Discord.");
            this.shards.options.maxShards = data.shards;
            if (this.shards.options.lastShardID === -1) this.shards.options.lastShardID = data.shards - 1;
        }

        if (this.shards.options.concurrency === -1) {
            if (!data) throw new Error("AutoConcurrency failed, missing required information from Discord.");
            this.shards.options.concurrency = data.maxConcurrency ?? 1;
        }


        if (!Array.isArray(this.shards.options.shardIDs)) this.shards.options.shardIDs = [];

        if (this.shards.options.shardIDs.length === 0) {
            if (this.shards.options.firstShardID !== undefined && this.shards.options.lastShardID !== undefined) {
                for (let i = this.shards.options.firstShardID; i <= this.shards.options.lastShardID; i++) {
                    this.shards.options.shardIDs.push(i);
                }
            }
        }
        for (const id of this.shards.options.shardIDs) this.shards.spawn(id);
    }

    /**
     * Edit the client's status across all shards.
     * @param status The status.
     * @param activities An array of activities.
     */
    async editStatus(status: SendStatuses, activities: Array<BotActivity> = []) {
        return this.shards.forEach(shard => shard.editStatus(status, activities));
    }

    getChannel<T extends AnyChannel = AnyChannel>(id: string): T | undefined {
        if (this.channelGuildMap[id]) return this.guilds.get(this.channelGuildMap[id]!)?.channels.get(id) as T;
        return (this.privateChannels.get(id) || this.groupChannels.get(id)) as T;
    }

    /**
     * Join a voice channel.
     * @param channelID The ID of the voice channel to join. Null to disconnect.
     * @param options The options for joining the voice channel.
     */
    async joinVoiceChannel(channelID: string, options?: UpdateVoiceStateOptions) {
        const channel = this.getChannel<VoiceChannel | StageChannel>(channelID);
        if (!channel) throw new Error("Invalid channel. Make sure the id is correct, and the channel is cached.");
        if (channel.type !== ChannelTypes.GUILD_VOICE && channel.type !== ChannelTypes.GUILD_STAGE_VOICE) throw new Error("Only voice & stage channels can be joined.");
        this.shards.get(this.guildShardMap[channel.guild.id] || 0)!.updateVoiceState(channel.guild.id, channelID, options);
        // @TODO proper voice connection handling
    }

    /**
     * Leave a voice channel.
     * @param channelID The ID of the voice channel to leave.
     */
    async leaveVoiceChannel(channelID: string) {
        const channel = this.getChannel<VoiceChannel | StageChannel>(channelID);
        if (!channel || (channel.type !== ChannelTypes.GUILD_VOICE && channel.type !== ChannelTypes.GUILD_STAGE_VOICE)) return;
        this.shards.get(this.guildShardMap[channel.guild.id] || 0)!.updateVoiceState(channel.guild.id, null, { selfDeaf: false, selfMute: false });
    }
}
