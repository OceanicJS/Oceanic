"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    _application;
    _user;
    channelGuildMap;
    gatewayURL;
    groupChannels;
    guildShardMap;
    guilds;
    options;
    privateChannels;
    ready;
    rest;
    shards;
    startTime = 0;
    threadGuildMap;
    unavailableGuilds;
    users;
    util;
    voiceConnections;
    /**
     * @constructor
     * @param options The options to create the client with.
     */
    constructor(options) {
        super();
        this.options = {
            allowedMentions: options?.allowedMentions || {
                everyone: false,
                repliedUser: false,
                users: true,
                roles: true
            },
            auth: options?.auth || null,
            defaultImageFormat: options?.defaultImageFormat || "png",
            defaultImageSize: options?.defaultImageSize || 4096
        };
        this.channelGuildMap = {};
        this.groupChannels = new Collection_1.default(GroupChannel_1.default, this);
        this.guilds = new Collection_1.default(Guild_1.default, this);
        this.privateChannels = new Collection_1.default(PrivateChannel_1.default, this);
        this.ready = false;
        this.guildShardMap = {};
        this.rest = new RESTManager_1.default(this, options?.rest);
        this.shards = new ShardManager_1.default(this, options?.gateway);
        this.threadGuildMap = {};
        this.unavailableGuilds = new Collection_1.default(UnavailableGuild_1.default, this);
        this.users = new Collection_1.default(User_1.default, this);
        this.util = new Util_1.default(this);
        this.voiceConnections = new VoiceConnectionManager_1.default(this);
    }
    /** The client's partial application. This will throw an error if not using a gateway connection or no shard is READY. **/
    get application() {
        if (!this._application)
            throw new Error("Cannot access `client.application` without having at least one shard marked as READY.");
        else
            return this._application;
    }
    /** The client's user application. This will throw an error if not using a gateway connection or no shard is READY. **/
    get user() {
        if (!this._user)
            throw new Error("Cannot access `client.user` without having at least one shard marked as READY.");
        else
            return this._user;
    }
    async connect() {
        if (!this.options.auth || !this.options.auth.startsWith("Bot "))
            throw new Error("You must provide a bot token to connect. Make sure it has been prefixed with `Bot `.");
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
     * @param status The status.
     * @param activities An array of activities.
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
     * @param channelID The ID of the voice channel to join. Null to disconnect.
     * @param options The options for joining the voice channel.
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
     * @param channelID The ID of the voice channel to leave.
     */
    async leaveVoiceChannel(channelID) {
        const channel = this.getChannel(channelID);
        if (!channel || (channel.type !== Constants_1.ChannelTypes.GUILD_VOICE && channel.type !== Constants_1.ChannelTypes.GUILD_STAGE_VOICE))
            return;
        this.shards.get(this.guildShardMap[channel.guild.id] || 0).updateVoiceState(channel.guild.id, null, { selfDeaf: false, selfMute: false });
    }
}
exports.default = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL0NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDJDQUE0RDtBQUM1RCxxRUFBNkM7QUFDN0MsbUVBQTJDO0FBQzNDLGlGQUF5RDtBQUN6RCw2RUFBcUQ7QUFDckQsNkRBQXFDO0FBQ3JDLCtEQUF1QztBQUt2Qyx1RUFBK0M7QUFFL0MsMEVBQWtEO0FBRWxELHFGQUE2RDtBQUM3RCw0RkFBb0U7QUFJcEUsdURBQStCO0FBRS9CLG9CQUFvQjtBQUNwQixJQUFJLE9BQTZDLENBQUM7QUFDbEQsSUFBSTtJQUNBLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7Q0FDaEM7QUFBQyxNQUFNLEdBQUU7QUFDVixtQkFBbUI7QUFFbkIsc0RBQXNEO0FBQ3RELE1BQXFCLE1BQU8sU0FBUSxzQkFBMEI7SUFDbEQsWUFBWSxDQUFxQjtJQUNqQyxLQUFLLENBQWdCO0lBQzdCLGVBQWUsQ0FBeUI7SUFDeEMsVUFBVSxDQUFVO0lBQ3BCLGFBQWEsQ0FBb0Q7SUFDakUsYUFBYSxDQUF5QjtJQUN0QyxNQUFNLENBQXNDO0lBQzVDLE9BQU8sQ0FBd0I7SUFDL0IsZUFBZSxDQUF3RDtJQUN2RSxLQUFLLENBQVU7SUFDZixJQUFJLENBQWM7SUFDbEIsTUFBTSxDQUFlO0lBQ3JCLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDZCxjQUFjLENBQXlCO0lBQ3ZDLGlCQUFpQixDQUE0RDtJQUM3RSxLQUFLLENBQW9DO0lBQ3pDLElBQUksQ0FBTztJQUNYLGdCQUFnQixDQUF5QjtJQUN6Qzs7O09BR0c7SUFDSCxZQUFZLE9BQXVCO1FBQy9CLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNYLGVBQWUsRUFBRSxPQUFPLEVBQUUsZUFBZSxJQUFJO2dCQUN6QyxRQUFRLEVBQUssS0FBSztnQkFDbEIsV0FBVyxFQUFFLEtBQUs7Z0JBQ2xCLEtB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