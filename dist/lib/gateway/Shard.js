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
const Member_1 = __importDefault(require("../structures/Member"));
const Base_1 = __importDefault(require("../structures/Base"));
const ClientApplication_1 = __importDefault(require("../structures/ClientApplication"));
const ExtendedUser_1 = __importDefault(require("../structures/ExtendedUser"));
const AutoModerationRule_1 = __importDefault(require("../structures/AutoModerationRule"));
const Channel_1 = __importDefault(require("../structures/Channel"));
const VoiceChannel_1 = __importDefault(require("../structures/VoiceChannel"));
const StageChannel_1 = __importDefault(require("../structures/StageChannel"));
const GuildScheduledEvent_1 = __importDefault(require("../structures/GuildScheduledEvent"));
const Invite_1 = __importDefault(require("../structures/Invite"));
const Message_1 = __importDefault(require("../structures/Message"));
const StageInstance_1 = __importDefault(require("../structures/StageInstance"));
const Interaction_1 = __importDefault(require("../structures/Interaction"));
const Util_1 = require("../util/Util");
const ws_1 = require("ws");
const crypto_1 = require("crypto");
const util_1 = require("util");
const assert_1 = __importDefault(require("assert"));
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
    client;
    connectAttempts;
    #connectTimeout;
    connecting;
    #getAllUsersCount;
    #getAllUsersQueue;
    globalBucket;
    #guildCreateTimeout;
    #heartbeatInterval;
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
    #requestMembersPromise;
    resumeURL;
    sequence;
    sessionID;
    #sharedZLib;
    status;
    ws;
    constructor(id, client) {
        super();
        Properties_1.default.new(this)
            .define("client", client)
            .define("ws", null, true);
        this.onDispatch = this.onDispatch.bind(this);
        this.onPacket = this.onPacket.bind(this);
        this.onWSClose = this.onWSClose.bind(this);
        this.onWSError = this.onWSError.bind(this);
        this.onWSMessage = this.onWSMessage.bind(this);
        this.onWSOpen = this.onWSOpen.bind(this);
        this.connectAttempts = 0;
        this.#connectTimeout = null;
        this.connecting = false;
        this.#getAllUsersCount = {};
        this.#getAllUsersQueue = [];
        this.#guildCreateTimeout = null;
        this.#heartbeatInterval = null;
        this.id = id;
        this.lastHeartbeatAck = true;
        this.lastHeartbeatReceived = 0;
        this.lastHeartbeatSent = 0;
        this.latency = Infinity;
        this.preReady = false;
        this.ready = false;
        this.reconnectInterval = 1000;
        this.#requestMembersPromise = {};
        this.resumeURL = null;
        this.sequence = 0;
        this.sessionID = null;
        this.status = "disconnected";
        this.hardReset();
    }
    async checkReady() {
        if (!this.ready) {
            if (this.#getAllUsersQueue.length > 0) {
                const id = this.#getAllUsersQueue.shift();
                await this.requestGuildMembers(id);
                this.#getAllUsersQueue.splice(this.#getAllUsersQueue.indexOf(id), 1);
                return;
            }
            if (Object.keys(this.#getAllUsersCount).length === 0) {
                this.ready = true;
                this.emit("ready");
            }
        }
    }
    createGuild(data) {
        this.client.guildShardMap[data.id] = this.id;
        const guild = this.client.guilds.update(data);
        if (this.client.shards.options.getAllUsers && guild.members.size > guild.memberCount) {
            void this.requestGuildMembers(guild.id, {
                presences: (this.client.shards.options.intents & Constants_1.Intents.GUILD_PRESENCES) === Constants_1.Intents.GUILD_PRESENCES
            });
        }
        return guild;
    }
    initialize() {
        if (!this._token)
            return this.disconnect(false, new Error("Invalid Token"));
        this.status = "connecting";
        if (this.client.shards.options.compress) {
            if (!ZlibSync)
                throw new Error("Cannot use compression without pako or zlib-sync.");
            this.client.emit("debug", "Initializing zlib-sync-based compression");
            this.#sharedZLib = new ZlibSync.Inflate({
                chunkSize: 128 * 1024
            });
        }
        if (this.sessionID) {
            if (this.resumeURL === null) {
                this.client.emit("warn", "Resume url is not currently present. Discord may disconnect you quicker.", this.id);
            }
            this.ws = new ws_1.WebSocket(this.resumeURL || this.client.gatewayURL, this.client.shards.options.ws);
        }
        else {
            this.ws = new ws_1.WebSocket(this.client.gatewayURL, this.client.shards.options.ws);
        }
        this.ws.on("close", this.onWSClose);
        this.ws.on("error", this.onWSError);
        this.ws.on("message", this.onWSMessage);
        this.ws.on("open", this.onWSOpen);
        this.#connectTimeout = setTimeout(() => {
            if (this.connecting) {
                this.disconnect(undefined, new Error("Connection timeout"));
            }
        }, this.client.shards.options.connectionTimeout);
    }
    async onDispatch(packet) {
        this.client.emit("packet", packet, this.id);
        switch (packet.t) {
            case "APPLICATION_COMMAND_PERMISSIONS_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in APPLICATION_COMMAND_PERMISSIONS_UPDATE: ${packet.d.guild_id}`);
                    break;
                }
                this.client.emit("applicationCommandPermissionsUpdate", guild, {
                    application: packet.d.application_id === this.client.application.id ? this.client.application : { id: packet.d.application_id },
                    id: packet.d.id,
                    permissions: packet.d.permissions
                });
                break;
            }
            case "AUTO_MODERATION_ACTION_EXECUTION": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in AUTO_MODERATION_ACTION_EXECUTION: ${packet.d.guild_id}`);
                    break;
                }
                const channel = !packet.d.channel_id ? null : this.client.getChannel(packet.d.channel_id) || { id: packet.d.channel_id };
                this.client.emit("autoModerationActionExecution", guild, channel, this.client.users.get(packet.d.user_id) || { id: packet.d.user_id }, {
                    action: {
                        metadata: {
                            channelID: packet.d.action.metadata.channel_id,
                            durationSeconds: packet.d.action.metadata.duration_seconds
                        },
                        type: packet.d.action.type
                    },
                    alertSystemMessageID: packet.d.alert_system_message_id,
                    content: packet.d.content,
                    matchedContent: packet.d.matched_content,
                    matchedKeyword: packet.d.matched_keyword,
                    messageID: packet.d.message_id,
                    rule: guild && guild.autoModerationRules.get(packet.d.rule_id) || { id: packet.d.rule_id },
                    ruleTriggerType: packet.d.rule_trigger_type
                });
                break;
            }
            case "AUTO_MODERATION_RULE_CREATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in AUTO_MODERATION_RULE_CREATE: ${packet.d.guild_id}`);
                    this.client.emit("autoModerationRuleCreate", new AutoModerationRule_1.default(packet.d, this.client));
                    break;
                }
                this.client.emit("autoModerationRuleCreate", guild.autoModerationRules.update(packet.d));
                break;
            }
            case "AUTO_MODERATION_RULE_DELETE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in AUTO_MODERATION_RULE_DELETE: ${packet.d.guild_id}`);
                    this.client.emit("autoModerationRuleDelete", new AutoModerationRule_1.default(packet.d, this.client));
                    break;
                }
                guild.autoModerationRules.delete(packet.d.id);
                this.client.emit("autoModerationRuleDelete", new AutoModerationRule_1.default(packet.d, this.client));
                break;
            }
            case "AUTO_MODERATION_RULE_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in AUTO_MODERATION_RULE_UPDATE: ${packet.d.guild_id}`);
                    this.client.emit("autoModerationRuleUpdate", new AutoModerationRule_1.default(packet.d, this.client), null);
                    break;
                }
                const oldRule = guild.autoModerationRules.get(packet.d.id)?.toJSON() || null;
                this.client.emit("autoModerationRuleUpdate", guild.autoModerationRules.update(packet.d), oldRule);
                break;
            }
            case "CHANNEL_CREATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                let channel;
                if (guild.channels.has(packet.d.id))
                    channel = guild.channels.update(packet.d);
                else {
                    channel = guild.channels.add(Channel_1.default.from(packet.d, this.client));
                    this.client.channelGuildMap[packet.d.id] = guild.id;
                }
                this.client.emit("channelCreate", channel);
                break;
            }
            case "CHANNEL_DELETE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                let channel;
                if (guild.channels.has(packet.d.id))
                    channel = guild.channels.get(packet.d.id);
                else
                    channel = Channel_1.default.from(packet.d, this.client);
                if (channel instanceof VoiceChannel_1.default || channel instanceof StageChannel_1.default) {
                    channel.voiceMembers.forEach(member => {
                        channel.voiceMembers.delete(member.id);
                        this.client.emit("voiceChannelLeave", member, channel);
                    });
                }
                guild.channels.delete(packet.d.id);
                this.client.emit("channelDelete", channel);
                break;
            }
            case "CHANNEL_PINS_UPDATE": {
                const channel = this.client.getChannel(packet.d.channel_id);
                if (!channel) {
                    this.client.emit("warn", `Missing channel ${packet.d.channel_id} in CHANNEL_PINS_UPDATE`, this.id);
                    break;
                }
                this.client.emit("channelPinsUpdate", channel, !packet.d.last_pin_timestamp ? null : new Date(packet.d.last_pin_timestamp));
                break;
            }
            case "CHANNEL_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                let oldChannel = null;
                let channel;
                if (guild.channels.has(packet.d.id)) {
                    oldChannel = guild.channels.get(packet.d.id).toJSON();
                    channel = guild.channels.update(packet.d);
                }
                else {
                    channel = guild.channels.add(Channel_1.default.from(packet.d, this.client));
                    this.client.channelGuildMap[packet.d.id] = guild.id;
                }
                this.client.emit("channelUpdate", channel, oldChannel);
                break;
            }
            case "GUILD_BAN_ADD": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in GUILD_BAN_ADD: ${packet.d.guild_id}`);
                    break;
                }
                this.client.emit("guildBanAdd", guild, this.client.users.update(packet.d.user));
                break;
            }
            case "GUILD_BAN_REMOVE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in GUILD_BAN_REMOVE: ${packet.d.guild_id}`);
                    break;
                }
                this.client.emit("guildBanRemove", guild, this.client.users.update(packet.d.user));
                break;
            }
            case "GUILD_CREATE": {
                if (!packet.d.unavailable) {
                    const guild = this.createGuild(packet.d);
                    if (this.ready) {
                        if (this.client.unavailableGuilds.delete(guild.id))
                            this.client.emit("guildAvailable", guild);
                        else
                            this.client.emit("guildCreate", guild);
                    }
                    else {
                        this.client.unavailableGuilds.delete(guild.id);
                        void this.restartGuildCreateTimeout();
                    }
                }
                else {
                    this.client.guilds.delete(packet.d.id);
                    this.client.emit("unavailableGuildCreate", this.client.unavailableGuilds.update(packet.d));
                }
                break;
            }
            case "GUILD_DELETE": {
                // @TODO disconnect voice
                delete this.client.guildShardMap[packet.d.id];
                const guild = this.client.guilds.get(packet.d.id);
                this.client.guilds.delete(packet.d.id);
                if (guild)
                    guild.channels.forEach((channel) => {
                        delete this.client.channelGuildMap[channel.id];
                    });
                if (packet.d.unavailable)
                    this.client.emit("guildUnavailable", this.client.unavailableGuilds.update(packet.d));
                else
                    this.client.emit("guildDelete", guild || { id: packet.d.id });
                break;
            }
            case "GUILD_EMOJIS_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in GUILD_EMOJIS_UPDATE: ${packet.d.guild_id}`);
                    break;
                }
                const oldEmojis = [...guild.emojis];
                guild["update"]({ emojis: packet.d.emojis });
                this.client.emit("guildEmojisUpdate", guild, guild.emojis, oldEmojis);
                break;
            }
            case "GUILD_INTEGRATIONS_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in GUILD_INTEGRATIONS_UPDATE: ${packet.d.guild_id}`);
                    break;
                }
                this.client.emit("guildIntegrationsUpdate", guild);
                break;
            }
            case "GUILD_MEMBER_ADD": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in GUILD_MEMBER_ADD: ${packet.d.guild_id}`);
                    this.client.emit("guildMemberAdd", new Member_1.default(packet.d, this.client, packet.d.guild_id));
                    break;
                }
                guild.memberCount++;
                this.client.emit("guildMemberAdd", guild.members.update({ ...packet.d, id: packet.d.user.id }, guild.id));
                break;
            }
            case "GUILD_MEMBERS_CHUNK": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                const members = packet.d.members.map(member => guild.members.update({ ...member, id: member.user.id }, guild.id));
                if (packet.d.presences)
                    packet.d.presences.forEach(presence => {
                        const member = guild.members.get(presence.user.id);
                        if (member)
                            member.presence = presence;
                    });
                if (!packet.d.nonce) {
                    this.client.emit("warn", "Recieved GUILD_MEMBERS_CHUNK without a nonce.");
                    break;
                }
                if (this.#requestMembersPromise[packet.d.nonce])
                    this.#requestMembersPromise[packet.d.nonce].members.push(...members);
                if (packet.d.chunk_index >= packet.d.chunk_count - 1) {
                    if (this.#requestMembersPromise[packet.d.nonce]) {
                        clearTimeout(this.#requestMembersPromise[packet.d.nonce].timeout);
                        this.#requestMembersPromise[packet.d.nonce].resolve(this.#requestMembersPromise[packet.d.nonce].members);
                        delete this.#requestMembersPromise[packet.d.nonce];
                    }
                    if (this.#getAllUsersCount[guild.id]) {
                        delete this.#getAllUsersCount[guild.id];
                        void this.checkReady();
                    }
                }
                this.client.emit("guildMemberChunk", guild, members);
                this.lastHeartbeatAck = true;
                break;
            }
            case "GUILD_MEMBER_REMOVE": {
                if (packet.d.user.id === this.client.user.id)
                    break;
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in GUILD_MEMBER_REMOVE: ${packet.d.guild_id}`);
                    this.client.emit("guildMemberRemove", this.client.users.update(packet.d.user), { id: packet.d.guild_id });
                    break;
                }
                guild.memberCount--;
                let member;
                if (guild.members.has(packet.d.user.id)) {
                    member = guild.members.get(packet.d.user.id);
                    member["update"]({ user: packet.d.user });
                }
                else
                    member = this.client.users.update(packet.d.user);
                this.client.emit("guildMemberRemove", member, guild);
                break;
            }
            case "GUILD_MEMBER_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in GUILD_MEMBER_UPDATE: ${packet.d.guild_id}`);
                    this.client.emit("guildMemberUpdate", new Member_1.default(packet.d, this.client, packet.d.guild_id), null);
                    break;
                }
                const oldMember = guild.members.get(packet.d.user.id)?.toJSON() || null;
                this.client.emit("guildMemberUpdate", guild.members.update({ ...packet.d, id: packet.d.user.id }, guild.id), oldMember);
                break;
            }
            case "GUILD_ROLE_CREATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                this.client.emit("guildRoleCreate", guild.roles.update(packet.d.role, guild.id));
                break;
            }
            case "GUILD_ROLE_DELETE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                this.client.emit("guildRoleDelete", guild.roles.get(packet.d.role_id));
                break;
            }
            case "GUILD_ROLE_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                const oldRole = guild.roles.get(packet.d.role.id)?.toJSON() || null;
                this.client.emit("guildRoleUpdate", guild.roles.update(packet.d.role, guild.id), oldRole);
                break;
            }
            case "GUILD_SCHEDULED_EVENT_CREATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in GUILD_SCHEDULED_EVENT_CREATE: ${packet.d.guild_id}`);
                    this.client.emit("guildScheduledEventCreate", new GuildScheduledEvent_1.default(packet.d, this.client));
                    break;
                }
                this.client.emit("guildScheduledEventCreate", guild.scheduledEvents.update(packet.d));
                break;
            }
            case "GUILD_SCHEDULED_EVENT_DELETE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in GUILD_SCHEDULED_EVENT_DELETE: ${packet.d.guild_id}`);
                    this.client.emit("guildScheduledEventDelete", new GuildScheduledEvent_1.default(packet.d, this.client));
                    break;
                }
                let event;
                if (guild.scheduledEvents.has(packet.d.id))
                    event = guild.scheduledEvents.get(packet.d.id);
                else
                    event = new GuildScheduledEvent_1.default(packet.d, this.client);
                this.client.emit("guildScheduledEventDelete", event);
                break;
            }
            case "GUILD_SCHEDULED_EVENT_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in GUILD_SCHEDULED_EVENT_UPDATE: ${packet.d.guild_id}`);
                    this.client.emit("guildScheduledEventUpdate", new GuildScheduledEvent_1.default(packet.d, this.client), null);
                    break;
                }
                const oldEvent = guild.scheduledEvents.get(packet.d.id)?.toJSON() || null;
                this.client.emit("guildScheduledEventUpdate", guild.scheduledEvents.update(packet.d), oldEvent);
                break;
            }
            case "GUILD_SCHEDULED_EVENT_USER_ADD": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild)
                    this.client.emit("debug", `Missing guild in GUILD_SCHEDULED_EVENT_USER_ADD: ${packet.d.guild_id}`);
                const event = guild && guild.scheduledEvents.get(packet.d.guild_scheduled_event_id) || { id: packet.d.guild_scheduled_event_id };
                if ("userCount" in event)
                    event.userCount++;
                const user = this.client.users.get(packet.d.user_id) || { id: packet.d.user_id };
                this.client.emit("guildScheduledEventUserAdd", event, user);
                break;
            }
            case "GUILD_SCHEDULED_EVENT_USER_REMOVE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild)
                    this.client.emit("debug", `Missing guild in GUILD_SCHEDULED_EVENT_USER_REMOVE: ${packet.d.guild_id}`);
                const event = guild && guild.scheduledEvents.get(packet.d.guild_scheduled_event_id) || { id: packet.d.guild_scheduled_event_id };
                if ("userCount" in event)
                    event.userCount--;
                const user = this.client.users.get(packet.d.user_id) || { id: packet.d.user_id };
                this.client.emit("guildScheduledEventUserRemove", event, user);
                break;
            }
            case "GUILD_STICKERS_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in GUILD_STICKERS_UPDATE: ${packet.d.guild_id}`);
                    break;
                }
                const oldStickers = [...guild.stickers];
                guild["update"]({ stickers: packet.d.stickers });
                this.client.emit("guildStickersUpdate", guild, guild.stickers, oldStickers);
                break;
            }
            case "GUILD_UPDATE": {
                const guild = this.client.guilds.get(packet.d.id);
                const oldGuild = guild?.toJSON() || null;
                this.client.emit("guildUpdate", this.client.guilds.update(packet.d), oldGuild);
                break;
            }
            case "INTEGRATION_CREATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in INTEGRATION_CREATE: ${packet.d.guild_id}`);
                    break;
                }
                this.client.emit("integrationCreate", guild, guild.integrations.update(packet.d));
                break;
            }
            case "INTEGRATION_DELETE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in INTEGRATION_DELETE: ${packet.d.guild_id}`);
                    break;
                }
                this.client.emit("integrationDelete", guild, guild.integrations.get(packet.d.id) || { applicationID: packet.d.application_id, id: packet.d.id });
                break;
            }
            case "INTEGRATION_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in INTEGRATION_UPDATE: ${packet.d.guild_id}`);
                    break;
                }
                const oldIntegration = guild.integrations.get(packet.d.id)?.toJSON() || null;
                this.client.emit("integrationUpdate", guild, guild.integrations.update(packet.d), oldIntegration);
                break;
            }
            case "INTERACTION_CREATE": {
                this.client.emit("interactionCreate", Interaction_1.default.from(packet.d, this.client));
                break;
            }
            case "INVITE_CREATE": {
                const guild = packet.d.guild_id ? this.client.guilds.get(packet.d.guild_id) : null;
                const channel = this.client.getChannel(packet.d.channel_id);
                this.client.emit("inviteCreate", guild, channel, new Invite_1.default(packet.d, this.client));
                break;
            }
            case "INVITE_DELETE": {
                const guild = packet.d.guild_id ? this.client.guilds.get(packet.d.guild_id) : null;
                const channel = this.client.getChannel(packet.d.channel_id);
                this.client.emit("inviteDelete", guild, channel, packet.d.code);
                break;
            }
            case "MESSAGE_CREATE": {
                const channel = this.client.getChannel(packet.d.channel_id);
                const message = channel ? channel.messages.update(packet.d) : new Message_1.default(packet.d, this.client);
                if (channel)
                    channel.lastMessage = message;
                this.client.emit("messageCreate", message);
                break;
            }
            case "MESSAGE_DELETE": {
                const channel = this.client.getChannel(packet.d.channel_id);
                const message = channel?.messages.get(packet.d.id) || { channel: channel || { id: packet.d.channel_id }, id: packet.d.id };
                if (channel)
                    channel.messages.delete(packet.d.id);
                this.client.emit("messageDelete", message);
                break;
            }
            case "MESSAGE_DELETE_BULK": {
                const channel = this.client.getChannel(packet.d.channel_id);
                this.client.emit("messageDeleteBulk", packet.d.ids.map(id => {
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
                const guild = packet.d.guild_id ? this.client.guilds.get(packet.d.guild_id) : null;
                const channel = this.client.getChannel(packet.d.channel_id);
                const message = channel?.messages.get(packet.d.message_id) || { channel: channel || { id: packet.d.channel_id }, id: packet.d.message_id };
                let reactor;
                if (guild && packet.d.member)
                    reactor = guild.members.update({ ...packet.d.member, id: packet.d.user_id }, guild.id);
                else
                    reactor = this.client.users.get(packet.d.user_id) || { id: packet.d.user_id };
                if (message instanceof Message_1.default) {
                    const name = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                    if (message.reactions[name]) {
                        message.reactions[name].count++;
                        if (packet.d.user_id === this.client.user.id)
                            message.reactions[name].me = true;
                    }
                    else {
                        message.reactions[name] = {
                            count: 1,
                            me: packet.d.user_id === this.client.user.id
                        };
                    }
                }
                this.client.emit("messageReactionAdd", message, reactor, packet.d.emoji);
                break;
            }
            case "MESSAGE_REACTION_REMOVE": {
                const channel = this.client.getChannel(packet.d.channel_id);
                const message = channel?.messages.get(packet.d.message_id) || { channel: channel || { id: packet.d.channel_id }, id: packet.d.message_id };
                const reactor = this.client.users.get(packet.d.user_id) || { id: packet.d.user_id };
                if (message instanceof Message_1.default) {
                    const name = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                    if (message.reactions[name]) {
                        message.reactions[name].count--;
                        if (packet.d.user_id === this.client.user.id)
                            message.reactions[name].me = false;
                        if (message.reactions[name].count === 0)
                            delete message.reactions[name];
                    }
                }
                this.client.emit("messageReactionRemove", message, reactor, packet.d.emoji);
                break;
            }
            case "MESSAGE_REACTION_REMOVE_ALL": {
                const channel = this.client.getChannel(packet.d.channel_id);
                const message = channel?.messages.get(packet.d.message_id) || { channel: channel || { id: packet.d.channel_id }, id: packet.d.message_id };
                if (message instanceof Message_1.default)
                    message.reactions = {};
                this.client.emit("messageReactionRemoveAll", message);
                break;
            }
            case "MESSAGE_REACTION_REMOVE_EMOJI": {
                const channel = this.client.getChannel(packet.d.channel_id);
                const message = channel?.messages.get(packet.d.message_id) || { channel: channel || { id: packet.d.channel_id }, id: packet.d.message_id };
                if (message instanceof Message_1.default) {
                    const name = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                    if (message.reactions[name])
                        delete message.reactions[name];
                }
                this.client.emit("messageReactionRemoveEmoji", message, packet.d.emoji);
                break;
            }
            case "MESSAGE_UPDATE": {
                const channel = this.client.getChannel(packet.d.channel_id);
                const oldMessage = channel && "messages" in channel ? channel.messages.get(packet.d.id)?.toJSON() || null : null;
                const message = channel && "messages" in channel ? channel.messages.update(packet.d) : new Message_1.default(packet.d, this.client);
                this.client.emit("messageUpdate", message, oldMessage);
                break;
            }
            case "PRESENCE_UPDATE": {
                const user = this.client.users.get(packet.d.user.id);
                if (user) {
                    const oldUser = user.toJSON();
                    user["update"](packet.d.user);
                    if (JSON.stringify(oldUser) !== JSON.stringify(user.toJSON()))
                        this.client.emit("userUpdate", user, oldUser);
                }
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in PRESENCE_UPDATE: ${packet.d.guild_id}`);
                    break;
                }
                const member = guild.members.get(packet.d.user.id);
                let oldPresence = null;
                if (member && member.presence) {
                    oldPresence = member.presence;
                    delete packet.d.user;
                    member.presence = packet.d;
                    this.client.emit("presenceUpdate", guild, member, oldPresence, packet.d);
                }
                break;
            }
            case "READY": {
                this.connectAttempts = 0;
                this.reconnectInterval = 1000;
                this.connecting = false;
                if (this.#connectTimeout)
                    clearInterval(this.#connectTimeout);
                this.status = "ready";
                this.client.shards["_ready"](this.id);
                this.client["_application"] = new ClientApplication_1.default(packet.d.application, this.client);
                if (!this.client["_user"])
                    this.client["_user"] = this.client.users.add(new ExtendedUser_1.default(packet.d.user, this.client));
                else
                    this.client.users.update(packet.d.user);
                let url = packet.d.resume_gateway_url;
                if (url.includes("?"))
                    url = url.slice(0, url.indexOf("?"));
                if (!url.endsWith("/"))
                    url += "/";
                this.resumeURL = `${url}?v=${Constants_1.GATEWAY_VERSION}&encoding=${Erlpack ? "etf" : "json"}`;
                packet.d.guilds.forEach(guild => {
                    this.client.guilds.delete(guild.id);
                    this.client.unavailableGuilds.update(guild);
                });
                this.preReady = true;
                this.emit("preReady");
                if (this.client.unavailableGuilds.size > 0 && packet.d.guilds.length > 0)
                    void this.restartGuildCreateTimeout();
                else
                    void this.checkReady();
                break;
            }
            case "RESUMED": {
                this.connectAttempts = 0;
                this.reconnectInterval = 1000;
                this.connecting = false;
                if (this.#connectTimeout)
                    clearInterval(this.#connectTimeout);
                this.status = "ready";
                this.client.shards["_ready"](this.id);
                break;
            }
            case "STAGE_INSTANCE_CREATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                this.client.emit("stageInstanceCreate", guild.stageInstances.update(packet.d));
                break;
            }
            case "STAGE_INSTANCE_DELETE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                this.client.emit("stageInstanceDelete", guild.stageInstances.get(packet.d.id) || new StageInstance_1.default(packet.d, this.client));
                break;
            }
            case "STAGE_INSTANCE_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                const oldStageInstance = guild.stageInstances.get(packet.d.id)?.toJSON() || null;
                this.client.emit("stageInstanceUpdate", guild.stageInstances.update(packet.d), oldStageInstance);
                break;
            }
            case "THREAD_CREATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                let thread;
                if (guild.threads.has(packet.d.id))
                    thread = guild.threads.update(packet.d);
                else {
                    thread = guild.threads.add(Channel_1.default.from(packet.d, this.client));
                    this.client.threadGuildMap[packet.d.id] = guild.id;
                }
                const channel = this.client.getChannel(packet.d.parent_id);
                if (channel) {
                    if ("threads" in channel)
                        channel.threads.add(thread);
                    if (channel.type === Constants_1.ChannelTypes.GUILD_FORUM)
                        channel.lastThread = thread;
                }
                this.client.emit("threadCreate", thread);
                break;
            }
            case "THREAD_DELETE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                const channel = this.client.getChannel(packet.d.parent_id);
                let thread;
                if (guild && guild.threads.has(packet.d.id)) {
                    thread = guild.threads.get(packet.d.id);
                    guild.threads.delete(packet.d.id);
                    if (channel) {
                        if ("threads" in channel)
                            channel.threads.delete(packet.d.id);
                        if (channel.type === Constants_1.ChannelTypes.GUILD_FORUM && channel.lastThread?.id === packet.d.id)
                            channel.lastThread = null;
                    }
                }
                else
                    thread = {
                        id: packet.d.id,
                        type: packet.d.type,
                        parentID: packet.d.parent_id
                    };
                this.client.emit("threadDelete", thread);
                break;
            }
            case "THREAD_LIST_SYNC": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                for (const thread of packet.d.threads) {
                    if (guild.threads.has(thread.id))
                        guild.threads.update(thread);
                    else
                        guild.threads.add(Channel_1.default.from(thread, this.client));
                }
                break;
            }
            case "THREAD_MEMBER_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                const thread = guild.threads.get(packet.d.id);
                if (!thread) {
                    this.client.emit("warn", `Missing thread ${packet.d.id} for ${packet.d.user_id} in THREAD_MEMBER_UPDATE`, this.id);
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
                this.client.emit("threadMemberUpdate", thread, member, oldMember);
                break;
            }
            case "THREAD_MEMBERS_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                const thread = guild.threads.get(packet.d.id);
                if (!thread) {
                    this.client.emit("warn", `Missing thread ${packet.d.id} in THREAD_MEMBERS_UPDATE`, this.id);
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
                        this.client.emit("warn", `Missing member ${id} in THREAD_MEMBERS_UPDATE`, this.id);
                        return;
                    }
                    removedMembers.push(...thread.members.splice(index, 1));
                });
                this.client.emit("threadMembersUpdate", thread, addedMembers, removedMembers);
                break;
            }
            case "THREAD_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                const channel = this.client.getChannel(packet.d.parent_id);
                let oldThread = null;
                let thread;
                if (guild.threads.has(packet.d.id)) {
                    oldThread = guild.threads.get(packet.d.id).toJSON();
                    thread = guild.threads.update(packet.d);
                }
                else {
                    thread = guild.threads.add(Channel_1.default.from(packet.d, this.client));
                    this.client.threadGuildMap[packet.d.id] = guild.id;
                }
                if (channel && "threads" in channel) {
                    const threads = channel.threads;
                    if (threads.has(packet.d.id))
                        threads.update(packet.d);
                    else
                        threads.add(thread);
                }
                this.client.emit("threadUpdate", thread, oldThread);
                break;
            }
            case "TYPING_START": {
                const guild = packet.d.guild_id ? this.client.guilds.get(packet.d.guild_id) : null;
                const channel = this.client.getChannel(packet.d.channel_id) || { id: packet.d.channel_id };
                const startTimestamp = new Date(packet.d.timestamp);
                if (guild) {
                    const member = guild.members.update({ ...packet.d.member, id: packet.d.user_id }, guild.id);
                    this.client.emit("typingStart", channel, member, startTimestamp);
                }
                else {
                    const user = this.client.users.get(packet.d.user_id);
                    this.client.emit("typingStart", channel, user || { id: packet.d.user_id }, startTimestamp);
                }
                break;
            }
            case "USER_UPDATE": {
                const oldUser = this.client.users.get(packet.d.id)?.toJSON() || null;
                this.client.emit("userUpdate", this.client.users.update(packet.d), oldUser);
                break;
            }
            case "VOICE_STATE_UPDATE": {
                if (!packet.d.guild_id)
                    break; // @TODO voice states without guilds?
                // @TODO voice
                packet.d.self_stream = !!packet.d.self_stream;
                const guild = this.client.guilds.get(packet.d.guild_id);
                const member = guild.members.update({ ...packet.d.member, id: packet.d.user_id }, guild.id);
                const oldState = member.voiceState?.toJSON() || null;
                const state = guild.voiceStates.update({ ...packet.d, id: member.id });
                member["update"]({ deaf: state.deaf, mute: state.mute });
                if (oldState?.channel !== state.channel) {
                    let oldChannel = null, newChannel;
                    if (oldState?.channel) {
                        oldChannel = guild.channels.get(oldState.channel) || null;
                        if (oldChannel && oldChannel.type !== Constants_1.ChannelTypes.GUILD_VOICE && oldChannel.type !== Constants_1.ChannelTypes.GUILD_STAGE_VOICE) {
                            this.client.emit("warn", `oldChannel is not a voice channel: ${oldChannel.id}`, this.id);
                            oldChannel = null;
                        }
                    }
                    if (packet.d.channel_id && (newChannel = guild.channels.get(packet.d.channel_id)) && (newChannel.type === Constants_1.ChannelTypes.GUILD_VOICE || newChannel.type === Constants_1.ChannelTypes.GUILD_STAGE_VOICE)) {
                        if (oldChannel) {
                            oldChannel.voiceMembers.delete(member.id);
                            this.client.emit("voiceChannelSwitch", newChannel.voiceMembers.add(member), newChannel, oldChannel);
                        }
                        else {
                            this.client.emit("voiceChannelJoin", newChannel.voiceMembers.add(member), newChannel);
                        }
                    }
                    else if (oldChannel) {
                        oldChannel.voiceMembers.delete(member.id);
                        this.client.emit("voiceChannelLeave", member, oldChannel);
                    }
                }
                if (JSON.stringify(oldState) !== JSON.stringify(state.toJSON())) {
                    this.client.emit("voiceStateUpdate", member, oldState);
                }
                break;
            }
            case "VOICE_SERVER_UPDATE": {
                // @TODO voice
                break;
            }
            case "WEBHOOKS_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in WEBHOOKS_UPDATE: ${packet.d.guild_id}`);
                    break;
                }
                const channel = this.client.getChannel(packet.d.channel_id) || { id: packet.d.channel_id };
                this.client.emit("webhooksUpdate", guild, channel);
                break;
            }
        }
    }
    onPacket(packet) {
        if ("s" in packet && packet.s) {
            if (packet.s > this.sequence + 1 && this.ws && this.status !== "resuming") {
                this.client.emit("warn", `Non-consecutive sequence (${this.sequence} -> ${packet.s})`, this.id);
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
                    this.client.emit("warn", "Session Invalidated. Session may be resumable, attempting to resume..", this.id);
                    this.resume();
                }
                else {
                    this.sequence = 0;
                    this.sessionID = null;
                    this.client.emit("warn", "Session Invalidated. Session is not resumable, requesting a new session..", this.id);
                    this.identify();
                }
                break;
            }
            case Constants_1.GatewayOPCodes.RECONNECT: {
                this.client.emit("debug", "Reconnect requested by Discord.", this.id);
                this.disconnect(true);
                break;
            }
            case Constants_1.GatewayOPCodes.HELLO: {
                if (this.#heartbeatInterval)
                    clearInterval(this.#heartbeatInterval);
                this.#heartbeatInterval = setInterval(() => this.heartbeat(false), packet.d.heartbeat_interval);
                this.connecting = false;
                if (this.#connectTimeout)
                    clearTimeout(this.#connectTimeout);
                this.#connectTimeout = null;
                if (this.sessionID)
                    this.resume();
                else {
                    this.identify();
                    this.heartbeat();
                }
                this.client.emit("hello", packet.d.heartbeat_interval, this.id);
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
            default: this.client.emit("warn", `Unrecognized gateway packet: ${packet}`, this.id);
        }
    }
    onWSClose(code, r) {
        const reason = r.toString();
        let err;
        let reconnect;
        if (code) {
            this.client.emit("debug", `${code === 1000 ? "Clean" : "Unclean"} WS close: ${code}: ${reason}`, this.id);
            switch (code) {
                case 1001: {
                    err = new GatewayError_1.default("CloudFlare WebSocket proxy restarting.", code);
                    break;
                }
                case 1006: {
                    err = new GatewayError_1.default("Connection reset by peer. This is a network issue. If you are concerned, talk to your ISP or host.", code);
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
                    this.client.emit("error", new Error(`Invalid Token: ${this._token}`));
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
        this.client.emit("error", err, this.id);
    }
    onWSMessage(data) {
        if (typeof data === "string")
            data = Buffer.from(data);
        try {
            if (data instanceof ArrayBuffer) {
                if (this.client.shards.options.compress || Erlpack) {
                    data = Buffer.from(data);
                }
            }
            else if (Array.isArray(data)) { // Fragmented messages
                data = Buffer.concat(data); // Copyfull concat is slow, but no alternative
            }
            (0, assert_1.default)((0, Util_1.is)(data));
            if (this.client.shards.options.compress) {
                if (data.length >= 4 && data.readUInt32BE(data.length - 4) === 0xFFFF) {
                    this.#sharedZLib.push(data, zlibConstants.Z_SYNC_FLUSH);
                    if (this.#sharedZLib.err) {
                        this.client.emit("error", new Error(`zlib error ${this.#sharedZLib.err}: ${this.#sharedZLib.msg || ""}`));
                        return;
                    }
                    data = Buffer.from(this.#sharedZLib.result || "");
                    if (Erlpack) {
                        return this.onPacket(Erlpack.unpack(data));
                    }
                    else {
                        return this.onPacket(JSON.parse(data.toString()));
                    }
                }
                else {
                    this.#sharedZLib.push(data, false);
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
            this.client.emit("error", err, this.id);
        }
    }
    onWSOpen() {
        this.status = "handshaking";
        this.client.emit("connect", this.id);
        this.lastHeartbeatAck = true;
    }
    async restartGuildCreateTimeout() {
        if (this.#guildCreateTimeout) {
            clearTimeout(this.#guildCreateTimeout);
            this.#guildCreateTimeout = null;
        }
        if (!this.ready) {
            if (this.client.unavailableGuilds.size === 0) {
                return this.checkReady();
            }
            this.#guildCreateTimeout = setTimeout(this.checkReady.bind(this), this.client.shards.options.guildCreateTimeout);
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
    get _token() { return this.client.options.auth; }
    /** Connect this shard. */
    connect() {
        if (this.ws && this.ws.readyState !== ws_1.WebSocket.CLOSED) {
            this.client.emit("error", new Error("Shard#connect called while existing connection is established."), this.id);
            return;
        }
        ++this.connectAttempts;
        this.connecting = true;
        this.initialize();
    }
    disconnect(reconnect = this.client.shards.options.autoReconnect, error) {
        if (!this.ws)
            return;
        if (this.#heartbeatInterval) {
            clearInterval(this.#heartbeatInterval);
            this.#heartbeatInterval = null;
        }
        if (this.ws.readyState !== ws_1.WebSocket.CLOSED) {
            this.ws.removeAllListeners();
            try {
                if (reconnect && this.sessionID) {
                    if (this.ws.readyState !== ws_1.WebSocket.OPEN)
                        this.ws.close(4999, "Reconnect");
                    else {
                        this.client.emit("debug", `Closing websocket (state: ${this.ws.readyState})`, this.id);
                        this.ws.terminate();
                    }
                }
                else {
                    this.ws.close(1000, "Normal Close");
                }
            }
            catch (err) {
                this.client.emit("error", err, this.id);
            }
        }
        this.ws = null;
        this.reset();
        if (error) {
            if (error instanceof GatewayError_1.default && [1001, 1006].includes(error.code))
                this.client.emit("debug", error.message, this.id);
            else
                this.client.emit("error", error, this.id);
        }
        this.emit("disconnect", error);
        if (this.sessionID && this.connectAttempts >= this.client.shards.options.maxReconnectAttempts) {
            this.client.emit("debug", `Automatically invalidating session due to excessive resume attempts | Attempt ${this.connectAttempts}`, this.id);
            this.sessionID = null;
        }
        if (reconnect) {
            if (this.sessionID) {
                this.client.emit("debug", `Immediately reconnecting for potential resume | Attempt ${this.connectAttempts}`, this.id);
                this.client.shards.connect(this);
            }
            else {
                this.client.emit("debug", `Queueing reconnect in ${this.reconnectInterval}ms | Attempt ${this.connectAttempts}`, this.id);
                setTimeout(() => {
                    this.client.shards.connect(this);
                }, this.reconnectInterval);
                this.reconnectInterval = Math.min(Math.round(this.reconnectInterval * (Math.random() * 2 + 1)), 30000);
            }
        }
        else
            this.hardReset();
    }
    /**
     * Edit this shard's status.
     * @param status The status.
     * @param activities An array of activities.
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
        this.#heartbeatInterval = null;
        this.#guildCreateTimeout = null;
        this.globalBucket = new Bucket_1.default(120, 60000, { reservedTokens: 5 });
        this.presence = JSON.parse(JSON.stringify(this.client.shards.options.presence));
        this.presenceUpdateBucket = new Bucket_1.default(5, 20000);
        this.resumeURL = null;
    }
    heartbeat(requested = false) {
        // discord/discord-api-docs#1619
        if (this.status === "resuming" || this.status === "identifying")
            return;
        if (!requested) {
            if (!this.lastHeartbeatAck) {
                this.client.emit("debug", "Heartbeat timeout; " + JSON.stringify({
                    lastReceived: this.lastHeartbeatReceived,
                    lastSent: this.lastHeartbeatSent,
                    interval: this.#heartbeatInterval,
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
            properties: this.client.shards.options.connectionProperties,
            compress: this.client.shards.options.compress,
            large_threshold: this.client.shards.options.largeThreshold,
            shard: [this.id, this.client.shards.options.maxShards],
            presence: this.presence,
            intents: this.client.shards.options.intents
        };
        this.send(Constants_1.GatewayOPCodes.IDENTIFY, data);
    }
    [util_1.inspect.custom]() {
        return Base_1.default.prototype[util_1.inspect.custom].call(this);
    }
    /**
     * Request the members of a guild.
     * @param guild The ID of the guild to request the members of.
     * @param options The options for requesting the members.
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
        if (!opts.query && !opts.user_ids && (!(this.client.shards.options.intents & Constants_1.Intents.GUILD_MEMBERS)))
            throw new Error("Cannot request all members without the GUILD_MEMBERS intent.");
        if (opts.presences && (!(this.client.shards.options.intents & Constants_1.Intents.GUILD_PRESENCES)))
            throw new Error("Cannot request presences without the GUILD_PRESENCES intent.");
        if (opts.user_ids && opts.user_ids.length > 100)
            throw new Error("Cannot request more than 100 users at once.");
        this.send(Constants_1.GatewayOPCodes.REQUEST_GUILD_MEMBERS, opts);
        return new Promise((resolve, reject) => this.#requestMembersPromise[opts.nonce] = {
            members: [],
            received: 0,
            timeout: setTimeout(() => {
                resolve(this.#requestMembersPromise[opts.nonce].members);
                delete this.#requestMembersPromise[opts.nonce];
            }, options?.timeout ?? this.client.rest.options.requestTimeout),
            resolve,
            reject
        });
    }
    reset() {
        this.connecting = false;
        this.ready = false;
        this.preReady = false;
        if (this.#requestMembersPromise !== undefined) {
            for (const guildID in this.#requestMembersPromise) {
                if (!this.#requestMembersPromise[guildID]) {
                    continue;
                }
                clearTimeout(this.#requestMembersPromise[guildID].timeout);
                this.#requestMembersPromise[guildID].resolve(this.#requestMembersPromise[guildID].received);
            }
        }
        this.#requestMembersPromise = {};
        this.#getAllUsersCount = {};
        this.#getAllUsersQueue = [];
        this.latency = Infinity;
        this.lastHeartbeatAck = true;
        this.lastHeartbeatReceived = 0;
        this.lastHeartbeatSent = 0;
        this.status = "disconnected";
        if (this.#connectTimeout)
            clearTimeout(this.#connectTimeout);
        this.#connectTimeout = null;
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
                    this.client.emit("debug", JSON.stringify({ op, d: data }), this.id);
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
     * @param guildID The ID of the guild to update the voice state of.
     * @param channelID The ID of the voice channel to join. Null to disconnect.
     * @param options The options for updating the voice state.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvZ2F0ZXdheS9TaGFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtFQUEwQztBQUUxQyxvRUFBNEM7QUFDNUMsd0VBQWdEO0FBRWhELDREQUFvQztBQUNwQyw0Q0FNc0I7QUFXdEIsa0VBQTBDO0FBQzFDLDhEQUFzQztBQUV0Qyx3RkFBZ0U7QUFHaEUsOEVBQXNEO0FBQ3RELDBGQUFrRTtBQUNsRSxvRUFBNEM7QUFhNUMsOEVBQXNEO0FBQ3RELDhFQUFzRDtBQUN0RCw0RkFBb0U7QUFDcEUsa0VBQTBDO0FBQzFDLG9FQUE0QztBQUU1QyxnRkFBd0Q7QUFFeEQsNEVBQW9EO0FBRXBELHVDQUFrQztBQUVsQywyQkFBK0I7QUFHL0IsbUNBQXFDO0FBQ3JDLCtCQUErQjtBQUMvQixvREFBNEI7QUFFNUIsb0JBQW9CO0FBQ3BCLElBQUksT0FBNkMsQ0FBQztBQUNsRCxJQUFJO0lBQ0EsT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztDQUNoQztBQUFDLE1BQU0sR0FBRztBQUNYLElBQUksUUFBd0UsRUFBRSxhQUF1RixDQUFDO0FBQ3RLLElBQUk7SUFDQSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2hDLGFBQWEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7Q0FDeEM7QUFBQyxNQUFNO0lBQ0osSUFBSTtRQUNBLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsYUFBYSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUM7S0FDekM7SUFBQyxNQUFNLEdBQUU7Q0FDYjtBQUNELG1CQUFtQjtBQUduQixzREFBc0Q7QUFDdEQsTUFBcUIsS0FBTSxTQUFRLHNCQUF5QjtJQUN4RCxNQUFNLENBQVU7SUFDaEIsZUFBZSxDQUFTO0lBQ3hCLGVBQWUsQ0FBd0I7SUFDdkMs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