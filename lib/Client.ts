/** @module Client */
import { ApplicationFlags, GATEWAY_VERSION, Intents } from "./Constants";
import RESTManager from "./rest/RESTManager";
import TypedCollection from "./util/TypedCollection";
import PrivateChannel from "./structures/PrivateChannel";
import GroupChannel from "./structures/GroupChannel";
import User from "./structures/User";
import Guild from "./structures/Guild";
import type { AnyChannel, RawGroupChannel, RawPrivateChannel } from "./types/channels";
import type { RawGuild, RawUnavailableGuild } from "./types/guilds";
import type { RawUser } from "./types/users";
import type {  ClientInstanceOptions, ClientOptions, CollectionLimitsOptions } from "./types/client";
import TypedEmitter from "./util/TypedEmitter";
import type ClientApplication from "./structures/ClientApplication";
import ShardManager from "./gateway/ShardManager";
import type { BotActivity, GetBotGatewayResponse, SendStatuses } from "./types/gateway";
import UnavailableGuild from "./structures/UnavailableGuild";
import type ExtendedUser from "./structures/ExtendedUser";
import Util from "./util/Util";
import type { ClientEvents } from "./types/events";
import type { JoinVoiceChannelOptions } from "./types/voice";
import { DependencyError, UncachedError } from "./util/Errors";
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
export default class Client<E extends ClientEvents = ClientEvents> extends TypedEmitter<E> {
    private _application?: ClientApplication;
    private _connected = false;
    private _user?: ExtendedUser;
    channelGuildMap: Record<string, string>;
    gatewayURL!: string;
    groupChannels: TypedCollection<string, RawGroupChannel, GroupChannel>;
    guildShardMap: Record<string, number>;
    guilds: TypedCollection<string, RawGuild, Guild, [rest?: boolean]>;
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
        this.util = new Util(this);
        const disableCache = options?.disableCache === true || options?.disableCache === "no-warning";
        const colZero = {
            auditLogEntries:     0,
            autoModerationRules: 0,
            channels:            0,
            groupChannels:       0,
            guildThreads:        0,
            guilds:              0,
            integrations:        0,
            members:             0,
            messages:            0,
            privateChannels:     0,
            roles:               0,
            scheduledEvents:     0,
            stageInstances:      0,
            unavailableGuilds:   0,
            users:               0,
            voiceMembers:        0,
            voiceStates:         0
        } satisfies Required<CollectionLimitsOptions>;
        this.options = {
            allowedMentions: options?.allowedMentions ?? {
                everyone:    false,
                repliedUser: false,
                users:       true,
                roles:       true
            },
            auth:             options?.auth ?? null,
            collectionLimits: disableCache ? colZero : {
                auditLogEntries:     this.util._setLimit(options?.collectionLimits?.auditLogEntries, 50),
                autoModerationRules: this.util._setLimit(options?.collectionLimits?.autoModerationRules, Infinity),
                channels:            this.util._setLimit(options?.collectionLimits?.channels, Infinity),
                groupChannels:       options?.collectionLimits?.groupChannels ?? 10,
                guildThreads:        this.util._setLimit(options?.collectionLimits?.guildThreads, Infinity),
                guilds:              options?.collectionLimits?.guilds ?? Infinity,
                integrations:        this.util._setLimit(options?.collectionLimits?.integrations, Infinity),
                members:             this.util._setLimit(options?.collectionLimits?.members, Infinity),
                messages:            this.util._setLimit(options?.collectionLimits?.messages, 100),
                privateChannels:     options?.collectionLimits?.privateChannels ?? 25,
                roles:               this.util._setLimit(options?.collectionLimits?.roles, Infinity),
                scheduledEvents:     this.util._setLimit(options?.collectionLimits?.scheduledEvents, Infinity),
                stageInstances:      this.util._setLimit(options?.collectionLimits?.stageInstances, Infinity),
                unavailableGuilds:   options?.collectionLimits?.unavailableGuilds ?? Infinity,
                users:               options?.collectionLimits?.users ?? Infinity,
                voiceMembers:        this.util._setLimit(options?.collectionLimits?.voiceMembers, Infinity),
                voiceStates:         this.util._setLimit(options?.collectionLimits?.voiceStates, Infinity)
            },
            defaultImageFormat:        options?.defaultImageFormat ?? "png",
            defaultImageSize:          options?.defaultImageSize ?? 4096,
            disableMemberLimitScaling: options?.disableMemberLimitScaling ?? false,
            restMode:                  false,
            disableCache
        };
        if (options?.disableCache === true) {
            process.emitWarning("Enabling the disableCache option is not recommended. This will break many aspects of the library, as it is not designed to function without cache.", {
                code:   "OCEANIC_CACHE_DISABLED",
                detail: "Set the disableCache option to the literal string \"no-warning\" to disable this warning."
            });
        }
        if (disableCache && options?.collectionLimits !== undefined && JSON.stringify(options.collectionLimits) !== JSON.stringify(colZero)) {
            process.emitWarning("Providing the collectionsLimit option when the disableCache option has been enabled is redundant. Any provided values will be ignored.", {
                code:   "OCEANIC_COLLECTIONS_LIMIT_WITH_CACHE_DISABLED",
                detail: "Remove the collectionsLimit option, or zero out all of the possible options to disable this warning."
            });
        }
        this.voiceAdapters = new Map();
        this.channelGuildMap = {};
        this.groupChannels = new TypedCollection(GroupChannel, this, this.options.collectionLimits.groupChannels);
        this.guilds = new TypedCollection(Guild, this, this.options.collectionLimits.guilds);
        this.privateChannels = new TypedCollection(PrivateChannel, this, this.options.collectionLimits.privateChannels);
        this.ready = false;
        this.guildShardMap = {};
        this.rest = new RESTManager(this, options?.rest);
        this.shards = new ShardManager(this, options?.gateway);
        this.threadGuildMap = {};
        this.unavailableGuilds = new TypedCollection(UnavailableGuild, this, this.options.collectionLimits.unavailableGuilds);
        this.users = new TypedCollection(User, this, this.options.collectionLimits.users);
    }

    /** The client's partial application. This will throw an error if not using a gateway connection or no shard is READY. If using a client for rest only, consider enabling rest mode. */
    get application(): ClientApplication {
        if (this._application) {
            return this._application;
        } else {
            throw new UncachedError(`${this.constructor.name}#application is not present if not using a gateway connection or no shard is READY. Consider making sure you have connected your client, or enable rest mode.`);
        }
    }

    get uptime(): number {
        return this.startTime ? Date.now() - this.startTime : 0;
    }

    /** The client's user. This will throw an error if not using a gateway connection or no shard is READY. If using a client for rest only, consider enabling rest mode. */
    get user(): ExtendedUser {
        if (this._user) {
            return this._user;
        } else {
            throw new UncachedError(`${this.constructor.name}#user is not present if not using a gateway connection or no shard is READY. Consider making sure you have connected your client, or enable rest mode.`);
        }
    }

    /** The active voice connections of this client. */
    get voiceConnections(): Map<string, VoiceConnection> {
        if (!DiscordJSVoice) {
            throw new DependencyError("Voice is only supported with @discordjs/voice installed.");
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return DiscordJSVoice.getVoiceConnections();
    }

    /** Connect the client to Discord. */
    async connect(): Promise<void> {
        if (this.options.restMode) {
            throw new TypeError("Rest mode has been enabled on this client. You cannot connect to the gateway.");
        }

        if (!this.options.auth || !this.options.auth.startsWith("Bot ")) {
            throw new TypeError("You must provide a bot token to connect. Make sure it has been prefixed with `Bot `.");
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
            throw new TypeError("Failed to get gateway information.", { cause: err as Error });
        }
        if (url.includes("?")) {
            url = url.slice(0, url.indexOf("?"));
        }
        if (!url.endsWith("/")) {
            url += "/";
        }
        const privilegedIntentMapping = [
            [Intents.GUILD_PRESENCES, [ApplicationFlags.GATEWAY_PRESENCE, ApplicationFlags.GATEWAY_PRESENCE_LIMITED]],
            [Intents.GUILD_MEMBERS, [ApplicationFlags.GATEWAY_GUILD_MEMBERS, ApplicationFlags.GATEWAY_GUILD_MEMBERS_LIMITED]],
            [Intents.MESSAGE_CONTENT, [ApplicationFlags.GATEWAY_MESSAGE_CONTENT, ApplicationFlags.GATEWAY_MESSAGE_CONTENT_LIMITED]]
        ] as Array<[intent: Intents, allowed: Array<ApplicationFlags>]>;

        if (this.shards.options.removeDisallowedIntents && privilegedIntentMapping.some(([intent]) => (this.shards.options.intents & intent) === intent)) {
            const { flags } = await this.rest.misc.getApplication();
            const check = (intent: Intents, allowed: Array<ApplicationFlags>): void => {
                if ((this.shards.options.intents & intent) === intent && !allowed.some(flag => (flags & flag) === flag)) {
                    this.emit("warn", `removeDisallowedIntents is enabled, and ${Intents[intent]} was included but not found to be allowed. It has been removed.`);
                    this.shards.options.intents &= ~intent;
                }
            };
            for (const [intent, allowed] of privilegedIntentMapping) {
                check(intent, allowed);
            }
        }

        this.gatewayURL = `${url}?v=${GATEWAY_VERSION}&encoding=${Erlpack ? "etf" : "json"}`;
        if (this.shards.options.compress) {
            this.gatewayURL += "&compress=zlib-stream";
        }

        if (this.shards.options.maxShards === -1) {
            if (!data || !data.shards) {
                throw new TypeError("AutoSharding failed, missing required information from Discord.");
            }
            this.shards.options.maxShards = data.shards;
            if (this.shards.options.lastShardID === -1) {
                this.shards.options.lastShardID = data.shards - 1;
            }
        }

        if (this.shards.options.concurrency === -1) {
            if (!data) {
                throw new TypeError("AutoConcurrency failed, missing required information from Discord.");
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

        this._connected = true;
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
            throw new DependencyError("Voice is only supported with @discordjs/voice installed.");
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
            throw new DependencyError("Voice is only supported with @discordjs/voice installed.");
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

    /**
     * Initialize this client for rest only use. Currently, this sets both the `application` and `user` properties (if not already present), as would happen with a gateway connection.
     * @param fakeReady If the client should emit a ready event. Defaults to true.
     */
    async restMode(fakeReady = true): Promise<this> {
        this._application ??= await this.rest.misc.getClientApplication();
        this._user ??= await this.rest.oauth.getCurrentUser();
        this.options.restMode = true;
        if (fakeReady) {
            this.emit("ready");
        }
        return this;
    }
}
