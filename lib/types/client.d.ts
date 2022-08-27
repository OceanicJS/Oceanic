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
	autoModerationRuleCreate: [rule: AutoModerationRule];
	autoModerationRuleDelete: [rule: AutoModerationRule];
	autoModerationRuleUpdate: [rule: AutoModerationRule, oldRule: JSONAutoModerationRule | null];
	channelCreate: [channel: AnyGuildChannelWithoutThreads];
	channelDelete: [channel: AnyGuildChannelWithoutThreads];
	channelPinsUpdate: [channel: AnyTextChannel, timestamp: Date | null];
	channelUpdate: [channel: TextChannel, oldChannel: JSONTextChannel | null] | [channel: VoiceChannel, oldChannel: JSONVoiceChannel | null] | [channel: CategoryChannel, oldChannel: JSONCategoryChannel | null] | [channel: AnnouncementChannel, oldChannel: JSONAnnouncementChannel | null] | [channel: StageChannel, oldChannel: JSONStageChannel | null];
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
	guildRoleCreate: [role: Role];
	guildRoleDelete: [role: Role];
	guildRoleUpdate: [role: Role, oldRole: JSONRole | null];
	guildScheduledEventCreate: [event: ScheduledEvent];
	guildScheduledEventDelete: [event: ScheduledEvent];
	guildScheduledEventUpdate: [event: ScheduledEvent, oldEvent: JSONScheduledEvent | null];
	guildScheduledEventUserAdd: [event: ScheduledEvent | Uncached, user: User | Uncached];
	guildScheduledEventUserRemove: [event: ScheduledEvent | Uncached, user: User | Uncached];
	guildStickersUpdate: [guild: Guild, stickers: Array<Sticker>, oldStickers: Array<Sticker>];
	guildUnavailable: [guild: UnavailableGuild];
	guildUpdate: [guild: Guild, oldGuild: JSONGuild];
	hello: [interval: number, shard: number];
	integrationCreate: [guild: Guild, integration: Integration];
	integrationDelete: [guild: Guild, integration: Integration | { applicationID?: string; id: string; }];
	integrationUpdate: [guild: Guild, integration: Integration, oldIntegration: JSONIntegration | null];
	interactionCreate: [interaction: AnyGatewayInteraction];
	inviteCreate: [guild: Guild | null, channel: InviteChannel, invite: Invite];
	inviteDelete: [guild: Guild | null, channel: InviteChannel, code: string];
	messageCreate: [message: Message];
	messageDelete: [message: Message | { channel: AnyTextChannel | Uncached; id: string; }];
	messageDeleteBulk: [messages: Array<Message | { channel: AnyTextChannel | Uncached; id: string; }>];
	messageReactionAdd: [message: Message | { channel: AnyTextChannel | Uncached; id: string; }, reactor: Member | User | Uncached, reaction: PartialEmoji];
	messageReactionRemove: [message: Message | { channel: AnyTextChannel | Uncached; id: string; }, reactor: Member | User | Uncached, reaction: PartialEmoji];
	messageReactionRemoveAll: [message: Message | { channel: AnyTextChannel | Uncached; id: string; }];
	messageReactionRemoveEmoji: [message: Message | { channel: AnyTextChannel | Uncached; id: string; }, reaction: PartialEmoji];
	messageUpdate: [message: Message, oldMessage: JSONMessage | null];
	packet: [data: AnyDispatchPacket, shard: number];
	presenceUpdate: [guild: Guild, member: Member, presence: Presence, oldPresence: Presence | null];
	ready: [];
	request: [rawRequest: RawRequest];
	shardDisconnect: [err: Error | undefined, id: number];
	shardPreReady: [id: number];
	shardReady: [id: number];
	shardResume: [id: number];
	stageInstanceCreate: [instance: StageInstance];
	stageInstanceDelete: [instance: StageInstance];
	stageInstanceUpdate: [instance: StageInstance, oldInstance: JSONStageInstance | null];
	threadCreate: [thread: AnyThreadChannel];
	threadDelete: [thread: AnyThreadChannel | Pick<AnyThreadChannel, "id" | "type"> & { parentID: string | null; }];
	threadListSync: [threads: Array<AnyThreadChannel>, members: Array<ThreadMember>];
	threadMemberUpdate: [thread: AnyThreadChannel, member: ThreadMember, oldMember: ThreadMember | null];
	threadMembersUpdate: [thread: AnyThreadChannel, addedMembers: Array<ThreadMember>, removedMembers: Array<ThreadMember>];
	threadUpdate: [thread: AnnouncementThreadChannel, oldThread: JSONAnnouncementThreadChannel] | [thread: PublicThreadChannel, oldThread: JSONPublicThreadChannel | null] | [thread: PrivateThreadChannel | null, oldThread: JSONPrivateThreadChannel | null];
	typingStart: [channel: PrivateChannel | Uncached, user: User | Uncached, startTimestamp: Date] | [channel: AnyGuildTextChannel | Uncached, member: Member, startTimestamp: Date];
	unavailableGuildCreate: [guild: UnavailableGuild];
	userUpdate: [user: User, oldUser: JSONUser | null];
	voiceChannelJoin: [member: Member, channel: VoiceChannel | StageChannel];
	voiceChannelLeave: [member: Member, channel: VoiceChannel | StageChannel];
	voiceChannelSwitch: [member: Member, channel: VoiceChannel | StageChannel, oldChannel: VoiceChannel | StageChannel | null];
	voiceStateUpdate: [member: Member, oldState: JSONVoiceState | null];
	warn: [info: string, shard?: number];
	webhooksUpdate: [channel: AnyGuildChannelWithoutThreads | Uncached];
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
