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
    /** The client's partial application (only set when using a gateway connection, at least one shard must be READY for this to be set). */
    application;
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
    /** The client's user (only set when using a gateway connection, at least one shard must be READY for this to be set). */
    user;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL0NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDJDQUE0RDtBQUM1RCxxRUFBNkM7QUFDN0MsbUVBQTJDO0FBQzNDLGlGQUF5RDtBQUN6RCw2RUFBcUQ7QUFDckQsNkRBQXFDO0FBQ3JDLCtEQUF1QztBQUt2Qyx1RUFBK0M7QUFFL0MsMEVBQWtEO0FBRWxELHFGQUE2RDtBQUM3RCw0RkFBb0U7QUFJcEUsdURBQStCO0FBRS9CLG9CQUFvQjtBQUNwQixJQUFJLE9BQTZDLENBQUM7QUFDbEQsSUFBSTtJQUNBLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7Q0FDaEM7QUFBQyxNQUFNLEdBQUU7QUFDVixtQkFBbUI7QUFFbkIsc0RBQXNEO0FBQ3RELE1BQXFCLE1BQU8sU0FBUSxzQkFBMEI7SUFDMUQsd0lBQXdJO0lBQ3hJLFdBQVcsQ0FBcUI7SUFDaEMsZUFBZSxDQUF5QjtJQUN4QyxVQUFVLENBQVU7SUFDcEIsYUFBYSxDQUFvRDtJQUNqRSxhQUFhLENBQXlCO0lBQ3RDLE1BQU0sQ0FBc0M7SUFDNUMsT0FBTyxDQUF3QjtJQUMvQixlQUFlLENBQXdEO0lBQ3ZFLEtBQUssQ0FBVTtJQUNmLElBQUksQ0FBYztJQUNsQixNQUFNLENBQWU7SUFDckIsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNkLGNBQWMsQ0FBeUI7SUFDdkMsaUJBQWlCLENBQTREO0lBQzdFLHlIQUF5SDtJQUN6SCxJQUFJLENBQWdCO0lBQ3BCLEtBQUssQ0FBb0M7SUFDekMsSUFBSSxDQUFPO0lBQ1gsZ0JBQWdCLENBQXlCO0lBQ3pDOzs7T0FHRztJQUNILFlBQVksT0FBdUI7UUFDL0IsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ1gsZUFBZSxFQUFFLE9BQU8sRUFBRSxlQUFlLElBQUk7Z0JBQ3pDLFFBQVEsRUFBSyxLQUFLO2dCQUNs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