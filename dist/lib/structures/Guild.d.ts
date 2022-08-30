/// <reference types="node" />
import Role from "./Role";
import Base from "./Base";
import Member from "./Member";
import type GuildScheduledEvent from "./GuildScheduledEvent";
import type User from "./User";
import type VoiceChannel from "./VoiceChannel";
import type ClientApplication from "./ClientApplication";
import type TextChannel from "./TextChannel";
import type CategoryChannel from "./CategoryChannel";
import Integration from "./Integration";
import AutoModerationRule from "./AutoModerationRule";
import Permission from "./Permission";
import VoiceState from "./VoiceState";
import StageInstance from "./StageInstance";
import type { DefaultMessageNotificationLevels, ExplicitContentFilterLevels, GuildFeature, GuildNSFWLevels, ImageFormat, MFALevels, PremiumTiers, VerificationLevels, GuildChannelTypesWithoutThreads } from "../Constants";
import type Client from "../Client";
import Collection from "../util/Collection";
import type { AnyGuildChannel, AnyGuildChannelWithoutThreads, AnyGuildTextChannel, AnyThreadChannel, RawGuildChannel, RawThreadChannel } from "../types/channels";
import type { AddMemberOptions, BeginPruneOptions, CreateBanOptions, CreateChannelOptions, CreateEmojiOptions, CreateRoleOptions, EditCurrentMemberOptions, EditCurrentUserVoiceStateOptions, EditEmojiOptions, EditGuildOptions, EditMemberOptions, EditRoleOptions, EditRolePositionsEntry, EditUserVoiceStateOptions, EditWelcomeScreenOptions, GetBansOptions, GetMembersOptions, GetPruneCountOptions, GuildEmoji, ModifyChannelPositionsEntry, RawGuild, RawMember, RawRole, SearchMembersOptions, Sticker, WelcomeScreen, WidgetImageStyle, WidgetSettings, RawIntegration } from "../types/guilds";
import type { CreateScheduledEventOptions, EditScheduledEventOptions, GetScheduledEventUsersOptions, RawScheduledEvent } from "../types/scheduled-events";
import type { CreateAutoModerationRuleOptions, EditAutoModerationRuleOptions, RawAutoModerationRule } from "../types/auto-moderation";
import type { GetAuditLogOptions } from "../types/audit-log";
import type { CreateTemplateOptions, EditGuildTemplateOptions } from "../types/guild-template";
import type { Uncached } from "../types/shared";
import type { RawVoiceState } from "../types/voice";
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
    scheduledEvents: Collection<string, RawScheduledEvent, GuildScheduledEvent>;
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
     * @param userID - The ID of the user to add.
     * @param options - The options for adding the member.
     */
    addMember(userID: string, options: AddMemberOptions): Promise<void | Member>;
    /**
     * Add a role to a member.
     * @param memberID - The ID of the member.
     * @param roleID - The ID of the role to add.
     * @param reason - The reason for adding the role.
     */
    addMemberRole(memberID: string, roleID: string, reason?: string): Promise<void>;
    /**
     * The url of this guild's banner.
     * @param format - The format the url should be.
     * @param size - The dimensions of the image.
     */
    bannerURL(format?: ImageFormat, size?: number): string | null;
    /**
     * Begine a prune.
     * @param options - The options for the prune.
     */
    beginPrune(options?: BeginPruneOptions): Promise<number | null>;
    /**
     * Create an auto moderation rule for this guild.
     * @param options - The options for the rule.
     */
    createAutoModerationRule(options: CreateAutoModerationRuleOptions): Promise<AutoModerationRule | undefined>;
    /**
     * Create a bon for a user.
     * @param userID - The ID of the user.
     * @param options - The options for creating the bon.
     */
    createBan(userID: string, options?: CreateBanOptions): Promise<void>;
    /**
     * Create a channel in this guild.
     * @param options - The options for creating the channel.
     */
    createChannel<T extends GuildChannelTypesWithoutThreads>(type: T, options: Omit<CreateChannelOptions, "type">): Promise<import("../types/guilds").CreateChannelReturn<T>>;
    /**
     * Create an emoji in this guild.
     * @param options - The options for creating the emoji.
     */
    createEmoji(options: CreateEmojiOptions): Promise<GuildEmoji>;
    /**
     * Create a role.
     * @param options - The options for creating the role.
     */
    createRole(options?: CreateRoleOptions): Promise<Role>;
    /**
     * Create a scheduled event in this guild.
     * @param options - The options for creating the scheduled event.
     */
    createScheduledEvent(options: CreateScheduledEventOptions): Promise<GuildScheduledEvent>;
    /**
     * Create a guild template.
     * @param options - The options for creating the template.
     */
    createTemplate(options: CreateTemplateOptions): Promise<import("./GuildTemplate").default>;
    /**
     * Delete this guild.
     */
    delete(): Promise<void>;
    /**
     * Delete an auto moderation rule in this guild.
     * @param ruleID - The ID of the rule to delete.
     * @param reason - The reason for deleting the rule.
     */
    deleteAutoModerationRule(ruleID: string, reason?: string): Promise<void>;
    /**
     * Delete an emoji in this guild.
     * @param emojiID - The ID of the emoji.
     * @param reason - The reason for deleting the emoji.
     */
    deleteEmoji(emojiID: string, reason?: string): Promise<void>;
    /**
     * Delete an integration.
     * @param integrationID - The ID of the integration.
     * @param reason - The reason for deleting the integration.
     */
    deleteIntegration(integrationID: string, reason?: string): Promise<void>;
    /**
     * Delete a role.
     * @param roleID - The ID of the role to delete.
     * @param reason - The reason for deleting the role.
     */
    deleteRole(roleID: string, reason?: string): Promise<void>;
    /**
     * Delete a scheduled event.
     * @param eventID - The ID of the scheduled event.
     * @param reason - The reason for deleting the scheduled event. Discord's docs do not explicitly state a reason can be provided, so it may not be used.
     */
    deleteScheduledEvent(eventID: string, reason?: string): Promise<void>;
    /**
     * Delete a template.
     * @param code - The code of the template.
     */
    deleteTemplate(code: string): Promise<void>;
    /**
     * Edit this guild.
     * @param options - The options for editing the guild.
     */
    edit(options: EditGuildOptions): Promise<Guild>;
    /**
     * Edit an existing auto moderation rule in this guild.
     * @param ruleID - The ID of the rule to edit.
     * @param options - The options for editing the rule.
     */
    editAutoModerationRule(ruleID: string, options: EditAutoModerationRuleOptions): Promise<AutoModerationRule | undefined>;
    /**
     * Edit the positions of channels in this guild.
     * @param options - The channels to move. Unedited channels do not need to be specifed.
     */
    editChannelPositions(options: Array<ModifyChannelPositionsEntry>): Promise<void>;
    /**
     * Modify the current member in this guild.
     * @param options - The options for editing the member.
     */
    editCurrentMember(options: EditCurrentMemberOptions): Promise<Member>;
    /**
     * Edit the current member's voice state in this guild. `channelID` is required, and the current member must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-current-user-voice-state-caveats) for more information.
     * @param options - The options for editing the voice state.
     */
    editCurrentUserVoiceState(options: EditCurrentUserVoiceStateOptions): Promise<void>;
    /**
     * Edit an existing emoji in this guild.
     * @param options - The options for editing the emoji.
     */
    editEmoji(emojiID: string, options: EditEmojiOptions): Promise<{
        user: User | undefined;
        name: string;
        roles: string[];
        managed: boolean;
        animated: boolean;
        available: boolean;
        require_colons: boolean;
        id: string;
    }>;
    /**
     * Edit the [mfa level](https://discord.com/developers/docs/resources/guild#guild-object-mfa-level) of this guild. This can only be used by the guild owner.
     * @param level - The new MFA level.
     */
    editMFALevel(level: MFALevels): Promise<MFALevels>;
    /**
     * Edit a member of this guild.
     * @param memberID - The ID of the member.
     * @param options - The options for editing the member.
     */
    editMember(memberID: string, options: EditMemberOptions): Promise<Member>;
    /**
     * Edit an existing role.
     * @param options - The options for editing the role.
     */
    editRole(roleID: string, options: EditRoleOptions): Promise<Role>;
    /**
     * Edit the position of roles in this guild.
     * @param options - The roles to move.
     */
    editRolePositions(options: Array<EditRolePositionsEntry>, reason?: string): Promise<Role[]>;
    /**
     * Edit an existing scheduled event in this guild.
     * @param options - The options for editing the scheduled event.
     */
    editScheduledEvent(options: EditScheduledEventOptions): Promise<GuildScheduledEvent>;
    /**
     * Edit a template.
     * @param code - The code of the template.
     * @param options - The options for editing the template.
     */
    editTemplate(code: string, options: EditGuildTemplateOptions): Promise<import("./GuildTemplate").default>;
    /**
     * Edit a guild member's voice state. `channelID` is required, and the user must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-user-voice-state) for more information.
     * @param memberID - The ID of the member.
     * @param options - The options for editing the voice state.
     */
    editUserVoiceState(memberID: string, options: EditUserVoiceStateOptions): Promise<void>;
    /**
     * Edit the welcome screen in this guild.
     * @param options - The options for editing the welcome screen.
     */
    editWelcomeScreen(options: EditWelcomeScreenOptions): Promise<WelcomeScreen>;
    /**
     * Edit the widget of this guild.
     * @param options - The options for editing the widget.
     */
    editWidget(options: WidgetSettings): Promise<import("../types/guilds").Widget>;
    /**
     * Request members from this guild.
     * @param options - The options for fetching the members.
     */
    fetchMembers(options?: RequestGuildMembersOptions): Promise<Member[]>;
    /**
     * Get the active threads in this guild.
     */
    getActiveThreads(): Promise<import("../types/guilds").GetActiveThreadsResponse>;
    /**
     * Get this guild's audit log.
     * @param options - The options for the audit log.
     */
    getAuditLog(options?: GetAuditLogOptions): Promise<import("../types/audit-log").AuditLog>;
    /**
     * Get an auto moderation rule for this guild.
     * @param ruleID - The ID of the rule to get.
     */
    getAutoModerationRule(ruleID: string): Promise<AutoModerationRule>;
    /**
     * Get the auto moderation rules for this guild.
     */
    getAutoModerationRules(): Promise<AutoModerationRule[]>;
    /**
     * Get a ban in this guild.
     * @param userID - The ID of the user to get the ban of.
     */
    getBan(userID: string): Promise<import("../types/guilds").Ban>;
    /**
     * Get the bans in this guild.
     * @param options - The options for getting the bans.
     */
    getBans(options?: GetBansOptions): Promise<import("../types/guilds").Ban[]>;
    /**
     * Get the channels in a guild. Does not include threads. Only use this if you need to. See the `channels` collection.
     */
    getChannels(): Promise<AnyGuildChannelWithoutThreads[]>;
    /**
     * Get an emoji in this guild.
     * @param emojiID - The ID of the emoji to get.
     */
    getEmoji(emojiID: string): Promise<GuildEmoji>;
    /**
     * Get the emojis in this guild.
     */
    getEmojis(): Promise<GuildEmoji[]>;
    /**
     * Get the integrations in this guild.
     */
    getIntegrations(): Promise<Integration[]>;
    /**
     * Get the invites of this guild.
     */
    getInvites(): Promise<import("./Invite").default<"withMetadata", import("../types/channels").InviteChannel>[]>;
    /**
     * Get a member of this guild.
     * @param memberID - The ID of the member.
     */
    getMember(memberID: string): Promise<Member>;
    /**
     * Get this guild's members. This requires the `GUILD_MEMBERS` intent.
     * @param options - The options for getting the members.
     */
    getMembers(options?: GetMembersOptions): Promise<Member[]>;
    /**
     * Get a preview of this guild.
     */
    getPreview(): Promise<import("./GuildPreview").default>;
    /**
     * Get the prune count of this guild.
     * @param options - The options for getting the prune count.
     */
    getPruneCount(options?: GetPruneCountOptions): Promise<number>;
    /**
     * Get the roles in this guild. Only use this if you need to. See the `roles` collection.
     */
    getRoles(): Promise<Role[]>;
    /**
     * Get a scheduled event.
     * @param eventID - The ID of the scheduled event to get.
     * @param withUserCount - If the number of users subscribed to the event should be included.
     */
    getScheduledEvent(eventID: string, withUserCount?: number): Promise<GuildScheduledEvent>;
    /**
     * Get the users subscribed to a scheduled event.
     * @param eventID - The ID of the scheduled event to get the users of.
     * @param options - The options for getting the users.
     */
    getScheduledEventUsers(eventID: string, options?: GetScheduledEventUsersOptions): Promise<import("../types/scheduled-events").ScheduledEventUser[]>;
    /**
     * Get this guild's scheduled events
     * @param withUserCount - If the number of users subscribed to the event should be included.
     */
    getScheduledEvents(withUserCount?: number): Promise<GuildScheduledEvent[]>;
    /**
     * Get this guild's templates.
     */
    getTemplates(): Promise<import("./GuildTemplate").default[]>;
    /**
     * Get the vanity url of this guild.
     */
    getVanityURL(): Promise<import("../types/guilds").GetVanityURLResponse>;
    /**
     * Get the list of usable voice regions for this guild. This will return VIP servers when the guild is VIP-enabled.
     */
    getVoiceRegions(): Promise<import("../types/voice").VoiceRegion[]>;
    /**
     * Get the welcome screen for this guild.
     */
    getWelcomeScreen(): Promise<WelcomeScreen>;
    /**
     * Get the widget of this guild.
     */
    getWidget(): Promise<import("../types/guilds").Widget>;
    /**
     * Get the widget image of this guild.
     * @param style - The style of the image.
     */
    getWidgetImage(style?: WidgetImageStyle): Promise<Buffer>;
    /**
     * Get the raw JSON widget of this guild.
     */
    getWidgetJSON(): Promise<import("../types/guilds").RawWidget>;
    /**
     * Get this guild's widget settings.
     */
    getWidgetSettings(): Promise<WidgetSettings>;
    /**
     * The url of this guild's icon.
     * @param format - The format the url should be.
     * @param size - The dimensions of the image.
     */
    iconURL(format?: ImageFormat, size?: number): string | null;
    /**
     * Leave this guild.
     */
    leave(): Promise<void>;
    /**
     * Get the permissions of a member. If providing an id, the member must be cached.
     * @param member - The member to get the permissions of.
     */
    permissionsOf(member: string | Member): Permission;
    /**
     * Remove a ban.
     * @param userID - The ID of the user to remove the ban from.
     * @param reason - The reason for removing the ban.
     */
    removeBan(userID: string, reason?: string): Promise<void>;
    /**
     * Remove a member from this guild.
     * @param memberID - The ID of the user to remove.
     * @param reason - The reason for the removal.
     */
    removeMember(memberID: string, reason?: string): Promise<void>;
    /**
     * remove a role from a member.
     * @param memberID - The ID of the member.
     * @param roleID - The ID of the role to remove.
     * @param reason - The reason for removing the role.
     */
    removeMemberRole(memberID: string, roleID: string, reason?: string): Promise<void>;
    /**
     * Search the username & nicknames of members in this guild.
     * @param options - The options for the search.
     */
    searchMembers(options: SearchMembersOptions): Promise<Member[]>;
    /**
     * Sync a guild template.
     * @param code - The code of the template to sync.
     */
    syncTemplate(code: string): Promise<import("./GuildTemplate").default>;
    toJSON(): JSONGuild;
}
