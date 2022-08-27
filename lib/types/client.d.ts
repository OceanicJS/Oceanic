import type {
	AllowedMentions,
	AnyGuildChannelWithoutThreads,
	AnyGuildTextChannel,
	AnyTextChannel,
	AnyThreadChannel,
	InviteChannel,
	ThreadMember
} from "./channels";
import type { RawRequest } from "./request-handler";
import type { AutoModerationActionExecution, GatewayOptions, Presence } from "./gateway";
import type { AnyDispatchPacket } from "./gateway-raw";
import type { Uncached } from "./shared";
import type {
	JSONAnnouncementChannel,
	JSONAnnouncementThreadChannel,
	JSONAutoModerationRule,
	JSONCategoryChannel,
	JSONGuild,
	JSONIntegration,
	JSONMember,
	JSONMessage,
	JSONPrivateThreadChannel,
	JSONPublicThreadChannel,
	JSONRole,
	JSONScheduledEvent,
	JSONStageChannel,
	JSONStageInstance,
	JSONTextChannel,
	JSONUser,
	JSONVoiceChannel,
	JSONVoiceState
} from "./json";
import type { GuildApplicationCommandPermissions } from "./application-commands";
import type { GuildEmoji, PartialEmoji, Sticker } from "./guilds";
import type { AnyGatewayInteraction } from "./interactions";
import type { ImageFormat } from "../Constants";
import type Guild from "../structures/Guild";
import type UnavailableGuild from "../structures/UnavailableGuild";
import type AutoModerationRule from "../structures/AutoModerationRule";
import type AnnouncementThreadChannel from "../structures/AnnouncementThreadChannel";
import type PublicThreadChannel from "../structures/PublicThreadChannel";
import type PrivateThreadChannel from "../structures/PrivateThreadChannel";
import type TextChannel from "../structures/TextChannel";
import type VoiceChannel from "../structures/VoiceChannel";
import type CategoryChannel from "../structures/CategoryChannel";
import type AnnouncementChannel from "../structures/AnnouncementChannel";
import type StageChannel from "../structures/StageChannel";
import type User from "../structures/User";
import type Member from "../structures/Member";
import type Role from "../structures/Role";
import type ScheduledEvent from "../structures/ScheduledEvent";
import type Integration from "../structures/Integration";
import type Invite from "../structures/Invite";
import type Message from "../structures/Message";
import type PrivateChannel from "../structures/PrivateChannel";
import type StageInstance from "../structures/StageInstance";
import type { Agent } from "undici";

export interface ClientOptions {
	allowedMentions?: AllowedMentions;
	auth?: string | null;
	defaultImageFormat?: ImageFormat;
	defaultImageSize?: number;
	gateway?: GatewayOptions;
	rest?: RESTOptions;
}
type ClientInstanceOptions = Required<Omit<ClientOptions, "rest" | "gateway">>;

export interface RESTOptions {
	agent?: Agent | null;
	baseURL?: string;
	disableLatencyCompensation?: boolean;
	host?: string;
	latencyThreshold?: number;
	ratelimiterOffset?: number;
	requestTimeout?: number;
	userAgent?: string;
}

// @TODO document events
export interface ClientEvents {
	applicationCommandPermissionsUpdate: [guild: Guild, permissions: GuildApplicationCommandPermissions];
	autoModerationActionExecution: [guild: Guild, execution: AutoModerationActionExecution];
	autoModerationRuleCreate: [guild: Guild, rule: AutoModerationRule];
	autoModerationRuleDelete: [guild: Guild, rule: AutoModerationRule];
	autoModerationRuleUpdate: [guild: Guild, rule: AutoModerationRule, oldRule: JSONAutoModerationRule | null];
	channelCreate: [guild: Guild, channel: AnyGuildChannelWithoutThreads];
	channelDelete: [guild: Guild, channel: AnyGuildChannelWithoutThreads];
	channelPinsUpdate: [guild: Guild | null, channel: AnyTextChannel, timestamp: Date | null];
	channelUpdate: [guild: Guild, channel: TextChannel, oldChannel: JSONTextChannel | null] | [guild: Guild, channel: VoiceChannel, oldChannel: JSONVoiceChannel | null] | [guild: Guild, channel: CategoryChannel, oldChannel: JSONCategoryChannel | null] | [guild: Guild, channel: AnnouncementChannel, oldChannel: JSONAnnouncementChannel | null] | [guild: Guild, channel: StageChannel, oldChannel: JSONStageChannel | null];
	connect: [id: number];
	debug: [info: string, shard?: number];
	disconnect: [];
	error: [info: Error | string, shard?: number];
	guildAvailable: [guild: Guild];
	guildBanAdd: [guild: Guild, user: User];
	guildBanRemove: [guild: Guild, user: User];
	guildCreate: [guild: Guild];
	guildDelete: [guild: Guild | Uncached];
	guildEmojisUpdate: [guild: Guild, emojis: Array<GuildEmoji>, oldEmojis: Array<GuildEmoji>];
	guildIntegrationsUpdate: [guild: Guild];
	guildMemberAdd: [guild: Guild, member: Member];
	guildMemberChunk: [guild: Guild, members: Array<Member>];
	guildMemberRemove: [guild: Guild, member: Member | User];
	guildMemberUpdate: [guild: Guild, member: Member, oldMember: JSONMember | null];
	guildRoleCreate: [guild: Guild, role: Role];
	guildRoleDelete: [guild: Guild, role: Role | Uncached];
	guildRoleUpdate: [guild: Guild, role: Role, oldRole: JSONRole | null];
	guildScheduledEventCreate: [guild: Guild, event: ScheduledEvent];
	guildScheduledEventDelete: [guild: Guild, event: ScheduledEvent];
	guildScheduledEventUpdate: [guild: Guild, event: ScheduledEvent, oldEvent: JSONScheduledEvent | null];
	guildScheduledEventUserAdd: [guild: Guild, event: ScheduledEvent | Uncached, user: User | Uncached];
	guildScheduledEventUserRemove: [guild: Guild, event: ScheduledEvent | Uncached, user: User | Uncached];
	guildStickersUpdate: [guild: Guild, stickers: Array<Sticker>, oldStickers: Array<Sticker>];
	guildUnavailable: [guild: UnavailableGuild];
	guildUpdate: [guild: Guild, oldGuild: JSONGuild];
	hello: [interval: number, shard: number];
	integrationCreate: [guild: Guild, integration: Integration];
	integrationDelete: [guild: Guild, integration: Integration | { applicationID?: string; id: string; }];
	integrationUpdate: [guild: Guild, integration: Integration, oldIntegration: JSONIntegration | null];
	interactionCreate: [interaction: AnyGatewayInteraction];
	inviteCreate: [guild: Guild | null, channel: InviteChannel | Uncached, invite: Invite];
	inviteDelete: [guild: Guild | null, channel: InviteChannel | Uncached, code: string];
	messageCreate: [guild: Guild | null, message: Message];
	messageDelete: [guild: Guild | null, message: Message | { channel: AnyTextChannel | Uncached; id: string; }];
	messageDeleteBulk: [guild: Guild | null, messages: Array<Message | { channel: AnyTextChannel | Uncached; id: string; }>];
	messageReactionAdd: [guild: Guild | null, message: Message | { channel: AnyTextChannel | Uncached; id: string; }, reactor: Member | User | Uncached, reaction: PartialEmoji];
	messageReactionRemove: [guild: Guild | null, message: Message | { channel: AnyTextChannel | Uncached; id: string; }, reactor: Member | User | Uncached, reaction: PartialEmoji];
	messageReactionRemoveAll: [guild: Guild | null, message: Message | { channel: AnyTextChannel | Uncached; id: string; }];
	messageReactionRemoveEmoji: [guild: Guild | null, message: Message | { channel: AnyTextChannel | Uncached; id: string; }, reaction: PartialEmoji];
	messageUpdate: [guild: Guild | null, message: Message, oldMessage: JSONMessage | null];
	packet: [data: AnyDispatchPacket, shard: number];
	presenceUpdate: [guild: Guild, member: Member, presence: Presence, oldPresence: Presence | null];
	ready: [];
	request: [rawRequest: RawRequest];
	shardDisconnect: [err: Error | undefined, id: number];
	shardPreReady: [id: number];
	shardReady: [id: number];
	shardResume: [id: number];
	stageInstanceCreate: [guild: Guild, instance: StageInstance];
	stageInstanceDelete: [guild: Guild, instance: StageInstance];
	stageInstanceUpdate: [guild: Guild, instance: StageInstance, oldInstance: JSONStageInstance | null];
	threadCreate: [guild: Guild, thread: AnyThreadChannel];
	threadDelete: [guild: Guild, thread: AnyThreadChannel | Pick<AnyThreadChannel, "id" | "type"> & { parentID: string | null; }];
	threadListSync: [guild: Guild, threads: Array<AnyThreadChannel>, members: Array<ThreadMember>];
	threadMemberUpdate: [guild: Guild, thread: AnyThreadChannel, member: ThreadMember, oldMember: ThreadMember | null];
	threadMembersUpdate: [guild: Guild, thread: AnyThreadChannel, addedMembers: Array<ThreadMember>, removedMembers: Array<ThreadMember>];
	threadUpdate: [guild: Guild, thread: AnnouncementThreadChannel, oldThread: JSONAnnouncementThreadChannel] | [guild: Guild, thread: PublicThreadChannel, oldThread: JSONPublicThreadChannel | null] | [guild: Guild, thread: PrivateThreadChannel | null, oldThread: JSONPrivateThreadChannel | null];
	typingStart: [channel: PrivateChannel | Uncached, user: User | Uncached, startTimestamp: Date] | [channel: AnyGuildTextChannel | Uncached, member: Member, startTimestamp: Date];
	unavailableGuildCreate: [guild: UnavailableGuild];
	userUpdate: [user: User, oldUser: JSONUser | null];
	voiceChannelJoin: [member: Member, channel: VoiceChannel | StageChannel];
	voiceChannelLeave: [member: Member, channel: VoiceChannel | StageChannel];
	voiceChannelSwitch: [member: Member, channel: VoiceChannel | StageChannel, oldChannel: VoiceChannel | StageChannel | null];
	voiceStateUpdate: [member: Member, oldState: JSONVoiceState | null];
	warn: [info: string, shard?: number];
	webhooksUpdate: [guild: Guild, channel: AnyGuildChannelWithoutThreads | Uncached];
}

export interface ShardEvents {
	debug: [info: string];
	disconnect: [err: Error | undefined];
	error: [info: Error | string];
	preReady: [];
	ready: [];
	resume: [];
	warn: [info: string];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VoiceEvents {}

export interface JoinVoiceChannelOptions {
	opusOnly?: boolean;
	selfDeaf?: boolean;
	selfMute?: boolean;
	shared?: boolean;
}
