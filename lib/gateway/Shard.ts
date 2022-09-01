import GatewayError from "./GatewayError";
import type Client from "../Client";
import Properties from "../util/Properties";
import TypedEmitter from "../util/TypedEmitter";
import type { ShardEvents } from "../types/client";
import Bucket from "../rest/Bucket";
import {
    ChannelTypes,
    GatewayCloseCodes,
    GatewayOPCodes,
    GATEWAY_VERSION,
    Intents
} from "../Constants";
import type {
    UpdatePresenceOptions,
    RequestGuildMembersOptions,
    UpdateVoiceStateOptions,
    PresenceUpdate,
    Presence,
    SendStatuses,
    BotActivity,
    ShardStatus
} from "../types/gateway";
import Member from "../structures/Member";
import Base from "../structures/Base";
import type { AnyDispatchPacket, AnyReceivePacket } from "../types/gateway-raw";
import ClientApplication from "../structures/ClientApplication";
import type { RawOAuthUser, RawUser } from "../types/users";
import type { RawGuild, RawMember } from "../types/guilds";
import ExtendedUser from "../structures/ExtendedUser";
import AutoModerationRule from "../structures/AutoModerationRule";
import Channel from "../structures/Channel";
import type {
    AnyGuildChannelWithoutThreads,
    AnyTextChannel,
    AnyThreadChannel,
    InviteChannel,
    RawMessage,
    RawThreadChannel,
    ThreadMember
} from "../types/channels";
import type TextChannel from "../structures/TextChannel";
import type { JSONAnnouncementThreadChannel, JSONTextChannel } from "../types/json";
import type User from "../structures/User";
import VoiceChannel from "../structures/VoiceChannel";
import StageChannel from "../structures/StageChannel";
import GuildScheduledEvent from "../structures/GuildScheduledEvent";
import Invite from "../structures/Invite";
import Message from "../structures/Message";
import type { Uncached } from "../types/shared";
import StageInstance from "../structures/StageInstance";
import type AnnouncementThreadChannel from "../structures/AnnouncementThreadChannel";
import Debug from "../util/Debug";
import Interaction from "../structures/Interaction";
import type Collection from "../util/Collection";
import type { Data } from "ws";
import { WebSocket } from "ws";
import type Pako from "pako";
import type { Inflate } from "zlib-sync";
import { assert, is } from "tsafe";
import { randomBytes } from "crypto";
import { inspect } from "util";

/* eslint-disable */
let Erlpack: typeof import("erlpack") | undefined;
try {
    Erlpack = require("erlpack");
} catch { }
let ZlibSync: typeof import("pako") | typeof import("zlib-sync") | undefined, zlibConstants: typeof import("pako").constants | typeof import("zlib-sync") | undefined;
try {
    ZlibSync = require("zlib-sync");
    zlibConstants = require("zlib-sync");
} catch {
    try {
        ZlibSync = require("pako");
    zlibConstants = require("pako").constants;
    } catch {}
}
/* eslint-enable */


/* eslint-disable @typescript-eslint/unbound-method */
export default class Shard extends TypedEmitter<ShardEvents> {
    private _connectTimeout!: NodeJS.Timeout | null;
    private _getAllUsersCount!: Record<string, true>;
    private _getAllUsersQueue!: Array<string>;
    private _guildCreateTimeout!: NodeJS.Timeout | null;
    private _heartbeatInterval!: NodeJS.Timeout | null;
    private _requestMembersPromise!: Record<string, { members: Array<Member>; received: number; timeout: NodeJS.Timeout; reject(reason?: unknown): void; resolve(value: unknown): void; }>;
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    private _sharedZLib!: Pako.Inflate | Inflate;
    client!: Client;
    connectAttempts!: number;
    connecting!: boolean;
    globalBucket!: Bucket;
    id: number;
    lastHeartbeatAck!: boolean;
    lastHeartbeatReceived!: number;
    lastHeartbeatSent!: number;
    latency!: number;
    preReady!: boolean;
    presence!: Required<UpdatePresenceOptions>;
    presenceUpdateBucket!: Bucket;
    ready!: boolean;
    reconnectInterval!: number;
    resumeURL!: string | null;
    sequence!: number;
    sessionID!: string | null;
    status!: ShardStatus;
    ws!: WebSocket | null;
    constructor(id: number, client: Client) {
        super();
        Properties.new(this)
            .define("client", client)
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

    private async checkReady() {
        if (!this.ready) {
            if (this._getAllUsersQueue.length > 0) {
                const id = this._getAllUsersQueue.shift()!;
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

    private createGuild(data: RawGuild) {
        this.client.guildShardMap[data.id] = this.id;
        const guild = this.client.guilds.update(data);
        if (this.client.shards.options.getAllUsers && guild.members.size > guild.memberCount) {
            void this.requestGuildMembers(guild.id, {
                presences: (this.client.shards.options.intents & Intents.GUILD_PRESENCES) === Intents.GUILD_PRESENCES
            });
        }

        return guild;
    }

    private initialize() {
        if (!this._token) return this.disconnect(false, new Error("Invalid Token"));
        this.status = "connecting";
        if (this.client.shards.options.compress) {
            if (!ZlibSync) throw new Error("Cannot use compression without pako or zlib-sync.");
            this.client.emit("debug", "Initializing zlib-sync-based compression");
            this._sharedZLib = new ZlibSync.Inflate({
                chunkSize: 128 * 1024
            });
        }
        if (this.sessionID) {
            if (this.resumeURL === null) {
                this.client.emit("warn", "Resume url is not currently present. Discord may disconnect you quicker.", this.id);
            }
            this.ws = new WebSocket(this.resumeURL || this.client.gatewayURL, this.client.shards.options.ws);
        } else {
            this.ws = new WebSocket(this.client.gatewayURL, this.client.shards.options.ws);
        }

        this.ws.on("close", this.onWSClose);
        this.ws.on("error", this.onWSError);
        this.ws.on("message", this.onWSMessage);
        this.ws.on("open", this.onWSOpen);

        this._connectTimeout = setTimeout(() => {
            if (this.connecting) {
                this.disconnect(undefined, new Error("Connection timeout"));
            }
        }, this.client.shards.options.connectionTimeout);
    }

    private async onDispatch(packet: AnyDispatchPacket) {
        this.client.emit("packet", packet, this.id);
        switch (packet.t) {
            case "APPLICATION_COMMAND_PERMISSIONS_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in APPLICATION_COMMAND_PERMISSIONS_UPDATE: ${packet.d.guild_id}`);
                    break;
                }
                this.client.emit("applicationCommandPermissionsUpdate", guild, {
                    application: packet.d.application_id === this.client.application!.id ? this.client.application! : { id: packet.d.application_id },
                    id:          packet.d.id,
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
                this.client.emit("autoModerationActionExecution", guild, channel, this.client.users.get(packet.d.user_id) || { id: packet.d.user_id },{
                    action: {
                        metadata: {
                            channelID:       packet.d.action.metadata.channel_id,
                            durationSeconds: packet.d.action.metadata.duration_seconds
                        },
                        type: packet.d.action.type
                    },
                    alertSystemMessageID: packet.d.alert_system_message_id,
                    content:              packet.d.content,
                    matchedContent:       packet.d.matched_content,
                    matchedKeyword:       packet.d.matched_keyword,
                    messageID:            packet.d.message_id,
                    rule:                 guild && guild.autoModerationRules.get(packet.d.rule_id) || { id: packet.d.rule_id },
                    ruleTriggerType:      packet.d.rule_trigger_type
                });
                break;
            }

            case "AUTO_MODERATION_RULE_CREATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in AUTO_MODERATION_RULE_CREATE: ${packet.d.guild_id}`);
                    this.client.emit("autoModerationRuleCreate", new AutoModerationRule(packet.d, this.client));
                    break;
                }
                this.client.emit("autoModerationRuleCreate", guild.autoModerationRules.update(packet.d));
                break;
            }

            case "AUTO_MODERATION_RULE_DELETE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in AUTO_MODERATION_RULE_DELETE: ${packet.d.guild_id}`);
                    this.client.emit("autoModerationRuleDelete", new AutoModerationRule(packet.d, this.client));
                    break;
                }
                guild.autoModerationRules.delete(packet.d.id);
                this.client.emit("autoModerationRuleDelete", new AutoModerationRule(packet.d, this.client));
                break;
            }

            case "AUTO_MODERATION_RULE_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in AUTO_MODERATION_RULE_UPDATE: ${packet.d.guild_id}`);
                    this.client.emit("autoModerationRuleUpdate", new AutoModerationRule(packet.d, this.client), null);
                    break;
                }
                const oldRule = guild.autoModerationRules.get(packet.d.id)?.toJSON() || null;
                this.client.emit("autoModerationRuleUpdate", guild.autoModerationRules.update(packet.d), oldRule);
                break;
            }

            case "CHANNEL_CREATE": {
                const guild = this.client.guilds.get(packet.d.guild_id)!;
                let channel: AnyGuildChannelWithoutThreads;
                if (guild.channels.has(packet.d.id)) channel = guild.channels.update(packet.d);
                else {
                    channel = guild.channels.add(Channel.from(packet.d, this.client));
                    this.client.channelGuildMap[packet.d.id] = guild.id;
                }
                this.client.emit("channelCreate", channel);
                break;
            }

            case "CHANNEL_DELETE": {
                const guild = this.client.guilds.get(packet.d.guild_id)!;
                let channel: AnyGuildChannelWithoutThreads;
                if (guild.channels.has(packet.d.id)) channel = guild.channels.get(packet.d.id)!;
                else channel = Channel.from(packet.d, this.client);
                if (channel instanceof VoiceChannel || channel instanceof StageChannel) {
                    channel.voiceMembers.forEach(member => {
                        (channel as VoiceChannel).voiceMembers.delete(member.id);
                        this.client.emit("voiceChannelLeave", member, channel as VoiceChannel);
                    });
                }
                guild.channels.delete(packet.d.id);
                this.client.emit("channelDelete", channel);
                break;
            }

            case "CHANNEL_PINS_UPDATE": {
                const channel = this.client.getChannel<AnyTextChannel>(packet.d.channel_id);
                if (!channel) {
                    this.client.emit("warn", `Missing channel ${packet.d.channel_id} in CHANNEL_PINS_UPDATE`, this.id);
                    break;
                }
                this.client.emit("channelPinsUpdate", channel, !packet.d.last_pin_timestamp ? null : new Date(packet.d.last_pin_timestamp));
                break;
            }

            case "CHANNEL_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id)!;
                let oldChannel: ReturnType<AnyGuildChannelWithoutThreads["toJSON"]> | null = null;
                let channel: AnyGuildChannelWithoutThreads;
                if (guild.channels.has(packet.d.id)) {
                    oldChannel = guild.channels.get(packet.d.id)!.toJSON();
                    channel = guild.channels.update(packet.d);
                } else {
                    channel = guild.channels.add(Channel.from(packet.d, this.client));
                    this.client.channelGuildMap[packet.d.id] = guild.id;
                }
                this.client.emit("channelUpdate", channel as TextChannel, oldChannel as JSONTextChannel);
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
                        if (this.client.unavailableGuilds.delete(guild.id)) this.client.emit("guildAvailable", guild);
                        else this.client.emit("guildCreate", guild);
                    } else {
                        this.client.unavailableGuilds.delete(guild.id);
                        void this.restartGuildCreateTimeout();
                    }
                } else {
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
                if (guild) guild.channels.forEach((channel) => {
                    delete this.client.channelGuildMap[channel.id];
                });
                if (packet.d.unavailable) this.client.emit("guildUnavailable", this.client.unavailableGuilds.update(packet.d));
                else this.client.emit("guildDelete", guild || { id: packet.d.id });
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
                    this.client.emit("guildMemberAdd", new Member(packet.d as RawMember, this.client, packet.d.guild_id));
                    break;
                }
                guild.memberCount++;
                this.client.emit("guildMemberAdd", guild.members.update({ ...packet.d, id: packet.d.user!.id }, guild.id));
                break;
            }

            case "GUILD_MEMBERS_CHUNK": {
                const guild = this.client.guilds.get(packet.d.guild_id)!;

                const members = packet.d.members.map(member => guild.members.update({ ...member, id: member.user!.id }, guild.id));
                if (packet.d.presences) packet.d.presences.forEach(presence => {
                    const member = guild.members.get(presence.user.id);
                    if (member) member.presence = presence;
                });
                if (!packet.d.nonce) {
                    this.client.emit("warn", "Recieved GUILD_MEMBERS_CHUNK without a nonce.");
                    break;
                }
                if (this._requestMembersPromise[packet.d.nonce]) this._requestMembersPromise[packet.d.nonce].members.push(...members);

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

                this.client.emit("guildMemberChunk", guild, members);
                this.lastHeartbeatAck = true;
                break;
            }

            case "GUILD_MEMBER_REMOVE": {
                if (packet.d.user.id === this.client.user.id) break;
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in GUILD_MEMBER_REMOVE: ${packet.d.guild_id}`);
                    this.client.emit("guildMemberRemove", this.client.users.update(packet.d.user), { id: packet.d.guild_id });
                    break;
                }
                guild.memberCount--;
                let member: Member | User;
                if (guild.members.has(packet.d.user.id)) {
                    member = guild.members.get(packet.d.user.id)!;
                    member["update"]({ user: packet.d.user });
                } else member = this.client.users.update(packet.d.user);
                this.client.emit("guildMemberRemove", member, guild);
                break;
            }

            case "GUILD_MEMBER_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in GUILD_MEMBER_UPDATE: ${packet.d.guild_id}`);
                    this.client.emit("guildMemberUpdate", new Member(packet.d as RawMember, this.client, packet.d.guild_id), null);
                    break;
                }
                const oldMember = guild.members.get(packet.d.user!.id)?.toJSON() || null;
                this.client.emit("guildMemberUpdate", guild.members.update({ ...packet.d, id: packet.d.user!.id }, guild.id), oldMember);
                break;
            }

            case "GUILD_ROLE_CREATE": {
                const guild = this.client.guilds.get(packet.d.guild_id)!;
                this.client.emit("guildRoleCreate", guild.roles.update(packet.d.role, guild.id));
                break;
            }

            case "GUILD_ROLE_DELETE": {
                const guild = this.client.guilds.get(packet.d.guild_id)!;
                this.client.emit("guildRoleDelete", guild.roles.get(packet.d.role_id)!);
                break;
            }

            case "GUILD_ROLE_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id)!;
                const oldRole = guild.roles.get(packet.d.role.id)?.toJSON() || null;
                this.client.emit("guildRoleUpdate", guild.roles.update(packet.d.role, guild.id), oldRole);
                break;
            }

            case "GUILD_SCHEDULED_EVENT_CREATE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in GUILD_SCHEDULED_EVENT_CREATE: ${packet.d.guild_id}`);
                    this.client.emit("guildScheduledEventCreate", new GuildScheduledEvent(packet.d, this.client));
                    break;
                }
                this.client.emit("guildScheduledEventCreate", guild.scheduledEvents.update(packet.d));
                break;
            }

            case "GUILD_SCHEDULED_EVENT_DELETE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in GUILD_SCHEDULED_EVENT_DELETE: ${packet.d.guild_id}`);
                    this.client.emit("guildScheduledEventDelete", new GuildScheduledEvent(packet.d, this.client));
                    break;
                }
                let event: GuildScheduledEvent;
                if (guild.scheduledEvents.has(packet.d.id)) event = guild.scheduledEvents.get(packet.d.id)!;
                else event = new GuildScheduledEvent(packet.d, this.client);
                this.client.emit("guildScheduledEventDelete", event);
                break;
            }

            case "GUILD_SCHEDULED_EVENT_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id)!;
                if (!guild) {
                    this.client.emit("debug", `Missing guild in GUILD_SCHEDULED_EVENT_UPDATE: ${packet.d.guild_id}`);
                    this.client.emit("guildScheduledEventUpdate", new GuildScheduledEvent(packet.d, this.client), null);
                    break;
                }
                const oldEvent = guild.scheduledEvents.get(packet.d.id)?.toJSON() || null;
                this.client.emit("guildScheduledEventUpdate", guild.scheduledEvents.update(packet.d), oldEvent);
                break;
            }

            case "GUILD_SCHEDULED_EVENT_USER_ADD": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) this.client.emit("debug", `Missing guild in GUILD_SCHEDULED_EVENT_USER_ADD: ${packet.d.guild_id}`);
                const event = guild && guild.scheduledEvents.get(packet.d.guild_scheduled_event_id) || { id: packet.d.guild_scheduled_event_id };
                if ("userCount" in event) event.userCount++;
                const user = this.client.users.get(packet.d.user_id) || { id: packet.d.user_id };
                this.client.emit("guildScheduledEventUserAdd", event, user);
                break;
            }

            case "GUILD_SCHEDULED_EVENT_USER_REMOVE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) this.client.emit("debug", `Missing guild in GUILD_SCHEDULED_EVENT_USER_REMOVE: ${packet.d.guild_id}`);
                const event = guild && guild.scheduledEvents.get(packet.d.guild_scheduled_event_id) || { id: packet.d.guild_scheduled_event_id };
                if ("userCount" in event) event.userCount--;
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
                this.client.emit("interactionCreate", Interaction.from(packet.d, this.client));
                break;
            }

            case "INVITE_CREATE": {
                const guild = packet.d.guild_id ? this.client.guilds.get(packet.d.guild_id)! : null;
                const channel = this.client.getChannel<InviteChannel>(packet.d.channel_id)!;
                this.client.emit("inviteCreate", guild, channel, new Invite(packet.d, this.client));
                break;
            }

            case "INVITE_DELETE": {
                const guild = packet.d.guild_id ? this.client.guilds.get(packet.d.guild_id)! : null;
                const channel = this.client.getChannel<InviteChannel>(packet.d.channel_id)!;
                this.client.emit("inviteDelete", guild, channel, packet.d.code);
                break;
            }

            case "MESSAGE_CREATE": {
                const channel = this.client.getChannel<AnyTextChannel>(packet.d.channel_id);
                const message = channel ? channel.messages.update(packet.d) : new Message(packet.d, this.client);
                if (channel) channel.lastMessage = message;
                this.client.emit("messageCreate", message);
                break;
            }

            case "MESSAGE_DELETE": {
                const channel = this.client.getChannel<AnyTextChannel>(packet.d.channel_id);
                const message = channel?.messages.get(packet.d.id) || { channel: channel || { id: packet.d.channel_id }, id: packet.d.id };
                if (channel) channel.messages.delete(packet.d.id);
                this.client.emit("messageDelete", message);
                break;
            }

            case "MESSAGE_DELETE_BULK": {
                const channel = this.client.getChannel<AnyTextChannel>(packet.d.channel_id);
                this.client.emit("messageDeleteBulk", packet.d.ids.map(id => {
                    if (channel && channel.messages.has(id)) {
                        const message = channel.messages.get(id)!;
                        channel.messages.delete(id);
                        return message;
                    } else {
                        return {
                            channel: channel || { id: packet.d.channel_id },
                            id
                        };
                    }
                }));
                break;
            }

            case "MESSAGE_REACTION_ADD": {
                const guild = packet.d.guild_id ? this.client.guilds.get(packet.d.guild_id)! : null;
                const channel = this.client.getChannel<AnyTextChannel>(packet.d.channel_id);
                const message = channel?.messages.get(packet.d.message_id) || { channel: channel || { id: packet.d.channel_id }, id: packet.d.message_id };
                let reactor: Member | User | Uncached;
                if (guild && packet.d.member) reactor = guild.members.update({ ...packet.d.member, id: packet.d.user_id }, guild.id);
                else reactor = this.client.users.get(packet.d.user_id) || { id: packet.d.user_id };

                if (message instanceof Message) {
                    const name = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                    if (message.reactions[name]) {
                        message.reactions[name].count++;
                        if (packet.d.user_id === this.client.user!.id) message.reactions[name].me = true;
                    } else {
                        message.reactions[name] = {
                            count: 1,
                            me:    packet.d.user_id === this.client.user!.id
                        };
                    }
                }
                this.client.emit("messageReactionAdd", message, reactor, packet.d.emoji);
                break;
            }

            case "MESSAGE_REACTION_REMOVE": {
                const channel = this.client.getChannel<AnyTextChannel>(packet.d.channel_id);
                const message = channel?.messages.get(packet.d.message_id) || { channel: channel || { id: packet.d.channel_id }, id: packet.d.message_id };
                const reactor = this.client.users.get(packet.d.user_id) || { id: packet.d.user_id };

                if (message instanceof Message) {
                    const name = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                    if (message.reactions[name]) {
                        message.reactions[name].count--;
                        if (packet.d.user_id === this.client.user!.id) message.reactions[name].me = false;
                        if (message.reactions[name].count === 0) delete message.reactions[name];
                    }
                }
                this.client.emit("messageReactionRemove", message, reactor, packet.d.emoji);
                break;
            }

            case "MESSAGE_REACTION_REMOVE_ALL": {
                const channel = this.client.getChannel<AnyTextChannel>(packet.d.channel_id);
                const message = channel?.messages.get(packet.d.message_id) || { channel: channel || { id: packet.d.channel_id }, id: packet.d.message_id };

                if (message instanceof Message) message.reactions = {};
                this.client.emit("messageReactionRemoveAll", message);
                break;
            }

            case "MESSAGE_REACTION_REMOVE_EMOJI": {
                const channel = this.client.getChannel<AnyTextChannel>(packet.d.channel_id);
                const message = channel?.messages.get(packet.d.message_id) || { channel: channel || { id: packet.d.channel_id }, id: packet.d.message_id };

                if (message instanceof Message) {
                    const name = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                    if (message.reactions[name]) delete message.reactions[name];
                }
                this.client.emit("messageReactionRemoveEmoji", message, packet.d.emoji);
                break;
            }

            case "MESSAGE_UPDATE": {
                const channel = this.client.getChannel<AnyTextChannel>(packet.d.channel_id);
                const oldMessage = channel && "messages" in channel ? channel.messages.get(packet.d.id)?.toJSON() || null : null;
                const message = channel && "messages" in channel ? channel.messages.update(packet.d) : new Message(packet.d as RawMessage, this.client);
                this.client.emit("messageUpdate", message, oldMessage);
                break;
            }

            case "PRESENCE_UPDATE": {
                const user = this.client.users.get(packet.d.user.id);
                if (user) {
                    const oldUser = user.toJSON();
                    user["update"](packet.d.user);
                    if (JSON.stringify(oldUser) !== JSON.stringify(user.toJSON())) this.client.emit("userUpdate", user, oldUser);
                }

                const guild = this.client.guilds.get(packet.d.guild_id);
                if (!guild) {
                    this.client.emit("debug", `Missing guild in PRESENCE_UPDATE: ${packet.d.guild_id}`);
                    break;
                }
                const member = guild.members.get(packet.d.user.id);
                let oldPresence: Presence | null = null;
                if (member && member.presence) {
                    oldPresence = member.presence;
                    delete (packet.d as { user?: PresenceUpdate["user"]; }).user;
                    member.presence = packet.d;
                    this.client.emit("presenceUpdate", guild, member, oldPresence, packet.d);
                }
                break;
            }

            case "READY": {
                this.connectAttempts = 0;
                this.reconnectInterval = 1000;
                this.connecting = false;
                if (this._connectTimeout) clearInterval(this._connectTimeout);
                this.status = "ready";
                this.client.shards["_ready"](this.id);
                this.client.application = new ClientApplication(packet.d.application, this.client);
                if (!this.client.user) this.client.user = this.client.users.add(new ExtendedUser(packet.d.user as RawOAuthUser, this.client));
                else this.client.users.update(packet.d.user as unknown as RawUser);

                let url = packet.d.resume_gateway_url;
                if (url.includes("?")) url = url.slice(0, url.indexOf("?"));
                if (!url.endsWith("/")) url += "/";
                this.resumeURL = `${url}?v=${GATEWAY_VERSION}&encoding=${Erlpack ? "etf" : "json"}`;

                packet.d.guilds.forEach(guild => {
                    this.client.guilds.delete(guild.id);
                    this.client.unavailableGuilds.update(guild);
                });

                this.preReady = true;
                this.emit("preReady");

                if (this.client.unavailableGuilds.size > 0 && packet.d.guilds.length > 0) void this.restartGuildCreateTimeout();
                else void this.checkReady();
                break;
            }

            case "RESUMED": {
                this.connectAttempts = 0;
                this.reconnectInterval = 1000;
                this.connecting = false;
                if (this._connectTimeout) clearInterval(this._connectTimeout);
                this.status = "ready";
                this.client.shards["_ready"](this.id);
                break;
            }

            case "STAGE_INSTANCE_CREATE": {
                const guild = this.client.guilds.get(packet.d.guild_id)!;
                this.client.emit("stageInstanceCreate", guild.stageInstances.update(packet.d));
                break;
            }

            case "STAGE_INSTANCE_DELETE": {
                const guild = this.client.guilds.get(packet.d.guild_id)!;
                this.client.emit("stageInstanceDelete", guild.stageInstances.get(packet.d.id) || new StageInstance(packet.d, this.client));
                break;
            }

            case "STAGE_INSTANCE_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id)!;
                const oldStageInstance = guild.stageInstances.get(packet.d.id)?.toJSON() || null;
                this.client.emit("stageInstanceUpdate", guild.stageInstances.update(packet.d), oldStageInstance);
                break;
            }

            case "THREAD_CREATE": {
                const guild = this.client.guilds.get(packet.d.guild_id)!;
                let thread: AnyThreadChannel;
                if (guild.threads.has(packet.d.id)) thread = guild.threads.update(packet.d);
                else {
                    thread = guild.threads.add(Channel.from(packet.d, this.client));
                    this.client.threadGuildMap[packet.d.id] = guild.id;
                }
                const channel = this.client.getChannel(packet.d.parent_id!);
                if (channel) {
                    if ("threads" in channel) (channel.threads as Collection<string, RawThreadChannel, AnyThreadChannel>).add(thread);
                    if (channel.type === ChannelTypes.GUILD_FORUM) channel.lastThread = thread;
                }
                this.client.emit("threadCreate", thread);
                break;
            }

            case "THREAD_DELETE": {
                const guild = this.client.guilds.get(packet.d.guild_id);
                const channel = this.client.getChannel(packet.d.parent_id!);
                let thread: AnyThreadChannel | Pick<AnyThreadChannel, "id" | "type"> & { parentID: string | null; };
                if (guild && guild.threads.has(packet.d.id)) {
                    thread = guild.threads.get(packet.d.id)!;
                    guild.threads.delete(packet.d.id);
                    if (channel) {
                        if ("threads" in channel) channel.threads.delete(packet.d.id);
                        if (channel.type === ChannelTypes.GUILD_FORUM && channel.lastThread?.id === packet.d.id) channel.lastThread = null;
                    }
                } else thread = {
                    id:       packet.d.id,
                    type:     packet.d.type,
                    parentID: packet.d.parent_id
                };
                this.client.emit("threadDelete", thread);
                break;
            }

            case "THREAD_LIST_SYNC": {
                const guild = this.client.guilds.get(packet.d.guild_id)!;
                for (const thread of packet.d.threads) {
                    if (guild.threads.has(thread.id)) guild.threads.update(thread);
                    else guild.threads.add(Channel.from<AnyThreadChannel>(thread, this.client));
                }
                break;
            }

            case "THREAD_MEMBER_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id)!;
                const thread = guild.threads.get(packet.d.id!);
                if (!thread) {
                    this.client.emit("warn", `Missing thread ${packet.d.id!} for ${packet.d.user_id!} in THREAD_MEMBER_UPDATE`, this.id);
                    break;
                }
                let oldMember: ThreadMember | null = null, member: ThreadMember;
                const index = thread.members.findIndex(m => m.userID === packet.d.user_id);
                if (index === -1) member = thread.members[thread.members.push({
                    id:            packet.d.id,
                    flags:         packet.d.flags,
                    joinTimestamp: new Date(packet.d.join_timestamp),
                    userID:        packet.d.user_id
                })]; else {
                    oldMember = { ...thread.members[index] };
                    member = thread.members[index] = {
                        ...thread.members[index],
                        flags:         packet.d.flags,
                        joinTimestamp: new Date(packet.d.join_timestamp)
                    };
                }
                this.client.emit("threadMemberUpdate", thread, member, oldMember);
                break;
            }

            case "THREAD_MEMBERS_UPDATE": {
                const guild = this.client.guilds.get(packet.d.guild_id)!;
                const thread = guild.threads.get(packet.d.id!);
                if (!thread) {
                    this.client.emit("warn", `Missing thread ${packet.d.id!} in THREAD_MEMBERS_UPDATE`, this.id);
                    break;
                }
                thread.memberCount = packet.d.member_count;
                const addedMembers: Array<ThreadMember> = [], removedMembers: Array<ThreadMember> = [];
                packet.d.added_members.forEach(rawMember => {
                    let member: ThreadMember;
                    const index = thread.members.findIndex(m => m.userID === rawMember.id);
                    if (index === -1) member = thread.members[thread.members.push({ flags: rawMember.flags, id: rawMember.id, joinTimestamp: new Date(rawMember.join_timestamp), userID: rawMember.user_id })];
                    else {
                        member = thread.members[index] = {
                            ...thread.members[index],
                            flags:         rawMember.flags,
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
                const guild = this.client.guilds.get(packet.d.guild_id)!;
                const channel = this.client.getChannel(packet.d.parent_id!);
                let oldThread: ReturnType<AnyThreadChannel["toJSON"]> | null = null;
                let thread: AnyThreadChannel;
                if (guild.threads.has(packet.d.id)) {
                    oldThread = guild.threads.get(packet.d.id)!.toJSON();
                    thread = guild.threads.update(packet.d);
                } else {
                    thread = guild.threads.add(Channel.from(packet.d, this.client));
                    this.client.threadGuildMap[packet.d.id] = guild.id;
                }
                if (channel && "threads" in channel) {
                    const threads =  (channel.threads as Collection<string, RawThreadChannel, AnyThreadChannel>);
                    if (threads.has(packet.d.id)) threads.update(packet.d);
                    else threads.add(thread);
                }
                this.client.emit("threadUpdate", thread as AnnouncementThreadChannel, oldThread as JSONAnnouncementThreadChannel);
                break;
            }

            case "TYPING_START": {
                const guild = packet.d.guild_id ? this.client.guilds.get(packet.d.guild_id)! : null;
                const channel = this.client.getChannel<AnyTextChannel>(packet.d.channel_id) || { id: packet.d.channel_id };
                const startTimestamp = new Date(packet.d.timestamp);
                if (guild) {
                    const member = guild.members.update({ ...packet.d.member!, id: packet.d.user_id }, guild.id);
                    this.client.emit("typingStart", channel, member, startTimestamp);
                } else {
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
                if (!packet.d.guild_id) break; // @TODO voice states without guilds?
                // @TODO voice
                packet.d.self_stream = !!packet.d.self_stream;
                const guild = this.client.guilds.get(packet.d.guild_id)!;
                const member = guild.members.update({ ...packet.d.member!, id: packet.d.user_id }, guild.id);
                const oldState = member.voiceState?.toJSON() || null;
                const state = guild.voiceStates.update({ ...packet.d, id: member.id });
                member["update"]({ deaf: state.deaf, mute: state.mute });
                if (oldState?.channel !== state.channel) {
                    let oldChannel: VoiceChannel | StageChannel | null = null, newChannel: VoiceChannel | StageChannel;
                    if (oldState?.channel) {
                        oldChannel = guild.channels.get(oldState.channel) as VoiceChannel | StageChannel || null;
                        if (oldChannel && oldChannel.type !== ChannelTypes.GUILD_VOICE && oldChannel.type !== ChannelTypes.GUILD_STAGE_VOICE) {
                            this.client.emit("warn", `oldChannel is not a voice channel: ${(oldChannel as Channel).id}`, this.id);
                            oldChannel = null;
                        }
                    }
                    if (packet.d.channel_id && (newChannel = guild.channels.get(packet.d.channel_id) as VoiceChannel | StageChannel) && (newChannel.type === ChannelTypes.GUILD_VOICE || newChannel.type === ChannelTypes.GUILD_STAGE_VOICE)) {
                        if (oldChannel) {
                            oldChannel.voiceMembers.delete(member.id);
                            this.client.emit("voiceChannelSwitch", newChannel.voiceMembers.add(member), newChannel, oldChannel);
                        } else {
                            this.client.emit("voiceChannelJoin", newChannel.voiceMembers.add(member), newChannel);
                        }
                    } else if (oldChannel) {
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
                const channel = this.client.getChannel<AnyGuildChannelWithoutThreads>(packet.d.channel_id) || { id: packet.d.channel_id };
                this.client.emit("webhooksUpdate", guild, channel);
                break;
            }
        }
    }

    private onPacket(packet: AnyReceivePacket) {
        Debug("ws:recieve", packet);
        if ("s" in packet && packet.s) {
            if (packet.s > this.sequence + 1 && this.ws && this.status !== "resuming") {
                this.client.emit("warn", `Non-consecutive sequence (${this.sequence} -> ${packet.s})`, this.id);
            }
            this.sequence = packet.s;
        }

        switch (packet.op) {
            case GatewayOPCodes.DISPATCH: void this.onDispatch(packet); break;
            case GatewayOPCodes.HEARTBEAT: this.heartbeat(true); break;
            case GatewayOPCodes.INVALID_SESSION: {
                if (packet.d) {
                    this.client.emit("warn", "Session Invalidated. Session may be resumable, attempting to resume..", this.id);
                    this.resume();
                } else {
                    this.sequence = 0;
                    this.sessionID = null;
                    this.client.emit("warn", "Session Invalidated. Session is not resumable, requesting a new session..", this.id);
                    this.identify();
                }
                break;
            }

            case GatewayOPCodes.RECONNECT: {
                this.client.emit("debug", "Reconnect requested by Discord.", this.id);
                this.disconnect(true);
                break;
            }

            case GatewayOPCodes.HELLO: {
                if (this._heartbeatInterval) clearInterval(this._heartbeatInterval);
                this._heartbeatInterval = setInterval(() => this.heartbeat(false), packet.d.heartbeat_interval);

                this.connecting = false;
                if (this._connectTimeout) clearTimeout(this._connectTimeout);
                this._connectTimeout = null;
                if (this.sessionID) this.resume();
                else {
                    this.identify();
                    this.heartbeat();
                }

                this.client.emit("hello", packet.d.heartbeat_interval, this.id);
                break;
            }

            case GatewayOPCodes.HEARTBEAT_ACK: {
                this.lastHeartbeatAck = true;
                this.lastHeartbeatReceived = Date.now();
                this.latency = this.lastHeartbeatReceived - this.lastHeartbeatSent;
                if (isNaN(this.latency)) this.latency = Infinity;
                break;
            }

            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            default: this.client.emit("warn", `Unrecognized gateway packet: ${packet}`, this.id);
        }
    }

    private onWSClose(code: number, r: Buffer) {
        const reason = r.toString();
        let err: Error | undefined;
        let reconnect: boolean | undefined;
        if (code) {
            this.client.emit("debug", `${code === 1000 ? "Clean" : "Unclean"} WS close: ${code}: ${reason}`, this.id);
            switch (code) {
                case 1001: {
                    err = new GatewayError("CloudFlare WebSocket proxy restarting.", code);
                    break;
                }
                case 1006: {
                    err = new GatewayError("Connection reset by peer. This is a network issue. If you are concerned, talk to your ISP or host.", code);
                    break;
                }
                case GatewayCloseCodes.UNKNOWN_OPCODE: {
                    err = new GatewayError("Gateway recieved an unknown opcode.", code);
                    break;
                }

                case GatewayCloseCodes.DECODE_ERROR: {
                    err = new GatewayError("Gateway recieved an improperly encoded packet.", code);
                    break;
                }

                case GatewayCloseCodes.NOT_AUTHENTICATED: {
                    err = new GatewayError("Gateway recieved a packet before authentication.", code);
                    this.sessionID = null;
                    break;
                }

                case GatewayCloseCodes.AUTHENTICATION_FAILED: {
                    err = new GatewayError("Authentication failed.", code);
                    this.sessionID = null;
                    reconnect = false;
                    this.client.emit("error", new Error(`Invalid Token: ${this._token}`));
                    break;
                }

                case GatewayCloseCodes.ALREADY_AUTHENTICATED: {
                    err = new GatewayError("Gateway recieved an authentication attempt while already authenticated.", code);
                    break;
                }

                case GatewayCloseCodes.INVALID_SEQUENCE: {
                    err = new GatewayError("Gateway recieved an invalid sequence.", code);
                    this.sequence = 0;
                    break;
                }

                case GatewayCloseCodes.RATE_LIMITED: {
                    err = new GatewayError("Gateway connection was ratelimited.", code);
                    break;
                }

                case GatewayCloseCodes.INVALID_SHARD: {
                    err = new GatewayError("Invalid sharding specified.", code);
                    this.sessionID = null;
                    reconnect = false;
                    break;
                }

                case GatewayCloseCodes.SHARDING_REQUIRED: {
                    err = new GatewayError("Shard would handle too many guilds (>2500 each).", code);
                    this.sessionID = null;
                    reconnect = false;
                    break;
                }

                case GatewayCloseCodes.INVALID_API_VERSION: {
                    err = new GatewayError("Invalid API version.", code);
                    this.sessionID = null;
                    reconnect = false;
                    break;
                }

                case GatewayCloseCodes.INVALID_INTENTS: {
                    err = new GatewayError("Invalid intents specified.", code);
                    this.sessionID = null;
                    reconnect = false;
                    break;
                }

                case GatewayCloseCodes.DISALLOWED_INTENTS: {
                    err = new GatewayError("Disallowed intents specified. Make sure any privileged intents you're trying to access have been enabled in the developer portal.", code);
                    this.sessionID = null;
                    reconnect = false;
                    break;
                }

                default: {
                    err = new GatewayError(`Unknown close: ${code}: ${reason}`, code);
                    break;
                }
            }

            this.disconnect(reconnect, err);
        }
    }

    private onWSError(err: Error) {
        this.client.emit("error", err, this.id);
    }

    private onWSMessage(data: Data) {
        if (typeof data === "string") data = Buffer.from(data);
        try {
            if (data instanceof ArrayBuffer) {
                if (this.client.shards.options.compress || Erlpack) {
                    data = Buffer.from(data);
                }
            } else if (Array.isArray(data)) { // Fragmented messages
                data = Buffer.concat(data); // Copyfull concat is slow, but no alternative
            }
            assert(is<Buffer>(data));
            if (this.client.shards.options.compress) {
                if (data.length >= 4 && data.readUInt32BE(data.length - 4) === 0xFFFF) {
                    this._sharedZLib.push(data, zlibConstants!.Z_SYNC_FLUSH);
                    if (this._sharedZLib.err) {
                        this.client.emit("error", new Error(`zlib error ${this._sharedZLib.err}: ${this._sharedZLib.msg || ""}`));
                        return;
                    }

                    data = Buffer.from(this._sharedZLib.result || "");
                    if (Erlpack) {
                        return this.onPacket(Erlpack.unpack(data as Buffer) as AnyReceivePacket);
                    } else {
                        return this.onPacket(JSON.parse(data.toString()) as AnyReceivePacket);
                    }
                } else {
                    this._sharedZLib.push(data, false);
                }
            } else if (Erlpack) {
                return this.onPacket(Erlpack.unpack(data) as AnyReceivePacket);
            } else {
                return this.onPacket(JSON.parse(data.toString()) as AnyReceivePacket);
            }
        } catch (err) {
            this.client.emit("error", err as Error, this.id);
        }
    }

    private onWSOpen() {
        this.status = "handshaking";
        this.client.emit("connect", this.id);
        this.lastHeartbeatAck = true;
    }

    private async restartGuildCreateTimeout() {
        if (this._guildCreateTimeout) {
            clearTimeout(this._guildCreateTimeout);
            this._guildCreateTimeout = null;
        }
        if (!this.ready) {
            if (this.client.unavailableGuilds.size === 0) {
                return this.checkReady();
            }
            this._guildCreateTimeout = setTimeout(this.checkReady.bind(this), this.client.shards.options.guildCreateTimeout);
        }
    }

    private sendPresenceUpdate() {
        this.send(GatewayOPCodes.PRESENCE_UPDATE, {
            activities: this.presence.activities,
            afk:        !!this.presence.afk,
            since:      this.presence.status === "idle" ? Date.now() : null,
            status:     this.presence.status
        });
    }

    private get _token() { return this.client.options.auth!; }

    /** Connect this shard. */
    connect() {
        if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
            this.client.emit("error", new Error("Shard#connect called while existing connection is established."), this.id);
            return;
        }
        ++this.connectAttempts;
        this.connecting = true;
        this.initialize();
    }

    disconnect(reconnect = this.client.shards.options.autoReconnect, error?: Error) {
        if (!this.ws) return;

        if (this._heartbeatInterval) {
            clearInterval(this._heartbeatInterval);
            this._heartbeatInterval = null;
        }

        if (this.ws.readyState !== WebSocket.CLOSED) {
            this.ws.removeAllListeners();
            try {
                if (reconnect && this.sessionID) {
                    if (this.ws.readyState !== WebSocket.OPEN) this.ws.close(4999, "Reconnect");
                    else {
                        this.client.emit("debug", `Closing websocket (state: ${this.ws.readyState})`, this.id);
                        this.ws.terminate();
                    }
                } else {
                    this.ws.close(1000, "Normal Close");
                }
            } catch (err) {
                this.client.emit("error", err as Error, this.id);
            }
        }

        this.ws = null;
        this.reset();

        if (error) {
            if (error instanceof GatewayError && [1001, 1006].includes(error.code)) this.client.emit("debug", error.message, this.id);
            else this.client.emit("error", error, this.id);
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
            } else {
                this.client.emit("debug", `Queueing reconnect in ${this.reconnectInterval}ms | Attempt ${this.connectAttempts}`, this.id);
                setTimeout(() => {
                    this.client.shards.connect(this);
                }, this.reconnectInterval);
                this.reconnectInterval = Math.min(Math.round(this.reconnectInterval * (Math.random() * 2 + 1)), 30000);
            }
        } else this.hardReset();
    }

    /**
     * Edit this shard's status.
     * @param status The status.
     * @param activities An array of activities.
     */
    async editStatus(status: SendStatuses, activities: Array<BotActivity> = []) {
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
        this.globalBucket = new Bucket(120, 60000, { reservedTokens: 5 });
        this.presence = JSON.parse(JSON.stringify(this.client.shards.options.presence)) as Shard["presence"];
        this.presenceUpdateBucket = new Bucket(5, 20000);
        this.resumeURL = null;
    }

    heartbeat(requested = false) {
        // discord/discord-api-docs#1619
        if (this.status === "resuming" || this.status === "identifying") return;
        if (!requested) {
            if (!this.lastHeartbeatAck) {
                this.client.emit("debug", "Heartbeat timeout; " + JSON.stringify({
                    lastReceived: this.lastHeartbeatReceived,
                    lastSent:     this.lastHeartbeatSent,
                    interval:     this._heartbeatInterval,
                    status:       this.status,
                    timestamp:    Date.now()
                }));
                return this.disconnect(undefined, new Error("Server didn't acknowledge previous heartbeat, possible lost connection"));
            }
            this.lastHeartbeatAck = false;
        }
        this.lastHeartbeatSent = Date.now();
        this.send(GatewayOPCodes.HEARTBEAT, this.sequence, true);
    }

    identify() {
        const data = {
            token:           this._token,
            properties:      this.client.shards.options.connectionProperties,
            compress:        this.client.shards.options.compress,
            large_threshold: this.client.shards.options.largeThreshold,
            shard:           [this.id, this.client.shards.options.maxShards],
            presence:        this.presence,
            intents:         this.client.shards.options.intents
        };
        this.send(GatewayOPCodes.IDENTIFY, data);
    }

    [inspect.custom]() {
        return Base.prototype[inspect.custom].call(this);
    }

    /**
     * Request the members of a guild.
     * @param guild The ID of the guild to request the members of.
     * @param options The options for requesting the members.
     */
    async requestGuildMembers(guild: string, options?: RequestGuildMembersOptions) {
        const opts = {
            guild_id:  guild,
            limit:     options?.limit ?? 0,
            user_ids:  options?.userIDs,
            query:     options?.query,
            nonce:     randomBytes(16).toString("hex"),
            presences: options?.presences ?? false
        };
        if (!opts.user_ids && !opts.query) opts.query = "";
        if (!opts.query && !opts.user_ids && (!(this.client.shards.options.intents & Intents.GUILD_MEMBERS))) throw new Error("Cannot request all members without the GUILD_MEMBERS intent.");
        if (opts.presences && (!(this.client.shards.options.intents & Intents.GUILD_PRESENCES))) throw new Error("Cannot request presences without the GUILD_PRESENCES intent.");
        if (opts.user_ids && opts.user_ids.length > 100) throw new Error("Cannot request more than 100 users at once.");
        this.send(GatewayOPCodes.REQUEST_GUILD_MEMBERS, opts);
        return new Promise<Array<Member>>((resolve, reject) => this._requestMembersPromise[opts.nonce] = {
            members:  [],
            received: 0,
            timeout:  setTimeout(() => {
                resolve(this._requestMembersPromise[opts.nonce].members);
                delete this._requestMembersPromise[opts.nonce];
            }, options?.timeout ?? this.client.rest.options.requestTimeout),
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
        if (this._connectTimeout) clearTimeout(this._connectTimeout);
        this._connectTimeout = null;
    }

    resume() {
        this.status = "resuming";
        this.send(GatewayOPCodes.RESUME, {
            token:      this._token,
            session_id: this.sessionID,
            seq:        this.sequence
        });
    }

    send(op: GatewayOPCodes, data: unknown, priority = false) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            let i = 0, waitFor = 1;
            const func = () => {
                if (++i >= waitFor && this.ws && this.ws.readyState === WebSocket.OPEN) {
                    const d = Erlpack ? Erlpack.pack({ op, d: data }) : JSON.stringify({ op, d: data });
                    this.ws.send(d);
                    if (typeof data === "object" && data && "token" in data) (data as { token: string; }).token = "[REMOVED]";
                    this.client.emit("debug", JSON.stringify({ op, d: data }), this.id);
                    Debug("ws:send", { op, d: data });
                }
            };
            if (op === GatewayOPCodes.PRESENCE_UPDATE) {
                ++waitFor;
                this.presenceUpdateBucket.queue(func, priority);
            }
            this.globalBucket.queue(func, priority);
        }
    }

    toString() {
        return Base.prototype.toString.call(this);
    }

    /**
     * Update the voice state of this shard.
     * @param guildID The ID of the guild to update the voice state of.
     * @param channelID The ID of the voice channel to join. Null to disconnect.
     * @param options The options for updating the voice state.
     */
    updateVoiceState(guildID: string, channelID: string | null, options?: UpdateVoiceStateOptions) {
        this.send(GatewayOPCodes.VOICE_STATE_UPDATE, {
            channel_id: channelID,
            guild_id:   guildID,
            self_deaf:  options?.selfDeaf ?? false,
            self_mute:  options?.selfMute ?? false
        });
    }
}
