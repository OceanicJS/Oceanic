/** @module Client */
import type * as Types from "./types/namespaced";
import RESTManager from "./rest/RESTManager";
import TypedCollection from "./util/TypedCollection";
import PrivateChannel from "./structures/PrivateChannel";
import GroupChannel from "./structures/GroupChannel";
import User from "./structures/User";
import Guild from "./structures/Guild";
import TypedEmitter from "./util/TypedEmitter";
import type ClientApplication from "./structures/ClientApplication";
import ShardManager from "./gateway/ShardManager";
import UnavailableGuild from "./structures/UnavailableGuild";
import type ExtendedUser from "./structures/ExtendedUser";
import Util from "./util/Util";
import { DependencyError, UncachedError } from "./util/Errors";
import type OAuthHelper from "./rest/OAuthHelper";

/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, unicorn/prefer-module */
// @ts-ignore optional dependency
import type { DiscordGatewayAdapterLibraryMethods, VoiceConnection } from "@discordjs/voice";
import { isDeepStrictEqual } from "node:util";
import { warning, WarningCodes } from "./util/warning";

// @ts-ignore optional dependency
let DiscordJSVoice: typeof import("@discordjs/voice") | undefined;
try {
    DiscordJSVoice = require("@discordjs/voice");
} catch {}
/* eslint-enable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, unicorn/prefer-module */

/** The primary class for interfacing with Discord. See {@link Types.Events.ClientEvents | Client Events} for a list of events. */
export default class Client<E extends Types.Events.ClientEvents = Types.Events.ClientEvents> extends TypedEmitter<E> {
    private _application?: ClientApplication;
    private _user?: ExtendedUser;
    /** A key-value mapping of channel IDs to guild IDs. In most cases, every channel listed here should be cached in their respective guild's {@link Guild#channels | channels collection}. */
    channelGuildMap = new Map<string, string>();
    groupChannels: TypedCollection<Types.Channels.RawGroupChannel, GroupChannel>;
    guildShardMap = new Map<string, number>();
    guilds: TypedCollection<Types.Guilds.RawGuild, Guild, [rest?: boolean]>;
    options: Types.Client.ClientInstanceOptions;
    privateChannels: TypedCollection<Types.Channels.RawPrivateChannel, PrivateChannel>;
    ready: boolean;
    rest: RESTManager;
    shards: ShardManager;
    startTime = 0;
    /** A key-value mapping of thread IDs to guild IDs. In most cases, every channel listed here should be cached in their respective guild's {@link Guild#threads | threads collection}. */
    threadGuildMap = new Map<string, string>();
    unavailableGuilds: TypedCollection<Types.Guilds.RawUnavailableGuild, UnavailableGuild>;
    users: TypedCollection<Types.Users.RawUser, User>;
    util: Util;
    voiceAdapters = new Map<string, DiscordGatewayAdapterLibraryMethods>();
    /**
     * @constructor
     * @param options The options to create the client with.
     */
    constructor(options?: Types.Client.ClientOptions) {
        super();
        this.util = new Util(this);
        const disableCache = options?.disableCache === true || options?.disableCache === "no-warning";
        const colZero = {
            auditLogEntries:     0,
            autoModerationRules: 0,
            channels:            0,
            emojis:              0,
            groupChannels:       0,
            guilds:              0,
            guildThreads:        0,
            integrations:        0,
            invites:             0,
            members:             0,
            messages:            0,
            privateChannels:     0,
            roles:               0,
            scheduledEvents:     0,
            soundboardSounds:    0,
            stageInstances:      0,
            stickers:            0,
            unavailableGuilds:   0,
            users:               0,
            voiceMembers:        0,
            voiceStates:         0
        } satisfies Required<Types.Client.CollectionLimitsOptions>;

        if (options?.token) {
            if (options.auth) warning(WarningCodes.OCEANIC_AUTH_AND_TOKEN_PROVIDED)
            else options.auth = this._prefixToken(options.token);
            delete options.token;
        }

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
                emojis:              this.util._setLimit(options?.collectionLimits?.emojis, Infinity),
                groupChannels:       options?.collectionLimits?.groupChannels ?? 10,
                guilds:              options?.collectionLimits?.guilds ?? Infinity,
                guildThreads:        this.util._setLimit(options?.collectionLimits?.guildThreads, Infinity),
                integrations:        this.util._setLimit(options?.collectionLimits?.integrations, Infinity),
                invites:             this.util._setLimit(options?.collectionLimits?.invites, Infinity),
                members:             this.util._setLimit(options?.collectionLimits?.members, Infinity),
                messages:            this.util._setLimit(options?.collectionLimits?.messages, 100),
                privateChannels:     options?.collectionLimits?.privateChannels ?? 25,
                roles:               this.util._setLimit(options?.collectionLimits?.roles, Infinity),
                scheduledEvents:     this.util._setLimit(options?.collectionLimits?.scheduledEvents, Infinity),
                soundboardSounds:    this.util._setLimit(options?.collectionLimits?.soundboardSounds, Infinity),
                stageInstances:      this.util._setLimit(options?.collectionLimits?.stageInstances, Infinity),
                stickers:            this.util._setLimit(options?.collectionLimits?.stickers, Infinity),
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
            warning(WarningCodes.OCEANIC_CACHE_DISABLED);
        }
        if (disableCache && options?.collectionLimits !== undefined && !isDeepStrictEqual(options.collectionLimits, colZero)) {
            warning(WarningCodes.OCEANIC_COLLECTIONS_LIMIT_WITH_CACHE_DISABLED);
        }
        this.groupChannels = new TypedCollection(GroupChannel, this, this.options.collectionLimits.groupChannels);
        this.guilds = new TypedCollection(Guild, this, this.options.collectionLimits.guilds);
        this.privateChannels = new TypedCollection(PrivateChannel, this, this.options.collectionLimits.privateChannels);
        this.ready = false;
        this.rest = new RESTManager(this, options?.rest);
        this.shards = new ShardManager(this, options?.gateway);
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

    /** The function called to prefix the `token` option. This will always be called if the {@link Types.Client.ClientOptions#token | token} option is set. */
    _prefixToken(token: string): string {
        return token.startsWith("Bot ") ? token : `Bot ${token}`;
    }

    /** Connect the client to Discord. */
    async connect(): Promise<void> {
        if (this.options.restMode) {
            throw new TypeError("Rest mode has been enabled on this client. You cannot connect to the gateway.");
        }

        if (!this.options.auth || !this.options.auth.startsWith("Bot ")) {
            throw new TypeError("You must provide a bot token to connect. Make sure it has been prefixed with `Bot `.");
        }

        await this.shards.connect();
    }

    /**
     * Disconnect all shards.
     * @param reconnect If shards should be reconnected. Defaults to {@link Types/Gateway~GatewayOptions#autoReconnect | GatewayOptions#autoReconnect}
     */
    disconnect(reconnect = this.shards.options.autoReconnect): void {
        return this.shards.disconnect(reconnect);
    }

    /**
     * Edit the client's status across all shards.
     * @param status The status.
     * @param activities An array of activities.
     */
    async editStatus(status: Types.Gateway.SendStatuses, activities: Array<Types.Gateway.BotActivity> = []): Promise<void>{
        for (const [,shard] of this.shards) await shard.editStatus(status, activities);
    }

    /**
     * Get a channel from an ID. This will return undefined if the channel is not cached.
     * @param channelID The id of the channel.
     */
    getChannel<T extends Types.Channels.AnyChannel = Types.Channels.AnyChannel>(channelID: string): T | undefined {
        if (this.channelGuildMap.has(channelID)) {
            return this.guilds.get(this.channelGuildMap.get(channelID)!)?.channels.get(channelID) as T;
        } else if (this.threadGuildMap.has(channelID)) {
            return this.guilds.get(this.threadGuildMap.get(channelID)!)?.threads.get(channelID) as T;
        }
        return (this.privateChannels.get(channelID) ?? this.groupChannels.get(channelID)) as T;
    }

    /**
     * Get a helper instance that can be used with a specific access token.
     * @param accessToken The access token. Must be prefixed with `Bearer `.
     */
    getOAuthHelper(accessToken: string): OAuthHelper {
        return this.rest.oauth.getHelper(accessToken);
    }

    /**
     * Get a voice connection.
     * @param guildID The ID of the guild the voice channel belongs to.
     */
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
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
    joinVoiceChannel(options: Types.Voice.JoinVoiceChannelOptions): VoiceConnection {
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
        this._application ??= await this.rest.applications.getCurrent();
        this._user ??= await this.rest.oauth.getCurrentUser();
        this.options.restMode = true;
        if (fakeReady) {
            this.emit("ready");
        }
        return this;
    }
}
