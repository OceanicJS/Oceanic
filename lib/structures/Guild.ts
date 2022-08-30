import Role from "./Role";
import Base from "./Base";
import GuildChannel from "./GuildChannel";
import Member from "./Member";
import type GuildScheduledEvent from "./GuildScheduledEvent";
import ThreadChannel from "./ThreadChannel";
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
import Channel from "./Channel";
import type {
    DefaultMessageNotificationLevels,
    ExplicitContentFilterLevels,
    GuildFeature,
    GuildNSFWLevels,
    ImageFormat,
    MFALevels,
    PremiumTiers,
    VerificationLevels
} from "../Constants";
import {
    AuditLogActionTypes,
    AutoModerationActionTypes,
    AutoModerationEventTypes,
    AutoModerationKeywordPresetTypes,
    AutoModerationTriggerTypes,
    GuildChannelTypesWithoutThreads,
    OverwriteTypes,
    GuildScheduledEventEntityTypes,
    GuildScheduledEventPrivacyLevels,
    GuildScheduledEventStatuses,
    ThreadAutoArchiveDuration,
    VideoQualityModes,
    AllPermissions,
    Permissions
} from "../Constants";
import * as Routes from "../util/Routes";
import type Client from "../Client";
import Collection from "../util/Collection";
import type {
    AnyGuildChannel,
    AnyGuildChannelWithoutThreads,
    AnyGuildTextChannel,
    AnyThreadChannel,
    RawGuildChannel,
    RawThreadChannel
} from "../types/channels";
import type {
    AddMemberOptions,
    Ban,
    BeginPruneOptions,
    CreateBanOptions,
    CreateCategoryChannelOptions,
    CreateChannelOptions,
    CreateEmojiOptions,
    CreateAnnouncementChannelOptions,
    CreateRoleOptions,
    CreateStageChannelOptions,
    CreateTextChannelOptions,
    CreateVoiceChannelOptions,
    EditCurrentMemberOptions,
    EditCurrentUserVoiceStateOptions,
    EditEmojiOptions,
    EditGuildOptions,
    EditMemberOptions,
    EditRoleOptions,
    EditRolePositionsEntry,
    EditUserVoiceStateOptions,
    EditWelcomeScreenOptions,
    GetActiveThreadsResponse,
    GetBansOptions,
    GetMembersOptions,
    GetPruneCountOptions,
    GetVanityURLResponse,
    GuildEmoji,
    ModifyChannelPositionsEntry,
    RawGuild,
    RawMember,
    RawRole,
    RawWidget,
    SearchMembersOptions,
    Sticker,
    WelcomeScreen,
    Widget,
    WidgetImageStyle,
    WidgetSettings,
    RawIntegration
} from "../types/guilds";
import type {
    CreateScheduledEventOptions,
    EditScheduledEventOptions,
    GetScheduledEventUsersOptions,
    RawScheduledEvent,
    ScheduledEventUser
} from "../types/scheduled-events";
import type { CreateAutoModerationRuleOptions, EditAutoModerationRuleOptions, RawAutoModerationRule } from "../types/auto-moderation";
import type { GetAuditLogOptions } from "../types/audit-log";
import { AuditLog } from "../types/audit-log";
import type { CreateTemplateOptions, EditGuildTemplateOptions } from "../types/guild-template";
import type { Uncached } from "../types/shared";
import type { RawVoiceState } from "../types/voice";
import { VoiceRegion } from "../types/voice";
import type { RawStageInstance } from "../types/stage-instances";
import type { JSONGuild } from "../types/json";
import type { PresenceUpdate, RequestGuildMembersOptions } from "../types/gateway";

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
    constructor(data: RawGuild, client: Client) {
        super(data.id, client);
        this.autoModerationRules = new Collection(AutoModerationRule, client);
        this.emojis = [];
        this.channels = new Collection(GuildChannel, client) as Collection<string, RawGuildChannel, AnyGuildChannelWithoutThreads>;
        this.features = [];
        this.integrations = new Collection(Integration, client);
        this.memberCount = data.member_count || data.approximate_member_count || 0;
        this.members = new Collection(Member, client);
        this.roles = new Collection(Role, client);
        this.stageInstances = new Collection(StageInstance, client);
        this.threads = new Collection(ThreadChannel, client) as Collection<string, RawThreadChannel, AnyThreadChannel>;
        this.stickers = [];
        this.voiceStates = new Collection(VoiceState, client);
        data.roles.forEach(role => this.roles.update(role, data.id));
        this.update(data);

        if (data.channels) {
            for (const channelData of data.channels) {
                channelData.guild_id = this.id;
                client.channelGuildMap[channelData.id] = this.id;
                this.channels.add(Channel.from<AnyGuildChannelWithoutThreads>(channelData, client)).guild = this;
            }
        }

        if (data.threads) {
            for (const threadData of data.threads) {
                threadData.guild_id = this.id;
                this.threads.add(Channel.from<AnyThreadChannel>(threadData, client)).guild = this;
                client.threadGuildMap[threadData.id] = this.id;
            }
        }

        if (data.members) {
            for (const member of data.members) {
                this.members.update({ ...member, id: member.user!.id }, this.id).guild = this;
            }
        }

        if (data.stage_instances) {
            for (const stageInstance of data.stage_instances) {
                stageInstance.guild_id = this.id;
                this.stageInstances.update(stageInstance).guild = this;
            }
        }

        if (data.presences) {
            for (const presence of data.presences) {
                const member = this.members.get(presence.user.id);
                if (member) {
                    delete (presence as { user?: PresenceUpdate["user"]; }).user;
                    member.presence = presence;
                } else {
                    client.emit("debug", `Rogue presence (user: ${presence.user.id}, guild: ${this.id})`);
                }
            }
        }

        if (data.voice_states) {
            for (const voiceState of data.voice_states) {
                if (!this.members.has(voiceState.user_id) || !voiceState.channel_id) continue;
                voiceState.guild_id = this.id;
                this.voiceStates.update({ ...voiceState, id: voiceState.user_id });
                const channel = this.channels.get(voiceState.channel_id);
                const member = this.members.update({ id: voiceState.user_id, deaf: voiceState.deaf, mute: voiceState.mute }, this.id);
                if (channel && "voiceMembers" in channel) channel.voiceMembers.add(member);
                // @TODO voice
                /* if (client.shards.options.seedVoiceConnections && voiceState.user_id === client.user!.id && !client.voiceConnections.has(this.id)) {
                    process.nextTick(() => client.joinVoiceChannel(voiceState.channel_id!));
                } */
            }
        }
    }

    protected update(data: Partial<RawGuild>) {
        if (data.afk_channel_id !== undefined) this.afkChannel = data.afk_channel_id === null ? null : this._client.getChannel(data.afk_channel_id) || { id: data.afk_channel_id };
        if (data.afk_timeout !== undefined) this.afkTimeout = data.afk_timeout;
        if (data.application_id !== undefined) this.application = data.application_id === null ? null : this._client.application?.id === data.application_id ? this._client.application : { id: data.application_id };
        if (data.approximate_member_count !== undefined) this.approximateMemberCount = data.approximate_member_count;
        if (data.approximate_presence_count !== undefined) this.approximatePresenceCount = data.approximate_presence_count;
        if (data.banner !== undefined) this.banner = data.banner;
        if (data.default_message_notifications !== undefined) this.defaultMessageNotifications = data.default_message_notifications;
        if (data.description !== undefined) this.description = data.description;
        if (data.discovery_splash !== undefined) this.discoverySplash = data.discovery_splash;
        if (data.emojis !== undefined) this.emojis = data.emojis.map(emoji => ({
            ...emoji,
            user: !emoji.user ? undefined : this._client.users.update(emoji.user)
        }));
        if (data.explicit_content_filter !== undefined) this.explicitContentFilter = data.explicit_content_filter;
        if (data.features !== undefined) this.features = data.features;
        if (data.icon !== undefined) this.icon = data.icon;
        if (data.max_members !== undefined) this.maxMembers = data.max_members;
        if (data.max_presences !== undefined) this.maxPresences = data.max_presences;
        if (data.max_video_channel_users !== undefined) this.maxVideoChannelUsers = data.max_video_channel_users;
        if (data.member_count !== undefined) this.memberCount = data.member_count;
        if (data.mfa_level !== undefined) this.mfaLevel = data.mfa_level;
        if (data.name !== undefined) this.name = data.name;
        if (data.nsfw_level !== undefined) this.nsfwLevel = data.nsfw_level;
        if (data.owner !== undefined) this.oauthOwner = data.owner;
        if (data.owner_id !== undefined) this.owner = this._client.users.get(data.owner_id) || { id: data.owner_id };
        if (data.permissions !== undefined) this.permissions = new Permission(data.permissions);
        if (data.preferred_locale !== undefined) this.preferredLocale = data.preferred_locale;
        if (data.premium_progress_bar_enabled !== undefined) this.premiumProgressBarEnabled = data.premium_progress_bar_enabled;
        if (data.premium_subscription_count !== undefined) this.premiumSubscriptionCount = data.premium_subscription_count;
        if (data.premium_tier !== undefined) this.premiumTier = data.premium_tier;
        if (data.public_updates_channel_id !== undefined) this.publicUpdatesChannel = data.public_updates_channel_id === null ? null : this._client.getChannel(data.public_updates_channel_id) || { id: data.public_updates_channel_id };
        if (data.region !== undefined) this.region = data.region;
        if (data.rules_channel_id !== undefined) this.rulesChannel = data.rules_channel_id === null ? null : this._client.getChannel(data.rules_channel_id) || { id: data.rules_channel_id };
        if (data.splash !== undefined) this.splash = data.splash;
        if (data.stickers !== undefined) this.stickers = data.stickers;
        if (data.system_channel_flags !== undefined) this.systemChannelFlags = data.system_channel_flags;
        if (data.system_channel_id !== undefined) this.systemChannel = data.system_channel_id === null ? null : this._client.getChannel(data.system_channel_id) || { id: data.system_channel_id };
        if (data.vanity_url_code !== undefined) this.vanityURLCode = data.vanity_url_code;
        if (data.verification_level !== undefined) this.verificationLevel = data.verification_level;
        if (data.welcome_screen !== undefined) this.welcomeScreen = {
            description:     data.welcome_screen.description,
            welcomeChannels: data.welcome_screen.welcome_channels.map(channel => ({
                channelID:   channel.channel_id,
                description: channel.description,
                emojiID:     channel.emoji_id,
                emojiName:   channel.emoji_name
            }))
        };
        if (data.widget_channel_id !== undefined) this.widgetChannel = data.widget_channel_id === null ? null : this._client.getChannel(data.widget_channel_id) || { id: data.widget_channel_id };
        if (data.widget_enabled !== undefined) this.widgetEnabled = data.widget_enabled;
    }

    /** The shard this guild is on. Gateway only. */
    get shard() { return this._client.shards.get(this._client.guildShardMap[this.id])!; }

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
    async addMember(userID: string, options: AddMemberOptions) {
        return this._client.rest.guilds.addMember(this.id, userID, options);
    }

    /**
     * Add a role to a member.
     *
     * @param {String} memberID - The ID of the member.
     * @param {String} roleID - The ID of the role to add.
     * @param {String} [reason] - The reason for adding the role.
     * @returns {Promise<void>}
     */
    async addMemberRole(memberID: string, roleID: string, reason?: string) {
        return this._client.rest.guilds.addMemberRole(this.id, memberID, roleID, reason);
    }

    /**
     * The url of this guild's banner.
     *
     * @param {ImageFormat} format - The format the url should be.
     * @param {Number} size - The dimensions of the image.
     * @returns {(String | null)}
     */
    bannerURL(format?: ImageFormat, size?: number) {
        return this.banner === null ? null : this._client.util.formatImage(Routes.BANNER(this.id, this.banner), format, size);
    }

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
    async beginPrune(options?: BeginPruneOptions) {
        return this._client.rest.guilds.beginPrune(this.id, options);
    }

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
    async createAutoModerationRule(options: CreateAutoModerationRuleOptions) {
        return this._client.rest.guilds.createAutoModerationRule(this.id, options);
    }

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
    async createBan(userID: string, options?: CreateBanOptions) {
        return this._client.rest.guilds.createBan(this.id, userID, options);
    }

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
    async createChannel(options: CreateTextChannelOptions): Promise<TextChannel>;
    async createChannel(options: CreateVoiceChannelOptions): Promise<VoiceChannel>;
    async createChannel(options: CreateCategoryChannelOptions): Promise<CategoryChannel>;
    async createChannel(options: CreateAnnouncementChannelOptions): Promise<AnnouncementChannel>;
    async createChannel(options: CreateStageChannelOptions): Promise<StageChannel>;
    async createChannel(options: CreateChannelOptions) {
        return this._client.rest.guilds.createChannel(this.id, options as never) as unknown as AnyGuildChannel;
    }

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
    async createEmoji(options: CreateEmojiOptions) {
        return this._client.rest.guilds.createEmoji(this.id, options);
    }

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
    async createRole(options?: CreateRoleOptions) {
        return this._client.rest.guilds.createRole(this.id, options);
    }

    /**
     * Create a scheduled event in this guild.
     *
     * @param {Object} options
     * @param {String} [options.channelID] - The ID of the stage channel the event is taking place in. Optional if `entityType` is `EXTERNAL`.
     * @param {String} [options.description] - The description of the event.
     * @param {Object} [options.entityMetadata]
     * @param {String} [options.entityMetadata.location] - The location of the event. Required if `entityType` is `EXTERNAL`.
     * @param {GuildScheduledEventEntityTypes} options.entityType - The type of the event.
     * @param {(Buffer | String)} [options.image] - The cover image of the event.
     * @param {String} options.name - The name of the scheduled event.
     * @param {GuildScheduledEventPrivacyLevels} options.privacyLevel - The privacy level of the event.
     * @param {String} [options.reason] - The reason for creating the scheduled event.
     * @param {String} [options.scheduledEndTime] - The time the event ends. ISO8601 Timestamp. Required if `entityType` is `EXTERNAL`.
     * @param {String} options.scheduledStartTime - The time the event starts. ISO8601 Timestamp.
     * @returns {Promise<GuildScheduledEvent>}
     */
    async createScheduledEvent(options: CreateScheduledEventOptions) {
        return this._client.rest.guilds.createScheduledEvent(this.id, options);
    }

    /**
     * Create a guild template.
     *
     * @param {Object} options
     * @param {String} [options.description] - The description of the template.
     * @param {String} options.name - The name of the template.
     * @returns {Promise<GuildTemplate>}
     */
    async createTemplate(options: CreateTemplateOptions) {
        return this._client.rest.guilds.createTemplate(this.id, options);
    }

    /**
     * Delete this guild.
     *
     * @returns {Promise<void>}
     */
    async delete() {
        return this._client.rest.guilds.delete(this.id);
    }

    /**
     * Delete an auto moderation rule in this guild.
     *
     * @param {String} ruleID - The ID of the rule to delete.
     * @param {String} [reason] - The reason for deleting the rule.
     * @returns {Promise<void>}
     */
    async deleteAutoModerationRule(ruleID: string, reason?: string) {
        return this._client.rest.guilds.deleteAutoModerationRule(this.id, ruleID, reason);
    }

    /**
     * Delete an emoji in this guild.
     *
     * @param {String} emojiID - The ID of the emoji.
     * @param {String} [reason] - The reason for deleting the emoji.
     * @returns {Promise<void>}
     */
    async deleteEmoji(emojiID: string, reason?: string) {
        return this._client.rest.guilds.deleteEmoji(this.id, emojiID, reason);
    }

    /**
     * Delete an integration.
     *
     * @param {String} integrationID - The ID of the integration.
     * @param {String} [reason] - The reason for deleting the integration.
     * @returns {Promise<void>}
     */
    async deleteIntegration(integrationID: string, reason?: string) {
        return this._client.rest.guilds.deleteIntegration(this.id, integrationID, reason);
    }

    /**
     * Delete a role.
     *
     * @param {String} roleID - The ID of the role to delete.
     * @param {String} [reason] - The reason for deleting the role.
     * @returns {Promise<void>}
     */
    async deleteRole(roleID: string, reason?: string) {
        return this._client.rest.guilds.deleteRole(this.id, roleID, reason);
    }

    /**
     * Delete a scheduled event.
     *
     * @param {String} eventID - The ID of the scheduled event.
     * @param {String} reason - The reason for deleting the scheduled event. Discord's docs do not explicitly state a reason can be provided, so it may not be used.
     * @returns {Promise<void>}
     */
    async deleteScheduledEvent(eventID: string, reason?: string) {
        return this._client.rest.guilds.deleteScheduledEvent(this.id, eventID, reason);
    }

    /**
     * Delete a template.
     *
     * @param {String} code - The code of the template.
     * @returns {Promise<void>}
     */
    async deleteTemplate(code: string) {
        return this._client.rest.guilds.deleteTemplate(this.id, code);
    }

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
    async edit(options: EditGuildOptions) {
        return this._client.rest.guilds.edit(this.id, options);
    }

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
    async editAutoModerationRule(ruleID: string, options: EditAutoModerationRuleOptions) {
        return this._client.rest.guilds.editAutoModerationRule(this.id, ruleID, options);
    }

    /**
     * Edit the positions of channels in this guild.
     *
     * @param {Object[]} options - The channels to move. Unedited channels do not need to be specifed.
     * @param {String} options[].id - The ID of the channel to move.
     * @param {Boolean} [options[].lockPermissions] - If the permissions should be synced (if moving to a new category).
     * @param {String} [options[].parentID] - The ID of the new parent category.
     * @param {Number} [options[].position] - The position to move the channel to.
     */
    async editChannelPositions(options: Array<ModifyChannelPositionsEntry>) {
        return this._client.rest.guilds.editChannelPositions(this.id, options);
    }

    /**
     * Modify the current member in this guild.
     *
     * @param {Object} options
     * @param {String?} [options.nick] - The new nickname for the member.
     * @param {String} [options.reason] - The reason updating the member.
     * @returns {Promise<Member>}
     */
    async editCurrentMember(options: EditCurrentMemberOptions) {
        return this._client.rest.guilds.editCurrentMember(this.id, options);
    }

    /**
     * Edit the current member's voice state in this guild. `channelID` is required, and the current member must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-current-user-voice-state-caveats) for more information.
     *
     * @param {Object} options
     * @param {String} options.channelID - The ID of the stage channel the member is in.
     * @param {String} [options.requestToSpeakTimestamp] - The timestamp of when the member should be able to speak.
     * @param {Boolean} [options.suppress] - If the user should be suppressed.
     * @returns {Promise<void>}
     */
    async editCurrentUserVoiceState(options: EditCurrentUserVoiceStateOptions) {
        return this._client.rest.guilds.editCurrentUserVoiceState(this.id, options);
    }
    /**
     * Edit an existing emoji in this guild.
     *
     * @param {Object} options
     * @param {String} [options.name] - The name of the emoji.
     * @param {String} [options.reason] - The reason for creating the emoji.
     * @param {String[]} [options.roles] - The roles to restrict the emoji to.
     * @returns {Promise<GuildEmoji>}
     */
    async editEmoji(emojiID: string, options: EditEmojiOptions) {
        return this._client.rest.guilds.editEmoji(this.id, emojiID, options);
    }

    /**
     * Edit the [mfa level](https://discord.com/developers/docs/resources/guild#guild-object-mfa-level) of this guild. This can only be used by the guild owner.
     *
     * @param {MFALevels} level - The new MFA level.
     * @returns {Promise<MFALevels>}
     */
    async editMFALevel(level: MFALevels) {
        return this._client.rest.guilds.editMFALevel(this.id, level);
    }

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
    async editMember(memberID: string, options: EditMemberOptions) {
        return this._client.rest.guilds.editMember(this.id, memberID, options);
    }

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
    async editRole(roleID: string, options: EditRoleOptions) {
        return this._client.rest.guilds.editRole(this.id, roleID, options);
    }

    /**
     * Edit the position of roles in this guild.
     *
     * @param {Object[]} options
     * @param {String} options[].id - The ID of the role to move.
     * @param {Number?} [options[].position] - The position to move the role to.
     * @param {String} [reason] - The reason for moving the roles.
     * @returns {Promise<Role[]>}
     */
    async editRolePositions(options: Array<EditRolePositionsEntry>, reason?: string) {
        return this._client.rest.guilds.editRolePositions(this.id, options, reason);
    }

    /**
     * Edit an existing scheduled event in this guild.
     *
     * @param {Object} options
     * @param {?String} [options.channelID] - The ID of the stage channel the event is taking place in. Required to be `null` if changing `entityType` to `EXTERNAL`.
     * @param {String} [options.description] - The description of the event.
     * @param {Object} [options.entityMetadata]
     * @param {String} [options.entityMetadata.location] - The location of the event. Required if changing `entityType` to `EXTERNAL`.
     * @param {GuildScheduledEventEntityTypes} options.entityType - The type of the event.
     * @param {(Buffer | String)} [options.image] - The cover image of the event.
     * @param {String} options.name - The name of the scheduled event.
     * @param {GuildScheduledEventPrivacyLevels} options.privacyLevel - The privacy level of the event.
     * @param {String} [options.reason] - The reason for creating the scheduled event.
     * @param {String} [options.scheduledEndTime] - The time the event ends. ISO8601 Timestamp. Required if changing `entityType` to `EXTERNAL`.
     * @param {String} options.scheduledStartTime - The time the event starts. ISO8601 Timestamp.
     * @param {GuildScheduledEventStatuses} [options.status] - The status of the event.
     * @returns {Promise<GuildScheduledEvent>}
     */
    async editScheduledEvent(options: EditScheduledEventOptions) {
        return this._client.rest.guilds.editScheduledEvent(this.id, options);
    }

    /**
     * Edit a template.
     *
     * @param {String} code - The code of the template.
     * @param {Object} options
     * @param {String} [options.description] - The description of the template.
     * @param {String} [options.name] - The name of the template.
     * @returns {Promise<GuildTemplate>}
     */
    async editTemplate(code: string, options: EditGuildTemplateOptions) {
        return this._client.rest.guilds.editTemplate(this.id, code, options);
    }

    /**
     * Edit a guild member's voice state. `channelID` is required, and the user must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-user-voice-state) for more information.
     *
     * @param {String} memberID - The ID of the member.
     * @param {Object} options
     * @param {String} options.channelID - The ID of the stage channel the member is in.
     * @param {Boolean} [options.suppress] - If the user should be suppressed.
     * @returns {Promise<void>}
     */
    async editUserVoiceState(memberID: string, options: EditUserVoiceStateOptions) {
        return this._client.rest.guilds.editUserVoiceState(this.id, memberID, options);
    }

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
    async editWelcomeScreen(options: EditWelcomeScreenOptions) {
        return this._client.rest.guilds.editWelcomeScreen(this.id, options);
    }

    /**
     * Edit the widget of this guild.
     *
     * @param {Object} options
     * @param {String} [options.channelID] - The ID of the channel the widget should lead to.
     * @param {Boolean} [options.enabled] - If the widget is enabled.
     * @returns {Promise<Widget>}
     */
    async editWidget(options: WidgetSettings) {
        return this._client.rest.guilds.editWidget(this.id, options);
    }

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
    async fetchMembers(options?: RequestGuildMembersOptions) {
        return this.shard.requestGuildMembers(this.id, options);
    }

    /**
     * Get the active threads in this guild.
     *
     * @returns {Promise<GetActiveThreadsResponse>}
     */
    async getActiveThreads() {
        return this._client.rest.guilds.getActiveThreads(this.id);
    }

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
    async getAuditLog(options?: GetAuditLogOptions) {
        return this._client.rest.guilds.getAuditLog(this.id, options);
    }

    /**
     * Get an auto moderation rule for this guild.
     *
     * @param {String} ruleID - The ID of the rule to get.
     * @returns {Promise<AutoModerationRule>}
     */
    async getAutoModerationRule(ruleID: string) {
        return this._client.rest.guilds.getAutoModerationRule(this.id, ruleID);
    }

    /**
     * Get the auto moderation rules for this guild.
     *
     * @returns {Promise<AutoModerationRule[]>}
     */
    async getAutoModerationRules() {
        return this._client.rest.guilds.getAutoModerationRules(this.id);
    }

    /**
     * Get a ban in this guild.
     *
     * @param {String} userID - The ID of the user to get the ban of.
     * @returns {Promise<Ban>}
     */
    async getBan(userID: string) {
        return this._client.rest.guilds.getBan(this.id, userID);
    }

    /**
     * Get the bans in this guild.
     *
     * @param {Object} options
     * @param {String} [options.after] - The ID of the ban to get bans after.
     * @param {String} [options.before] - The ID of the ban to get bans before.
     * @param {Number} [options.limit] - The maximum number of bans to get.
     * @returns {Promise<Ban[]>}
     */
    async getBans(options?: GetBansOptions) {
        return this._client.rest.guilds.getBans(this.id, options);
    }

    /**
     * Get the channels in a guild. Does not include threads. Only use this if you need to. See the `channels` collection.
     *
     * @returns {Promise<AnyGuildChannelWithoutThreads[]>}
     */
    async getChannels() {
        return this._client.rest.guilds.getChannels(this.id);
    }

    /**
     * Get an emoji in this guild.
     *
     * @param {String} emojiID - The ID of the emoji to get.
     * @returns {Promise<GuildEmoji>}
     */
    async getEmoji(emojiID: string) {
        return this._client.rest.guilds.getEmoji(this.id, emojiID);
    }

    /**
     * Get the emojis in this guild.
     *
     * @returns {Promise<GuildEmoji[]>}
     */
    async getEmojis() {
        return this._client.rest.guilds.getEmojis(this.id);
    }

    /**
     * Get the integrations in this guild.
     *
     * @returns {Promise<Integration[]>}
     */
    async getIntegrations() {
        return this._client.rest.guilds.getIntegrations(this.id);
    }

    /**
     * Get the invites of this guild.
     *
     * @returns {Promise<Invite[]>} - An array of invites with metadata.
     */
    async getInvites() {
        return this._client.rest.guilds.getInvites(this.id);
    }

    /**
     * Get a member of this guild.
     *
     * @param {String} memberID - The ID of the member.
     * @returns {Promise<Member>}
     */
    async getMember(memberID: string) {
        return this._client.rest.guilds.getMember(this.id, memberID);
    }

    /**
     * Get this guild's members. This requires the `GUILD_MEMBERS` intent.
     *
     * @param {Object} [options]
     * @param {String} [options.after] - The last id on the previous page, for pagination.
     * @param {Number} [options.limit] - The maximum number of members to get.
     * @returns {Promise<Member[]>}
     */
    async getMembers(options?: GetMembersOptions) {
        return this._client.rest.guilds.getMembers(this.id, options);
    }

    /**
     * Get a preview of this guild.
     *
     * @returns {Promise<GuildPreview>}
     */
    async getPreview() {
        return this._client.rest.guilds.getPreview(this.id);
    }

    /**
     * Get the prune count of this guild.
     *
     * @param {Object} [options]
     * @param {Number} [options.days] - The number of days to consider inactivity for.
     * @param {String[]} [options.includeRoles] - The roles to include.
     * @returns {Promise<Number>}
     */
    async getPruneCount(options?: GetPruneCountOptions) {
        return this._client.rest.guilds.getPruneCount(this.id, options);
    }

    /**
     * Get the roles in this guild. Only use this if you need to. See the `roles` collection.
     *
     * @returns {Promise<Role[]>}
     */
    async getRoles() {
        return this._client.rest.guilds.getRoles(this.id);
    }

    /**
     * Get a scheduled event.
     *
     * @param {String} eventID - The ID of the scheduled event to get.
     * @param {Number} [withUserCount] - If the number of users subscribed to the event should be included.
     * @returns {Promise<GuildScheduledEvent>}
     */
    async getScheduledEvent(eventID: string, withUserCount?: number) {
        return this._client.rest.guilds.getScheduledEvent(this.id, eventID, withUserCount);
    }

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
    async getScheduledEventUsers(eventID: string, options?: GetScheduledEventUsersOptions) {
        return this._client.rest.guilds.getScheduledEventUsers(this.id, eventID, options);
    }

    /**
     * Get this guild's scheduled events
     *
     * @param {Number} [withUserCount] - If the number of users subscribed to the event should be included.
     * @returns {Promise<GuildScheduledEvent[]>}
     */
    async getScheduledEvents(withUserCount?: number) {
        return this._client.rest.guilds.getScheduledEvents(this.id, withUserCount);
    }

    /**
     * Get this guild's templates.
     *
     * @returns {Promise<GuildTemplate[]>}
     */
    async getTemplates() {
        return this._client.rest.guilds.getTemplates(this.id);
    }

    /**
     * Get the vanity url of this guild.
     *
     * @returns {Promise<GetVanityURLResponse>}
     */
    async getVanityURL() {
        return this._client.rest.guilds.getVanityURL(this.id);
    }

    /**
     * Get the list of usable voice regions for this guild. This will return VIP servers when the guild is VIP-enabled.
     *
     * @returns {Promise<VoiceRegion[]>}
     */
    async getVoiceRegions() {
        return this._client.rest.guilds.getVoiceRegions(this.id);
    }

    /**
     * Get the welcome screen for this guild.
     *
     * @returns {Promise<WelcomeScreen>}
     */
    async getWelcomeScreen() {
        return this._client.rest.guilds.getWelcomeScreen(this.id);
    }

    /**
     * Get the widget of this guild.
     *
     * @returns {Promise<Widget>}
     */
    async getWidget() {
        return this._client.rest.guilds.getWidget(this.id);
    }

    /**
     * Get the widget image of this guild.
     *
     * @param {WidgetImageStyle} [style=shield] - The style of the image.
     * @returns {Promise<Buffer>}
     */
    async getWidgetImage(style?: WidgetImageStyle) {
        return this._client.rest.guilds.getWidgetImage(this.id, style);
    }

    /**
     * Get the raw JSON widget of this guild.
     *
     * @returns {Promise<RawWidget>}
     */
    async getWidgetJSON() {
        return this._client.rest.guilds.getWidgetJSON(this.id);
    }

    /**
     * Get this guild's widget settings.
     *
     * @returns {Promise<WidgetSettings>}
     */
    async getWidgetSettings() {
        return this._client.rest.guilds.getWidgetSettings(this.id);
    }

    /**
     * The url of this guild's icon.
     *
     * @param {ImageFormat} format - The format the url should be.
     * @param {Number} size - The dimensions of the image.
     * @returns {(String | null)}
     */
    iconURL(format?: ImageFormat, size?: number) {
        return this.icon === null ? null : this._client.util.formatImage(Routes.GUILD_ICON(this.id, this.icon), format, size);
    }

    /**
     * Leave this guild.
     *
     * @returns {Promise<void>}
     */
    async leave() {
        return this._client.rest.guilds.delete(this.id);
    }

    /**
     * Get the permissions of a member.
     *
     * @param {(String | Member)} member - The member to get the permissions of.
     * @returns {Permission}
     */
    permissionsOf(member: string | Member) {
        if (typeof member === "string") member = this.members.get(member)!;
        if (!member) throw new Error("Member not found");
        if (member.id === this.owner.id) return new Permission(AllPermissions);
        else {
            let permissions = this.roles.get(this.id)!.permissions.allow;
            if (permissions & Permissions.ADMINISTRATOR) return new Permission(AllPermissions);
            for (const id of member.roles) {
                const role = this.roles.get(id);
                if (!role) continue;
                if (role.permissions.allow & Permissions.ADMINISTRATOR) {
                    permissions = AllPermissions;
                    break;
                } else permissions |= role.permissions.allow;
            }
            return new Permission(permissions);
        }
    }

    /**
     * Remove a ban.
     *
     * @param {string} userID - The ID of the user to remove the ban from.
     * @param {String} [reason] - The reason for removing the ban.
     */
    async removeBan(userID: string, reason?: string) {
        return this._client.rest.guilds.removeBan(this.id, userID, reason);
    }

    /**
     * Remove a member from this guild.
     *
     * @param {String} memberID - The ID of the user to remove.
     * @param {String} reason - The reason for the removal.
     * @returns {Promise<void>}
     */
    async removeMember(memberID: string, reason?: string) {
        return this._client.rest.guilds.removeMember(this.id, memberID, reason);
    }

    /**
     * remove a role from a member.
     *
     * @param {String} memberID - The ID of the member.
     * @param {String} roleID - The ID of the role to remove.
     * @param {String} [reason] - The reason for removing the role.
     * @returns {Promise<void>}
     */
    async removeMemberRole(memberID: string, roleID: string, reason?: string) {
        return this._client.rest.guilds.removeMemberRole(this.id, memberID, roleID, reason);
    }

    /**
     * Search the username & nicknames of members in this guild.
     *
     * @param {Object} options
     * @param {Number} [options.limit] - The maximum number of entries to get.
     * @param {String} options.query - The query to search for.
     * @returns {Promise<Member[]>}
     */
    async searchMembers(options: SearchMembersOptions) {
        return this._client.rest.guilds.searchMembers(this.id, options);
    }

    /**
     * Sync a guild template.
     *
     * @param {String} code - The code of the template to sync.
     * @returns {Promise<GuildTemplate>}
     */
    async syncTemplate(code: string) {
        return this._client.rest.guilds.syncTemplate(this.id, code);
    }

    override toJSON(): JSONGuild {
        return {
            ...super.toJSON(),
            afkChannel:                  this.afkChannel?.id || null,
            afkTimeout:                  this.afkTimeout,
            application:                 this.application?.id,
            approximateMemberCount:      this.approximateMemberCount,
            approximatePresenceCount:    this.approximatePresenceCount,
            autoModerationRules:         this.autoModerationRules.map(rule => rule.toJSON()),
            banner:                      this.banner,
            channels:                    this.channels.map(channel => channel.id),
            defaultMessageNotifications: this.defaultMessageNotifications,
            description:                 this.description,
            discoverySplash:             this.discoverySplash,
            emojis:                      this.emojis,
            explicitContentFilter:       this.explicitContentFilter,
            features:                    this.features,
            icon:                        this.icon,
            joinedAt:                    this.joinedAt.getTime(),
            large:                       this.large,
            maxMembers:                  this.maxMembers,
            maxPresences:                this.maxPresences,
            maxVideoChannelUsers:        this.maxVideoChannelUsers,
            memberCount:                 this.memberCount,
            members:                     this.members.map(member => member.id),
            mfaLevel:                    this.mfaLevel,
            name:                        this.name,
            nsfwLevel:                   this.nsfwLevel,
            owner:                       this.owner?.id,
            permissions:                 this.permissions?.toJSON(),
            preferredLocale:             this.preferredLocale,
            premiumProgressBarEnabled:   this.premiumProgressBarEnabled,
            premiumSubscriptionCount:    this.premiumSubscriptionCount,
            premiumTier:                 this.premiumTier,
            publicUpdatesChannel:        this.publicUpdatesChannel?.id || null,
            region:                      this.region,
            roles:                       this.roles.map(role => role.toJSON()),
            rulesChannel:                this.rulesChannel?.id || null,
            scheduledEvents:             this.scheduledEvents.map(event => event.toJSON()),
            splash:                      this.splash,
            stageInstances:              this.stageInstances.map(instance => instance.toJSON()),
            stickers:                    this.stickers,
            systemChannel:               this.systemChannel?.id || null,
            systemChannelFlags:          this.systemChannelFlags,
            threads:                     this.threads.map(thread => thread.id),
            unavailable:                 this.unavailable,
            vanityURLCode:               this.vanityURLCode,
            verificationLevel:           this.verificationLevel,
            voiceStates:                 this.voiceStates.map(state => state.toJSON()),
            welcomeScreen:               this.welcomeScreen,
            widgetChannel:               this.widgetChannel === null ? null : this.widgetChannel?.id,
            widgetEnabled:               this.widgetEnabled
        };
    }
}
