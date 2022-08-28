"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Properties_1 = __importDefault(require("./util/Properties"));
const Constants_1 = require("./Constants");
const RESTManager_1 = __importDefault(require("./rest/RESTManager"));
const Collection_1 = __importDefault(require("./util/Collection"));
const PrivateChannel_1 = __importDefault(require("./structures/PrivateChannel"));
const GroupChannel_1 = __importDefault(require("./structures/GroupChannel"));
const User_1 = __importDefault(require("./structures/User"));
const Guild_1 = __importDefault(require("./structures/Guild"));
const TypedEmitter_1 = __importDefault(require("./util/TypedEmitter"));
const ShardManager_1 = __importDefault(require("./gateway/ShardManager"));
const UnavailableGuild_1 = __importDefault(require("./structures/UnavailableGuild"));
const VoiceConnectionManager_1 = __importDefault(require("./voice/VoiceConnectionManager"));
const Util_1 = __importDefault(require("./util/Util"));
/* eslint-disable */
let Erlpack;
try {
    Erlpack = require("erlpack");
}
catch { }
/* eslint-enable */
/** The primary class for interfacing with Discord. */
class Client extends TypedEmitter_1.default {
    /** The client's partial application (only set when using a gateway connection, at least one shard must be READY for this to be set). */
    application;
    channelGuildMap;
    gatewayURL;
    groupChannels;
    guildShardMap;
    guilds;
    options;
    privateChannels;
    ready = false;
    rest;
    shards;
    startTime = 0;
    threadGuildMap;
    unavailableGuilds;
    /** The client's user (only set when using a gateway connection, at least one shard must be READY for this to be set). */
    user;
    users;
    util;
    voiceConnections;
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
    constructor(options) {
        super();
        Properties_1.default.new(this)
            .define("options", {
            allowedMentions: options?.allowedMentions || {
                everyone: false,
                repliedUser: false,
                users: true,
                roles: true
            },
            auth: options?.auth || null,
            defaultImageFormat: options?.defaultImageFormat || "png",
            defaultImageSize: options?.defaultImageSize || 4096
        })
            .define("channelGuildMap", {})
            .define("groupChannels", new Collection_1.default(GroupChannel_1.default, this))
            .define("guilds", new Collection_1.default(Guild_1.default, this))
            .define("privateChannels", new Collection_1.default(PrivateChannel_1.default, this))
            .define("guildShardMap", {})
            .define("rest", new RESTManager_1.default(this, options?.rest))
            .define("shards", new ShardManager_1.default(this, options?.gateway))
            .define("threadGuildMap", {})
            .define("unavailableGuilds", new Collection_1.default(UnavailableGuild_1.default, this))
            .define("users", new Collection_1.default(User_1.default, this))
            .define("util", new Util_1.default(this))
            .define("voiceConnections", new VoiceConnectionManager_1.default(this));
    }
    async connect() {
        if (!this.options.auth || !this.options.auth.startsWith("Bot "))
            throw new Error("You must provide a bot token to connect.");
        let url, data;
        try {
            if (this.shards.options.maxShards === -1 || this.shards.options.concurrency === -1) {
                data = await this.rest.getBotGateway();
                url = data.url;
            }
            else
                url = (await this.rest.getGateway()).url;
        }
        catch (err) {
            throw new Error("Failed to get gateway information.", { cause: err });
        }
        if (url.includes("?"))
            url = url.slice(0, url.indexOf("?"));
        if (!url.endsWith("/"))
            url += "/";
        this.gatewayURL = `${url}?v=${Constants_1.GATEWAY_VERSION}&encoding=${Erlpack ? "etf" : "json"}`;
        if (this.shards.options.compress)
            this.gatewayURL += "&compress=zlib-stream";
        if (this.shards.options.maxShards === -1) {
            if (!data || !data.shards)
                throw new Error("AutoSharding failed, missing required information from Discord.");
            this.shards.options.maxShards = data.shards;
            if (this.shards.options.lastShardID === -1)
                this.shards.options.lastShardID = data.shards - 1;
        }
        if (this.shards.options.concurrency === -1) {
            if (!data)
                throw new Error("AutoConcurrency failed, missing required information from Discord.");
            this.shards.options.concurrency = data.maxConcurrency ?? 1;
        }
        if (!Array.isArray(this.shards.options.shardIDs))
            this.shards.options.shardIDs = [];
        if (this.shards.options.shardIDs.length === 0) {
            if (this.shards.options.firstShardID !== undefined && this.shards.options.lastShardID !== undefined) {
                for (let i = this.shards.options.firstShardID; i <= this.shards.options.lastShardID; i++) {
                    this.shards.options.shardIDs.push(i);
                }
            }
        }
        for (const id of this.shards.options.shardIDs)
            this.shards.spawn(id);
    }
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
    async editStatus(status, activities = []) {
        return this.shards.forEach(shard => shard.editStatus(status, activities));
    }
    getChannel(id) {
        if (this.channelGuildMap[id])
            return this.guilds.get(this.channelGuildMap[id])?.channels.get(id);
        return (this.privateChannels.get(id) || this.groupChannels.get(id));
    }
    /**
     * Join a voice channel.
     *
     * @param {String?} channelID - The ID of the voice channel to join. Null to disconnect.
     * @param {Object} [options]
     * @param {Boolean} [options.selfDeaf] - If the client should join deafened.
     * @param {Boolean} [options.selfMute] - If the client should join muted.
     * @returns {Promise<void>}
     */
    async joinVoiceChannel(channelID, options) {
        const channel = this.getChannel(channelID);
        if (!channel)
            throw new Error("Invalid channel. Make sure the id is correct, and the channel is cached.");
        if (channel.type !== Constants_1.ChannelTypes.GUILD_VOICE && channel.type !== Constants_1.ChannelTypes.GUILD_STAGE_VOICE)
            throw new Error("Only voice & stage channels can be joined.");
        this.shards.get(this.guildShardMap[channel.guild.id] || 0).updateVoiceState(channel.guild.id, channelID, options);
        // @TODO proper voice connection handling
    }
    /**
     * Leave a voice channel.
     *
     * @param {String} channelID - The ID of the voice channel to leave.
     * @returns {Promise<void>}
     */
    async leaveVoiceChannel(channelID) {
        const channel = this.getChannel(channelID);
        if (!channel || (channel.type !== Constants_1.ChannelTypes.GUILD_VOICE && channel.type !== Constants_1.ChannelTypes.GUILD_STAGE_VOICE))
            return;
        this.shards.get(this.guildShardMap[channel.guild.id] || 0).updateVoiceState(channel.guild.id, null, { selfDeaf: false, selfMute: false });
    }
}
exports.default = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL0NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1FQUEyQztBQUUzQywyQ0FBeUU7QUFDekUscUVBQTZDO0FBQzdDLG1FQUEyQztBQUMzQyxpRkFBeUQ7QUFDekQsNkVBQXFEO0FBQ3JELDZEQUFxQztBQUNyQywrREFBdUM7QUFLdkMsdUVBQStDO0FBRS9DLDBFQUFrRDtBQVFsRCxxRkFBNkQ7QUFDN0QsNEZBQW9FO0FBSXBFLHVEQUErQjtBQUcvQixvQkFBb0I7QUFDcEIsSUFBSSxPQUE2QyxDQUFDO0FBQ2xELElBQUk7SUFDQSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0NBQ2hDO0FBQUMsTUFBTSxHQUFFO0FBQ1YsbUJBQW1CO0FBRW5CLHNEQUFzRDtBQUN0RCxNQUFxQixNQUFPLFNBQVEsc0JBQTBCO0lBQzFELHdJQUF3STtJQUN4SSxXQUFXLENBQW9CO0lBQy9CLGVBQWUsQ0FBeUI7SUFDeEMsVUFBVSxDQUFTO0lBQ25CLGFBQWEsQ0FBb0Q7SUFDakUsYUFBYSxDQUF5QjtJQUN0QyxNQUFNLENBQXNDO0lBQzVDLE9BQU8sQ0FBd0I7SUFDL0IsZUFBZSxDQUF3RDtJQUN2RSxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ2QsSUFBSSxDQUFjO0lBQ2xCLE1BQU0sQ0FBZTtJQUNyQixTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsY0FBYyxDQUF5QjtJQUN2QyxpQkFBaUIsQ0FBNEQ7SUFDN0UseUhBQXlIO0lBQ3pILElBQUksQ0FBZTtJQUNuQixLQUFLLENBQW9DO0lBQ3pDLElBQUksQ0FBTztJQUNYLGdCQUFnQixDQUF5QjtJQUN6Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQWlERztJQUNILFlBQVksT0FBdUI7UUFDL0IsS0FBSyxFQUFFLENBQUM7UUFDUixvQkFBVSxDQUFDLEdB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