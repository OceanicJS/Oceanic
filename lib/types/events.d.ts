/** @module Events */
import type * as Types from "./namespaced";
import type Guild from "../structures/Guild";
import type UnavailableGuild from "../structures/UnavailableGuild";
import type AutoModerationRule from "../structures/AutoModerationRule";
import type AnnouncementThreadChannel from "../structures/AnnouncementThreadChannel";
import type PublicThreadChannel from "../structures/PublicThreadChannel";
import type PrivateThreadChannel from "../structures/PrivateThreadChannel";
import type VoiceChannel from "../structures/VoiceChannel";
import type StageChannel from "../structures/StageChannel";
import type User from "../structures/User";
import type Member from "../structures/Member";
import type Role from "../structures/Role";
import type GuildScheduledEvent from "../structures/GuildScheduledEvent";
import type Integration from "../structures/Integration";
import type Invite from "../structures/Invite";
import type Message from "../structures/Message";
import type PrivateChannel from "../structures/PrivateChannel";
import type StageInstance from "../structures/StageInstance";
import type AuditLogEntry from "../structures/AuditLogEntry";
import type GroupChannel from "../structures/GroupChannel";
import type Entitlement from "../structures/Entitlement";
import type TestEntitlement from "../structures/TestEntitlement";
import type { JSONChannelTypeMap } from "../Constants";
import type Soundboard from "../structures/Soundboard";
import type Subscription from "../structures/Subscription";
import type Shard from "../gateway/Shard";


export interface ClientEvents {
    /** @event Emitted when an application command's permissions are updated. */
    applicationCommandPermissionsUpdate: [guild: Guild | Types.Shared.Uncached, permissions: Types.Applications.GuildApplicationCommandPermissions];
    /** @event Emitted when an auto moderation action is executed. Requires the `AUTO_MODERATION_EXECUTION` intent. */
    autoModerationActionExecution: [guild: Guild | Types.Shared.Uncached, channel: Types.Channels.AnyTextableGuildChannel | Types.Shared.Uncached | null, user: User | Types.Shared.Uncached, executionOptions: Types.Gateway.AutoModerationActionExecution];
    /** @event Emitted when an auto moderation rule is created. Requires the `AUTO_MODERATION_CONFIGURATION` intent. */
    autoModerationRuleCreate: [rule: AutoModerationRule];
    /** @event Emitted when an auto moderation rule is deleted. Requires the `AUTO_MODERATION_CONFIGURATION` intent. */
    autoModerationRuleDelete: [rule: AutoModerationRule];
    /** @event Emitted when an auto moderation rule is updated. Requires the `AUTO_MODERATION_CONFIGURATION` intent. */
    autoModerationRuleUpdate: [rule: AutoModerationRule, oldRule: Types.JSON.JSONAutoModerationRule | null];
    /** @event Emitted when a channel is created. Guild channels require the `GUILDS` intent. */
    channelCreate: [channel: Types.Channels.AnyGuildChannelWithoutThreads | GroupChannel];
    /** @event Emitted when channel is deleted. Requires the `GUILDS` intent. */
    channelDelete: [channel: Types.Channels.AnyGuildChannelWithoutThreads | PrivateChannel | Types.Gateway.DeletedPrivateChannel];
    /** @event Emitted when a shard receives the CHANNEL_INFO packet. */
    channelInfo: [guild: Guild | Types.Shared.Uncached, channels: Array<Types.Gateway.ChannelInfoWithChannel>, shard: Shard];
    /** @event Emitted when a channel's pins are updated (message pinned, message unpinned). Requires the `GUILDS` intent for guild channels, and `DIRECT_MESSAGES` for direct messages. */
    channelPinsUpdate: [channel: Types.Channels.AnyTextableChannel | Types.Shared.Uncached, timestamp: Date | null];
    /** @event Emitted when a channel is updated. Requires the `GUILDS` intent. */
    channelUpdate: [channel: Types.Channels.AnyGuildChannel, oldChannel: JSONChannelTypeMap[Types.Channels.GuildChannels] | null];
    /**
     * @event Emitted when a shard connects.
     * @deprecated The `id` parameter will be changed from {@link number} to {@link Shard} in 1.16.0.
     * */
    connect: [id: number];
    /**
     * @event Emitted with various information for debugging.
     * @deprecated The `shard` parameter will be changed from {@link number} to {@link Shard} in 1.16.0.
     */
    debug: [info: string, shard?: number];
    /** @event Emitted when all shards disconnect. */
    disconnect: [];
    /** @event Emitted when an entitlement is created. */
    entitlementCreate: [entitlement: Entitlement | TestEntitlement];
    /** @event Emitted when an entitlement is deleted. Note that expired entitlements are not deleted. */
    entitlementDelete: [entitlement: Entitlement | TestEntitlement];
    /** @event Emitted when an entitlement is updated. */
    entitlementUpdate: [entitlement: Entitlement | TestEntitlement, oldEntitlement: Types.JSON.JSONEntitlement | Types.JSON.JSONTestEntitlement | null];
    /**
     * @event Emitted when an error happens. If an error is emitted and no handlers are present, the error will be thrown.
     * @deprecated The `shard` parameter will be changed from {@link number} to {@link Shard} in 1.16.0.
     * */
    error: [info: Error | string, shard?: number];
    /** @event Emitted when an audit log entry is created. Requires both the `GUILD_MODERATION` intent, as well as the `VIEW_AUDIT_LOG` permission. */
    guildAuditLogEntryCreate: [guild: Guild | Types.Shared.Uncached, auditLogEntry: AuditLogEntry];
    /** @event Emitted when a guild becomes available. Requires the `GUILDS` intent. */
    guildAvailable: [guild: Guild, shard: Shard];
    /** @event Emitted when a guild ban is created. Requires the `GUILD_BANS` intent. */
    guildBanAdd: [guild: Guild | Types.Shared.Uncached, user: User];
    /** @event Emitted when a guild ban is revoked. Requires the `GUILD_BANS` intent. */
    guildBanRemove: [guild: Guild | Types.Shared.Uncached, user: User];
    /** @event Emitted when the client joins a new guild. Requires the `GUILDS` intent. */
    guildCreate: [guild: Guild, shard: Shard];
    /** @event Emitted when the client leaves a guild. Requires the `GUILDS` intent. */
    guildDelete: [guild: Guild | Types.Shared.Uncached, shard: Shard];
    /** @event Emitted when a guild's emojis are updated. Requires the `GUILD_EXPRESSIONS` intent. */
    guildEmojisUpdate: [guild: Guild | Types.Shared.Uncached, emojis: Array<Types.Guilds.GuildEmoji>, oldEmojis: Array<Types.Guilds.GuildEmoji> | null];
    /** @event Emitted when a guild's integrations are updated. Requires the `GUILD_INTEGRATIONS` intent. */
    guildIntegrationsUpdate: [guild: Guild | Types.Shared.Uncached];
    /** @event Emitted when a member joins a guild. Requires the `GUILD_MEMBERS` intent. */
    guildMemberAdd: [member: Member];
    /** @event Emitted when a chunk of guild members is received from Discord. */
    guildMemberChunk: [members: Array<Member>, shard: Shard];
    /** @event Emitted when a member leaves a guild. Requires the `GUILD_MEMBERS` intent. If the member is uncached, the first parameter will be a user. If the guild is uncached, the first parameter will be a user, and the second will be an object with only an `id`. */
    guildMemberRemove: [member: Member | User, guild: Guild | Types.Shared.Uncached];
    /** @event Emitted when a guild member is updates. Requires the `GUILD_MEMBERS` intent. */
    guildMemberUpdate: [member: Member, oldMember: Types.JSON.JSONMember | null];
    /** @event Emitted when a role is created. Requires the `GUILDS` intent. */
    guildRoleCreate: [role: Role];
    /** @event Emitted when a role is deleted. Requires the `GUILDS` intent. */
    guildRoleDelete: [role: Role | Types.Shared.Uncached, guild: Guild | Types.Shared.Uncached];
    /** @event Emitted when a role is updated. Requires the `GUILDS` intent. */
    guildRoleUpdate: [role: Role, oldRole: Types.JSON.JSONRole | null];
    /** @event Emitted when a scheduled event is created. Requires the `GUILD_SCHEDULED_EVENTS` intent. */
    guildScheduledEventCreate: [event: GuildScheduledEvent];
    /** @event Emitted when a scheduled event is deleted. Requires the `GUILD_SCHEDULED_EVENTS` intent. */
    guildScheduledEventDelete: [event: GuildScheduledEvent];
    /** @event Emitted when a scheduled event is updated. Requires the `GUILD_SCHEDULED_EVENTS` intent. */
    guildScheduledEventUpdate: [event: GuildScheduledEvent, oldEvent: Types.JSON.JSONScheduledEvent | null];
    /** @event Emitted when a user subscribes to a scheduled event. Requires the `GUILD_SCHEDULED_EVENTS` intent. */
    guildScheduledEventUserAdd: [event: GuildScheduledEvent | Types.Shared.Uncached, user: User | Types.Shared.Uncached];
    /** @event Emitted when a user unsubscribes from a scheduled event. Requires the `GUILD_SCHEDULED_EVENTS` intent. */
    guildScheduledEventUserRemove: [event: GuildScheduledEvent | Types.Shared.Uncached, user: User | Types.Shared.Uncached];
    /** @event Emitted when a guild's soundboard sound is created. Requires the `GUILD_EXPRESSIONS` intent. */
    guildSoundboardSoundCreate: [soundboardSound: Soundboard];
    /** @event Emitted when a guild's soundboard sound is deleted. Requires the `GUILD_EXPRESSIONS` intent. */
    guildSoundboardSoundDelete: [soundboardSound: Soundboard | Types.Shared.Uncached];
    /** @event Emitted when a guild's soundboard sound is updated. Requires the `GUILD_EXPRESSIONS` intent. */
    guildSoundboardSoundUpdate: [soundboardSound: Soundboard, oldSoundboardSound: Types.JSON.JSONSoundboard | null];
    /** @event Emitted when multiple guild's soundboard sounds are updated. Requires the `GUILD_EXPRESSIONS` intent. */
    guildSoundboardSoundsUpdate: [soundboardSounds: Array<Soundboard>, oldSoundboardSounds: Array<Types.JSON.JSONSoundboard | null>, guildID: string];
    /** @event Emitted when a guild's stickers are updated. Requires the `GUILD_EXPRESSIONS` intent. */
    guildStickersUpdate: [guild: Guild | Types.Shared.Uncached, stickers: Array<Types.Guilds.Sticker>, oldStickers: Array<Types.Guilds.Sticker> | null];
    /** @event Emitted when a guild becomes unavailable. Requires the `GUILDS` intent. */
    guildUnavailable: [guild: UnavailableGuild, shard: Shard];
    /** @event Emitted when a guild is updated. Requires the `GUILDS` intent. */
    guildUpdate: [guild: Guild, oldGuild: Types.JSON.JSONGuild | null];
    /**
     * @event Emitted when a shard receives the HELLO packet.
     * @deprecated The `shard` parameter will be changed from {@link number} to {@link Shard} in 1.16.0.
     * */
    hello: [interval: number, shard: number];
    /** @event Emitted when an integration is created. Requires the `GUILD_INTEGRATIONS` intent. */
    integrationCreate: [guild: Guild | Types.Shared.Uncached, integration: Integration];
    /** @event Emitted when an integration is deleted. Requires the `GUILD_INTEGRATIONS` intent. */
    integrationDelete: [guild: Guild | Types.Shared.Uncached, integration: Integration | Types.Guilds.PossiblyUncachedIntegration];
    /** @event Emitted when an integration is updated. Requires the `GUILD_INTEGRATIONS` intent. */
    integrationUpdate: [guild: Guild | Types.Shared.Uncached, integration: Integration, oldIntegration: Types.JSON.JSONIntegration | null];
    /** @event Emitted when an interaction is created. */
    interactionCreate: [interaction: Types.Interactions.AnyInteractionGateway];
    /** @event Emitted when an invite is created. Requires the `GUILD_INVITES` intent, and the `MANAGE_CHANNELS` permission on the channel. */
    inviteCreate: [invite: Invite];
    /** @event Emitted when an invite is deleted. Requires the `GUILD_INVITES` intent, and the `MANAGE_CHANNELS` permission on the channel. */
    inviteDelete: [invite: Types.Channels.PossiblyUncachedInvite];
    /** @event Emitted when a message is created. Requires the `GUILD_MESSAGES` intent for guild messages, `DIRECT_MESSAGES` for direct messages. The `MESSAGE_CONTENT` intent is required for `content`, `embeds`, and similar to be present on most messages. */
    messageCreate: [message: Message];
    /** @event Emitted when a message is created. Requires the `GUILD_MESSAGES` intent for guild messages, `DIRECT_MESSAGES` for direct messages. The `MESSAGE_CONTENT` intent is required for `content`, `embeds`, and similar to be present on most messages. */
    messageDelete: [message: Types.Channels.PossiblyUncachedMessage];
    /** @event Emitted when messages are bulk deleted. Requires the `GUILD_MESSAGES` intent. The `MESSAGE_CONTENT` intent is required for `content`, `embeds`, and similar to be present on most messages. */
    messageDeleteBulk: [messages: Array<Types.Channels.PossiblyUncachedMessage>];
    /** @event Emitted when a vote is added to a poll. Requires the `GUILD_MESSAGE_POLLS` for guild messages, and `DIRECT_MESSAGE_POLLS` for direct messages. */
    messagePollVoteAdd: [message: Types.Channels.PossiblyUncachedMessage, user: User | Types.Shared.Uncached, answer: Types.Channels.PollAnswer | { answerID: number; }];
    /** @event Emitted when a vote is added to a poll. Requires the `GUILD_MESSAGE_POLLS` for guild messages, and `DIRECT_MESSAGE_POLLS` for direct messages. */
    messagePollVoteRemove: [message: Types.Channels.PossiblyUncachedMessage, user: User | Types.Shared.Uncached, answer: Types.Channels.PollAnswer | { answerID: number; }];
    /** @event Emitted when a reaction is added to a message. For uncached messages, `author` will not be present if the reaction was added to a webhook message. Requires the `GUILD_MESSAGE_REACTIONS` for guild messages, and `DIRECT_MESSAGE_REACTIONS` for direct messages. */
    messageReactionAdd: [message: Types.Channels.PossiblyUncachedMessage & { author?: User | Types.Shared.Uncached; member?: Member | Types.Shared.Uncached; }, reactor: Member | User | Types.Shared.Uncached, reaction: Types.Channels.EventReaction];
    /** @event Emitted when a reaction is removed from a message. Requires the `GUILD_MESSAGE_REACTIONS` for guild messages, and `DIRECT_MESSAGE_REACTIONS` for direct messages. */
    messageReactionRemove: [message: Types.Channels.PossiblyUncachedMessage, reactor: Member | User | Types.Shared.Uncached, reaction: Types.Channels.EventReaction];
    /** @event Emitted when all reactions are removed from a message. Requires the `GUILD_MESSAGE_REACTIONS` for guild messages, and `DIRECT_MESSAGE_REACTIONS` for direct messages. */
    messageReactionRemoveAll: [message: Types.Channels.PossiblyUncachedMessage];
    /** @event Emitted when a specific reaction is removed for all users from a message. Requires the `GUILD_MESSAGE_REACTIONS` for guild messages, and `DIRECT_MESSAGE_REACTIONS` for direct messages. */
    messageReactionRemoveEmoji: [message: Types.Channels.PossiblyUncachedMessage, reaction: Types.Guilds.PartialEmoji];
    /** @event Emitted when a message is updated. Requires the `GUILD_MESSAGES` intent for guild messages, `DIRECT_MESSAGES` for direct messages. The `MESSAGE_CONTENT` intent is required for `content`, `embeds`, and similar to be present on most messages. */
    messageUpdate: [message: Message, oldMessage: Types.JSON.JSONMessage | null];
    /**
     * @event Emitted when a raw dispatch packet is received.
     * @deprecated The `shard` parameter will be changed from {@link number} to {@link Shard} in 1.16.0.
     */
    packet: [data: Types.GatewayRaw.AnyDispatchPacket, shard: number];
    /** @event Emitted when a guild member's presence, or user is updated. Requires the `GUILD_PRESENCES` intent. */
    presenceUpdate: [guild: Guild | Types.Shared.Uncached, member: Member | Types.Shared.Uncached, presence: Types.Guilds.Presence, oldPresence: Types.Guilds.Presence | null];
    /** @event Emitted when a shard is ratelimited. */
    rateLimited: [info: Types.Gateway.RateLimitInfo, shard: Shard];
    /** @event Emitted when all shards are ready. */
    ready: [];
    /** @event Emitted when a request is made. */
    request: [rawRequest: Types.RequestHandler.RawRequest];
    /**
     * @event Emitted when this shard disconnects.
     * @deprecated The `id` parameter will be changed from {@link number} to {@link Shard} in 1.16.0.
     * */
    shardDisconnect: [err: Error | undefined, id: number];
    /**
     * @event Emitted when this shard has processed the READY packet from Discord.
     * @deprecated The `id` parameter will be changed from {@link number} to {@link Shard} in 1.16.0.
     */
    shardPreReady: [id: number];
    /**
     * @event Emitted when a shard is fully ready.
     * @deprecated The `id` parameter will be changed from {@link number} to {@link Shard} in 1.16.0.
     */
    shardReady: [id: number];
    /**
     * @event Emitted when a shard resumes a connection.
     * @deprecated The `id` parameter will be changed from {@link number} to {@link Shard} in 1.16.0.
     */
    shardResume: [id: number];
    /** @event Emitted when a shard receives the SOUNDBOARD_SOUNDS packet. */
    soundboardSounds: [guild: Guild | Types.Shared.Uncached, soundboardSounds: Array<Soundboard>, shard: Shard];
    /** @event Emitted when a stage instance is created. */
    stageInstanceCreate: [instance: StageInstance];
    /** @event Emitted when a stage instance is deleted. */
    stageInstanceDelete: [instance: StageInstance];
    /** @event Emitted when a stage instance is updated. */
    stageInstanceUpdate: [instance: StageInstance, oldInstance: Types.JSON.JSONStageInstance | null];
    /** @event Emitted when a subscription is created. */
    subscriptionCreate: [subscription: Subscription];
    /** @event Emitted when a subscription is deleted. */
    subscriptionDelete: [subscription: Subscription];
    /** @event Emitted when a subscription is updated. */
    subscriptionUpdate: [subscription: Subscription, oldSubscription: Types.JSON.JSONSubscription | null];
    /** @event Emitted when a thread is created. Requires the `GUILDS` intent. */
    threadCreate: [thread: Types.Channels.AnyThreadChannel];
    /** @event Emitted when a thread is deleted. Requires the `GUILDS` intent. */
    threadDelete: [thread: Types.Channels.PossiblyUncachedThread];
    /** @event Emitted when a guild's threads are synced. Requires the `GUILDS` intent. */
    threadListSync: [threads: Array<Types.Channels.AnyThreadChannel>, members: Array<Types.Channels.ThreadMember>];
    /** @event Emitted when the client's thread member is updated. Requires the `GUILDS` intent. */
    threadMemberUpdate: [thread: Types.Channels.MinimalPossiblyUncachedThread, member: Types.Channels.ThreadMember, oldMember: Types.Channels.ThreadMember | null];
    /** @event Emitted when the members of a thread are updated. Requires the `GUILDS` intent. The received information will be different if `GUILD_MEMBERS` is also used. */
    threadMembersUpdate: [thread: Types.Channels.MinimalPossiblyUncachedThread, addedMembers: Array<Types.Channels.ThreadMember>, removedMembers: Array<Types.Channels.ThreadMember | Types.Channels.UncachedThreadMember>];
    /** @event Emitted when a thread is updated. Requires the `GUILDS` intent. */
    threadUpdate: [thread: AnnouncementThreadChannel, oldThread: Types.JSON.JSONAnnouncementThreadChannel | null] | [thread: PublicThreadChannel, oldThread: Types.JSON.JSONPublicThreadChannel | null] | [thread: PrivateThreadChannel, oldThread: Types.JSON.JSONPrivateThreadChannel | null];
    /** @event Emitted when a user starts typing. Requires the `GUILD_MESSAGE_TYPING` for guilds, and `DIRECT_MESSAGE_TYPING` for direct messages. */
    typingStart: [channel: PrivateChannel | Types.Shared.Uncached, user: User | Types.Shared.Uncached, startTimestamp: Date] | [channel: Types.Channels.AnyTextableGuildChannel | Types.Shared.Uncached, member: Member, startTimestamp: Date];
    /** @event Emitted when a guild is created, but is unavailable. Requires the `GUILDS` intent. */
    unavailableGuildCreate: [guild: UnavailableGuild, shard: Shard];
    /** @event Emitted when a user is updated. */
    userUpdate: [user: User, oldUser: Types.JSON.JSONUser | null];
    /** @event Emitted when a user uses an effect in a voice channel. Requires the `GUILD_VOICE_STATES` event. */
    voiceChannelEffectSend: [channel: Types.Channels.AnyVoiceChannel | (Types.Shared.Uncached & { guild: Guild | Types.Shared.Uncached; }), user: Member | User | Types.Shared.Uncached, effect: Types.Gateway.VoiceChannelEffect];
    /** @event Emitted when a user joins a voice channel. Requires the `GUILD_VOICE_STATES` intent. */
    voiceChannelJoin: [member: Member, channel: VoiceChannel | StageChannel | Types.Shared.Uncached];
    /** @event Emitted when a user leaves a voice channel. Requires the `GUILD_VOICE_STATES` intent. */
    voiceChannelLeave: [member: Member, channel: VoiceChannel | StageChannel | Types.Shared.Uncached | null];
    /** @event Emitted when a voice channel's start time is updated. Requires the `GUILD_VOICE_STATES` intent. */
    voiceChannelStartTimeUpdate: [channel: Types.Channels.AnyVoiceChannel | Types.Shared.Uncached, voiceStartTime: number | null];
    /** @event Emitted when a voice channel's status is updated. Requires the `GUILD_VOICE_STATES` intent. */
    voiceChannelStatusUpdate: [channel: Types.Channels.AnyVoiceChannel | Types.Shared.Uncached, status: string | null];
    /** @event Emitted when a user switches voice channels. Requires the `GUILD_VOICE_STATES` intent. */
    voiceChannelSwitch: [member: Member, channel: VoiceChannel | StageChannel | Types.Shared.Uncached, oldChannel: VoiceChannel | StageChannel | Types.Shared.Uncached | null];
    /** @event Emitted when a VOICE_SERVER_UPDATE packet is received. */
    voiceServerUpdate: [guild: Guild | Types.Shared.Uncached, endpoint: string | null, token: string];
    /** @event Emitted when a user's voice state is updated. Requires the `GUILD_VOICE_STATES` intent. */
    voiceStateUpdate: [member: Member, oldState: Types.JSON.JSONVoiceState | null];
    /**
     * @event Emitted with various warning information.
     * @deprecated The `shard` parameter will be changed from {@link number} to {@link Shard} in 1.16.0.
     */
    warn: [info: string, shard?: number];
    /** @event Emitted when a guild's webhooks are updated. Requires the `GUILD_WEBHOOKS` intent. */
    webhooksUpdate: [guild: Guild | Types.Shared.Uncached, channel: Types.Channels.AnyGuildChannelWithoutThreads | Types.Shared.Uncached];
}

export interface ShardEvents {
    /** @event Emitted with various information for debugging. */
    debug: [info: string];
    /** @event Emitted when this shard disconnects. */
    disconnect: [err?: Error];
    /** @event Emitted when an error happens. If an error is emitted and no handlers are present, the error will be thrown. */
    error: [info: Error | string];
    /** @event Emitted when this shard has processed the READY packet from Discord. */
    preReady: [];
    /** @event Emitted when this shard is fully ready. */
    ready: [];
    /** @event Emitted when this shard resumes a connection. */
    resume: [];
    /** @event Emitted with various warning information. */
    warn: [info: string];
}
