/// <reference types="node" />
import Role from "./Role";
import Base from "./Base";
import Member from "./Member";
import type ScheduledEvent from "./ScheduledEvent";
import GuildTemplate from "./GuildTemplate";
import type User from "./User";
import type VoiceChannel from "./VoiceChannel";
import type ClientApplication from "./ClientApplication";
import type TextChannel from "./TextChannel";
import type CategoryChannel from "./CategoryChannel";
import type AnnouncementChannel from "./AnnouncementChannel";
import type StageChannel from "./StageChannel";
import Integration from "./Integration";
import type Invite from "./Invite";
import GuildPreview from "./GuildPreview";
import AutoModerationRule from "./AutoModerationRule";
import Permission from "./Permission";
import VoiceState from "./VoiceState";
import StageInstance from "./StageInstance";
import type { DefaultMessageNotificationLevels, ExplicitContentFilterLevels, GuildFeature, GuildNSFWLevels, ImageFormat, MFALevels, PremiumTiers, VerificationLevels } from "../Constants";
import type Client from "../Client";
import Collection from "../util/Collection";
import type { AnyGuildChannel, AnyGuildChannelWithoutThreads, AnyGuildTextChannel, AnyThreadChannel, RawGuildChannel, RawThreadChannel } from "../types/channels";
import type { AddMemberOptions, Ban, BeginPruneOptions, CreateBanOptions, CreateCategoryChannelOptions, CreateEmojiOptions, CreateAnnouncementChannelOptions, CreateRoleOptions, CreateStageChannelOptions, CreateTextChannelOptions, CreateVoiceChannelOptions, EditCurrentMemberOptions, EditCurrentUserVoiceStateOptions, EditEmojiOptions, EditGuildOptions, EditMemberOptions, EditRoleOptions, EditRolePositionsEntry, EditUserVoiceStateOptions, EditWelcomeScreenOptions, GetActiveThreadsResponse, GetBansOptions, GetMembersOptions, GetPruneCountOptions, GetVanityURLResponse, GuildEmoji, ModifyChannelPositionsEntry, RawGuild, RawMember, RawRole, RawWidget, SearchMembersOptions, Sticker, WelcomeScreen, Widget, WidgetImageStyle, WidgetSettings, RawIntegration } from "../types/guilds";
import type { CreateScheduledEventOptions, EditScheduledEventOptions, GetScheduledEventUsersOptions, RawScheduledEvent, ScheduledEventUser } from "../types/scheduled-events";
import type { CreateAutoModerationRuleOptions, EditAutoModerationRuleOptions, RawAutoModerationRule } from "../types/auto-moderation";
import type { GetAuditLogOptions } from "../types/audit-log";
import { AuditLog } from "../types/audit-log";
import type { CreateTemplateOptions, EditGuildTemplateOptions } from "../types/guild-template";
import type { Uncached } from "../types/shared";
import type { RawVoiceState } from "../types/voice";
import { VoiceRegion } from "../types/voice";
import type { RawStageInstance } from "../types/stage-instances";
import type { JSONGuild } from "../types/json";
import type { RequestGuildMembersOptions } from "../types/gateway";
/** Represents a Discord server. */
export default class Guild extends Base {
    /** This guild's afk voice channel. This can be a partial object with just an `id` property. */
    afkChannel: VoiceChannel | Uncached | null;
    /** The seconds after which voice users will be moved to the afk channel. */
    afkTimeout: number;
    /** The application that created this guild, if applicable. This can be a partial object with just an `id` property. */
    application: ClientApplication | Uncached | null;
    /** The approximate number of members in this guild (if retreived with counts). */
    approximateMemberCount?: number;
    /** The approximate number of non-offline members in this guild (if retreived with counts). */
    approximatePresenceCount?: number;
    /** The auto moderation rules in this guild. */
    autoModerationRules: Collection<string, RawAutoModerationRule, AutoModerationRule>;
    /** The hash of this guild's banner. */
    banner: string | null;
    /** The channels in this guild. */
    channels: Collection<string, RawGuildChannel, AnyGuildChannelWithoutThreads>;
    /** The default [message notifications level](https://discord.com/developers/docs/resources/guild#guild-object-default-message-notification-level) of this guild. */
    defaultMessageNotifications: DefaultMessageNotificationLevels;
    /** The description of this guild. */
    description: string | null;
    /** The discovery splash of this guild. Only present if the guild has the `DISCOVERABLE` feature. */
    discoverySplash: string | null;
    /** The custom emojis of this guild. */
    emojis: Array<GuildEmoji>;
    /** The [explicit content filter](https://discord.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level) of this guild. */
    explicitContentFilter: ExplicitContentFilterLevels;
    /** The [features](https://discord.com/developers/docs/resources/guild#guild-object-guild-features) this guild has. */
    features: Array<GuildFeature>;
    /** The icon hash of this guild. */
    icon: string | null;
    /** The integrations in this guild. */
    integrations: Collection<string, RawIntegration, Integration>;
    /** The date at which this guild was joined. */
    joinedAt: Date;
    /** If this guild is considered large. */
    large: boolean;
    /** The maximum amount of members this guild can have. */
    maxMembers?: number;
    /** The maximum amount of people that can be present at a time in this guild. Only present for very large guilds. */
    maxPresences?: number;
    /** The maximum amount of users that can be present in a video channel. */
    maxVideoChannelUsers?: number;
    /** The number of members in this guild. */
    memberCount: number;
    /** The cached members in this guild. */
    members: Collection<string, RawMember, Member, [guildID: string]>;
    /** The required [mfa level](https://discord.com/developers/docs/resources/guild#guild-object-mfa-level) for moderators of this guild. */
    mfaLevel: MFALevels;
    /** The name of this guild. */
    name: string;
    /** The [nsfw level](https://discord.com/developers/docs/resources/guild#guild-object-guild-nsfw-level) of this guild. */
    nsfwLevel: GuildNSFWLevels;
    /** If the current user is the owner of this guild (only present when getting the current user's guilds). */
    oauthOwner?: boolean;
    /** The id of the owner of this guild. */
    owner: User | Uncached;
    /** The permissions of the current user in this guild (only present when getting the current user's guilds). */
    permissions?: Permission;
    /** The [preferred locale](https://discord.com/developers/docs/reference#locales) of this guild. */
    preferredLocale: string;
    /** If this guild has the boost progress bar enabled. */
    premiumProgressBarEnabled: boolean;
    /** The number of nitro boosts this guild has. */
    premiumSubscriptionCount?: number;
    /** The [boost level](https://discord.com/developers/docs/resources/guild#guild-object-premium-tier) of this guild. */
    premiumTier: PremiumTiers;
    /** The id of the channel where notices from Discord are recieved. Only present in guilds with the `COMMUNITY` feature. */
    publicUpdatesChannel: AnyGuildTextChannel | Uncached | null;
    /** @deprecated The region of this guild.*/
    region?: string | null;
    /** The roles in this guild. */
    roles: Collection<string, RawRole, Role, [guildID: string]>;
    /** The id of the channel where rules/guidelines are displayed. Only present in guilds with the `COMMUNITY` feature. */
    rulesChannel: TextChannel | Uncached | null;
    /** The scheduled events in this guild. */
    scheduledEvents: Collection<string, RawScheduledEvent, ScheduledEvent>;
    /** The invite splash hash of this guild. */
    splash: string | null;
    /** The stage instances in this guild. */
    stageInstances: Collection<string, RawStageInstance, StageInstance>;
    /** The custom stickers of this guild. */
    stickers: Array<Sticker>;
    /** The id of the channel where welcome messages and boosts notices are posted. */
    systemChannel: TextChannel | Uncached | null;
    /** The [flags](https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags) for the system channel. */
    systemChannelFlags: number;
    /** The threads in this guild. */
    threads: Collection<string, RawThreadChannel, AnyThreadChannel>;
    /** If this guild is unavailable. */
    unavailable: boolean;
    /** The vanity url of this guild. Only present in guilds with the `VANITY_URL` feature. */
    vanityURLCode: string | null;
    /** The [verfication level](https://discord.com/developers/docs/resources/guild#guild-object-verification-level) of this guild. */
    verificationLevel: VerificationLevels;
    /** The voice states of members in voice channels. */
    voiceStates: Collection<string, RawVoiceState, VoiceState>;
    /** The welcome screen configuration. Only present in guilds with the `WELCOME_SCREEN_ENABLED` feature. */
    welcomeScreen?: WelcomeScreen;
    /** The id of the channel the widget will generate an invite to, or `null` if set to no invite. */
    widgetChannel?: Exclude<AnyGuildChannel, CategoryChannel> | Uncached | null;
    /** If the widget is enabled. */
    widgetEnabled?: boolean;
    constructor(data: RawGuild, client: Client);
    protected update(data: Partial<RawGuild>): void;
    /** The shard this guild is on. Gateway only. */
    get shard(): import("..").Shard;
    /**
     * Add a member to this guild. Requires an access token with the `guilds.join` scope.
     *
     * Returns the newly added member upon success, or void if the member is already in the guild.
     *
     * @param {String} userID - The ID of the user to add.
     * @param {Object} options
     * @param {String} options.accessToken - The access token of the user to add.
     * @param {Boolean} [options.deaf] - If the user should be deafened or not.
     * @param {Boolean} [options.mute] - If the user should be muted or not.
     * @param {String} [options.nick] - The nickname of the user to add.
     * @param {String} [options.roles] - The IDs of the roles to add to the user. This bypasses membership screening and verification levels.
     * @returns {Promise<void | Member>}
     */
    addMember(userID: string, options: AddMemberOptions): Promise<void | Member>;
    /**
     * Add a role to a member.
     *
     * @param {String} memberID - The ID of the member.
     * @param {String} roleID - The ID of the role to add.
     * @param {String} [reason] - The reason for adding the role.
     * @returns {Promise<void>}
     */
    addMemberRole(memberID: string, roleID: string, reason?: string): Promise<void>;
    /**
     * The url of this guild's banner.
     *
     * @param {ImageFormat} format - The format the url should be.
     * @param {Number} size - The dimensions of the image.
     * @returns {(String | null)}
     */
    bannerURL(format?: ImageFormat, size?: number): string | null;
    /**
     * Begine a prune.
     *
     * @param {Object} [options]
     * @param {Number} [options.days] - The number of days to prune.
     * @param {Boolean} [options.computePruneCount] - If the number of members to prune should be computed. If false, the return will be `null`.
     * @param {String[]} [options.includeRoles] - The roles to include.
     * @param {String} [options.reason] - The reason for the prune.
     * @returns {Promise<Number?>}
     */
    beginPrune(options?: BeginPruneOptions): Promise<number | null>;
    /**
     * Create an auto moderation rule for this guild.
     *
     * @param {Object} options
     * @param {Object[]} options.actions - The actions to take.
     * @param {Object} options.actions[].metadata - The metadata for the action.
     * @param {String} [options.actions[].metadata.channelID] - The ID of the channel to send the message to. (`SEND_ALERT_MESSAGE`)
     * @param {Number} [options.actions[].metadata.durationSeconds] - The duration of the timeout in seconds. (`TIMEOUT`)
     * @param {AutoModerationActionTypes} options.actions[].type - The type of action to take.
     * @param {AutoModerationEventTypes} options.eventType - The event type to trigger on.
     * @param {String[]} options.exemptChannels - The channels to exempt from the rule.
     * @param {String[]} options.exemptRoles - The roles to exempt from the rule.
     * @param {String} [options.reason] - The reason for creating the rule.
     * @param {Object} [options.triggerMetadata] - The metadata to use for the trigger.
     * @param {String} [options.triggerMetadata.allowList] - The keywords to allow. (`KEYWORD_PRESET`)
     * @param {String[]} [options.triggerMetadata.keywordFilter] - The keywords to filter. (`KEYWORD`)
     * @param {Number} [options.triggerMetadata.mentionTotalLimit] - The maximum number of mentions to allow. (`MENTION_SPAM`)
     * @param {AutoModerationKeywordPresetTypes[]} [options.triggerMetadata.presets] - The presets to use. (`KEYWORD_PRESET`)
     * @param {AutoModerationTriggerTypes} options.triggerType - The type of trigger to use.
     * @returns {Promise<AutoModerationRule>}
     */
    createAutoModerationRule(options: CreateAutoModerationRuleOptions): Promise<AutoModerationRule | undefined>;
    /**
     * Create a bon for a user.
     *
     * @param {String} userID - The ID of the user.
     * @param {Object} options
     * @param {Number} [options.deleteMessageDays] - The number of days to delete messages from. Technically DEPRECTED. This is internally converted in to `deleteMessageSeconds`.
     * @param {Number} [options.deleteMessageSeconds] - The number of seconds to delete messages from. Takes precedence over `deleteMessageDays`.
     * @param {String} [options.reason] - The reason for creating the bon.
     * @returns {Promise<void>}
     */
    createBan(userID: string, options?: CreateBanOptions): Promise<void>;
    /**
     * Create a channel in this guild.
     *
     * @template {AnyGuildChannel} T
     * @param {Object} options
     * @param {ThreadAutoArchiveDuration} [options.defaultAutoArchiveDuration] - [Text, Announcement] The default auto archive duration for the channel.
     * @param {String} options.name - The name of the channel.
     * @param {Boolean} [options.nsfw] - [Text, Voice, Announcement] If the channel is age restricted.
     * @param {String} [options.parentID] - The ID of the category to put this channel in.
     * @param {Object[]} [options.permissionOverwrites] - The permission overwrites to apply to the channel.
     * @param {(BigInt | String)} [options.permissionOverwrites[].allow] - The permissions to allow.
     * @param {(BigInt | String)} [options.permissionOverwrites[].deny] - The permissions to deny.
     * @param {String} options.permissionOverwrites[].id - The ID of the user or role to apply the permissions to.
     * @param {OverwriteTypes} options.permissionOverwrites[].type - `0` for role, `1` for user.
     * @param {Number} [options.position] - The position of the channel.
     * @param {Number} [options.rateLimitPerUser] - [Text] The seconds between sending messages for users. Between 0 and 21600.
     * @param {String} [options.reason] - The reason for creating the channel.
     * @param {String} [options.rtcRegion] - [Voice] The voice region for the channel.
     * @param {GuildChannelTypesWithoutThreads} options.type - The [type](https://discord.com/developers/docs/resources/channel#channel-object-channel-types) of channel to create.
     * @param {Number} [options.userLimit] - [Voice] The maximum number of users that can be in the channel. Between 0 and 99.
     * @param {VideoQualityModes} [options.videoQualityMode] - [Voice] The [video quality mode](https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes) for the channel.
     * @param {Promise<T>}
     */
    createChannel(options: CreateTextChannelOptions): Promise<TextChannel>;
    createChannel(options: CreateVoiceChannelOptions): Promise<VoiceChannel>;
    createChannel(options: CreateCategoryChannelOptions): Promise<CategoryChannel>;
    createChannel(options: CreateAnnouncementChannelOptions): Promise<AnnouncementChannel>;
    createChannel(options: CreateStageChannelOptions): Promise<StageChannel>;
    /**
     * Create an emoji in this guild.
     *
     * @param {Object} options
     * @param {String} options.name - The name of the emoji.
     * @param {(Buffer | String)} options.image - The image (buffer, or full data url).
     * @param {String} [options.reason] - The reason for creating the emoji.
     * @param {String[]} [options.roles] - The roles to restrict the emoji to.
     * @returns {Promise<GuildEmoji>}
     */
    createEmoji(options: CreateEmojiOptions): Promise<{
        user: User | undefined; /** The shard this guild is on. Gateway only. */
        name: string;
        id: string;
        roles: string[];
        managed: boolean;
        animated: boolean;
        available: boolean;
        require_colons: boolean;
    }>;
    /**
     * Create a role.
     *
     * @param {Object} options
     * @param {Number} [options.color] - The color of the role.
     * @param {Boolean} [options.hoist] - If the role should be hoisted.
     * @param {(Buffer | String)?} [options.icon] - The icon for the role (buffer, or full data url) (requires the `ROLE_ICONS` feature).
     * @param {Boolean} [options.mentionable] - If the role should be mentionable.
     * @param {String} [options.name] - The name of the role.
     * @param {String} [options.permissions] - The permissions of the role.
     * @param {String} [options.reason] - The reason for creating the role.
     * @param {String} [options.unicodeEmoji] - The unicode emoji for the role (requires the `ROLE_ICONS` feature).
     * @returns
     */
    createRole(options?: CreateRoleOptions): Promise<Role>;
    /**
     * Create a scheduled event in this guild.
     *
     * @param {Object} options
     * @param {String} [options.channelID] - The ID of the stage channel the event is taking place in. Optional if `entityType` is `EXTERNAL`.
     * @param {String} [options.description] - The description of the event.
     * @param {Object} [options.entityMetadata]
     * @param {String} [options.entityMetadata.location] - The location of the event. Required if `entityType` is `EXTERNAL`.
     * @param {ScheduledEventEntityTypes} options.entityType - The type of the event.
     * @param {(Buffer | String)} [options.image] - The cover image of the event.
     * @param {String} options.name - The name of the scheduled event.
     * @param {ScheduledEventPrivacyLevels} options.privacyLevel - The privacy level of the event.
     * @param {String} [options.reason] - The reason for creating the scheduled event.
     * @param {String} [options.scheduledEndTime] - The time the event ends. ISO8601 Timestamp. Required if `entityType` is `EXTERNAL`.
     * @param {String} options.scheduledStartTime - The time the event starts. ISO8601 Timestamp.
     * @returns {Promise<ScheduledEvent>}
     */
    createScheduledEvent(options: CreateScheduledEventOptions): Promise<ScheduledEvent>;
    /**
     * Create a guild template.
     *
     * @param {Object} options
     * @param {String} [options.description] - The description of the template.
     * @param {String} options.name - The name of the template.
     * @returns {Promise<GuildTemplate>}
     */
    createTemplate(options: CreateTemplateOptions): Promise<GuildTemplate>;
    /**
     * Delete this guild.
     *
     * @returns {Promise<void>}
     */
    delete(): Promise<void>;
    /**
     * Delete an auto moderation rule in this guild.
     *
     * @param {String} ruleID - The ID of the rule to delete.
     * @param {String} [reason] - The reason for deleting the rule.
     * @returns {Promise<void>}
     */
    deleteAutoModerationRule(ruleID: string, reason?: string): Promise<void>;
    /**
     * Delete an emoji in this guild.
     *
     * @param {String} emojiID - The ID of the emoji.
     * @param {String} [reason] - The reason for deleting the emoji.
     * @returns {Promise<void>}
     */
    deleteEmoji(emojiID: string, reason?: string): Promise<void>;
    /**
     * Delete an integration.
     *
     * @param {String} integrationID - The ID of the integration.
     * @param {String} [reason] - The reason for deleting the integration.
     * @returns {Promise<void>}
     */
    deleteIntegration(integrationID: string, reason?: string): Promise<void>;
    /**
     * Delete a role.
     *
     * @param {String} roleID - The ID of the role to delete.
     * @param {String} [reason] - The reason for deleting the role.
     * @returns {Promise<void>}
     */
    deleteRole(roleID: string, reason?: string): Promise<void>;
    /**
     * Delete a scheduled event.
     *
     * @param {String} eventID - The ID of the scheduled event.
     * @param {String} reason - The reason for deleting the scheduled event. Discord's docs do not explicitly state a reason can be provided, so it may not be used.
     * @returns {Promise<void>}
     */
    deleteScheduledEvent(eventID: string, reason?: string): Promise<void>;
    /**
     * Delete a template.
     *
     * @param {String} code - The code of the template.
     * @returns {Promise<void>}
     */
    deleteTemplate(code: string): Promise<void>;
    /**
     * Edit this guild.
     *
     * @param {Object} options
     * @param {String?} [options.afkChannelID] - The ID of the AFK voice channel.
     * @param {Number} [options.afkTimeout] - The AFK timeout in seconds.
     * @param {(Buffer | String)?} [options.banner] - The banner of the guild.
     * @param {DefaultMessageNotificationLevels} [options.defaultMessageNotifications] - The default message notification level.
     * @param {String?} [options.description] - The description of the guild.
     * @param {ExplicitContentFilterLevels} [options.explicitContentFilter] - The explicit content filter level.
     * @param {String?} [options.icon] - The icon of the guild.
     * @param {String} [options.name] - The name of the guild.
     * @param {String} [options.ownerID] - The ID of the member to transfer guild ownership to.
     * @param {String?} [options.preferredLocale] - The preferred locale of the guild.
     * @param {Boolean} [options.premiumProgressBarEnabled] - Whether the premium progress bar is enabled.
     * @param {String?} [options.publicUpdatesChannelID] - The ID of the public updates channel.
     * @param {String} [options.reason] - The reason for editing the guild.
     * @param {String?} [options.region] - The region of the guild.
     * @param {String?} [options.rulesChannelID] - The ID of the rules channel.
     * @param {(Buffer | String)?} [options.splash] - The splash of the guild.
     * @param {Number} [options.systemChannelFlags] - The system channel flags.
     * @param {String?} [options.systemChannelID] - The ID of the system channel.
     * @param {VerificationLevels} [options.verificationLevel] - The verification level of the guild.
     * @returns {Promise<Guild>}
     */
    edit(options: EditGuildOptions): Promise<Guild>;
    /**
     * Edit an existing auto moderation rule in this guild.
     *
     * @param {String} ruleID - The ID of the rule to edit.
     * @param {Object} options
     * @param {Object[]} [options.actions] - The actions to take.
     * @param {Object} options.actions[].metadata - The metadata for the action.
     * @param {String} [options.actions[].metadata.channelID] - The ID of the channel to send the message to. (`SEND_ALERT_MESSAGE`)
     * @param {Number} [options.actions[].metadata.durationSeconds] - The duration of the timeout in seconds. (`TIMEOUT`)
     * @param {AutoModerationActionTypes} options.actions[].type - The type of action to take.
     * @param {AutoModerationEventTypes} options.eventType - The event type to trigger on.
     * @param {String[]} [options.exemptChannels] - The channels to exempt from the rule.
     * @param {String[]} [options.exemptRoles] - The roles to exempt from the rule.
     * @param {String} [options.reason] - The reason for editing the rule.
     * @param {Object} [options.triggerMetadata] - The metadata to use for the trigger.
     * @param {String} [options.triggerMetadata.allowList] - The keywords to allow. (`KEYWORD_PRESET`)
     * @param {String[]} [options.triggerMetadata.keywordFilter] - The keywords to filter. (`KEYWORD`)
     * @param {Number} [options.triggerMetadata.mentionTotalLimit] - The maximum number of mentions to allow. (`MENTION_SPAM`)
     * @param {AutoModerationKeywordPresetTypes[]} [options.triggerMetadata.presets] - The presets to use. (`KEYWORD_PRESET`)
     * @returns {Promise<AutoModerationRule>}
     */
    editAutoModerationRule(ruleID: string, options: EditAutoModerationRuleOptions): Promise<AutoModerationRule | undefined>;
    /**
     * Edit the positions of channels in this guild.
     *
     * @param {Object[]} options - The channels to move. Unedited channels do not need to be specifed.
     * @param {String} options[].id - The ID of the channel to move.
     * @param {Boolean} [options[].lockPermissions] - If the permissions should be synced (if moving to a new category).
     * @param {String} [options[].parentID] - The ID of the new parent category.
     * @param {Number} [options[].position] - The position to move the channel to.
     */
    editChannelPositions(options: Array<ModifyChannelPositionsEntry>): Promise<void>;
    /**
     * Modify the current member in this guild.
     *
     * @param {Object} options
     * @param {String?} [options.nick] - The new nickname for the member.
     * @param {String} [options.reason] - The reason updating the member.
     * @returns {Promise<Member>}
     */
    editCurrentMember(options: EditCurrentMemberOptions): Promise<Member>;
    /**
     * Edit the current member's voice state in this guild. `channelID` is required, and the current member must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-current-user-voice-state-caveats) for more information.
     *
     * @param {Object} options
     * @param {String} options.channelID - The ID of the stage channel the member is in.
     * @param {String} [options.requestToSpeakTimestamp] - The timestamp of when the member should be able to speak.
     * @param {Boolean} [options.suppress] - If the user should be suppressed.
     * @returns {Promise<void>}
     */
    editCurrentUserVoiceState(options: EditCurrentUserVoiceStateOptions): Promise<void>;
    /**
     * Edit an existing emoji in this guild.
     *
     * @param {Object} options
     * @param {String} [options.name] - The name of the emoji.
     * @param {String} [options.reason] - The reason for creating the emoji.
     * @param {String[]} [options.roles] - The roles to restrict the emoji to.
     * @returns {Promise<GuildEmoji>}
     */
    editEmoji(emojiID: string, options: EditEmojiOptions): Promise<{
        user: User | undefined;
        name: string;
        id: string;
        roles: string[];
        managed: boolean;
        animated: boolean;
        available: boolean;
        require_colons: boolean;
    }>;
    /**
     * Edit the [mfa level](https://discord.com/developers/docs/resources/guild#guild-object-mfa-level) of this guild. This can only be used by the guild owner.
     *
     * @param {MFALevels} level - The new MFA level.
     * @returns {Promise<MFALevels>}
     */
    editMFALevel(level: MFALevels): Promise<MFALevels>;
    /**
     * Edit a member of this guild.
     *
     * @param {String} memberID - The ID of the member.
     * @param {Object} options
     * @param {String?} [options.channelID] - The ID of the channel to move the member to. `null` to disconnect.
     * @param {String?} [options.communicationDisabledUntil] - An ISO8601 timestamp to disable communication until. `null` to reset.
     * @param {Boolean} [options.deaf] - If the member should be deafened.
     * @param {Boolean} [options.mute] - If the member should be muted.
     * @param {String} [options.nick] - The new nickname of the member. `null` to reset.
     * @param {String} [options.reason] - The reason for editing the member.
     * @param {String[]} [options.roles] - The new roles of the member.
     * @returns {Promise<Member>}
     */
    editMember(memberID: string, options: EditMemberOptions): Promise<Member>;
    /**
     * Edit an existing role.
     *
     * @param {Object} options
     * @param {Number} [options.color] - The color of the role.
     * @param {Boolean} [options.hoist] - If the role should be hoisted.
     * @param {(Buffer | String)?} [options.icon] - The icon for the role (buffer, or full data url) (requires the `ROLE_ICONS` feature).
     * @param {Boolean} [options.mentionable] - If the role should be mentionable.
     * @param {String} [options.name] - The name of the role.
     * @param {String} [options.permissions] - The permissions of the role.
     * @param {String} [options.reason] - The reason for creating the role.
     * @param {String} [options.unicodeEmoji] - The unicode emoji for the role (requires the `ROLE_ICONS` feature).
     * @returns
     */
    editRole(roleID: string, options: EditRoleOptions): Promise<Role>;
    /**
     * Edit the position of roles in this guild.
     *
     * @param {Object[]} options
     * @param {String} options[].id - The ID of the role to move.
     * @param {Number?} [options[].position] - The position to move the role to.
     * @param {String} [reason] - The reason for moving the roles.
     * @returns {Promise<Role[]>}
     */
    editRolePositions(options: Array<EditRolePositionsEntry>, reason?: string): Promise<Role[]>;
    /**
     * Edit an existing scheduled event in this guild.
     *
     * @param {Object} options
     * @param {?String} [options.channelID] - The ID of the stage channel the event is taking place in. Required to be `null` if changing `entityType` to `EXTERNAL`.
     * @param {String} [options.description] - The description of the event.
     * @param {Object} [options.entityMetadata]
     * @param {String} [options.entityMetadata.location] - The location of the event. Required if changing `entityType` to `EXTERNAL`.
     * @param {ScheduledEventEntityTypes} options.entityType - The type of the event.
     * @param {(Buffer | String)} [options.image] - The cover image of the event.
     * @param {String} options.name - The name of the scheduled event.
     * @param {ScheduledEventPrivacyLevels} options.privacyLevel - The privacy level of the event.
     * @param {String} [options.reason] - The reason for creating the scheduled event.
     * @param {String} [options.scheduledEndTime] - The time the event ends. ISO8601 Timestamp. Required if changing `entityType` to `EXTERNAL`.
     * @param {String} options.scheduledStartTime - The time the event starts. ISO8601 Timestamp.
     * @param {ScheduledEventStatuses} [options.status] - The status of the event.
     * @returns {Promise<ScheduledEvent>}
     */
    editScheduledEvent(options: EditScheduledEventOptions): Promise<ScheduledEvent>;
    /**
     * Edit a template.
     *
     * @param {String} code - The code of the template.
     * @param {Object} options
     * @param {String} [options.description] - The description of the template.
     * @param {String} [options.name] - The name of the template.
     * @returns {Promise<GuildTemplate>}
     */
    editTemplate(code: string, options: EditGuildTemplateOptions): Promise<GuildTemplate>;
    /**
     * Edit a guild member's voice state. `channelID` is required, and the user must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-user-voice-state) for more information.
     *
     * @param {String} memberID - The ID of the member.
     * @param {Object} options
     * @param {String} options.channelID - The ID of the stage channel the member is in.
     * @param {Boolean} [options.suppress] - If the user should be suppressed.
     * @returns {Promise<void>}
     */
    editUserVoiceState(memberID: string, options: EditUserVoiceStateOptions): Promise<void>;
    /**
     * Edit the welcome screen in this guild.
     *
     * @param {String} options
     * @param {String} [options.description] - The description of the welcome screen.
     * @param {Boolean} [options.enabled] - Whether the welcome screen is enabled.
     * @param {Object[]} [options.welcomeChannels] - The welcome channels of the guild.
     * @param {String} options.welcomeChannels[].channelID - The ID of the welcome channel.
     * @param {String} options.welcomeChannels[].description - The description of the welcome channel.
     * @param {String} options.welcomeChannels[].emojiID - The ID of the emoji to use on the welcome channel.
     * @param {String} options.welcomeChannels[].emojiName - The name (or unicode characters) of the emoji to use on the welcome channel.
     * @returns {Promise<WelcomeScreen>}
     */
    editWelcomeScreen(options: EditWelcomeScreenOptions): Promise<WelcomeScreen>;
    /**
     * Edit the widget of this guild.
     *
     * @param {Object} options
     * @param {String} [options.channelID] - The ID of the channel the widget should lead to.
     * @param {Boolean} [options.enabled] - If the widget is enabled.
     * @returns {Promise<Widget>}
     */
    editWidget(options: WidgetSettings): Promise<Widget>;
    /**
     * Request members from this guild.
     *
     * @param {Object} options
     * @param {Number} [options.limit] - The maximum number of members to request.
     * @param {Boolean} [options.presences=false] - If presences should be requested. Requires the `GUILD_PRESENCES` intent.
     * @param {String} [options.query] - If provided, only members with a username that starts with this string will be returned. If empty or not provided, requires the `GUILD_MEMBERS` intent.
     * @param {Number} [options.timeout=client.rest.options.requestTimeout] - The maximum amount of time in milliseconds to wait.
     * @param {String[]} [options.userIDs] - The IDs of up to 100 users to specifically request.
     * @returns {Promise<Member[]>}
     */
    fetchMembers(options?: RequestGuildMembersOptions): Promise<Member[]>;
    /**
     * Get the active threads in this guild.
     *
     * @returns {Promise<GetActiveThreadsResponse>}
     */
    getActiveThreads(): Promise<GetActiveThreadsResponse>;
    /**
     * Get this guild's audit log.
     *
     * Note: everything under the `entries` key is raw from Discord. See [their documentation](https://discord.com/developers/docs/resources/audit-log#audit-logs) for structure and other information. (`audit_log_entries`)
     *
     * @param {Object} [options]
     * @param {AuditLogActionTypes} [options.actionType] - The action type to filter by.
     * @param {Number} [options.before] - The ID of the entry to get entries before.
     * @param {Number} [options.limit] - The maximum number of entries to get.
     * @param {String} [options.userID] - The ID of the user to filter by.
     * @returns {Promise<AuditLog>}
     */
    getAuditLog(options?: GetAuditLogOptions): Promise<AuditLog>;
    /**
     * Get an auto moderation rule for this guild.
     *
     * @param {String} ruleID - The ID of the rule to get.
     * @returns {Promise<AutoModerationRule>}
     */
    getAutoModerationRule(ruleID: string): Promise<AutoModerationRule>;
    /**
     * Get the auto moderation rules for this guild.
     *
     * @returns {Promise<AutoModerationRule[]>}
     */
    getAutoModerationRules(): Promise<AutoModerationRule[]>;
    /**
     * Get a ban in this guild.
     *
     * @param {String} userID - The ID of the user to get the ban of.
     * @returns {Promise<Ban>}
     */
    getBan(userID: string): Promise<Ban>;
    /**
     * Get the bans in this guild.
     *
     * @param {Object} options
     * @param {String} [options.after] - The ID of the ban to get bans after.
     * @param {String} [options.before] - The ID of the ban to get bans before.
     * @param {Number} [options.limit] - The maximum number of bans to get.
     * @returns {Promise<Ban[]>}
     */
    getBans(options?: GetBansOptions): Promise<Ban[]>;
    /**
     * Get the channels in a guild. Does not include threads. Only use this if you need to. See the `channels` collection.
     *
     * @returns {Promise<AnyGuildChannelWithoutThreads[]>}
     */
    getChannels(): Promise<AnyGuildChannelWithoutThreads[]>;
    /**
     * Get an emoji in this guild.
     *
     * @param {String} emojiID - The ID of the emoji to get.
     * @returns {Promise<GuildEmoji>}
     */
    getEmoji(emojiID: string): Promise<GuildEmoji>;
    /**
     * Get the emojis in this guild.
     *
     * @returns {Promise<GuildEmoji[]>}
     */
    getEmojis(): Promise<GuildEmoji[]>;
    /**
     * Get the integrations in this guild.
     *
     * @returns {Promise<Integration[]>}
     */
    getIntegrations(): Promise<Integration[]>;
    /**
     * Get the invites of this guild.
     *
     * @returns {Promise<Invite[]>} - An array of invites with metadata.
     */
    getInvites(): Promise<Invite<"withMetadata", import("../types/channels").InviteChannel>[]>;
    /**
     * Get a member of this guild.
     *
     * @param {String} memberID - The ID of the member.
     * @returns {Promise<Member>}
     */
    getMember(memberID: string): Promise<Member>;
    /**
     * Get this guild's members. This requires the `GUILD_MEMBERS` intent.
     *
     * @param {Object} [options]
     * @param {String} [options.after] - The last id on the previous page, for pagination.
     * @param {Number} [options.limit] - The maximum number of members to get.
     * @returns {Promise<Member[]>}
     */
    getMembers(options?: GetMembersOptions): Promise<Member[]>;
    /**
     * Get a preview of this guild.
     *
     * @returns {Promise<GuildPreview>}
     */
    getPreview(): Promise<GuildPreview>;
    /**
     * Get the prune count of this guild.
     *
     * @param {Object} [options]
     * @param {Number} [options.days] - The number of days to consider inactivity for.
     * @param {String[]} [options.includeRoles] - The roles to include.
     * @returns {Promise<Number>}
     */
    getPruneCount(options?: GetPruneCountOptions): Promise<number>;
    /**
     * Get the roles in this guild. Only use this if you need to. See the `roles` collection.
     *
     * @returns {Promise<Role[]>}
     */
    getRoles(): Promise<Role[]>;
    /**
     * Get a scheduled event.
     *
     * @param {String} eventID - The ID of the scheduled event to get.
     * @param {Number} [withUserCount] - If the number of users subscribed to the event should be included.
     * @returns {Promise<ScheduledEvent>}
     */
    getScheduledEvent(eventID: string, withUserCount?: number): Promise<ScheduledEvent>;
    /**
     * Get the users subscribed to a scheduled event.
     *
     * @param {String} eventID
     * @param {Object} options
     * @param {String} [options.after] - The ID of the entry to get entries after.
     * @param {String} [options.before] - The ID of the entry to get entries before.
     * @param {Number} [options.limit] - The maximum number of entries to get.
     * @param {Boolean} [options.withMember] - If the member object should be included.
     * @returns {Promise<ScheduledEventUser[]>}
     */
    getScheduledEventUsers(eventID: string, options?: GetScheduledEventUsersOptions): Promise<ScheduledEventUser[]>;
    /**
     * Get this guild's scheduled events
     *
     * @param {Number} [withUserCount] - If the number of users subscribed to the event should be included.
     * @returns {Promise<ScheduledEvent[]>}
     */
    getScheduledEvents(withUserCount?: number): Promise<ScheduledEvent[]>;
    /**
     * Get this guild's templates.
     *
     * @returns {Promise<GuildTemplate[]>}
     */
    getTemplates(): Promise<GuildTemplate[]>;
    /**
     * Get the vanity url of this guild.
     *
     * @returns {Promise<GetVanityURLResponse>}
     */
    getVanityURL(): Promise<GetVanityURLResponse>;
    /**
     * Get the list of usable voice regions for this guild. This will return VIP servers when the guild is VIP-enabled.
     *
     * @returns {Promise<VoiceRegion[]>}
     */
    getVoiceRegions(): Promise<VoiceRegion[]>;
    /**
     * Get the welcome screen for this guild.
     *
     * @returns {Promise<WelcomeScreen>}
     */
    getWelcomeScreen(): Promise<WelcomeScreen>;
    /**
     * Get the widget of this guild.
     *
     * @returns {Promise<Widget>}
     */
    getWidget(): Promise<Widget>;
    /**
     * Get the widget image of this guild.
     *
     * @param {WidgetImageStyle} [style=shield] - The style of the image.
     * @returns {Promise<Buffer>}
     */
    getWidgetImage(style?: WidgetImageStyle): Promise<Buffer>;
    /**
     * Get the raw JSON widget of this guild.
     *
     * @returns {Promise<RawWidget>}
     */
    getWidgetJSON(): Promise<RawWidget>;
    /**
     * Get this guild's widget settings.
     *
     * @returns {Promise<WidgetSettings>}
     */
    getWidgetSettings(): Promise<WidgetSettings>;
    /**
     * The url of this guild's icon.
     *
     * @param {ImageFormat} format - The format the url should be.
     * @param {Number} size - The dimensions of the image.
     * @returns {(String | null)}
     */
    iconURL(format?: ImageFormat, size?: number): string | null;
    /**
     * Remove a ban.
     *
     * @param {string} userID - The ID of the user to remove the ban from.
     * @param {String} [reason] - The reason for removing the ban.
     */
    removeBan(userID: string, reason?: string): Promise<void>;
    /**
     * Remove a member from this guild.
     *
     * @param {String} memberID - The ID of the user to remove.
     * @param {String} reason - The reason for the removal.
     * @returns {Promise<void>}
     */
    removeMember(memberID: string, reason?: string): Promise<void>;
    /**
     * remove a role from a member.
     *
     * @param {String} memberID - The ID of the member.
     * @param {String} roleID - The ID of the role to remove.
     * @param {String} [reason] - The reason for removing the role.
     * @returns {Promise<void>}
     */
    removeMemberRole(memberID: string, roleID: string, reason?: string): Promise<void>;
    /**
     * Search the username & nicknames of members in this guild.
     *
     * @param {Object} options
     * @param {Number} [options.limit] - The maximum number of entries to get.
     * @param {String} options.query - The query to search for.
     * @returns {Promise<Member[]>}
     */
    searchMembers(options: SearchMembersOptions): Promise<Member[]>;
    /**
     * Sync a guild template.
     *
     * @param {String} code - The code of the template to sync.
     * @returns {Promise<GuildTemplate>}
     */
    syncTemplate(code: string): Promise<GuildTemplate>;
    toJSON(): JSONGuild;
}
