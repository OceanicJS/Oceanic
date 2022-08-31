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
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this._client.emit("debug", `Missing guild in APPLICATION_COMMAND_PERMISSIONS_UPDATE: ${packet.d.guild_id}`);
                    break;
                }
                this._client.emit("applicationCommandPermissionsUpdate", guild, {
                    application: packet.d.application_id === this._client.application.id ? this._client.application : { id: packet.d.application_id },
                    id: packet.d.id,
                    permissions: packet.d.permissions
                });
                break;
            }
            case "AUTO_MODERATION_ACTION_EXECUTION": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this._client.emit("debug", `Missing guild in AUTO_MODERATION_ACTION_EXECUTION: ${packet.d.guild_id}`);
                    break;
                }
                const channel = !packet.d.channel_id ? null : this._client.getChannel(packet.d.channel_id) || { id: packet.d.channel_id };
                this._client.emit("autoModerationActionExecution", guild, channel, this._client.users.get(packet.d.user_id) || { id: packet.d.user_id }, {
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
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this._client.emit("debug", `Missing guild in AUTO_MODERATION_RULE_CREATE: ${packet.d.guild_id}`);
                    this._client.emit("autoModerationRuleCreate", new AutoModerationRule_1.default(packet.d, this._client));
                    break;
                }
                this._client.emit("autoModerationRuleCreate", guild.autoModerationRules.update(packet.d));
                break;
            }
            case "AUTO_MODERATION_RULE_DELETE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this._client.emit("debug", `Missing guild in AUTO_MODERATION_RULE_DELETE: ${packet.d.guild_id}`);
                    this._client.emit("autoModerationRuleDelete", new AutoModerationRule_1.default(packet.d, this._client));
                    break;
                }
                guild.autoModerationRules.delete(packet.d.id);
                this._client.emit("autoModerationRuleDelete", new AutoModerationRule_1.default(packet.d, this._client));
                break;
            }
            case "AUTO_MODERATION_RULE_UPDATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this._client.emit("debug", `Missing guild in AUTO_MODERATION_RULE_UPDATE: ${packet.d.guild_id}`);
                    this._client.emit("autoModerationRuleUpdate", new AutoModerationRule_1.default(packet.d, this._client), null);
                    break;
                }
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
                if (!guild) {
                    this._client.emit("debug", `Missing guild in GUILD_BAN_ADD: ${packet.d.guild_id}`);
                    break;
                }
                this._client.emit("guildBanAdd", guild, this._client.users.update(packet.d.user));
                break;
            }
            case "GUILD_BAN_REMOVE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this._client.emit("debug", `Missing guild in GUILD_BAN_REMOVE: ${packet.d.guild_id}`);
                    break;
                }
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
                if (!guild) {
                    this._client.emit("debug", `Missing guild in GUILD_EMOJIS_UPDATE: ${packet.d.guild_id}`);
                    break;
                }
                const oldEmojis = [...guild.emojis];
                guild["update"]({ emojis: packet.d.emojis });
                this._client.emit("guildEmojisUpdate", guild, guild.emojis, oldEmojis);
                break;
            }
            case "GUILD_INTEGRATIONS_UPDATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this._client.emit("debug", `Missing guild in GUILD_INTEGRATIONS_UPDATE: ${packet.d.guild_id}`);
                    break;
                }
                this._client.emit("guildIntegrationsUpdate", guild);
                break;
            }
            case "GUILD_MEMBER_ADD": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this._client.emit("debug", `Missing guild in GUILD_MEMBER_ADD: ${packet.d.guild_id}`);
                    this._client.emit("guildMemberAdd", new Member_1.default(packet.d, this._client, packet.d.guild_id));
                    break;
                }
                guild.memberCount++;
                this._client.emit("guildMemberAdd", guild.members.update({ ...packet.d, id: packet.d.user.id }, guild.id));
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
                if (packet.d.user.id === this._client.user.id)
                    break;
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this._client.emit("debug", `Missing guild in GUILD_MEMBER_REMOVE: ${packet.d.guild_id}`);
                    this._client.emit("guildMemberRemove", this._client.users.update(packet.d.user), { id: packet.d.guild_id });
                    break;
                }
                guild.memberCount--;
                let member;
                if (guild.members.has(packet.d.user.id)) {
                    member = guild.members.get(packet.d.user.id);
                    member["update"]({ user: packet.d.user });
                }
                else
                    member = this._client.users.update(packet.d.user);
                this._client.emit("guildMemberRemove", member, guild);
                break;
            }
            case "GUILD_MEMBER_UPDATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this._client.emit("debug", `Missing guild in GUILD_MEMBER_UPDATE: ${packet.d.guild_id}`);
                    this._client.emit("guildMemberUpdate", new Member_1.default(packet.d, this._client, packet.d.guild_id), null);
                    break;
                }
                const oldMember = guild.members.get(packet.d.user.id)?.toJSON() || null;
                this._client.emit("guildMemberUpdate", guild.members.update({ ...packet.d, id: packet.d.user.id }, guild.id), oldMember);
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
                if (!guild) {
                    this._client.emit("debug", `Missing guild in GUILD_SCHEDULED_EVENT_CREATE: ${packet.d.guild_id}`);
                    this._client.emit("guildScheduledEventCreate", new GuildScheduledEvent_1.default(packet.d, this._client));
                    break;
                }
                this._client.emit("guildScheduledEventCreate", guild.scheduledEvents.update(packet.d));
                break;
            }
            case "GUILD_SCHEDULED_EVENT_DELETE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this._client.emit("debug", `Missing guild in GUILD_SCHEDULED_EVENT_DELETE: ${packet.d.guild_id}`);
                    this._client.emit("guildScheduledEventDelete", new GuildScheduledEvent_1.default(packet.d, this._client));
                    break;
                }
                let event;
                if (guild.scheduledEvents.has(packet.d.id))
                    event = guild.scheduledEvents.get(packet.d.id);
                else
                    event = new GuildScheduledEvent_1.default(packet.d, this._client);
                this._client.emit("guildScheduledEventDelete", event);
                break;
            }
            case "GUILD_SCHEDULED_EVENT_UPDATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this._client.emit("debug", `Missing guild in GUILD_SCHEDULED_EVENT_UPDATE: ${packet.d.guild_id}`);
                    this._client.emit("guildScheduledEventUpdate", new GuildScheduledEvent_1.default(packet.d, this._client), null);
                    break;
                }
                const oldEvent = guild.scheduledEvents.get(packet.d.id)?.toJSON() || null;
                this._client.emit("guildScheduledEventUpdate", guild.scheduledEvents.update(packet.d), oldEvent);
                break;
            }
            case "GUILD_SCHEDULED_EVENT_USER_ADD": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild)
                    this._client.emit("debug", `Missing guild in GUILD_SCHEDULED_EVENT_USER_ADD: ${packet.d.guild_id}`);
                const event = guild && guild.scheduledEvents.get(packet.d.guild_scheduled_event_id) || { id: packet.d.guild_scheduled_event_id };
                if ("userCount" in event)
                    event.userCount++;
                const user = this._client.users.get(packet.d.user_id) || { id: packet.d.user_id };
                this._client.emit("guildScheduledEventUserAdd", event, user);
                break;
            }
            case "GUILD_SCHEDULED_EVENT_USER_REMOVE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild)
                    this._client.emit("debug", `Missing guild in GUILD_SCHEDULED_EVENT_USER_REMOVE: ${packet.d.guild_id}`);
                const event = guild && guild.scheduledEvents.get(packet.d.guild_scheduled_event_id) || { id: packet.d.guild_scheduled_event_id };
                if ("userCount" in event)
                    event.userCount--;
                const user = this._client.users.get(packet.d.user_id) || { id: packet.d.user_id };
                this._client.emit("guildScheduledEventUserRemove", event, user);
                break;
            }
            case "GUILD_STICKERS_UPDATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this._client.emit("debug", `Missing guild in GUILD_STICKERS_UPDATE: ${packet.d.guild_id}`);
                    break;
                }
                const oldStickers = [...guild.stickers];
                guild["update"]({ stickers: packet.d.stickers });
                this._client.emit("guildStickersUpdate", guild, guild.stickers, oldStickers);
                break;
            }
            case "GUILD_UPDATE": {
                const guild = this._client.guilds.get(packet.d.id);
                const oldGuild = guild?.toJSON() || null;
                this._client.emit("guildUpdate", this._client.guilds.update(packet.d), oldGuild);
                break;
            }
            case "INTEGRATION_CREATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this._client.emit("debug", `Missing guild in INTEGRATION_CREATE: ${packet.d.guild_id}`);
                    break;
                }
                this._client.emit("integrationCreate", guild, guild.integrations.update(packet.d));
                break;
            }
            case "INTEGRATION_DELETE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this._client.emit("debug", `Missing guild in INTEGRATION_DELETE: ${packet.d.guild_id}`);
                    break;
                }
                this._client.emit("integrationDelete", guild, guild.integrations.get(packet.d.id) || { applicationID: packet.d.application_id, id: packet.d.id });
                break;
            }
            case "INTEGRATION_UPDATE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this._client.emit("debug", `Missing guild in INTEGRATION_UPDATE: ${packet.d.guild_id}`);
                    break;
                }
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
                    this._client.emit("debug", `Missing guild in PRESENCE_UPDATE: ${packet.d.guild_id}`);
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
                const channel = this._client.getChannel(packet.d.parent_id);
                if (channel && "threads" in channel)
                    channel.threads.add(thread);
                this._client.emit("threadCreate", thread);
                break;
            }
            case "THREAD_DELETE": {
                const guild = this._client.guilds.get(packet.d.guild_id);
                const channel = this._client.getChannel(packet.d.parent_id);
                let thread;
                if (guild && guild.threads.has(packet.d.id)) {
                    thread = guild.threads.get(packet.d.id);
                    guild.threads.delete(packet.d.id);
                    if (channel && "threads" in channel)
                        channel.threads.delete(packet.d.id);
                }
                else
                    thread = {
                        id: packet.d.id,
                        type: packet.d.type,
                        parentID: packet.d.parent_id
                    };
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
                const channel = this._client.getChannel(packet.d.parent_id);
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
                if (channel && "threads" in channel) {
                    const threads = channel.threads;
                    if (threads.has(packet.d.id))
                        threads.update(packet.d);
                    else
                        threads.add(thread);
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
                const guild = this._client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this._client.emit("debug", `Missing guild in WEBHOOKS_UPDATE: ${packet.d.guild_id}`);
                    break;
                }
                const channel = this._client.getChannel(packet.d.channel_id) || { id: packet.d.channel_id };
                this._client.emit("webhooksUpdate", guild, channel);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvZ2F0ZXdheS9TaGFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtFQUEwQztBQUUxQyxvRUFBNEM7QUFDNUMsd0VBQWdEO0FBRWhELDREQUFvQztBQUNwQyw0Q0FNc0I7QUFXdEIsa0VBQTBDO0FBQzFDLDhEQUFzQztBQUV0Qyx3RkFBZ0U7QUFHaEUsOEVBQXNEO0FBQ3RELDBGQUFrRTtBQUNsRSxvRUFBNEM7QUFhNUMsOEVBQXNEO0FBQ3RELDhFQUFzRDtBQUN0RCw0RkFBb0U7QUFDcEUsa0VBQTBDO0FBQzFDLG9FQUE0QztBQUU1QyxnRkFBd0Q7QUFFeEQsMERBQWtDO0FBQ2xDLDRFQUFvRDtBQUdwRCwyQkFBK0I7QUFHL0IsaUNBQW1DO0FBQ25DLG1DQUFxQztBQUNyQywrQkFBK0I7QUFFL0Isb0JBQW9CO0FBQ3BCLElBQUksT0FBNkMsQ0FBQztBQUNsRCxJQUFJO0lBQ0EsT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztDQUNoQztBQUFDLE1BQU0sR0FBRztBQUNYLElBQUksUUFBd0UsRUFBRSxhQUF1RixDQUFDO0FBQ3RLLElBQUk7SUFDQSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2hDLGFBQWEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7Q0FDeEM7QUFBQyxNQUFNO0lBQ0osSUFBSTtRQUNBLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsYUFBYSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUM7S0FDekM7SUFBQyxNQUFNLEdBQUU7Q0FDYjtBQUNELG1CQUFtQjtBQUduQixzREFBc0Q7QUFDdEQsTUFBcUIsS0FBTSxTQUFRLHNCQUF5QjtJQUNoRCxPQUFPLENBQVM7SUFDaEIsZUFBZSxDQUF3QjtJQUN2QyxpQkFBaUIsQ0FBdUI7SUFD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