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
/* eslint-enable */
/* eslint-disable @typescript-eslint/unbound-method */
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
     * @param {string} guild - The ID of the guild to request the members of.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvZ2F0ZXdheS9TaGFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtFQUEwQztBQUUxQyxvRUFBNEM7QUFDNUMsd0VBQWdEO0FBRWhELDREQUFvQztBQUNwQyw0Q0FNc0I7QUFhdEIsOERBQXNDO0FBRXRDLHdGQUFnRTtBQUdoRSw4RUFBc0Q7QUFDdEQsMEZBQWtFO0FBQ2xFLG9FQUE0QztBQVk1Qyw4RUFBc0Q7QUFDdEQsOEVBQXNEO0FBQ3RELGtGQUEwRDtBQUMxRCxrRUFBMEM7QUFDMUMsb0VBQTRDO0FBRTVDLGdGQUF3RDtBQUV4RCwwREFBa0M7QUFDbEMsNEVBQW9EO0FBRXBELDJCQUErQjtBQUcvQixpQ0FBbUM7QUFDbkMsbUNBQXFDO0FBQ3JDLCtCQUErQjtBQUUvQixvQkFBb0I7QUFDcEIsSUFBSSxPQUE2QyxDQUFDO0FBQ2xELElBQUk7SUFDSCxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0NBQzdCO0FBQUMsTUFBTSxHQUFHO0FBQ1gsSUFBSSxRQUF3RSxFQUFFLGFBQXVGLENBQUM7QUFDdEssSUFBSTtJQUNILFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDaEMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztDQUNyQztBQUFDLE1BQU07SUFDUCxJQUFJO1FBQ0gsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QixhQUFhLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQztLQUN6QztJQUFDLE1BQU0sR0FBRTtDQUNWO0FBQ0QsbUJBQW1CO0FBR25CLHNEQUFzRDtBQUN0RCxNQUFxQixLQUFNLFNBQVEsc0JBQXlCO0lBQ25ELE9BQU8sQ0FBUztJQUNoQixlQUFlLENBQXdCO0lBQ3ZDLGlCQUFpQixDQUF1QjtJQUN4QyxpQkFBaUIsQ0FB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