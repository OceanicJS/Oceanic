import BaseRoute from "./BaseRoute";
import type {
    CreateCategoryChannelOptions,
    CreateChannelOptions,
    CreateEmojiOptions,
    CreateGuildOptions,
    CreateAnnouncementChannelOptions,
    CreateStageChannelOptions,
    CreateTextChannelOptions,
    CreateVoiceChannelOptions,
    EditEmojiOptions,
    EditGuildOptions,
    GuildEmoji,
    ModifyChannelPositionsEntry,
    RawGuild,
    RawGuildEmoji,
    RawGuildPreview,
    RawMember,
    GetActiveThreadsResponse,
    GetMembersOptions,
    SearchMembersOptions,
    AddMemberOptions,
    EditMemberOptions,
    EditCurrentMemberOptions,
    GetBansOptions,
    RawBan,
    Ban,
    CreateBanOptions,
    RawRole,
    CreateRoleOptions,
    EditRolePositionsEntry,
    EditRoleOptions,
    GetPruneCountOptions,
    BeginPruneOptions,
    RawIntegration,
    RawWidgetSettings,
    WidgetSettings,
    RawWidget,
    Widget,
    WidgetImageStyle,
    RawWelcomeScreen,
    WelcomeScreen,
    EditWelcomeScreenOptions,
    GetVanityURLResponse,
    EditUserVoiceStateOptions,
    EditCurrentUserVoiceStateOptions
} from "../types/guilds";
import * as Routes from "../util/Routes";
import Guild from "../structures/Guild";
import type { CreateAutoModerationRuleOptions, EditAutoModerationRuleOptions, RawAutoModerationRule } from "../types/auto-moderation";
import type {
    GuildChannelTypesWithoutThreads,
    MFALevels,
    OverwriteTypes,
    ThreadAutoArchiveDuration,
    VideoQualityModes
} from "../Constants";
import {
    AuditLogActionTypes,
    AutoModerationActionTypes,
    AutoModerationEventTypes,
    AutoModerationKeywordPresetTypes,
    AutoModerationTriggerTypes,
    DefaultMessageNotificationLevels,
    ExplicitContentFilterLevels,
    GuildScheduledEventEntityTypes,
    GuildScheduledEventPrivacyLevels,
    GuildScheduledEventStatuses,
    VerificationLevels
} from "../Constants";
import type { AuditLog, GetAuditLogOptions, RawAuditLog } from "../types/audit-log";
import GuildScheduledEvent from "../structures/GuildScheduledEvent";
import Webhook from "../structures/Webhook";
import type {
    CreateScheduledEventOptions,
    EditScheduledEventOptions,
    GetScheduledEventUsersOptions,
    RawScheduledEvent,
    RawScheduledEventUser,
    ScheduledEventUser
} from "../types/scheduled-events";
import Member from "../structures/Member";
import GuildTemplate from "../structures/GuildTemplate";
import type { CreateGuildFromTemplateOptions, CreateTemplateOptions, EditGuildTemplateOptions, RawGuildTemplate } from "../types/guild-template";
import GuildPreview from "../structures/GuildPreview";
import type {
    AnyGuildChannel,
    AnyGuildChannelWithoutThreads,
    AnyThreadChannel,
    RawGuildChannel,
    RawInvite,
    RawThreadChannel,
    RawThreadMember,
    ThreadMember
} from "../types/channels";
import type StageChannel from "../structures/StageChannel";
import type TextChannel from "../structures/TextChannel";
import type VoiceChannel from "../structures/VoiceChannel";
import type CategoryChannel from "../structures/CategoryChannel";
import type AnnouncementChannel from "../structures/AnnouncementChannel";
import Role from "../structures/Role";
import type { VoiceRegion } from "../types/voice";
import Invite from "../structures/Invite";
import Integration from "../structures/Integration";
import AutoModerationRule from "../structures/AutoModerationRule";
import Channel from "../structures/Channel";
import AuditLogEntry from "../structures/AuditLogEntry";

export default class Guilds extends BaseRoute {
    /**
     * Add a member to a guild. Requires an access token with the `guilds.join` scope.
     *
     * Returns the newly added member upon success, or void if the member is already in the guild.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} userID - The ID of the user to add.
     * @param {Object} options
     * @param {String} options.accessToken - The access token of the user to add.
     * @param {Boolean} [options.deaf] - If the user should be deafened or not.
     * @param {Boolean} [options.mute] - If the user should be muted or not.
     * @param {String} [options.nick] - The nickname of the user to add.
     * @param {String} [options.roles] - The IDs of the roles to add to the user. This bypasses membership screening and verification levels.
     * @returns {Promise<void | Member>}
     */
    async addMember(id: string, userID: string, options: AddMemberOptions) {
        return this._manager.authRequest<RawMember | null>({
            method: "PUT",
            path:   Routes.GUILD_MEMBER(id, userID),
            json:   {
                access_token: options.accessToken,
                deaf:         options.deaf,
                mute:         options.mute,
                nick:         options.nick,
                roles:        options.roles
            }
        }).then(data => data === null ? undefined as void : this._client.util.updateMember(id, userID, data));
    }

    /**
     * Add a role to a member.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} memberID - The ID of the member.
     * @param {String} roleID - The ID of the role to add.
     * @param {String} [reason] - The reason for adding the role.
     * @returns {Promise<void>}
     */
    async addMemberRole(id: string, memberID: string, roleID: string, reason?: string) {
        await this._manager.authRequest<null>({
            method: "PUT",
            path:   Routes.GUILD_MEMBER_ROLE(id, memberID, roleID),
            reason
        });
    }

    /**
     * Begine a prune.
     *
     * @param {String} id - The ID of the guild.
     * @param {Object} [options]
     * @param {Number} [options.days] - The number of days to prune.
     * @param {Boolean} [options.computePruneCount] - If the number of members to prune should be computed. If false, the return will be `null`.
     * @param {String[]} [options.includeRoles] - The roles to include.
     * @param {String} [options.reason] - The reason for the prune.
     * @returns {Promise<Number?>}
     */
    async beginPrune(id: string, options?: BeginPruneOptions) {
        const reason = options?.reason;
        if (options?.reason) delete options.reason;
        return this._manager.authRequest<{ pruned: number | null; }>({
            method: "POST",
            path:   Routes.GUILD_PRUNE(id),
            json:   {
                days:                options?.days,
                compute_prune_count: options?.computePruneCount,
                include_roles:       options?.includeRoles
            },
            reason
        }).then(data => data.pruned);
    }

    /**
     * Create a guild. This can only be used by bots in under 10 guilds.
     *
     * @param {Object} options
     * @param {String?} [options.afkChannelID] - The ID of the AFK voice channel.
     * @param {Number} [options.afkTimeout] - The AFK timeout in seconds.
     * @param {(Buffer | String)?} [options.banner] - The banner of the guild.
     * @param {DefaultMessageNotificationLevels} [options.defaultMessageNotifications] - The default message notification level.
     * @param {ExplicitContentFilterLevels} [options.explicitContentFilter] - The explicit content filter level.
     * @param {String?} [options.icon] - The icon of the guild.
     * @param {String} [options.name] - The name of the guild.
     * @param {String?} [options.region] - The region of the guild.
     * @param {Number} [options.systemChannelFlags] - The system channel flags.
     * @param {String?} [options.systemChannelID] - The ID of the system channel.
     * @param {VerificationLevels} [options.verificationLevel] - The verification level of the guild.
     * @returns {Promise<Guild>}
     */
    async create(options: CreateGuildOptions) {
        if (options.icon) options.icon = this._client.util._convertImage(options.icon, "icon");
        return this._manager.authRequest<RawGuild>({
            method: "POST",
            path:   Routes.GUILDS,
            json:   {
                afk_channel_id:                options.afkChannelID,
                afk_timeout:                   options.afkTimeout,
                channels:                      options.channels,
                default_message_notifications: options.defaultMessageNotifications,
                explicit_content_filter:       options.explicitContentFilter,
                icon:                          options.icon,
                name:                          options.name,
                region:                        options.region,
                roles:                         options.roles,
                system_channel_flags:          options.systemChannelFlags,
                system_channel_id:             options.systemChannelID,
                verification_level:            options.verificationLevel
            }
        });
    }

    /**
     * Create an auto moderation rule for a guild.
     *
     * @param {String} id - The ID of the guild.
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
    async createAutoModerationRule(id: string, options: CreateAutoModerationRuleOptions) {
        const reason = options.reason;
        if (options.reason) delete options.reason;
        return this._manager.authRequest<RawAutoModerationRule>({
            method: "POST",
            path:   Routes.GUILD_AUTOMOD_RULES(id),
            json:   {
                actions: options.actions.map(a => ({
                    metadata: {
                        channel_id:       a.metadata.channelID,
                        duration_seconds: a.metadata.durationSeconds
                    },
                    type: a.type
                })),
                event_type:       options.eventType,
                exempt_channels:  options.exemptChannels,
                exempt_roles:     options.exemptRoles,
                name:             options.name,
                trigger_metadata: !options.triggerMetadata ? undefined : {
                    allow_list:          options.triggerMetadata.allowList,
                    keyword_filter:      options.triggerMetadata.keywordFilter,
                    mention_total_limit: options.triggerMetadata.mentionTotalLimit,
                    presets:             options.triggerMetadata.presets
                },
                trigger_type: options.triggerType
            },
            reason
        }).then(data => this._client.guilds.has(id) ? this._client.guilds.get(id)?.autoModerationRules.update(data) : new AutoModerationRule(data, this._client));
    }

    /**
     * Create a bon for a user.
     *
     * @param {String} guildID - The ID of the guild.
     * @param {String} userID - The ID of the user.
     * @param {Object} [options]
     * @param {Number} [options.deleteMessageDays] - The number of days to delete messages from. Technically DEPRECTED. This is internally converted in to `deleteMessageSeconds`.
     * @param {Number} [options.deleteMessageSeconds] - The number of seconds to delete messages from. Takes precedence over `deleteMessageDays`.
     * @param {String} [options.reason] - The reason for creating the bon.
     * @returns {Promise<void>}
     */
    async createBan(guildID: string, userID: string, options?: CreateBanOptions) {
        const reason = options?.reason;
        if (options?.reason) delete options.reason;
        if (options?.deleteMessageDays !== undefined && !Object.hasOwn(options, "deleteMessageSeconds")) options.deleteMessageSeconds = options.deleteMessageDays * 86400;
        await this._manager.authRequest<null>({
            method: "POST",
            path:   Routes.GUILD_BAN(guildID, userID),
            json:   {
                delete_message_seconds: options?.deleteMessageSeconds
            },
            reason
        });
    }

    /**
     * Create a channel in a guild.
     *
     * @template {AnyGuildChannel} T
     * @param {String} id - The ID of the guild.
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
    async createChannel(id: string, options: CreateTextChannelOptions): Promise<TextChannel>;
    async createChannel(id: string, options: CreateVoiceChannelOptions): Promise<VoiceChannel>;
    async createChannel(id: string, options: CreateCategoryChannelOptions): Promise<CategoryChannel>;
    async createChannel(id: string, options: CreateAnnouncementChannelOptions): Promise<AnnouncementChannel>;
    async createChannel(id: string, options: CreateStageChannelOptions): Promise<StageChannel>;
    async createChannel(id: string, options: CreateChannelOptions) {
        const reason = options.reason;
        if (options.reason) delete options.reason;
        return this._manager.authRequest<RawGuildChannel>({
            method: "POST",
            path:   Routes.GUILD_CHANNELS(id),
            json:   {
                default_auto_archive_duration: options.defaultAutoArchiveDuration,
                name:                          options.name,
                nsfw:                          options.nsfw,
                parent_id:                     options.parentID,
                permission_overwrites:         options.permissionOverwrites,
                position:                      options.position,
                rate_limit_per_user:           options.rateLimitPerUser,
                rtc_region:                    options.rtcRegion,
                topic:                         options.topic,
                type:                          options.type,
                user_limit:                    options.userLimit,
                video_quality_mode:            options.videoQualityMode
            },
            reason
        }).then(data => Channel.from(data, this._client));
    }

    /**
     * Create an emoji in a guild.
     *
     * @param {String} id - The ID of the guild.
     * @param {Object} options
     * @param {String} options.name - The name of the emoji.
     * @param {(Buffer | String)} options.image - The image (buffer, or full data url).
     * @param {String} [options.reason] - The reason for creating the emoji.
     * @param {String[]} [options.roles] - The roles to restrict the emoji to.
     * @returns {Promise<GuildEmoji>}
     */
    async createEmoji(id: string, options: CreateEmojiOptions) {
        const reason = options.reason;
        if (options.reason) delete options.reason;
        if (options.image) options.image = this._client.util._convertImage(options.image, "image");
        return this._manager.authRequest<RawGuildEmoji>({
            method: "POST",
            path:   Routes.GUILD_EMOJIS(id),
            json:   {
                image: options.image,
                name:  options.name,
                roles: options.roles
            },
            reason
        }).then(data => ({
            ...data,
            user: !data.user ? undefined : this._client.users.update(data.user)
        }) as GuildEmoji);
    }

    /**
     * Create a guild from a template. This can only be used by bots in less than 10 guilds.
     *
     * @param {String} code - The code of the template to use.
     * @param {Object} options
     * @param {(Buffer | String)} [options.icon] - The icon for the created guild (buffer, or full data url).
     * @param {String} options.name - The name of the guild.
     * @returns {Promise<Guild>}
     */
    async createFromTemplate(code: string, options: CreateGuildFromTemplateOptions) {
        if (options.icon) options.icon = this._client.util._convertImage(options.icon, "icon");
        return this._manager.authRequest<RawGuild>({
            method: "POST",
            path:   Routes.GUILD_TEMPLATE_CODE(code),
            json:   {
                icon: options.icon,
                name: options.name
            }
        }).then(data => this._client.guilds.update(data));
    }

    /**
     * Create a role.
     *
     * @param {String} id - The ID of the guild.
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
    async createRole(id: string, options?: CreateRoleOptions) {
        const reason = options?.reason;
        if (options?.reason) delete options.reason;
        if (options?.icon) options.icon = this._client.util._convertImage(options.icon, "icon");
        return this._manager.authRequest<RawRole>({
            method: "POST",
            path:   Routes.GUILD_ROLES(id),
            json:   {
                color:         options?.color,
                hoist:         options?.hoist,
                icon:          options?.icon,
                mentionable:   options?.mentionable,
                name:          options?.name,
                permissions:   options?.permissions,
                unicode_emoji: options?.unicodeEmoji
            },
            reason
        }).then(data => this._client.guilds.has(id) ? this._client.guilds.get(id)!.roles.update(data, id) : new Role(data, this._client, id));
    }

    /**
     * Create a scheduled event in a guild.
     *
     * @param {String} id - The ID of the guild.
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
    async createScheduledEvent(id: string, options: CreateScheduledEventOptions) {
        const reason = options.reason;
        if (options.reason) delete options.reason;
        if (options.image) options.image = this._client.util._convertImage(options.image, "image");
        return this._manager.authRequest<RawScheduledEvent>({
            method: "POST",
            path:   Routes.GUILD_SCHEDULED_EVENTS(id),
            json:   {
                channel_id:      options.channelID,
                description:     options.description,
                entity_metadata: !options.entityMetadata ? undefined : {
                    location: options.entityMetadata.location
                },
                entity_type:          options.entityType,
                image:                options.image,
                name:                 options.name,
                privacy_level:        options.privacyLevel,
                scheduled_end_time:   options.scheduledEndTime,
                scheduled_start_time: options.scheduledStartTime
            },
            reason
        }).then(data => new GuildScheduledEvent(data, this._client));
    }

    /**
     * Create a guild template.
     *
     * @param {String} id - The ID of the guild to create a template from.
     * @param {Object} options
     * @param {String} [options.description] - The description of the template.
     * @param {String} options.name - The name of the template.
     * @returns {Promise<GuildTemplate>}
     */
    async createTemplate(id: string, options: CreateTemplateOptions) {
        return this._manager.authRequest<RawGuildTemplate>({
            method: "POST",
            path:   Routes.GUILD_TEMPLATES(id),
            json:   {
                description: options.description,
                name:        options.name
            }
        }).then(data => new GuildTemplate(data, this._client));
    }

    /**
     * Delete a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<void>}
     */
    async delete(id: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD(id)
        });
    }

    /**
     * Delete an auto moderation rule.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} ruleID - The ID of the rule to delete.
     * @param {String} [reason] - The reason for deleting the rule.
     * @returns {Promise<void>}
     */
    async deleteAutoModerationRule(id: string, ruleID: string, reason?: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_AUTOMOD_RULE(id, ruleID),
            reason
        });
    }

    /**
     * Delete an emoji.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} emojiID - The ID of the emoji.
     * @param {String} [reason] - The reason for deleting the emoji.
     * @returns {Promise<void>}
     */
    async deleteEmoji(id: string, emojiID: string, reason?: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_EMOJI(id, emojiID),
            reason
        });
    }

    /**
     * Delete an integration.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} integrationID - The ID of the integration.
     * @param {String} [reason] - The reason for deleting the integration.
     * @returns {Promise<void>}
     */
    async deleteIntegration(id: string, integrationID: string, reason?: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_INTEGRATION(id, integrationID),
            reason
        });
    }

    /**
     * Delete a role.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} roleID - The ID of the role to delete.
     * @param {String} [reason] - The reason for deleting the role.
     * @returns {Promise<void>}
     */
    async deleteRole(id: string, roleID: string, reason?: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_ROLE(id, roleID),
            reason
        });
    }

    /**
     * Delete a scheduled event.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} eventID - The ID of the scheduled event.
     * @param {String} reason - The reason for deleting the scheduled event. Discord's docs do not explicitly state a reason can be provided, so it may not be used.
     * @returns {Promise<void>}
     */
    async deleteScheduledEvent(id: string, eventID: string, reason?: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_SCHEDULED_EVENT(id, eventID),
            reason
        });
    }

    /**
     * Delete a template.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} code - The code of the template.
     * @returns {Promise<void>}
     */
    async deleteTemplate(id: string, code: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_TEMPLATE(id, code)
        });
    }

    /**
     * Edit a guild.
     *
     * @param {String} id - The ID of the guild.
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
    async edit(id: string, options: EditGuildOptions) {
        const reason = options.reason;
        if (options.reason) delete options.reason;
        if (options.banner) options.banner = this._client.util._convertImage(options.banner, "banner");
        if (options.discoverySplash) options.discoverySplash = this._client.util._convertImage(options.discoverySplash, "discovery splash");
        if (options.icon) options.icon = this._client.util._convertImage(options.icon, "icon");
        if (options.splash) options.splash = this._client.util._convertImage(options.splash, "splash");
        return this._manager.authRequest<RawGuild>({
            method: "PATCH",
            path:   Routes.GUILD(id),
            json:   {
                afk_channel_id:                options.afkChannelID,
                afk_timeout:                   options.afkTimeout,
                banner:                        options.banner,
                default_message_notifications: options.defaultMessageNotifications,
                description:                   options.description,
                discovery_splash:              options.discoverySplash,
                explicit_content_filter:       options.explicitContentFilter,
                features:                      options.features,
                icon:                          options.icon,
                name:                          options.name,
                owner_id:                      options.ownerID,
                preferred_locale:              options.preferredLocale,
                premium_progress_bar_enabled:  options.premiumProgressBarEnabled,
                public_updates_channel_id:     options.publicUpdatesChannelID,
                region:                        options.region,
                rules_channel_id:              options.rulesChannelID,
                splash:                        options.splash,
                system_channel_flags:          options.systemChannelFlags,
                system_channel_id:             options.systemChannelID,
                verification_level:            options.verificationLevel
            },
            reason
        }).then(data => this._client.guilds.update(data));
    }

    /**
     * Edit an existing auto moderation rule.
     *
     * @param {String} id - The ID of the guild.
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
    async editAutoModerationRule(id: string, ruleID: string, options: EditAutoModerationRuleOptions) {
        const reason = options.reason;
        if (options.reason) delete options.reason;
        return this._manager.authRequest<RawAutoModerationRule>({
            method: "PATCH",
            path:   Routes.GUILD_AUTOMOD_RULE(id, ruleID),
            json:   {
                actions: options.actions?.map(a => ({
                    metadata: {
                        channel_id:       a.metadata.channelID,
                        duration_seconds: a.metadata.durationSeconds
                    },
                    type: a.type
                })),
                event_type:       options.eventType,
                exempt_channels:  options.exemptChannels,
                exempt_roles:     options.exemptRoles,
                name:             options.name,
                trigger_metadata: !options.triggerMetadata ? undefined : {
                    allow_list:          options.triggerMetadata.allowList,
                    keyword_filter:      options.triggerMetadata.keywordFilter,
                    mention_total_limit: options.triggerMetadata.mentionTotalLimit,
                    presets:             options.triggerMetadata.presets
                }
            },
            reason
        }).then(data => this._client.guilds.has(id) ? this._client.guilds.get(id)?.autoModerationRules.update(data) : new AutoModerationRule(data, this._client));
    }

    /**
     * Edit the positions of channels in a guild.
     *
     * @param {String} id - The ID of the guild.
     * @param {Object[]} options - The channels to move. Unedited channels do not need to be specifed.
     * @param {String} options[].id - The ID of the channel to move.
     * @param {Boolean} [options[].lockPermissions] - If the permissions should be synced (if moving to a new category).
     * @param {String} [options[].parentID] - The ID of the new parent category.
     * @param {Number} [options[].position] - The position to move the channel to.
     */
    async editChannelPositions(id: string, options: Array<ModifyChannelPositionsEntry>) {
        await this._manager.authRequest<null>({
            method: "PATCH",
            path:   Routes.GUILD_CHANNELS(id),
            json:   options.map(o => ({
                id:               o.id,
                lock_permissions: o.lockPermissions ?? null,
                parent_id:        o.parentID || null,
                position:         o.position ?? null
            }))
        });
    }

    /**
     * Modify the current member in a guild.
     *
     * @param {String} id - The ID of the guild.
     * @param {Object} options
     * @param {String?} [options.nick] - The new nickname for the member.
     * @param {String} [options.reason] - The reason updating the member.
     * @returns {Promise<Member>}
     */
    async editCurrentMember(id: string, options: EditCurrentMemberOptions) {
        const reason = options.reason;
        if (options.reason) delete options.reason;
        return this._manager.authRequest<RawMember>({
            method: "PATCH",
            path:   Routes.GUILD_MEMBER(id, "@me"),
            json:   {
                nick: options.nick
            },
            reason
        }).then(data => this._client.util.updateMember(id, data.user!.id, data));
    }

    /**
     * Edit the current member's voice state in a guild. `channelID` is required, and the current member must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-current-user-voice-state-caveats) for more information.
     *
     * @param {String} id - The ID of the guild.
     * @param {Object} options
     * @param {String} options.channelID - The ID of the stage channel the member is in.
     * @param {String} [options.requestToSpeakTimestamp] - The timestamp of when the member should be able to speak.
     * @param {Boolean} [options.suppress] - If the user should be suppressed.
     * @returns {Promise<void>}
     */
    async editCurrentUserVoiceState(id: string, options: EditCurrentUserVoiceStateOptions) {
        await this._manager.authRequest<null>({
            method: "PATCH",
            path:   Routes.GUILD_VOICE_STATE(id, "@me"),
            json:   {
                channel_id:                 options.channelID,
                suppress:                   options.suppress,
                request_to_speak_timestamp: options.requestToSpeakTimestamp
            }
        });
    }

    /**
     * Edit an existing emoji.
     *
     * @param {String} id - The ID of the guild the emoji is in.
     * @param {Object} options
     * @param {String} [options.name] - The name of the emoji.
     * @param {String} [options.reason] - The reason for creating the emoji.
     * @param {String[]} [options.roles] - The roles to restrict the emoji to.
     * @returns {Promise<GuildEmoji>}
     */
    async editEmoji(id: string, emojiID: string, options: EditEmojiOptions) {
        const reason = options.reason;
        if (options.reason) delete options.reason;
        return this._manager.authRequest<RawGuildEmoji>({
            method: "POST",
            path:   Routes.GUILD_EMOJI(id, emojiID),
            json:   {
                name:  options.name,
                roles: options.roles
            },
            reason
        }).then(data => ({
            ...data,
            user: !data.user ? undefined : this._client.users.update(data.user)
        }));
    }

    /**
     * Edit the [mfa level](https://discord.com/developers/docs/resources/guild#guild-object-mfa-level) of a guild. This can only be used by the guild owner.
     *
     * @param {String} id - The ID of the guild.
     * @param {MFALevels} level - The new MFA level.
     * @returns {Promise<MFALevels>}
     */
    async editMFALevel(id: string, level: MFALevels) {
        return this._manager.authRequest<MFALevels>({
            method: "PATCH",
            path:   Routes.GUILD_MFA(id),
            json:   {
                level
            }
        });
    }

    /**
     * Edit a guild member.
     *
     * @param {string} id - The ID of the guild.
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
    async editMember(id: string, memberID: string, options: EditMemberOptions) {
        const reason = options.reason;
        if (options.reason) delete options.reason;
        return this._manager.authRequest<RawMember>({
            method: "PATCH",
            path:   Routes.GUILD_MEMBER(id, memberID),
            json:   {
                channel_id:                   options.channelID,
                communication_disabled_until: options.communicationDisabledUntil,
                deaf:                         options.deaf,
                mute:                         options.mute,
                nick:                         options.nick,
                roles:                        options.roles
            },
            reason
        }).then(data => this._client.util.updateMember(id, memberID, data));
    }

    /**
     * Edit an existing role.
     *
     * @param {String} id - The ID of the guild.
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
    async editRole(id: string, roleID: string, options: EditRoleOptions) {
        const reason = options.reason;
        if (options.reason) delete options.reason;
        if (options.icon) options.icon = this._client.util._convertImage(options.icon, "icon");
        return this._manager.authRequest<RawRole>({
            method: "PATCH",
            path:   Routes.GUILD_ROLE(id, roleID),
            json:   {
                color:         options.color,
                hoist:         options.hoist,
                icon:          options.icon,
                mentionable:   options.mentionable,
                name:          options.name,
                permissions:   options.permissions,
                unicode_emoji: options.unicodeEmoji
            },
            reason
        }).then(data => this._client.guilds.has(id) ? this._client.guilds.get(id)!.roles.update(data, id) : new Role(data, this._client, id));
    }

    /**
     * Edit the position of roles in a guild.
     *
     * @param {String} id - The ID of the guild.
     * @param {Object[]} options
     * @param {String} options[].id - The ID of the role to move.
     * @param {Number?} [options[].position] - The position to move the role to.
     * @param {String} [reason] - The reason for moving the roles.
     * @returns {Promise<Role[]>}
     */
    async editRolePositions(id: string, options: Array<EditRolePositionsEntry>, reason?: string) {
        const guild = this._client.guilds.get(id);
        return this._manager.authRequest<Array<RawRole>>({
            method: "PATCH",
            path:   Routes.GUILD_ROLES(id),
            json:   options.map(o => ({
                id:       o.id,
                position: o.position
            })),
            reason
        }).then(data => data.map(role => guild ? guild.roles.update(role, id) : new Role(role, this._client, id)));
    }

    /**
     * Edit an existing scheduled event in a guild.
     *
     * @param {String} id - The ID of the guild.
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
    async editScheduledEvent(id: string, options: EditScheduledEventOptions) {
        const reason = options.reason;
        if (options.reason) delete options.reason;
        if (options.image) options.image = this._client.util._convertImage(options.image, "image");
        return this._manager.authRequest<RawScheduledEvent>({
            method: "POST",
            path:   Routes.GUILD_SCHEDULED_EVENTS(id),
            json:   {
                channel_id:      options.channelID,
                description:     options.description,
                entity_metadata: !options.entityMetadata ? undefined : {
                    location: options.entityMetadata.location
                },
                entity_type:          options.entityType,
                image:                options.image,
                name:                 options.name,
                privacy_level:        options.privacyLevel,
                status:               options.status,
                scheduled_end_time:   options.scheduledEndTime,
                scheduled_start_time: options.scheduledStartTime
            },
            reason
        }).then(data => new GuildScheduledEvent(data, this._client));
    }

    /**
     * Edit a guild template.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} code - The code of the template.
     * @param {Object} options
     * @param {String} [options.description] - The description of the template.
     * @param {String} [options.name] - The name of the template.
     * @returns {Promise<GuildTemplate>}
     */
    async editTemplate(id: string, code: string, options: EditGuildTemplateOptions) {
        return this._manager.authRequest<RawGuildTemplate>({
            method: "POST",
            path:   Routes.GUILD_TEMPLATE(id, code),
            json:   {
                code,
                description: options.description,
                name:        options.name
            }
        }).then(data => new GuildTemplate(data, this._client));
    }

    /**
     * Edit a guild member's voice state. `channelID` is required, and the user must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-user-voice-state) for more information.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} memberID - The ID of the member.
     * @param {Object} options
     * @param {String} options.channelID - The ID of the stage channel the member is in.
     * @param {Boolean} [options.suppress] - If the user should be suppressed.
     * @returns {Promise<void>}
     */
    async editUserVoiceState(id: string, memberID: string, options: EditUserVoiceStateOptions) {
        await this._manager.authRequest<null>({
            method: "PATCH",
            path:   Routes.GUILD_VOICE_STATE(id, memberID),
            json:   {
                channel_id: options.channelID,
                suppress:   options.suppress
            }
        });
    }

    /**
     * Edit the welcome screen in a guild.
     *
     * @param {String} id - The ID of the guild.
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
    async editWelcomeScreen(id: string, options: EditWelcomeScreenOptions) {
        const reason = options.reason;
        if (options.reason) delete options.reason;
        return this._manager.authRequest<RawWelcomeScreen>({
            method: "PATCH",
            path:   Routes.GUILD_WELCOME_SCREEN(id),
            json:   {
                description:      options.description,
                enabled:          options.enabled,
                welcome_channels: options.welcomeChannels.map(ch => ({
                    channel_id:  ch.channelID,
                    description: ch.description,
                    emoji_id:    ch.emojiID,
                    emoji_name:  ch.emojiName
                }))
            },
            reason
        }).then(data => ({
            description:     data.description,
            welcomeChannels: data.welcome_channels.map(channel => ({
                channelID:   channel.channel_id,
                description: channel.description,
                emojiID:     channel.emoji_id,
                emojiName:   channel.emoji_name
            }))
        }) as WelcomeScreen);
    }

    /**
     * Edit the widget of a guild.
     *
     * @param {String} id - The ID of the guild.
     * @param {Object} options
     * @param {String} [options.channelID] - The ID of the channel the widget should lead to.
     * @param {Boolean} [options.enabled] - If the widget is enabled.
     * @returns {Promise<Widget>}
     */
    async editWidget(id: string, options: WidgetSettings) {
        return this._manager.authRequest<RawWidget>({
            method: "POST",
            path:   Routes.GUILD_WIDGET(id),
            json:   {
                channel_id: options.channelID,
                enabled:    options.enabled
            }
        }).then(data => ({
            channels:      data.channels,
            id:            data.id,
            instantInvite: data.instant_invite,
            members:       data.members.map(m => ({
                activity:      m.activity,
                avatar:        m.avatar,
                avatarURL:     m.avatar_url,
                discriminator: m.discriminator,
                id:            m.id,
                status:        m.status,
                tag:           `${m.username}#${m.discriminator}`,
                username:      m.username
            })),
            name:          data.name,
            presenceCount: data.presence_count
        }) as Widget);
    }

    /**
     * Get a guild.
     *
     * @param {String} id - The ID of the guild.
     * @param {Number} [withCounts=false] - If the approximate number of members and online members should be included.
     * @returns {Promise<Guild>}
     */
    async get(id: string, withCounts?: number) {
        const query = new URLSearchParams();
        if (withCounts) query.set("with_counts", withCounts.toString());
        return this._manager.authRequest<RawGuild>({
            method: "GET",
            path:   Routes.GUILD(id),
            query
        }).then(data => this._client.guilds.update(data));
    }

    /**
     * Get the active threads in a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<GetActiveThreadsResponse>}
     */
    async getActiveThreads(id: string) {
        return this._manager.authRequest<{ members: Array<RawThreadMember>; threads: Array<RawThreadChannel>; }>({
            method: "GET",
            path:   Routes.GUILD_ACTIVE_THREADS(id)
        }).then(data => ({
            members: data.members.map(member => ({
                flags:         member.flags,
                id:            member.id,
                joinTimestamp: new Date(member.join_timestamp),
                userID:        member.user_id
            }) as ThreadMember),
            threads: data.threads.map(thread => Channel.from<AnyThreadChannel>(thread, this._client))
        }) as GetActiveThreadsResponse);
    }

    /**
     * Get a guild's audit log.
     *
     * Note: everything under the `entries` key is raw from Discord. See [their documentation](https://discord.com/developers/docs/resources/audit-log#audit-logs) for structure and other information. (`audit_log_entries`)
     *
     * @param {String} id - The ID of the guild.
     * @param {Object} [options]
     * @param {AuditLogActionTypes} [options.actionType] - The action type to filter by.
     * @param {Number} [options.before] - The ID of the entry to get entries before.
     * @param {Number} [options.limit] - The maximum number of entries to get.
     * @param {String} [options.userID] - The ID of the user to filter by.
     * @returns {Promise<AuditLog>}
     */
    async getAuditLog(id: string, options?: GetAuditLogOptions) {
        const guild = this._client.guilds.get(id);
        const query = new URLSearchParams();
        if (options?.actionType) query.set("action_type", options.actionType.toString());
        if (options?.before) query.set("before", options.before);
        if (options?.limit) query.set("limit", options.limit.toString());
        if (options?.userID) query.set("user_id", options.userID);
        return this._manager.authRequest<RawAuditLog>({
            method: "GET",
            path:   Routes.GUILD_AUDIT_LOG(id),
            query
        }).then(data => ({
            autoModerationRules:  data.auto_moderation_rules.map(rule => guild ? guild.autoModerationRules.update(rule) : new AutoModerationRule(rule, this._client)),
            entries:              data.audit_log_entries.map(entry => new AuditLogEntry(entry, this._client)),
            guildScheduledEvents: data.guild_scheduled_events.map(event => guild ? guild.scheduledEvents.update(event) : new GuildScheduledEvent(event, this._client)),
            integrations:         data.integrations.map(integration => new Integration(integration, this._client)),
            threads:              data.threads.map(thread => guild ? guild.threads.update(thread) : Channel.from(thread, this._client)),
            users:                data.users.map(user => this._client.users.update(user)),
            webhooks:             data.webhooks.map(webhook => new Webhook(webhook, this._client))
        }) as AuditLog);
    }

    /**
     * Get an auto moderation rule for a guild.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} ruleID - The ID of the rule to get.
     * @returns {Promise<AutoModerationRule>}
     */
    async getAutoModerationRule(id: string, ruleID: string) {
        return this._manager.authRequest<RawAutoModerationRule>({
            method: "GET",
            path:   Routes.GUILD_AUTOMOD_RULE(id, ruleID)
        }).then(data => this._client.guilds.has(id) ? this._client.guilds.get(id)!.autoModerationRules.update(data) : new AutoModerationRule(data, this._client));
    }

    /**
     * Get the auto moderation rules for a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<AutoModerationRule[]>}
     */
    async getAutoModerationRules(id: string) {
        const guild = this._client.guilds.get(id);
        return this._manager.authRequest<Array<RawAutoModerationRule>>({
            method: "GET",
            path:   Routes.GUILD_AUTOMOD_RULES(id)
        }).then(data => data.map(rule => guild ? guild.autoModerationRules.update(rule) : new AutoModerationRule(rule, this._client)));
    }

    /**
     * Get a ban.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} userID - The ID of the user to get the ban of.
     * @returns {Promise<Ban>}
     */
    async getBan(id: string, userID: string) {
        return this._manager.authRequest<RawBan>({
            method: "GET",
            path:   Routes.GUILD_BAN(id, userID)
        }).then(data => ({
            reason: data.reason,
            user:   this._client.users.update(data.user)
        }) as Ban);
    }

    /**
     * Get the bans in a guild.
     *
     * @param {String} id
     * @param {Object} options
     * @param {String} [options.after] - The ID of the ban to get bans after.
     * @param {String} [options.before] - The ID of the ban to get bans before.
     * @param {Number} [options.limit] - The maximum number of bans to get.
     * @returns {Promise<Ban[]>}
     */
    async getBans(id: string, options?: GetBansOptions) {
        const query = new URLSearchParams();
        if (options?.after) query.set("after", options.after);
        if (options?.before) query.set("before", options.before);
        if (options?.limit) query.set("limit", options.limit.toString());
        return this._manager.authRequest<Array<RawBan>>({
            method: "GET",
            path:   Routes.GUILD_BANS(id),
            query
        }).then(data => data.map(ban => ({
            reason: ban.reason,
            user:   this._client.users.update(ban.user)
        }) as Ban));
    }

    /**
     * Get the channels in a guild. Does not include threads.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<AnyGuildChannelWithoutThreads[]>}
     */
    async getChannels(id: string) {
        return this._manager.authRequest<Array<RawGuildChannel>>({
            method: "GET",
            path:   Routes.GUILD_CHANNELS(id)
        }).then(data => data.map(d => Channel.from<AnyGuildChannelWithoutThreads>(d, this._client)));
    }

    /**
     * Get an emoji in a guild.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} emojiID - The ID of the emoji to get.
     * @returns {Promise<GuildEmoji>}
     */
    async getEmoji(id: string, emojiID: string) {
        return this._manager.authRequest<RawGuildEmoji>({
            method: "GET",
            path:   Routes.GUILD_EMOJI(id, emojiID)
        }).then(data => ({
            ...data,
            user: !data.user ? undefined : this._client.users.update(data.user)
        }) as GuildEmoji);
    }

    /**
     * Get the emojis in a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<GuildEmoji[]>}
     */
    async getEmojis(id: string) {
        return this._manager.authRequest<Array<RawGuildEmoji>>({
            method: "GET",
            path:   Routes.GUILD_EMOJIS(id)
        }).then(data => data.map(d => ({
            ...d,
            user: !d.user ? undefined : this._client.users.update(d.user)
        }) as GuildEmoji));
    }

    /**
     * Get the integrations in a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<Integration[]>}
     */
    async getIntegrations(id: string) {
        return this._manager.authRequest<Array<RawIntegration>>({
            method: "GET",
            path:   Routes.GUILD_INTEGRATIONS(id)
        }).then(data => data.map(integration => new Integration(integration, this._client)));
    }

    /**
     * Get the invites of a guild.
     *
     * @param {String} id - The id of the guild to get the invites of.
     * @returns {Promise<Invite[]>} - An array of invites with metadata.
     */
    async getInvites(id: string) {
        return this._manager.authRequest<Array<RawInvite>>({
            method: "GET",
            path:   Routes.GUILD_INVITES(id)
        }).then(data => data.map(invite => new Invite<"withMetadata">(invite, this._client)));
    }

    /**
     * Get a guild member.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} memberID - The ID of the member.
     * @returns {Promise<Member>}
     */
    async getMember(id: string, memberID: string) {
        return this._manager.authRequest<RawMember>({
            method: "GET",
            path:   Routes.GUILD_MEMBER(id, memberID)
        }).then(data => this._client.util.updateMember(id, memberID, data));
    }

    /**
     * Get a guild's members. This requires the `GUILD_MEMBERS` intent.
     *
     * @param {String} id - The ID of the guild.
     * @param {Object} [options]
     * @param {String} [options.after] - The last id on the previous page, for pagination.
     * @param {Number} [options.limit] - The maximum number of members to get.
     * @returns {Promise<Member[]>}
     */
    async getMembers(id: string, options?: GetMembersOptions) {
        const query = new URLSearchParams();
        if (options?.after) query.set("after", options.after);
        if (options?.limit) query.set("limit", options.limit.toString());
        return this._manager.authRequest<Array<RawMember>>({
            method: "GET",
            path:   Routes.GUILD_MEMBERS(id),
            query
        }).then(data => data.map(d => this._client.util.updateMember(id, d.user!.id, d)));
    }

    /**
     * Get a preview of a guild. If the client is not already in this guild, the guild must be lurkable.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<GuildPreview>}
     */
    async getPreview(id: string) {
        return this._manager.authRequest<RawGuildPreview>({
            method: "GET",
            path:   Routes.GUILD_PREVIEW(id)
        }).then(data => new GuildPreview(data, this._client));
    }

    /**
     * Get the prune count of a guild.
     *
     * @param {String} id - The ID of the guild.
     * @param {Object} [options]
     * @param {Number} [options.days] - The number of days to consider inactivity for.
     * @param {String[]} [options.includeRoles] - The roles to include.
     * @returns {Promise<Number>}
     */
    async getPruneCount(id: string, options?: GetPruneCountOptions) {
        const query = new URLSearchParams();
        if (options?.days) query.set("days", options.days.toString());
        if (options?.includeRoles) query.set("include_roles", options.includeRoles.join(","));
        return this._manager.authRequest<{ pruned: number; }>({
            method: "GET",
            path:   Routes.GUILD_PRUNE(id),
            query
        }).then(data => data.pruned);
    }

    /**
     * Get the roles in a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<Role[]>}
     */
    async getRoles(id: string) {
        const guild = this._client.guilds.get(id);
        return this._manager.authRequest<Array<RawRole>>({
            method: "GET",
            path:   Routes.GUILD_ROLES(id)
        }).then(data => data.map(role => guild ? guild.roles.update(role, id) : new Role(role, this._client, id)));
    }

    /**
     * Get a scheduled event.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} eventID - The ID of the scheduled event to get.
     * @param {Number} [withUserCount] - If the number of users subscribed to the event should be included.
     * @returns {Promise<GuildScheduledEvent>}
     */
    async getScheduledEvent(id: string, eventID: string, withUserCount?: number) {
        const query = new URLSearchParams();
        if (withUserCount) query.set("with_user_count", withUserCount.toString());
        return this._manager.authRequest<RawScheduledEvent>({
            method: "GET",
            path:   Routes.GUILD_SCHEDULED_EVENT(id, eventID),
            query
        }).then(data => new GuildScheduledEvent(data, this._client));
    }

    /**
     * Get the users subscribed to a scheduled event.
     *
     * @param {String} id
     * @param {String} eventID
     * @param {Object} options
     * @param {String} [options.after] - The ID of the entry to get entries after.
     * @param {String} [options.before] - The ID of the entry to get entries before.
     * @param {Number} [options.limit] - The maximum number of entries to get.
     * @param {Boolean} [options.withMember] - If the member object should be included.
     * @returns {Promise<ScheduledEventUser[]>}
     */
    async getScheduledEventUsers(id: string, eventID: string, options?: GetScheduledEventUsersOptions) {
        const guild = this._client.guilds.get(id);
        const query = new URLSearchParams();
        if (options?.after) query.set("after", options.after);
        if (options?.before) query.set("before", options.before);
        if (options?.limit) query.set("limit", options.limit.toString());
        if (options?.withMember !== undefined) query.set("with_member", options.withMember ? "true" : "false");
        return this._manager.authRequest<Array<RawScheduledEventUser>>({
            method: "GET",
            path:   Routes.GUILD_SCHEDULED_EVENT_USERS(id, eventID)
        }).then(data => data.map(d => ({
            guildScheduledEvent: guild?.scheduledEvents.get(d.guild_scheduled_event_id) || { id: d.guild_scheduled_event_id },
            user:                this._client.users.update(d.user),
            member:              d.member ? this._client.util.updateMember(id, d.member.user!.id, d.member) : undefined
        } as ScheduledEventUser)));
    }

    /**
     * Get a guild's scheduled events
     *
     * @param {String} id - The ID of the guild.
     * @param {Number} [withUserCount] - If the number of users subscribed to the event should be included.
     * @returns {Promise<GuildScheduledEvent[]>}
     */
    async getScheduledEvents(id: string, withUserCount?: number) {
        const query = new URLSearchParams();
        if (withUserCount) query.set("with_user_count", withUserCount.toString());
        return this._manager.authRequest<Array<RawScheduledEvent>>({
            method: "GET",
            path:   Routes.GUILD_SCHEDULED_EVENTS(id),
            query
        }).then(data => data.map(d => new GuildScheduledEvent(d, this._client)));
    }

    /**
     * Get a guild template.
     *
     * @param {String} code - The code of the template to get.
     * @returns {Promise<GuildTemplate>}
     */
    async getTemplate(code: string) {
        return this._manager.authRequest<RawGuildTemplate>({
            method: "GET",
            path:   Routes.GUILD_TEMPLATE_CODE(code)
        }).then(data => new GuildTemplate(data, this._client));
    }

    /**
     * Get a guild's templates.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<GuildTemplate[]>}
     */
    async getTemplates(id: string) {
        return this._manager.authRequest<Array<RawGuildTemplate>>({
            method: "GET",
            path:   Routes.GUILD_TEMPLATES(id)
        }).then(data => data.map(d => new GuildTemplate(d, this._client)));
    }

    /**
     * Get the vanity url of a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<GetVanityURLResponse>}
     */
    async getVanityURL(id: string) {
        return this._manager.authRequest<GetVanityURLResponse>({
            method: "GET",
            path:   Routes.GUILD_VANITY_URL(id)
        });
    }

    /**
     * Get the list of usable voice regions for a guild. This will return VIP servers when the guild is VIP-enabled.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<VoiceRegion[]>}
     */
    async getVoiceRegions(id: string) {
        return this._manager.authRequest<Array<VoiceRegion>>({
            method: "GET",
            path:   Routes.GUILD_VOICE_REGIONS(id)
        });
    }

    /**
     * Get the welcome screen for a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<WelcomeScreen>}
     */
    async getWelcomeScreen(id: string) {
        return this._manager.authRequest<RawWelcomeScreen>({
            method: "GET",
            path:   Routes.GUILD_WELCOME_SCREEN(id)
        }).then(data => ({
            description:     data.description,
            welcomeChannels: data.welcome_channels.map(channel => ({
                channelID:   channel.channel_id,
                description: channel.description,
                emojiID:     channel.emoji_id,
                emojiName:   channel.emoji_name
            }))
        }) as WelcomeScreen);
    }

    /**
     * Get the widget of a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<Widget>}
     */
    async getWidget(id: string) {
        return this._manager.authRequest<RawWidget>({
            method: "GET",
            path:   Routes.GUILD_WIDGET(id)
        }).then(data => ({
            channels:      data.channels,
            id:            data.id,
            instantInvite: data.instant_invite,
            members:       data.members.map(m => ({
                activity:      m.activity,
                avatar:        m.avatar,
                avatarURL:     m.avatar_url,
                discriminator: m.discriminator,
                id:            m.id,
                status:        m.status,
                tag:           `${m.username}#${m.discriminator}`,
                username:      m.username
            })),
            name:          data.name,
            presenceCount: data.presence_count
        }) as Widget);
    }

    /**
     * Get the widget image of a guild.
     *
     * @param {String} id - The ID of the guild.
     * @param {WidgetImageStyle} [style=shield] - The style of the image.
     * @returns {Promise<Buffer>}
     */
    async getWidgetImage(id: string, style?: WidgetImageStyle) {
        const query = new URLSearchParams();
        if (style) query.set("style", style.toString());
        return this._manager.request<Buffer>({
            method: "GET",
            path:   Routes.GUILD_WIDGET_IMAGE(id),
            query
        });
    }

    /**
     * Get the raw JSON widget of a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<RawWidget>}
     */
    async getWidgetJSON(id: string) {
        return this._manager.request<RawWidget>({
            method: "GET",
            path:   Routes.GUILD_WIDGET_JSON(id)
        });
    }

    /**
     * Get a guild's widget settings.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<WidgetSettings>}
     */
    async getWidgetSettings(id: string) {
        return this._manager.authRequest<RawWidgetSettings>({
            method: "GET",
            path:   Routes.GUILD_WIDGET(id)
        }).then(data => ({
            channelID: data.channel_id,
            enabled:   data.enabled
        }) as WidgetSettings);
    }

    /**
     * Remove a ban.
     *
     * @param {String} id - The ID of the guild.
     * @param {string} userID - The ID of the user to remove the ban from.
     * @param {String} [reason] - The reason for removing the ban.
     */
    async removeBan(id: string, userID: string, reason?: string) {
        await this._manager.authRequest<void>({
            method: "DELETE",
            path:   Routes.GUILD_BAN(id, userID),
            reason
        });
    }

    /**
     * Remove a member from a guild.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} memberID - The ID of the user to remove.
     * @param {String} reason - The reason for the removal.
     * @returns {Promise<void>}
     */
    async removeMember(id: string, memberID: string, reason?: string) {
        await this._manager.authRequest<void>({
            method: "DELETE",
            path:   Routes.GUILD_MEMBER(id, memberID),
            reason
        });
    }

    /**
     * remove a role from a member.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} memberID - The ID of the member.
     * @param {String} roleID - The ID of the role to remove.
     * @param {String} [reason] - The reason for removing the role.
     * @returns {Promise<void>}
     */
    async removeMemberRole(id: string, memberID: string, roleID: string, reason?: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_MEMBER_ROLE(id, memberID, roleID),
            reason
        });
    }

    /**
     * Search the username & nicknames of members in a guild.
     *
     * @param {String} id - The ID of the guild.
     * @param {Object} options
     * @param {Number} [options.limit] - The maximum number of entries to get.
     * @param {String} options.query - The query to search for.
     * @returns {Promise<Member[]>}
     */
    async searchMembers(id: string, options: SearchMembersOptions) {
        const query = new URLSearchParams();
        query.set("query", options.query);
        if (options.limit) query.set("limit", options.limit.toString());
        return this._manager.authRequest<Array<RawMember>>({
            method: "GET",
            path:   Routes.GUILD_SEARCH_MEMBERS(id),
            query
        }).then(data => data.map(d => this._client.util.updateMember(id, d.user!.id, d)));
    }

    /**
     * Sync a guild template.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} code - The code of the template to sync.
     * @returns {Promise<GuildTemplate>}
     */
    async syncTemplate(id: string, code: string) {
        return this._manager.authRequest<RawGuildTemplate>({
            method: "POST",
            path:   Routes.GUILD_TEMPLATE(id, code)
        }).then(data => new GuildTemplate(data, this._client));
    }
}
