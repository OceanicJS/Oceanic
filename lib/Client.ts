/** @module Client */
import { GATEWAY_VERSION } from "./Constants";
import RESTManager from "./rest/RESTManager";
import TypedCollection from "./util/TypedCollection";
import PrivateChannel from "./structures/PrivateChannel";
import GroupChannel from "./structures/GroupChannel";
import User from "./structures/User";
import Guild from "./structures/Guild";
import type { AnyChannel, RawGroupChannel, RawPrivateChannel } from "./types/channels";
import type { RawGuild, RawUnavailableGuild } from "./types/guilds";
import type { RawUser } from "./types/users";
import type {  ClientInstanceOptions, ClientOptions } from "./types/client";
import TypedEmitter from "./util/TypedEmitter";
import type ClientApplication from "./structures/ClientApplication";
import ShardManager from "./gateway/ShardManager";
import type { BotActivity, GetBotGatewayResponse, SendStatuses } from "./types/gateway";
import UnavailableGuild from "./structures/UnavailableGuild";
import type ExtendedUser from "./structures/ExtendedUser";
import Util from "./util/Util";
import type { ClientEvents } from "./types/events";
import type { JoinVoiceChannelOptions } from "./types/voice";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { DiscordGatewayAdapterLibraryMethods,VoiceConnection } from "@discordjs/voice";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
let DiscordJSVoice: typeof import("@discordjs/voice") | undefined;
try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, unicorn/prefer-module
    DiscordJSVoice = require("@discordjs/voice");
} catch {}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
let Erlpack: typeof import("erlpack") | undefined;
try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, unicorn/prefer-module
    Erlpack = require("erlpack");
} catch {}

/** The primary class for interfacing with Discord. See {@link Events~ClientEvents | Client Events} for a list of events. */
export default class Client extends TypedEmitter<ClientEvents> {
    private _application?: ClientApplication;
    private _user?: ExtendedUser;
    channelGuildMap: Record<string, string>;
    gatewayURL!: string;
    groupChannels: TypedCollection<string, RawGroupChannel, GroupChannel>;
    guildShardMap: Record<string, number>;
    guilds: TypedCollection<string, RawGuild, Guild>;
    options: ClientInstanceOptions;
    privateChannels: TypedCollection<string, RawPrivateChannel, PrivateChannel>;
    ready: boolean;
    rest: RESTManager;
    shards: ShardManager;
    startTime = 0;
    threadGuildMap: Record<string, string>;
    unavailableGuilds: TypedCollection<string, RawUnavailableGuild, UnavailableGuild>;
    users: TypedCollection<string, RawUser, User>;
    util: Util;
    voiceAdapters: Map<string, DiscordGatewayAdapterLibraryMethods>;
    /**
     * @constructor
     * @param options The options to create the client with.
     */
    constructor(options?: ClientOptions) {
        super();
        this.options = {
            allowedMentions: options?.allowedMentions ?? {
                everyone:    false,
                repliedUser: false,
                users:       true,
                roles:       true
            },
            auth:             options?.auth ?? null,
            collectionLimits: {
                members: options?.collectionLimits?.members === undefined ?  Infinity : (typeof options.collectionLimits.members === "object" ? {
                    unknown: Infinity,
                    ...options.collectionLimits.members
                } : options.collectionLimits.members),
                messages: options?.collectionLimits?.messages ?? 100,
                users:    options?.collectionLimits?.users ?? Infinity
            },
            defaultImageFormat:        options?.defaultImageFormat ?? "png",
            defaultImageSize:          options?.defaultImageSize ?? 4096,
            disableMemberLimitScaling: options?.disableMemberLimitScaling ?? false
        };
        this.voiceAdapters = new Map();
        this.channelGuildMap = {};
        this.groupChannels = new TypedCollection(GroupChannel, this, 10);
        this.guilds = new TypedCollection(Guild, this);
        this.privateChannels = new TypedCollection(PrivateChannel, this, 25);
        this.ready = false;
        this.guildShardMap = {};
        this.rest = new RESTManager(this, options?.rest);
        this.shards = new ShardManager(this, options?.gateway);
        this.threadGuildMap = {};
        this.unavailableGuilds = new TypedCollection(UnavailableGuild, this);
        this.users = new TypedCollection(User, this, this.options.collectionLimits.users);
        this.util = new Util(this);
    }

    /** The client's partial application. This will throw an error if not using a gateway connection or no shard is READY. */
    get application(): ClientApplication {
        if (!this._application) {
            throw new Error(`${this.constructor.name}#application is not present if not using a gateway connection or no shard is READY. Consider making sure you have connected your client.`);
        } else {
            return this._application;
        }
    }

    get uptime(): number {
        return this.startTime ? Date.now() - this.startTime : 0;
    }

    /** The client's user application. This will throw an error if not using a gateway connection or no shard is READY. */
    get user(): ExtendedUser {
        if (!this._user) {
            throw new Error(`${this.constructor.name}#user is not present if not using a gateway connection or no shard is READY. Consider making sure you have connected your client.`);
        } else {
            return this._user;
        }
    }

    /** The active voice connections of this client. */
    get voiceConnections(): Map<string, VoiceConnection> {
        if (!DiscordJSVoice) {
            throw new Error("Voice is only supported with @discordjs/voice installed.");
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return DiscordJSVoice.getVoiceConnections();
    }

    /** Connect the client to Discord. */
    async connect(): Promise<void> {
        if (!this.options.auth || !this.options.auth.startsWith("Bot ")) {
            throw new Error("You must provide a bot token to connect. Make sure it has been prefixed with `Bot `.");
        }
        let url: string, data: GetBotGatewayResponse | undefined;
        try {
            if (this.shards.options.maxShards === -1 || this.shards.options.concurrency === -1) {
                data = await this.rest.getBotGateway();
                url = data.url;
            } else {
                url = (await this.rest.getGateway()).url;
            }
        } catch (err) {
            throw new Error("Failed to get gateway information.", { cause: err as Error });
        }
        if (url.includes("?")) {
            url = url.slice(0, url.indexOf("?"));
        }
        if (!url.endsWith("/")) {
            url += "/";
        }
        this.gatewayURL = `${url}?v=${GATEWAY_VERSION}&encoding=${Erlpack ? "etf" : "json"}`;
        if (this.shards.options.compress) {
            this.gatewayURL += "&compress=zlib-stream";
        }

        if (this.shards.options.maxShards === -1) {
            if (!data || !data.shards) {
                throw new Error("AutoSharding failed, missing required information from Discord.");
            }
            this.shards.options.maxShards = data.shards;
            if (this.shards.options.lastShardID === -1) {
                this.shards.options.lastShardID = data.shards - 1;
            }
        }

        if (this.shards.options.concurrency === -1) {
            if (!data) {
                throw new Error("AutoConcurrency failed, missing required information from Discord.");
            }
            this.shards.options.concurrency = data.sessionStartLimit.maxConcurrency;
        }


        if (!Array.isArray(this.shards.options.shardIDs)) {
            this.shards.options.shardIDs = [];
        }

        if (this.shards.options.shardIDs.length === 0 && this.shards.options.firstShardID !== undefined && this.shards.options.lastShardID !== undefined) {
            for (let i = this.shards.options.firstShardID; i <= this.shards.options.lastShardID; i++) {
                this.shards.options.shardIDs.push(i);
            }
        }


        for (const id of this.shards.options.shardIDs) {
            this.shards.spawn(id);
        }
    }

    /**
     * Disconnect all shards.
     * @param reconnect If shards should be reconnected. Defaults to {@link Types/Gateway~GatewayOptions#autoReconnect | GatewayOptions#autoReconnect}
     */
    disconnect(reconnect = this.shards.options.autoReconnect): void {
        this.ready = false;
        for (const [,shard] of this.shards) shard.disconnect(reconnect);
        this.shards["_resetConnectQueue"]();
    }

    /**
     * Edit the client's status across all shards.
     * @param status The status.
     * @param activities An array of activities.
     */
    async editStatus(status: SendStatuses, activities: Array<BotActivity> = []): Promise<void>{
        for (const [,shard] of this.shards) await shard.editStatus(status, activities);
    }

    /**
     * Get a channel from an ID. This will return undefined if the channel is not cached.
     * @param channelID The id of the channel.
     */
    getChannel<T extends AnyChannel = AnyChannel>(channelID: string): T | undefined {
        if (this.channelGuildMap[channelID]) {
            return this.guilds.get(this.channelGuildMap[channelID])?.channels.get(channelID) as T;
        } else if (this.threadGuildMap[channelID]) {
            return this.guilds.get(this.threadGuildMap[channelID])?.threads.get(channelID) as T;
        }
        return (this.privateChannels.get(channelID) ?? this.groupChannels.get(channelID)) as T;
    }

    /**
     * Get a voice connection.
     * @param guildID The ID of the guild the voice channel belongs to.
     */
    getVoiceConnection(guildID: string): VoiceConnection | undefined {
        if (!DiscordJSVoice) {
            throw new Error("Voice is only supported with @discordjs/voice installed.");
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        return DiscordJSVoice.getVoiceConnection(guildID);
    }

    /**
     * Join a voice channel.
     * @param options The options to join the channel with.
     * */
    joinVoiceChannel(options: JoinVoiceChannelOptions): VoiceConnection {
        if (!DiscordJSVoice) {
            throw new Error("Voice is only supported with @discordjs/voice installed.");
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return DiscordJSVoice.joinVoiceChannel({
            channelId:      options.channelID,
            guildId:        options.guildID,
            debug:          options.debug,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            adapterCreator: options.voiceAdapterCreator,
            selfDeaf:       options.selfDeaf,
            selfMute:       options.selfMute
        });
    }

    /**
     * Leave a voice channel.
     * @param guildID The ID of the guild the voice channel belongs to.
     */
    leaveVoiceChannel(guildID: string): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return this.getVoiceConnection(guildID)?.destroy();
    }
}
