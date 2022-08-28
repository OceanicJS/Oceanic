"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GatewayError_1 = __importDefault(require("./GatewayError"));
const Properties_1 = __importDefault(require("../util/Properties"));
const TypedEmitter_1 = __importDefault(require("../util/TypedEmitter"));
const Bucket_1 = __importDefault(require("../rest/Bucket"));
const Constants_1 = require("../Constants");
const Base_1 = __importDefault(require("../structures/Base"));
const ClientApplication_1 = __importDefault(require("../structures/ClientApplication"));
const ExtendedUser_1 = __importDefault(require("../structures/ExtendedUser"));
const AutoModerationRule_1 = __importDefault(require("../structures/AutoModerationRule"));
const Channel_1 = __importDefault(require("../structures/Channel"));
const VoiceChannel_1 = __importDefault(require("../structures/VoiceChannel"));
const StageChannel_1 = __importDefault(require("../structures/StageChannel"));
const ScheduledEvent_1 = __importDefault(require("../structures/ScheduledEvent"));
const Invite_1 = __importDefault(require("../structures/Invite"));
const Message_1 = __importDefault(require("../structures/Message"));
const StageInstance_1 = __importDefault(require("../structures/StageInstance"));
const Debug_1 = __importDefault(require("../util/Debug"));
const Interaction_1 = __importDefault(require("../structures/Interaction"));
const ws_1 = require("ws");
const tsafe_1 = require("tsafe");
const crypto_1 = require("crypto");
const util_1 = require("util");
/* eslint-disable */
let Erlpack;
try {
    Erlpack = require("erlpack");
}
catch { }
let ZlibSync, zlibConstants;
try {
    ZlibSync = require("zlib-sync");
    zlibConstants = require("zlib-sync");
}
catch {
    try {
        ZlibSync = require("pako");
        zlibConstants = require("pako").constants;
    }
    catch { }
}
class Shard extends TypedEmitter_1.default {
    _client;
    _connectTimeout;
    _getAllUsersCount;
    _getAllUsersQueue;
    _guildCreateTimeout;
    _heartbeatInterval;
    _requestMembersPromise;
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    _sharedZLib;
    connectAttempts;
    connecting;
    globalBucket;
    id;
    lastHeartbeatAck;
    lastHeartbeatReceived;
    lastHeartbeatSent;
    latency;
    preReady;
    presence;
    presenceUpdateBucket;
    ready;
    reconnectInterval;
    resumeURL;
    sequence;
    sessionID;
    status;
    ws;
    constructor(id, client) {
        super();
        Properties_1.default.new(this)
            .looseDefine("_client", client)
            .define("ws", null, true);
        this.onDispatch = this.onDispatch.bind(this);
        this.onPacket = this.onPacket.bind(this);
        this.onWSClose = this.onWSClose.bind(this);
        this.onWSError = this.onWSError.bind(this);
        this.onWSMessage = this.onWSMessage.bind(this);
        this.onWSOpen = this.onWSOpen.bind(this);
        this.id = id;
        this.hardReset();
    }
    async checkReady() {
        if (!this.ready) {
            if (this._getAllUsersQueue.length > 0) {
                const id = this._getAllUsersQueue.shift();
                await this.requestGuildMembers(id);
                this._getAllUsersQueue.splice(this._getAllUsersQueue.indexOf(id), 1);
                return;
            }
            if (Object.keys(this._getAllUsersCount).length === 0) {
                this.ready = true;
                this.emit("ready");
            }
        }
    }
    createGuild(data) {
        this._client.guildShardMap[data.id] = this.id;
        const guild = this._client.guilds.update(data);
        if (this._client.shards.options.getAllUsers && guild.members.size > guild.memberCount) {
            void this.requestGuildMembers(guild.id, {
                presences: (this._client.shards.options.intents & Constants_1.Intents.GUILD_PRESENCES) === Constants_1.Intents.GUILD_PRESENCES
            });
        }
        return guild;
    }
    initialize() {
        if (!this._token)
            return this.disconnect(false, new Error("Invalid Token"));
        this.status = "connecting";
        if (this._client.shards.options.compress) {
            if (!ZlibSync)
                throw new Error("Cannot use compression without pako or zlib-sync.");
            this._client.emit("debug", "Initializing zlib-sync-based compression");
            this._sharedZLib = new ZlibSync.Inflate({
                chunkSize: 128 * 1024
            });
        }
        if (this.sessionID) {
            if (this.resumeURL === null) {
                this._client.emit("warn", "Resume url is not currently present. Discord may disconnect you quicker.", this.id);
            }
            this.ws = new ws_1.WebSocket(this.resumeURL || this._client.gatewayURL, this._client.shards.options.ws);
        }
        else {
            this.ws = new ws_1.WebSocket(this._client.gatewayURL, this._client.shards.options.ws);
        }
        this.ws.on("close", this.onWSClose);
        this.ws.on("error", this.onWSError);
        this.ws.on("message", this.onWSMessage);
        this.ws.on("open", this.onWSOpen);
        this._connectTimeout = setTimeout(() => {
            if (this.connecting) {
                this.disconnect(undefined, new Error("Connection timeout"));
            }
        }, this._client.shards.options.connectionTimeout);
    }
    async onDispatch(packet) {
        this._client.emit("packet", packet, this.id);
        switch (packet.t) {
            case "APPLICATION_COMMAND_PERMISSIONS_UPDATE": {
                this._client.emit("applicationCommandPermissionsUpdate", this._client.guilds.get(packet.d.guild_id), {
                    application: packet.d.application_id === this._client.application.id ? this._client.application : { id: packet.d.application_id },
                    id: packet.d.id,
                    permissions: packet.d.permissions
                });
                break;
            }
            case "AUTO_MODERATION_ACTION_EXECUTION": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                this._client.emit("autoModerationRuleCreate", guild.autoModerationRules.update(packet.d));
                break;
            }
            case "AUTO_MODERATION_RULE_CREATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                this._client.emit("autoModerationRuleCreate", guild.autoModerationRules.update(packet.d));
                break;
            }
            case "AUTO_MODERATION_RULE_DELETE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                guild.autoModerationRules.delete(packet.d.id);
                this._client.emit("autoModerationRuleDelete", new AutoModerationRule_1.default(packet.d, this._client));
                break;
            }
            case "AUTO_MODERATION_RULE_UPDATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                const oldRule = guild.autoModerationRules.get(packet.d.id)?.toJSON() || null;
                this._client.emit("autoModerationRuleUpdate", guild.autoModerationRules.update(packet.d), oldRule);
                break;
            }
            case "CHANNEL_CREATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                let channel;
                if (guild.channels.has(packet.d.id))
                    channel = guild.channels.update(packet.d);
                else {
                    channel = guild.channels.add(Channel_1.default.from(packet.d, this._client));
                    this._client.channelGuildMap[packet.d.id] = guild.id;
                }
                this._client.emit("channelCreate", channel);
                break;
            }
            case "CHANNEL_DELETE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                let channel;
                if (guild.channels.has(packet.d.id))
                    channel = guild.channels.get(packet.d.id);
                else
                    channel = Channel_1.default.from(packet.d, this._client);
                if (channel instanceof VoiceChannel_1.default || channel instanceof StageChannel_1.default) {
                    channel.voiceMembers.forEach(member => {
                        channel.voiceMembers.delete(member.id);
                        this._client.emit("voiceChannelLeave", member, channel);
                    });
                }
                guild.channels.delete(packet.d.id);
                this._client.emit("channelDelete", channel);
                break;
            }
            case "CHANNEL_PINS_UPDATE": {
                const channel = this._client.getChannel(packet.d.channel_id);
                if (!channel) {
                    this._client.emit("warn", `Missing channel ${packet.d.channel_id} in CHANNEL_PINS_UPDATE`, this.id);
                    break;
                }
                this._client.emit("channelPinsUpdate", channel, !packet.d.last_pin_timestamp ? null : new Date(packet.d.last_pin_timestamp));
                break;
            }
            case "CHANNEL_UPDATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                let oldChannel = null;
                let channel;
                if (guild.channels.has(packet.d.id)) {
                    oldChannel = guild.channels.get(packet.d.id).toJSON();
                    channel = guild.channels.update(packet.d);
                }
                else {
                    channel = guild.channels.add(Channel_1.default.from(packet.d, this._client));
                    this._client.channelGuildMap[packet.d.id] = guild.id;
                }
                this._client.emit("channelUpdate", channel, oldChannel);
                break;
            }
            case "GUILD_BAN_ADD": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                this._client.emit("guildBanAdd", guild, this._client.users.update(packet.d.user));
                break;
            }
            case "GUILD_BAN_REMOVE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                this._client.emit("guildBanRemove", guild, this._client.users.update(packet.d.user));
                break;
            }
            case "GUILD_CREATE": {
                if (!packet.d.unavailable) {
                    const guild = this.createGuild(packet.d);
                    if (this.ready) {
                        if (this._client.unavailableGuilds.delete(guild.id))
                            this._client.emit("guildAvailable", guild);
                        else
                            this._client.emit("guildCreate", guild);
                    }
                    else {
                        this._client.unavailableGuilds.delete(guild.id);
                        void this.restartGuildCreateTimeout();
                    }
                }
                else {
                    this._client.guilds.delete(packet.d.id);
                    this._client.emit("unavailableGuildCreate", this._client.unavailableGuilds.update(packet.d));
                }
                break;
            }
            case "GUILD_DELETE": {
                // @TODO disconnect voice
                delete this._client.guildShardMap[packet.d.id];
                const guild = this._client.guilds.get(packet.d.id);
                this._client.guilds.delete(packet.d.id);
                if (guild)
                    guild.channels.forEach((channel) => {
                        delete this._client.channelGuildMap[channel.id];
                    });
                if (packet.d.unavailable)
                    this._client.emit("guildUnavailable", this._client.unavailableGuilds.update(packet.d));
                else
                    this._client.emit("guildDelete", guild || { id: packet.d.id });
                break;
            }
            case "GUILD_EMOJIS_UPDATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                const oldEmojis = [...guild.emojis];
                guild["update"]({ emojis: packet.d.emojis });
                this._client.emit("guildEmojisUpdate", guild, guild.emojis, oldEmojis);
                break;
            }
            case "GUILD_INTEGRATIONS_UPDATE": {
                this._client.emit("guildIntegrationsUpdate", this._client.guilds.get(packet.d.guild_id));
                break;
            }
            case "GUILD_MEMBER_ADD": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                this._client.emit("guildMemberAdd", guild, guild.members.update({ ...packet.d, id: packet.d.user.id }, guild.id));
                break;
            }
            case "GUILD_MEMBERS_CHUNK": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                const members = packet.d.members.map(member => guild.members.update({ ...member, id: member.user.id }, guild.id));
                if (packet.d.presences)
                    packet.d.presences.forEach(presence => {
                        const member = guild.members.get(presence.user.id);
                        if (member)
                            member.presence = presence;
                    });
                if (!packet.d.nonce) {
                    this._client.emit("warn", "Recieved GUILD_MEMBERS_CHUNK without a nonce.");
                    break;
                }
                if (this._requestMembersPromise[packet.d.nonce])
                    this._requestMembersPromise[packet.d.nonce].members.push(...members);
                if (packet.d.chunk_index >= packet.d.chunk_count - 1) {
                    if (this._requestMembersPromise[packet.d.nonce]) {
                        clearTimeout(this._requestMembersPromise[packet.d.nonce].timeout);
                        this._requestMembersPromise[packet.d.nonce].resolve(this._requestMembersPromise[packet.d.nonce].members);
                        delete this._requestMembersPromise[packet.d.nonce];
                    }
                    if (this._getAllUsersCount[guild.id]) {
                        delete this._getAllUsersCount[guild.id];
                        void this.checkReady();
                    }
                }
                this._client.emit("guildMemberChunk", guild, members);
                this.lastHeartbeatAck = true;
                break;
            }
            case "GUILD_MEMBER_REMOVE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                let member;
                if (guild.members.has(packet.d.user.id)) {
                    member = guild.members.get(packet.d.user.id);
                    member["update"]({ user: packet.d.user });
                }
                else
                    member = this._client.users.update(packet.d.user);
                this._client.emit("guildMemberRemove", guild, member);
                break;
            }
            case "GUILD_MEMBER_UPDATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                const oldMember = guild.members.get(packet.d.user.id)?.toJSON() || null;
                this._client.emit("guildMemberUpdate", guild, guild.members.update({ ...packet.d, id: packet.d.user.id }, guild.id), oldMember);
                break;
            }
            case "GUILD_ROLE_CREATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                this._client.emit("guildRoleCreate", guild.roles.update(packet.d.role, guild.id));
                break;
            }
            case "GUILD_ROLE_DELETE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                this._client.emit("guildRoleDelete", guild.roles.get(packet.d.role_id));
                break;
            }
            case "GUILD_ROLE_UPDATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                const oldRole = guild.roles.get(packet.d.role.id)?.toJSON() || null;
                this._client.emit("guildRoleUpdate", guild.roles.update(packet.d.role, guild.id), oldRole);
                break;
            }
            case "GUILD_SCHEDULED_EVENT_CREATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                this._client.emit("guildScheduledEventCreate", guild.scheduledEvents.update(packet.d));
                break;
            }
            case "GUILD_SCHEDULED_EVENT_DELETE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                let event;
                if (guild.scheduledEvents.has(packet.d.id))
                    event = guild.scheduledEvents.get(packet.d.id);
                else
                    event = new ScheduledEvent_1.default(packet.d, this._client);
                this._client.emit("guildScheduledEventDelete", event);
                break;
            }
            case "GUILD_SCHEDULED_EVENT_UPDATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                const oldEvent = guild.scheduledEvents.get(packet.d.id)?.toJSON() || null;
                this._client.emit("guildScheduledEventUpdate", guild.scheduledEvents.update(packet.d), oldEvent);
                break;
            }
            case "GUILD_SCHEDULED_EVENT_USER_ADD": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                const event = guild.scheduledEvents.get(packet.d.guild_scheduled_event_id) || { id: packet.d.guild_scheduled_event_id };
                if ("userCount" in event)
                    event.userCount++;
                const user = this._client.users.get(packet.d.user_id) || { id: packet.d.user_id };
                this._client.emit("guildScheduledEventUserAdd", event, user);
                break;
            }
            case "GUILD_SCHEDULED_EVENT_USER_REMOVE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                const event = guild.scheduledEvents.get(packet.d.guild_scheduled_event_id) || { id: packet.d.guild_scheduled_event_id };
                if ("userCount" in event)
                    event.userCount--;
                const user = this._client.users.get(packet.d.user_id) || { id: packet.d.user_id };
                this._client.emit("guildScheduledEventUserRemove", event, user);
                break;
            }
            case "GUILD_STICKERS_UPDATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                const oldStickers = [...guild.stickers];
                guild["update"]({ stickers: packet.d.stickers });
                this._client.emit("guildStickersUpdate", guild, guild.stickers, oldStickers);
                break;
            }
            case "GUILD_UPDATE": {
                const guild = this._client.guilds.get(packet.d.id);
                const oldGuild = guild.toJSON();
                this._client.emit("guildUpdate", this._client.guilds.update(packet.d), oldGuild);
                break;
            }
            case "INTEGRATION_CREATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                this._client.emit("integrationCreate", guild, guild.integrations.update(packet.d));
                break;
            }
            case "INTEGRATION_DELETE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                this._client.emit("integrationDelete", guild, guild.integrations.get(packet.d.id) || { applicationID: packet.d.application_id, id: packet.d.id });
                break;
            }
            case "INTEGRATION_UPDATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                const oldIntegration = guild.integrations.get(packet.d.id)?.toJSON() || null;
                this._client.emit("integrationUpdate", guild, guild.integrations.update(packet.d), oldIntegration);
                break;
            }
            case "INTERACTION_CREATE": {
                this._client.emit("interactionCreate", Interaction_1.default.from(packet.d, this._client));
                break;
            }
            case "INVITE_CREATE": {
                const guild = packet.d.guild_id ? this._client.guilds.get(packet.d.guild_id) : null;
                const channel = this._client.getChannel(packet.d.channel_id);
                this._client.emit("inviteCreate", guild, channel, new Invite_1.default(packet.d, this._client));
                break;
            }
            case "INVITE_DELETE": {
                const guild = packet.d.guild_id ? this._client.guilds.get(packet.d.guild_id) : null;
                const channel = this._client.getChannel(packet.d.channel_id);
                this._client.emit("inviteDelete", guild, channel, packet.d.code);
                break;
            }
            case "MESSAGE_CREATE": {
                const channel = this._client.getChannel(packet.d.channel_id);
                const message = channel ? channel.messages.update(packet.d) : new Message_1.default(packet.d, this._client);
                if (channel)
                    channel.lastMessage = message;
                this._client.emit("messageCreate", message);
                break;
            }
            case "MESSAGE_DELETE": {
                const channel = this._client.getChannel(packet.d.channel_id);
                const message = channel?.messages.get(packet.d.id) || { channel: channel || { id: packet.d.channel_id }, id: packet.d.id };
                if (channel)
                    channel.messages.delete(packet.d.id);
                this._client.emit("messageDelete", message);
                break;
            }
            case "MESSAGE_DELETE_BULK": {
                const channel = this._client.getChannel(packet.d.channel_id);
                this._client.emit("messageDeleteBulk", packet.d.ids.map(id => {
                    if (channel && channel.messages.has(id)) {
                        const message = channel.messages.get(id);
                        channel.messages.delete(id);
                        return message;
                    }
                    else {
                        return {
                            channel: channel || { id: packet.d.channel_id },
                            id
                        };
                    }
                }));
                break;
            }
            case "MESSAGE_REACTION_ADD": {
                const guild = packet.d.guild_id ? this._client.guilds.get(packet.d.guild_id) : null;
                const channel = this._client.getChannel(packet.d.channel_id);
                const message = channel?.messages.get(packet.d.message_id) || { channel: channel || { id: packet.d.channel_id }, id: packet.d.message_id };
                let reactor;
                if (guild && packet.d.member)
                    reactor = guild.members.update({ ...packet.d.member, id: packet.d.user_id }, guild.id);
                else
                    reactor = this._client.users.get(packet.d.user_id) || { id: packet.d.user_id };
                if (message instanceof Message_1.default) {
                    const name = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                    if (message.reactions[name]) {
                        message.reactions[name].count++;
                        if (packet.d.user_id === this._client.user.id)
                            message.reactions[name].me = true;
                    }
                    else {
                        message.reactions[name] = {
                            count: 1,
                            me: packet.d.user_id === this._client.user.id
                        };
                    }
                }
                this._client.emit("messageReactionAdd", message, reactor, packet.d.emoji);
                break;
            }
            case "MESSAGE_REACTION_REMOVE": {
                const channel = this._client.getChannel(packet.d.channel_id);
                const message = channel?.messages.get(packet.d.message_id) || { channel: channel || { id: packet.d.channel_id }, id: packet.d.message_id };
                const reactor = this._client.users.get(packet.d.user_id) || { id: packet.d.user_id };
                if (message instanceof Message_1.default) {
                    const name = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                    if (message.reactions[name]) {
                        message.reactions[name].count--;
                        if (packet.d.user_id === this._client.user.id)
                            message.reactions[name].me = false;
                        if (message.reactions[name].count === 0)
                            delete message.reactions[name];
                    }
                }
                this._client.emit("messageReactionRemove", message, reactor, packet.d.emoji);
                break;
            }
            case "MESSAGE_REACTION_REMOVE_ALL": {
                const channel = this._client.getChannel(packet.d.channel_id);
                const message = channel?.messages.get(packet.d.message_id) || { channel: channel || { id: packet.d.channel_id }, id: packet.d.message_id };
                if (message instanceof Message_1.default)
                    message.reactions = {};
                this._client.emit("messageReactionRemoveAll", message);
                break;
            }
            case "MESSAGE_REACTION_REMOVE_EMOJI": {
                const channel = this._client.getChannel(packet.d.channel_id);
                const message = channel?.messages.get(packet.d.message_id) || { channel: channel || { id: packet.d.channel_id }, id: packet.d.message_id };
                if (message instanceof Message_1.default) {
                    const name = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                    if (message.reactions[name])
                        delete message.reactions[name];
                }
                this._client.emit("messageReactionRemoveEmoji", message, packet.d.emoji);
                break;
            }
            case "MESSAGE_UPDATE": {
                const channel = this._client.getChannel(packet.d.channel_id);
                const oldMessage = channel && "messages" in channel ? channel.messages.get(packet.d.id)?.toJSON() || null : null;
                const message = channel && "messages" in channel ? channel.messages.update(packet.d) : new Message_1.default(packet.d, this._client);
                this._client.emit("messageUpdate", message, oldMessage);
                break;
            }
            case "PRESENCE_UPDATE": {
                const user = this._client.users.get(packet.d.user.id);
                if (user) {
                    const oldUser = user.toJSON();
                    user["update"](packet.d.user);
                    if (JSON.stringify(oldUser) !== JSON.stringify(user.toJSON()))
                        this._client.emit("userUpdate", user, oldUser);
                }
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this._client.emit("debug", `Got PRESENCE_UPDATE for ${packet.d.user.id} without guild ${packet.d.guild_id}`);
                    break;
                }
                const member = guild.members.get(packet.d.user.id);
                let oldPresence = null;
                if (member && member.presence) {
                    oldPresence = member.presence;
                    delete packet.d.user;
                    member.presence = packet.d;
                    this._client.emit("presenceUpdate", guild, member, oldPresence, packet.d);
                }
                break;
            }
            case "READY": {
                this.connectAttempts = 0;
                this.reconnectInterval = 1000;
                this.connecting = false;
                if (this._connectTimeout)
                    clearInterval(this._connectTimeout);
                this.status = "ready";
                this._client.shards["_ready"](this.id);
                this._client.application = new ClientApplication_1.default(packet.d.application, this._client);
                if (!this._client.user)
                    this._client.user = this._client.users.add(new ExtendedUser_1.default(packet.d.user, this._client));
                else
                    this._client.users.update(packet.d.user);
                let url = packet.d.resume_gateway_url;
                if (url.includes("?"))
                    url = url.slice(0, url.indexOf("?"));
                if (!url.endsWith("/"))
                    url += "/";
                this.resumeURL = `${url}?v=${Constants_1.GATEWAY_VERSION}&encoding=${Erlpack ? "etf" : "json"}`;
                packet.d.guilds.forEach(guild => {
                    this._client.guilds.delete(guild.id);
                    this._client.unavailableGuilds.update(guild);
                });
                this.preReady = true;
                this.emit("preReady");
                if (this._client.unavailableGuilds.size > 0 && packet.d.guilds.length > 0)
                    void this.restartGuildCreateTimeout();
                else
                    void this.checkReady();
                break;
            }
            case "RESUMED": {
                this.connectAttempts = 0;
                this.reconnectInterval = 1000;
                this.connecting = false;
                if (this._connectTimeout)
                    clearInterval(this._connectTimeout);
                this.status = "ready";
                this._client.shards["_ready"](this.id);
                break;
            }
            case "STAGE_INSTANCE_CREATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                this._client.emit("stageInstanceCreate", guild.stageInstances.update(packet.d));
                break;
            }
            case "STAGE_INSTANCE_DELETE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                this._client.emit("stageInstanceDelete", guild.stageInstances.get(packet.d.id) || new StageInstance_1.default(packet.d, this._client));
                break;
            }
            case "STAGE_INSTANCE_UPDATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                const oldStageInstance = guild.stageInstances.get(packet.d.id)?.toJSON() || null;
                this._client.emit("stageInstanceUpdate", guild.stageInstances.update(packet.d), oldStageInstance);
                break;
            }
            case "THREAD_CREATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                let thread;
                if (guild.threads.has(packet.d.id))
                    thread = guild.threads.update(packet.d);
                else {
                    thread = guild.threads.add(Channel_1.default.from(packet.d, this._client));
                    this._client.threadGuildMap[packet.d.id] = guild.id;
                }
                this._client.emit("threadCreate", thread);
                break;
            }
            case "THREAD_DELETE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                let thread;
                if (guild.threads.has(packet.d.id))
                    thread = guild.threads.get(packet.d.id);
                else
                    thread = {
                        id: packet.d.id,
                        type: packet.d.type,
                        parentID: packet.d.parent_id
                    };
                guild.threads.delete(packet.d.id);
                this._client.emit("threadDelete", thread);
                break;
            }
            case "THREAD_LIST_SYNC": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                for (const thread of packet.d.threads) {
                    if (guild.threads.has(thread.id))
                        guild.threads.update(thread);
                    else
                        guild.threads.add(Channel_1.default.from(thread, this._client));
                }
                break;
            }
            case "THREAD_MEMBER_UPDATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                const thread = guild.threads.get(packet.d.id);
                if (!thread) {
                    this._client.emit("warn", `Missing thread ${packet.d.id} for ${packet.d.user_id} in THREAD_MEMBER_UPDATE`, this.id);
                    break;
                }
                let oldMember = null, member;
                const index = thread.members.findIndex(m => m.userID === packet.d.user_id);
                if (index === -1)
                    member = thread.members[thread.members.push({
                        id: packet.d.id,
                        flags: packet.d.flags,
                        joinTimestamp: new Date(packet.d.join_timestamp),
                        userID: packet.d.user_id
                    })];
                else {
                    oldMember = { ...thread.members[index] };
                    member = thread.members[index] = {
                        ...thread.members[index],
                        flags: packet.d.flags,
                        joinTimestamp: new Date(packet.d.join_timestamp)
                    };
                }
                this._client.emit("threadMemberUpdate", thread, member, oldMember);
                break;
            }
            case "THREAD_MEMBERS_UPDATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                const thread = guild.threads.get(packet.d.id);
                if (!thread) {
                    this._client.emit("warn", `Missing thread ${packet.d.id} in THREAD_MEMBERS_UPDATE`, this.id);
                    break;
                }
                thread.memberCount = packet.d.member_count;
                const addedMembers = [], removedMembers = [];
                packet.d.added_members.forEach(rawMember => {
                    let member;
                    const index = thread.members.findIndex(m => m.userID === rawMember.id);
                    if (index === -1)
                        member = thread.members[thread.members.push({ flags: rawMember.flags, id: rawMember.id, joinTimestamp: new Date(rawMember.join_timestamp), userID: rawMember.user_id })];
                    else {
                        member = thread.members[index] = {
                            ...thread.members[index],
                            flags: rawMember.flags,
                            joinTimestamp: new Date(rawMember.join_timestamp)
                        };
                    }
                    addedMembers.push(member);
                });
                packet.d.removed_member_ids.forEach(id => {
                    const index = thread.members.findIndex(m => m.userID === id);
                    if (index === -1) {
                        this._client.emit("warn", `Missing member ${id} in THREAD_MEMBERS_UPDATE`, this.id);
                        return;
                    }
                    removedMembers.push(...thread.members.splice(index, 1));
                });
                this._client.emit("threadMembersUpdate", thread, addedMembers, removedMembers);
                break;
            }
            case "THREAD_UPDATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                let oldThread = null;
                let thread;
                if (guild.threads.has(packet.d.id)) {
                    oldThread = guild.threads.get(packet.d.id).toJSON();
                    thread = guild.threads.update(packet.d);
                }
                else {
                    thread = guild.threads.add(Channel_1.default.from(packet.d, this._client));
                    this._client.threadGuildMap[packet.d.id] = guild.id;
                }
                this._client.emit("threadUpdate", thread, oldThread);
                break;
            }
            case "TYPING_START": {
                const guild = packet.d.guild_id ? this._client.guilds.get(packet.d.guild_id) : null;
                const channel = this._client.getChannel(packet.d.channel_id) || { id: packet.d.channel_id };
                const startTimestamp = new Date(packet.d.timestamp);
                if (guild) {
                    const member = guild.members.update({ ...packet.d.member, id: packet.d.user_id }, guild.id);
                    this._client.emit("typingStart", channel, member, startTimestamp);
                }
                else {
                    const user = this._client.users.get(packet.d.user_id);
                    this._client.emit("typingStart", channel, user || { id: packet.d.user_id }, startTimestamp);
                }
                break;
            }
            case "USER_UPDATE": {
                const oldUser = this._client.users.get(packet.d.id)?.toJSON() || null;
                this._client.emit("userUpdate", this._client.users.update(packet.d), oldUser);
                break;
            }
            case "VOICE_STATE_UPDATE": {
                if (!packet.d.guild_id)
                    break; // @TODO voice states without guilds?
                // @TODO voice
                packet.d.self_stream = !!packet.d.self_stream;
                const guild = this._client.guilds.get(packet.d.guild_id);
                const member = guild.members.update({ ...packet.d.member, id: packet.d.user_id }, guild.id);
                const oldState = member.voiceState?.toJSON() || null;
                const state = guild.voiceStates.update({ ...packet.d, id: member.id });
                member["update"]({ deaf: state.deaf, mute: state.mute });
                if (oldState?.channel !== state.channel) {
                    let oldChannel = null, newChannel;
                    if (oldState?.channel) {
                        oldChannel = guild.channels.get(oldState.channel) || null;
                        if (oldChannel && oldChannel.type !== Constants_1.ChannelTypes.GUILD_VOICE && oldChannel.type !== Constants_1.ChannelTypes.GUILD_STAGE_VOICE) {
                            this._client.emit("warn", `oldChannel is not a voice channel: ${oldChannel.id}`, this.id);
                            oldChannel = null;
                        }
                    }
                    if (packet.d.channel_id && (newChannel = guild.channels.get(packet.d.channel_id)) && (newChannel.type === Constants_1.ChannelTypes.GUILD_VOICE || newChannel.type === Constants_1.ChannelTypes.GUILD_STAGE_VOICE)) {
                        if (oldChannel) {
                            oldChannel.voiceMembers.delete(member.id);
                            this._client.emit("voiceChannelSwitch", newChannel.voiceMembers.add(member), newChannel, oldChannel);
                        }
                        else {
                            this._client.emit("voiceChannelJoin", newChannel.voiceMembers.add(member), newChannel);
                        }
                    }
                    else if (oldChannel) {
                        oldChannel.voiceMembers.delete(member.id);
                        this._client.emit("voiceChannelLeave", member, oldChannel);
                    }
                }
                if (JSON.stringify(oldState) !== JSON.stringify(state.toJSON())) {
                    this._client.emit("voiceStateUpdate", member, oldState);
                }
                break;
            }
            case "VOICE_SERVER_UPDATE": {
                // @TODO voice
                break;
            }
            case "WEBHOOKS_UPDATE": {
                const channel = this._client.getChannel(packet.d.channel_id) || { id: packet.d.channel_id };
                this._client.emit("webhooksUpdate", channel);
                break;
            }
        }
    }
    onPacket(packet) {
        (0, Debug_1.default)("ws:recieve", packet);
        if ("s" in packet && packet.s) {
            if (packet.s > this.sequence + 1 && this.ws && this.status !== "resuming") {
                this._client.emit("warn", `Non-consecutive sequence (${this.sequence} -> ${packet.s})`, this.id);
            }
            this.sequence = packet.s;
        }
        switch (packet.op) {
            case Constants_1.GatewayOPCodes.DISPATCH:
                void this.onDispatch(packet);
                break;
            case Constants_1.GatewayOPCodes.HEARTBEAT:
                this.heartbeat(true);
                break;
            case Constants_1.GatewayOPCodes.INVALID_SESSION: {
                if (packet.d) {
                    this._client.emit("warn", "Session Invalidated. Session may be resumable, attempting to resume..", this.id);
                    this.resume();
                }
                else {
                    this.sequence = 0;
                    this.sessionID = null;
                    this._client.emit("warn", "Session Invalidated. Session is not resumable, requesting a new session..", this.id);
                    this.identify();
                }
                break;
            }
            case Constants_1.GatewayOPCodes.RECONNECT: {
                this._client.emit("debug", "Reconnect requested by Discord.", this.id);
                this.disconnect(true);
                break;
            }
            case Constants_1.GatewayOPCodes.HELLO: {
                if (this._heartbeatInterval)
                    clearInterval(this._heartbeatInterval);
                this._heartbeatInterval = setInterval(() => this.heartbeat(false), packet.d.heartbeat_interval);
                this.connecting = false;
                if (this._connectTimeout)
                    clearTimeout(this._connectTimeout);
                this._connectTimeout = null;
                if (this.sessionID)
                    this.resume();
                else {
                    this.identify();
                    this.heartbeat();
                }
                this._client.emit("hello", packet.d.heartbeat_interval, this.id);
                break;
            }
            case Constants_1.GatewayOPCodes.HEARTBEAT_ACK: {
                this.lastHeartbeatAck = true;
                this.lastHeartbeatReceived = Date.now();
                this.latency = this.lastHeartbeatReceived - this.lastHeartbeatSent;
                if (isNaN(this.latency))
                    this.latency = Infinity;
                break;
            }
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            default: this._client.emit("warn", `Unrecognized gateway packet: ${packet}`, this.id);
        }
    }
    onWSClose(code, r) {
        const reason = r.toString();
        let err;
        let reconnect;
        if (code) {
            this._client.emit("debug", `${code === 1000 ? "Clean" : "Unclean"} WS close: ${code}: ${reason}`, this.id);
            switch (code) {
                case 1006: {
                    err = new Error("Connection reset by peer. This is a network issue. If you are concerned, talk to your ISP or host.");
                    break;
                }
                case Constants_1.GatewayCloseCodes.UNKNOWN_OPCODE: {
                    err = new GatewayError_1.default("Gateway recieved an unknown opcode.", code);
                    break;
                }
                case Constants_1.GatewayCloseCodes.DECODE_ERROR: {
                    err = new GatewayError_1.default("Gateway recieved an improperly encoded packet.", code);
                    break;
                }
                case Constants_1.GatewayCloseCodes.NOT_AUTHENTICATED: {
                    err = new GatewayError_1.default("Gateway recieved a packet before authentication.", code);
                    this.sessionID = null;
                    break;
                }
                case Constants_1.GatewayCloseCodes.AUTHENTICATION_FAILED: {
                    err = new GatewayError_1.default("Authentication failed.", code);
                    this.sessionID = null;
                    reconnect = false;
                    this._client.emit("error", new Error(`Invalid Token: ${this._token}`));
                    break;
                }
                case Constants_1.GatewayCloseCodes.ALREADY_AUTHENTICATED: {
                    err = new GatewayError_1.default("Gateway recieved an authentication attempt while already authenticated.", code);
                    break;
                }
                case Constants_1.GatewayCloseCodes.INVALID_SEQUENCE: {
                    err = new GatewayError_1.default("Gateway recieved an invalid sequence.", code);
                    this.sequence = 0;
                    break;
                }
                case Constants_1.GatewayCloseCodes.RATE_LIMITED: {
                    err = new GatewayError_1.default("Gateway connection was ratelimited.", code);
                    break;
                }
                case Constants_1.GatewayCloseCodes.INVALID_SHARD: {
                    err = new GatewayError_1.default("Invalid sharding specified.", code);
                    this.sessionID = null;
                    reconnect = false;
                    break;
                }
                case Constants_1.GatewayCloseCodes.SHARDING_REQUIRED: {
                    err = new GatewayError_1.default("Shard would handle too many guilds (>2500 each).", code);
                    this.sessionID = null;
                    reconnect = false;
                    break;
                }
                case Constants_1.GatewayCloseCodes.INVALID_API_VERSION: {
                    err = new GatewayError_1.default("Invalid API version.", code);
                    this.sessionID = null;
                    reconnect = false;
                    break;
                }
                case Constants_1.GatewayCloseCodes.INVALID_INTENTS: {
                    err = new GatewayError_1.default("Invalid intents specified.", code);
                    this.sessionID = null;
                    reconnect = false;
                    break;
                }
                case Constants_1.GatewayCloseCodes.DISALLOWED_INTENTS: {
                    err = new GatewayError_1.default("Disallowed intents specified. Make sure any privileged intents you're trying to access have been enabled in the developer portal.", code);
                    this.sessionID = null;
                    reconnect = false;
                    break;
                }
                default: {
                    err = new GatewayError_1.default(`Unknown close: ${code}: ${reason}`, code);
                    break;
                }
            }
            this.disconnect(reconnect, err);
        }
    }
    onWSError(err) {
        this._client.emit("error", err, this.id);
    }
    onWSMessage(data) {
        if (typeof data === "string")
            data = Buffer.from(data);
        try {
            if (data instanceof ArrayBuffer) {
                if (this._client.shards.options.compress || Erlpack) {
                    data = Buffer.from(data);
                }
            }
            else if (Array.isArray(data)) { // Fragmented messages
                data = Buffer.concat(data); // Copyfull concat is slow, but no alternative
            }
            (0, tsafe_1.assert)((0, tsafe_1.is)(data));
            if (this._client.shards.options.compress) {
                if (data.length >= 4 && data.readUInt32BE(data.length - 4) === 0xFFFF) {
                    this._sharedZLib.push(data, zlibConstants.Z_SYNC_FLUSH);
                    if (this._sharedZLib.err) {
                        this._client.emit("error", new Error(`zlib error ${this._sharedZLib.err}: ${this._sharedZLib.msg || ""}`));
                        return;
                    }
                    data = Buffer.from(this._sharedZLib.result || "");
                    if (Erlpack) {
                        return this.onPacket(Erlpack.unpack(data));
                    }
                    else {
                        return this.onPacket(JSON.parse(data.toString()));
                    }
                }
                else {
                    this._sharedZLib.push(data, false);
                }
            }
            else if (Erlpack) {
                return this.onPacket(Erlpack.unpack(data));
            }
            else {
                return this.onPacket(JSON.parse(data.toString()));
            }
        }
        catch (err) {
            this._client.emit("error", err, this.id);
        }
    }
    onWSOpen() {
        this.status = "handshaking";
        this._client.emit("connect", this.id);
        this.lastHeartbeatAck = true;
    }
    async restartGuildCreateTimeout() {
        if (this._guildCreateTimeout) {
            clearTimeout(this._guildCreateTimeout);
            this._guildCreateTimeout = null;
        }
        if (!this.ready) {
            if (this._client.unavailableGuilds.size === 0) {
                return this.checkReady();
            }
            this._guildCreateTimeout = setTimeout(this.checkReady.bind(this), this._client.shards.options.guildCreateTimeout);
        }
    }
    sendPresenceUpdate() {
        this.send(Constants_1.GatewayOPCodes.PRESENCE_UPDATE, {
            activities: this.presence.activities,
            afk: !!this.presence.afk,
            since: this.presence.status === "idle" ? Date.now() : null,
            status: this.presence.status
        });
    }
    get _token() { return this._client.options.auth; }
    /** Connect this shard. */
    connect() {
        if (this.ws && this.ws.readyState !== ws_1.WebSocket.CLOSED) {
            this._client.emit("error", new Error("Shard#connect called while existing connection is established."), this.id);
            return;
        }
        ++this.connectAttempts;
        this.connecting = true;
        this.initialize();
    }
    disconnect(reconnect = this._client.shards.options.autoReconnect, error) {
        if (!this.ws)
            return;
        if (this._heartbeatInterval) {
            clearInterval(this._heartbeatInterval);
            this._heartbeatInterval = null;
        }
        if (this.ws.readyState !== ws_1.WebSocket.CLOSED) {
            this.ws.removeAllListeners();
            try {
                if (reconnect && this.sessionID) {
                    if (this.ws.readyState !== ws_1.WebSocket.OPEN)
                        this.ws.close(4999, "Reconnect");
                    else {
                        this._client.emit("debug", `Closing websocket (state: ${this.ws.readyState})`, this.id);
                        this.ws.terminate();
                    }
                }
                else {
                    this.ws.close(1000, "Normal Close");
                }
            }
            catch (err) {
                this._client.emit("error", err, this.id);
            }
        }
        this.ws = null;
        this.reset();
        if (error)
            this._client.emit("error", error, this.id);
        this.emit("disconnect", error);
        if (this.sessionID && this.connectAttempts >= this._client.shards.options.maxReconnectAttempts) {
            this._client.emit("debug", `Automatically invalidating session due to excessive resume attempts | Attempt ${this.connectAttempts}`, this.id);
            this.sessionID = null;
        }
        if (reconnect) {
            if (this.sessionID) {
                this._client.emit("debug", `Immediately reconnecting for potential resume | Attempt ${this.connectAttempts}`, this.id);
                this._client.shards.connect(this);
            }
            else {
                this._client.emit("debug", `Queueing reconnect in ${this.reconnectInterval}ms | Attempt ${this.connectAttempts}`, this.id);
                setTimeout(() => {
                    this._client.shards.connect(this);
                }, this.reconnectInterval);
                this.reconnectInterval = Math.min(Math.round(this.reconnectInterval * (Math.random() * 2 + 1)), 30000);
            }
        }
        else
            this.hardReset();
    }
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
    async editStatus(status, activities = []) {
        this.presence.status = status;
        this.presence.activities = activities;
        return this.sendPresenceUpdate();
    }
    hardReset() {
        this.reset();
        this.sequence = 0;
        this.sessionID = null;
        this.reconnectInterval = 1000;
        this.connectAttempts = 0;
        this.ws = null;
        this._heartbeatInterval = null;
        this._guildCreateTimeout = null;
        this.globalBucket = new Bucket_1.default(120, 60000, { reservedTokens: 5 });
        this.presence = JSON.parse(JSON.stringify(this._client.shards.options.presence));
        this.presenceUpdateBucket = new Bucket_1.default(5, 20000);
        this.resumeURL = null;
    }
    heartbeat(requested = false) {
        // discord/discord-api-docs#1619
        if (this.status === "resuming" || this.status === "identifying")
            return;
        if (!requested) {
            if (!this.lastHeartbeatAck) {
                this._client.emit("debug", "Heartbeat timeout; " + JSON.stringify({
                    lastReceived: this.lastHeartbeatReceived,
                    lastSent: this.lastHeartbeatSent,
                    interval: this._heartbeatInterval,
                    status: this.status,
                    timestamp: Date.now()
                }));
                return this.disconnect(undefined, new Error("Server didn't acknowledge previous heartbeat, possible lost connection"));
            }
            this.lastHeartbeatAck = false;
        }
        this.lastHeartbeatSent = Date.now();
        this.send(Constants_1.GatewayOPCodes.HEARTBEAT, this.sequence, true);
    }
    identify() {
        const data = {
            token: this._token,
            properties: this._client.shards.options.connectionProperties,
            compress: this._client.shards.options.compress,
            large_threshold: this._client.shards.options.largeThreshold,
            shard: [this.id, this._client.shards.options.maxShards],
            presence: this.presence,
            intents: this._client.shards.options.intents
        };
        this.send(Constants_1.GatewayOPCodes.IDENTIFY, data);
    }
    [util_1.inspect.custom]() {
        return Base_1.default.prototype[util_1.inspect.custom].call(this);
    }
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
    async requestGuildMembers(guild, options) {
        const opts = {
            guild_id: guild,
            limit: options?.limit ?? 0,
            user_ids: options?.userIDs,
            query: options?.query,
            nonce: (0, crypto_1.randomBytes)(16).toString("hex"),
            presences: options?.presences ?? false
        };
        if (!opts.user_ids && !opts.query)
            opts.query = "";
        if (!opts.query && !opts.user_ids && (!(this._client.shards.options.intents & Constants_1.Intents.GUILD_MEMBERS)))
            throw new Error("Cannot request all members without the GUILD_MEMBERS intent.");
        if (opts.presences && (!(this._client.shards.options.intents & Constants_1.Intents.GUILD_PRESENCES)))
            throw new Error("Cannot request presences without the GUILD_PRESENCES intent.");
        if (opts.user_ids && opts.user_ids.length > 100)
            throw new Error("Cannot request more than 100 users at once.");
        this.send(Constants_1.GatewayOPCodes.REQUEST_GUILD_MEMBERS, opts);
        return new Promise((resolve, reject) => this._requestMembersPromise[opts.nonce] = {
            members: [],
            received: 0,
            timeout: setTimeout(() => {
                resolve(this._requestMembersPromise[opts.nonce].members);
                delete this._requestMembersPromise[opts.nonce];
            }, options?.timeout ?? this._client.rest.options.requestTimeout),
            resolve,
            reject
        });
    }
    reset() {
        this.connecting = false;
        this.ready = false;
        this.preReady = false;
        if (this._requestMembersPromise !== undefined) {
            for (const guildID in this._requestMembersPromise) {
                if (!this._requestMembersPromise[guildID]) {
                    continue;
                }
                clearTimeout(this._requestMembersPromise[guildID].timeout);
                this._requestMembersPromise[guildID].resolve(this._requestMembersPromise[guildID].received);
            }
        }
        this._requestMembersPromise = {};
        this._getAllUsersCount = {};
        this._getAllUsersQueue = [];
        this.latency = Infinity;
        this.lastHeartbeatAck = true;
        this.lastHeartbeatReceived = 0;
        this.lastHeartbeatSent = 0;
        this.status = "disconnected";
        if (this._connectTimeout)
            clearTimeout(this._connectTimeout);
        this._connectTimeout = null;
    }
    resume() {
        this.status = "resuming";
        this.send(Constants_1.GatewayOPCodes.RESUME, {
            token: this._token,
            session_id: this.sessionID,
            seq: this.sequence
        });
    }
    send(op, data, priority = false) {
        if (this.ws && this.ws.readyState === ws_1.WebSocket.OPEN) {
            let i = 0, waitFor = 1;
            const func = () => {
                if (++i >= waitFor && this.ws && this.ws.readyState === ws_1.WebSocket.OPEN) {
                    const d = Erlpack ? Erlpack.pack({ op, d: data }) : JSON.stringify({ op, d: data });
                    this.ws.send(d);
                    if (typeof data === "object" && data && "token" in data)
                        data.token = "[REMOVED]";
                    this._client.emit("debug", JSON.stringify({ op, d: data }), this.id);
                    (0, Debug_1.default)("ws:send", { op, d: data });
                }
            };
            if (op === Constants_1.GatewayOPCodes.PRESENCE_UPDATE) {
                ++waitFor;
                this.presenceUpdateBucket.queue(func, priority);
            }
            this.globalBucket.queue(func, priority);
        }
    }
    toString() {
        return Base_1.default.prototype.toString.call(this);
    }
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
    updateVoiceState(guildID, channelID, options) {
        this.send(Constants_1.GatewayOPCodes.VOICE_STATE_UPDATE, {
            channel_id: channelID,
            guild_id: guildID,
            self_deaf: options?.selfDeaf ?? false,
            self_mute: options?.selfMute ?? false
        });
    }
}
exports.default = Shard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvZ2F0ZXdheS9TaGFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtFQUEwQztBQUUxQyxvRUFBNEM7QUFDNUMsd0VBQWdEO0FBRWhELDREQUFvQztBQUNwQyw0Q0FNc0I7QUFZdEIsOERBQXNDO0FBRXRDLHdGQUFnRTtBQUdoRSw4RUFBc0Q7QUFDdEQsMEZBQWtFO0FBQ2xFLG9FQUE0QztBQVk1Qyw4RUFBc0Q7QUFDdEQsOEVBQXNEO0FBQ3RELGtGQUEwRDtBQUMxRCxrRUFBMEM7QUFDMUMsb0VBQTRDO0FBRTVDLGdGQUF3RDtBQUV4RCwwREFBa0M7QUFDbEMsNEVBQW9EO0FBRXBELDJCQUErQjtBQUcvQixpQ0FBbUM7QUFDbkMsbUNBQXFDO0FBQ3JDLCtCQUErQjtBQUUvQixvQkFBb0I7QUFDcEIsSUFBSSxPQUE2QyxDQUFDO0FBQ2xELElBQUk7SUFDSCxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0NBQzdCO0FBQUMsTUFBTSxHQUFHO0FBQ1gsSUFBSSxRQUF3RSxFQUFFLGFBQXVGLENBQUM7QUFDdEssSUFBSTtJQUNILFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDaEMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztDQUNyQztBQUFDLE1BQU07SUFDUCxJQUFJO1FBQ0gsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QixhQUFhLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQztLQUN6QztJQUFDLE1BQU0sR0FBRTtDQUNWO0FBTUQsTUFBcUIsS0FBTSxTQUFRLHNCQUF5QjtJQUNuRCxPQUFPLENBQVM7SUFDaEIsZUFBZSxDQUF3QjtJQUN2QyxpQkFBaUIsQ0FBdUI7SUFDeEMsaUJBQWlCLENBQWdCO0lBQ2pDLG1CQUFtQixDQUF3QjtJQUMz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