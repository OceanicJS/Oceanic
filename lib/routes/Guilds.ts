/** @module REST/Guilds */
import type * as Types from "../types/namespaced";
import type { ChannelTypeMap } from "../Constants";
import type RESTManager from "../rest/RESTManager";
import ApplicationCommand from "../structures/ApplicationCommand";
import AuditLogEntry from "../structures/AuditLogEntry";
import AutoModerationRule from "../structures/AutoModerationRule";
import Guild from "../structures/Guild";
import GuildPreview from "../structures/GuildPreview";
import GuildScheduledEvent from "../structures/GuildScheduledEvent";
import GuildTemplate from "../structures/GuildTemplate";
import Integration from "../structures/Integration";
import Invite, { type InviteWithMetadata } from "../structures/Invite";
import type Member from "../structures/Member";
import Role from "../structures/Role";
import Soundboard from "../structures/Soundboard";
import VoiceState from "../structures/VoiceState";
import Webhook from "../structures/Webhook";
import QueryBuilder from "../util/QueryBuilder";
import * as Routes from "../util/Routes";
import Channel from "../structures/Channel";
import GuildJoinRequest from "../structures/GuildJoinRequest";
import { setTimeout } from "node:timers/promises";

/** Various methods for interacting with guilds. Located at {@link Client#rest | Client#rest}{@link RESTManager#guilds | .guilds}. */
export default class Guilds {
    private _manager: RESTManager;
    constructor(manager: RESTManager) {
        this._manager = manager;
    }

    /**
     * Accept or deny a guild join request.
     * @param guildID The ID of the guild.
     * @param requestID The ID of the join request.
     * @param options The options for actioning the join request.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#joinRequests | Guild#joinRequests}
     */
    async actionJoinRequest(guildID: string, requestID: string, options: Types.Guilds.ActionGuildJoinRequestOptions): Promise<Types.Guilds.GuildJoinRequest> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.Guilds.RawGuildJoinRequest>({
            method: "PATCH",
            path:   Routes.GUILD_JOIN_REQUEST(guildID, requestID),
            json:   {
                action:           options.action,
                rejection_reason: options.rejectionReason
            }
        }).then(data => this._manager.client.guilds.get(guildID)?.joinRequests.update(data) ?? new GuildJoinRequest(data, this._manager.client));
    }

    /**
     * Add a member to a guild. Requires an access token with the `guilds.join` scope.
     *
     * Returns the newly added member upon success, or void if the member is already in the guild.
     * @param guildID The ID of the guild.
     * @param userID The ID of the user to add.
     * @param options The options for adding the member.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#members | Guild#members}
     */
    async addMember(guildID: string, userID: string, options: Types.Guilds.AddMemberOptions): Promise<Member | undefined> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.Guilds.RESTMember | null>({
            method: "PUT",
            path:   Routes.GUILD_MEMBER(guildID, userID),
            json:   {
                access_token: options.accessToken,
                deaf:         options.deaf,
                mute:         options.mute,
                nick:         options.nick,
                roles:        options.roles
            }
        }).then(data => data === null ? undefined : this._manager.client.util.updateMember(guildID, userID, data));
    }

    /**
     * Add a role to a member.
     * @param guildID The ID of the guild.
     * @param memberID The ID of the member.
     * @param roleID The ID of the role to add.
     * @param reason The reason for adding the role.
     * @caching This method **does not** cache its result.
     */
    async addMemberRole(guildID: string, memberID: string, roleID: string, reason?: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "PUT",
            path:   Routes.GUILD_MEMBER_ROLE(guildID, memberID, roleID),
            reason
        });
    }

    /**
     * Begin a prune.
     * @param guildID The ID of the guild.
     * @param options The options for the prune.
     * @caching This method **does not** cache its result.
     */
    async beginPrune(guildID: string, options?: Types.Guilds.BeginPruneOptions): Promise<number | null> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<{ pruned: number | null; }>({
            method: "POST",
            path:   Routes.GUILD_PRUNE(guildID),
            json:   {
                days:                options?.days,
                compute_prune_count: options?.computePruneCount,
                include_roles:       options?.includeRoles
            },
            reason: options?.reason
        }).then(data => data.pruned);
    }

    /**
     * Ban up to 200 members from a guild. This requires both the `BAN_MEMBERS` and `MANAGE_GUILD` permissions.
     * If no members were banned, a {@link Constants~JSONErrorCodes.FAILED_TO_BAN_USERS | FAILED_TO_BAN_USERS } will be returned.
     * The bot user is ignored.
     * @param guildID The ID of the guild.
     * @param options The options for banning.
     */
    async bulkBan(guildID: string, options: Types.Guilds.BulkBanOptions): Promise<Types.Guilds.BulkBanResponse> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.Guilds.RawBulkBanResponse>({
            method: "POST",
            path:   Routes.GUILD_BULK_BAN(guildID),
            json:   {
                delete_message_seconds: options.deleteMessageSeconds,
                user_ids:               options.userIDs
            },
            reason: options.reason
        }).then(data => ({
            bannedUsers: data.banned_users,
            failedUsers: data.failed_users
        }));
    }

    /**
     * Create an auto moderation rule for a guild.
     * @param guildID The ID of the guild.
     * @param options The options for creating the rule.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#autoModerationRules | Guild#autoModerationRules}
     */
    async createAutoModerationRule(guildID: string, options: Types.AutoModeration.CreateAutoModerationRuleOptions): Promise<AutoModerationRule> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.AutoModeration.RawAutoModerationRule>({
            method: "POST",
            path:   Routes.GUILD_AUTOMOD_RULES(guildID),
            json:   {
                actions: options.actions.map(a => ({
                    metadata: {
                        channel_id:       a.metadata.channelID,
                        custom_message:   a.metadata.customMessage,
                        duration_seconds: a.metadata.durationSeconds
                    },
                    type: a.type
                })),
                enabled:          options.enabled,
                event_type:       options.eventType,
                exempt_channels:  options.exemptChannels,
                exempt_roles:     options.exemptRoles,
                name:             options.name,
                trigger_metadata: options.triggerMetadata ? {
                    allow_list:                      options.triggerMetadata.allowList,
                    keyword_filter:                  options.triggerMetadata.keywordFilter,
                    mention_raid_protection_enabled: options.triggerMetadata.mentionRaidProtectionEnabled,
                    mention_total_limit:             options.triggerMetadata.mentionTotalLimit,
                    presets:                         options.triggerMetadata.presets,
                    regex_patterns:                  options.triggerMetadata.regexPatterns
                } : undefined,
                trigger_type: options.triggerType
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.autoModerationRules.update(data) ?? new AutoModerationRule(data, this._manager.client));
    }

    /**
     * Create a ban for a user.
     * @param guildID The ID of the guild.
     * @param userID The ID of the user to ban.
     * @param options The options for creating the ban.
     * @caching This method **does not** cache its result.
     */
    async createBan(guildID: string, userID: string, options?: Types.Guilds.CreateBanOptions): Promise<void> {
        options = this._manager.client.util._freeze(options);
        let deleteMessageSeconds: number | undefined = options?.deleteMessageSeconds;
        if (options?.deleteMessageDays !== undefined && !Object.hasOwn(options, "deleteMessageSeconds")) {
            deleteMessageSeconds = options.deleteMessageDays! * 86400;
        }
        await this._manager.authRequest<null>({
            method: "PUT",
            path:   Routes.GUILD_BAN(guildID, userID),
            json:   { delete_message_seconds: deleteMessageSeconds },
            reason: options?.reason
        });
    }

    /**
     * Create a channel in a guild.
     * @param guildID The ID of the guild.
     * @param options The options for creating the channel.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#channels | Guild#channels}
     */
    async createChannel<T extends Types.Channels.GuildChannelsWithoutThreads>(guildID: string, type: T, options: Omit<Types.Guilds.CreateChannelOptions, "type">): Promise<ChannelTypeMap[T]> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.Channels.RawGuildChannel>({
            method: "POST",
            path:   Routes.GUILD_CHANNELS(guildID),
            json:   {
                available_tags: options.availableTags ? options.availableTags.map(tag => ({
                    emoji_id:   tag.emoji?.id,
                    emoji_name: tag.emoji?.name,
                    moderated:  tag.moderated,
                    name:       tag.name
                })) : options.availableTags,
                bitrate:                       options.bitrate,
                default_auto_archive_duration: options.defaultAutoArchiveDuration,
                default_forum_layout:          options.defaultForumLayout,
                default_reaction_emoji:        options.defaultReactionEmoji ? { emoji_id: options.defaultReactionEmoji.id, emoji_name: options.defaultReactionEmoji.name } : options.defaultReactionEmoji,
                default_sort_order:            options.defaultSortOrder,
                name:                          options.name,
                nsfw:                          options.nsfw,
                parent_id:                     options.parentID,
                permission_overwrites:         options.permissionOverwrites,
                position:                      options.position,
                rate_limit_per_user:           options.rateLimitPerUser,
                rtc_region:                    options.rtcRegion,
                topic:                         options.topic,
                type,
                user_limit:                    options.userLimit,
                video_quality_mode:            options.videoQualityMode
            },
            reason: options.reason
        }).then(data => this._manager.client.util.updateChannel(data)) as never;
    }

    /**
     * Create an emoji in a guild.
     * @param guildID The ID of the guild.
     * @param options The options for creating the emoji.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#emojis | Guild#emojis}<br>{@link Client#users | Client#users} (creator, if applicable)
     */
    async createEmoji(guildID: string, options: Types.Guilds.CreateGuildEmojiOptions): Promise<Types.Guilds.GuildEmoji> {
        options = this._manager.client.util._freeze(options);
        let image: string | undefined;
        if (options.image) {
            image = this._manager.client.util._convertImage(options.image, "image");
        }
        return this._manager.authRequest<Types.Guilds.RawGuildEmoji>({
            method: "POST",
            path:   Routes.GUILD_EMOJIS(guildID),
            json:   {
                image,
                name:  options.name,
                roles: options.roles
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.emojis.update(data) ?? this._manager.client.util.convertGuildEmoji(data));
    }

    /**
     * Create a role.
     * @param guildID The ID of the guild.
     * @param options The options for creating the role.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#roles | Guild#roles}
     */
    async createRole(guildID: string, options?: Types.Guilds.CreateRoleOptions): Promise<Role> {
        options = this._manager.client.util._freeze(options);
        let icon: string | undefined;
        if (options?.icon) {
            icon = this._manager.client.util._convertImage(options.icon, "icon");
        }
        return this._manager.authRequest<Types.Guilds.RawRole>({
            method: "POST",
            path:   Routes.GUILD_ROLES(guildID),
            json:   {
                colors: options?.colors || options?.color ? {
                    primary_color:   options.colors?.primaryColor ?? options.color,
                    secondary_color: options.colors?.secondaryColor,
                    tertiary_color:  options.colors?.tertiaryColor
                } : undefined,
                hoist:         options?.hoist,
                icon,
                mentionable:   options?.mentionable,
                name:          options?.name,
                permissions:   options?.permissions,
                unicode_emoji: options?.unicodeEmoji
            },
            reason: options?.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.roles.update(data, guildID) ?? new Role(data, this._manager.client, guildID));
    }

    /**
     * Create a scheduled event in a guild.
     * @param guildID The ID of the guild.
     * @param options The options for creating the scheduled event.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#scheduledEvents | Guild#scheduledEvents}
     */
    async createScheduledEvent(guildID: string, options: Types.ScheduledEvents.CreateScheduledEventOptions): Promise<GuildScheduledEvent> {
        options = this._manager.client.util._freeze(options);
        let image: string | undefined;
        if (options.image) {
            image = this._manager.client.util._convertImage(options.image, "image");
        }
        return this._manager.authRequest<Types.ScheduledEvents.RawScheduledEvent>({
            method: "POST",
            path:   Routes.GUILD_SCHEDULED_EVENTS(guildID),
            json:   {
                channel_id:           options.channelID,
                description:          options.description,
                entity_metadata:      options.entityMetadata ? { location: options.entityMetadata.location } : undefined,
                entity_type:          options.entityType,
                image,
                name:                 options.name,
                privacy_level:        options.privacyLevel,
                scheduled_end_time:   options.scheduledEndTime,
                scheduled_start_time: options.scheduledStartTime
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.scheduledEvents.update(data) ?? new GuildScheduledEvent(data, this._manager.client));
    }

    /**
     * Create an exception to the recurrence rule for a scheduled event.
     * @param guildID The ID of the guild.
     * @param eventID The ID of the scheduled event.
     * @param options The options for creating the scheduled event exception.
     * @caching This method **may** cache its result. The result will not be cached if the scheduled event is not cached.
     * @caches {@link GuildScheduledEvent#exceptions | GuildScheduledEvent#exceptions}
     */
    async createScheduledEventException(guildID: string, eventID: string, options: Types.ScheduledEvents.CreateScheduledEventExceptionOptions): Promise<Types.ScheduledEvents.ScheduledEventException> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.ScheduledEvents.RawScheduledEventException>({
            method: "POST",
            path:   Routes.GUILD_SCHEDULED_EVENT_EXCEPTIONS(guildID, eventID),
            json:   {
                is_canceled:                   options.isCanceled,
                original_scheduled_start_time: options.originalScheduledStartTime,
                scheduled_end_time:            options.scheduledEndTime,
                scheduled_start_time:          options.scheduledStartTime
            },
            reason: options.reason
        }).then(data => {
            const exception = this._manager.client.util.convertScheduledEventException(data);
            const event = this._manager.client.guilds.get(guildID)?.scheduledEvents.get(eventID);
            if (event) {
                const existing = event.exceptions.findIndex(e => e.eventExceptionID === exception.eventExceptionID);
                if (existing === -1) {
                    event.exceptions.push(exception);
                } else {
                    event.exceptions[existing] = exception;
                }
            }
            return exception;
        });
    }

    /**
     * Create a soundboard sound
     * @param guildID The ID of the guild
     * @param options The options for creating the soundboard sound
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#soundboardSounds | Guild#soundboardSounds}
     */
    async createSoundboardSound(guildID: string, options: Types.Guilds.CreateSoundboardSoundOptions): Promise<Soundboard> {
        options = this._manager.client.util._freeze(options);
        let sound: string | undefined;
        if (options.sound) {
            sound = this._manager.client.util._convertSound(options.sound, "sound");
        }
        return this._manager.authRequest<Types.Channels.RawSoundboard>({
            method: "POST",
            path:   Routes.SOUNDBOARD_SOUNDS(guildID),
            json:   {
                emoji_id:   options.emojiID,
                emoji_name: options.emojiName,
                name:       options.name,
                sound,
                volume:     options.volume
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.soundboardSounds.update(data) ?? new Soundboard(data, this._manager.client));
    }

    /**
     * Create a sticker.
     * @param guildID The ID of the guild.
     * @param options The options for creating the sticker.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#stickers | Guild#stickers}<br>{@link Client#users | Client#users} (creator, if applicable)
     */
    async createSticker(guildID: string, options: Types.Guilds.CreateStickerOptions): Promise<Types.Guilds.Sticker> {
        options = this._manager.client.util._freeze(options);
        const magic = this._manager.client.util.getMagic(options.file.contents);
        let mime: string | undefined;
        switch (magic) {
            // png & apng have the same magic
            case "89504E47": {
                mime = "image/png"; break;
            }
            // lottie
            case "7B227622": {
                mime = "application/json"; break;
            }
        }

        const form = new FormData();
        form.append("description", options.description);
        form.append("name", options.name);
        form.append("tags", options.tags);
        form.append("file", new Blob([options.file.contents], { type: mime }), options.file.name);

        return this._manager.authRequest<Types.Guilds.RawSticker>({
            method: "POST",
            path:   Routes.GUILD_STICKERS(guildID),
            form,
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.stickers.update(data) ?? this._manager.client.util.convertSticker(data));
    }

    /**
     * Create a guild template.
     * @param guildID The ID of the guild to create a template from.
     * @param options The options for creating the template.
     */
    async createTemplate(guildID: string, options: Types.GuildTemplate.CreateTemplateOptions): Promise<GuildTemplate> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.GuildTemplate.RawGuildTemplate>({
            method: "POST",
            path:   Routes.GUILD_TEMPLATES(guildID),
            json:   {
                description: options.description,
                name:        options.name
            }
        }).then(data => new GuildTemplate(data, this._manager.client));
    }

    /**
     * Delete an auto moderation rule.
     * @param guildID The ID of the guild.
     * @param ruleID The ID of the rule to delete.
     * @param reason The reason for deleting the rule.
     * @caching This method **does not** cache its result.
     */
    async deleteAutoModerationRule(guildID: string, ruleID: string, reason?: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_AUTOMOD_RULE(guildID, ruleID),
            reason
        });
    }

    /**
     * Delete an emoji.
     * @param guildID The ID of the guild.
     * @param emojiID The ID of the emoji.
     * @param reason The reason for deleting the emoji.
     * @caching This method **does not** cache its result.
     */
    async deleteEmoji(guildID: string, emojiID: string, reason?: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_EMOJI(guildID, emojiID),
            reason
        });
    }

    /**
     * Delete an integration.
     * @param guildID The ID of the guild.
     * @param integrationID The ID of the integration.
     * @param reason The reason for deleting the integration.
     * @caching This method **does not** cache its result.
     */
    async deleteIntegration(guildID: string, integrationID: string, reason?: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_INTEGRATION(guildID, integrationID),
            reason
        });
    }

    /**
     * Delete a role.
     * @param guildID The ID of the guild.
     * @param roleID The ID of the role to delete.
     * @param reason The reason for deleting the role.
     * @caching This method **does not** cache its result.
     */
    async deleteRole(guildID: string, roleID: string, reason?: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_ROLE(guildID, roleID),
            reason
        });
    }

    /**
     * Delete a scheduled event.
     * @param guildID The ID of the guild.
     * @param eventID The ID of the scheduled event.
     * @param reason The reason for deleting the scheduled event. Discord's docs do not explicitly state a reason can be provided, so it may not be used.
     * @caching This method **does not** cache its result.
     */
    async deleteScheduledEvent(guildID: string, eventID: string, reason?: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_SCHEDULED_EVENT(guildID, eventID),
            reason
        });
    }

    /**
     * Delete an exception to the recurrence rule for a scheduled event.
     * @param guildID The ID of the guild.
     * @param eventID The ID of the scheduled event.
     * @param exceptionID The ID of the scheduled event exception.
     * @param reason The reason for deleting the scheduled event exception.
     * @caching This method **may** remove the result from cache. The result will not be removed if the scheduled event is not cached.
     * @caches {@link GuildScheduledEvent#exceptions | GuildScheduledEvent#exceptions}
     */
    async deleteScheduledEventException(guildID: string, eventID: string, exceptionID: string, reason?: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_SCHEDULED_EVENT_EXCEPTION(guildID, eventID, exceptionID),
            reason
        });
        const event = this._manager.client.guilds.get(guildID)?.scheduledEvents.get(eventID);
        if (event) {
            event.exceptions = event.exceptions.filter(exception => exception.eventExceptionID !== exceptionID);
        }
    }

    /**
     *
     * @param guildID The ID of the guild.
     * @param soundID The ID of the soundboard sound to delete.
     * @param reason The reason for deleting the soundboard sound.
     * @caching This method **does not** cache its result.
     */
    async deleteSoundboardSound(guildID: string, soundID: string, reason?: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.SOUNDBOARD_SOUND(guildID, soundID),
            reason
        });
    }

    /**
     * Delete a sticker.
     * @param guildID The ID of the guild.
     * @param stickerID The ID of the sticker to delete.
     * @param reason The reason for deleting the sticker.
     * @caching This method **does not** cache its result.
     */
    async deleteSticker(guildID: string, stickerID: string, reason?: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_STICKER(guildID, stickerID),
            reason
        });
    }

    /**
     * Delete a template.
     * @param guildID The ID of the guild.
     * @param code The code of the template.
     * @caching This method **does not** cache its result.
     */
    async deleteTemplate(guildID: string, code: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_TEMPLATE(guildID, code)
        });
    }

    /**
     * Edit a guild.
     * @param guildID The ID of the guild.
     * @param options The options for editing the guild.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not already cached.
     * @caches {@link Client#guilds | Client#guilds}
     */
    async edit(guildID: string, options: Types.Guilds.EditGuildOptions): Promise<Guild> {
        options = this._manager.client.util._freeze(options);
        let banner: string | undefined, discoverySplash: string | undefined, icon: string | undefined, splash: string | undefined;
        if (options.banner) {
            banner = this._manager.client.util._convertImage(options.banner, "banner");
        }
        if (options.discoverySplash) {
            discoverySplash = this._manager.client.util._convertImage(options.discoverySplash, "discovery splash");
        }
        if (options.icon) {
            icon = this._manager.client.util._convertImage(options.icon, "icon");
        }
        if (options.splash) {
            splash = this._manager.client.util._convertImage(options.splash, "splash");
        }
        return this._manager.authRequest<Types.Guilds.RawGuild>({
            method: "PATCH",
            path:   Routes.GUILD(guildID),
            json:   {
                afk_channel_id:                options.afkChannelID,
                afk_timeout:                   options.afkTimeout,
                banner,
                default_message_notifications: options.defaultMessageNotifications,
                description:                   options.description,
                discovery_splash:              discoverySplash,
                explicit_content_filter:       options.explicitContentFilter,
                features:                      options.features,
                icon,
                name:                          options.name,
                preferred_locale:              options.preferredLocale,
                premium_progress_bar_enabled:  options.premiumProgressBarEnabled,
                public_updates_channel_id:     options.publicUpdatesChannelID,
                region:                        options.region,
                rules_channel_id:              options.rulesChannelID,
                safety_alerts_channel_id:      options.safetyAlertsChannelID,
                splash,
                system_channel_flags:          options.systemChannelFlags,
                system_channel_id:             options.systemChannelID,
                verification_level:            options.verificationLevel
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.has(guildID) ? this._manager.client.guilds.update(data, true) : new Guild(data, this._manager.client, true));
    }

    /**
     * Edit an existing auto moderation rule.
     * @param guildID The ID of the guild.
     * @param ruleID The ID of the rule to edit.
     * @param options The options for editing the rule.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#autoModerationRules | Guild#autoModerationRules}
     */
    async editAutoModerationRule(guildID: string, ruleID: string, options: Types.AutoModeration.EditAutoModerationRuleOptions): Promise<AutoModerationRule> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.AutoModeration.RawAutoModerationRule>({
            method: "PATCH",
            path:   Routes.GUILD_AUTOMOD_RULE(guildID, ruleID),
            json:   {
                actions: options.actions?.map(a => ({
                    metadata: {
                        channel_id:       a.metadata.channelID,
                        custom_message:   a.metadata.customMessage,
                        duration_seconds: a.metadata.durationSeconds
                    },
                    type: a.type
                })),
                enabled:          options.enabled,
                event_type:       options.eventType,
                exempt_channels:  options.exemptChannels,
                exempt_roles:     options.exemptRoles,
                name:             options.name,
                trigger_metadata: options.triggerMetadata ? {
                    allow_list:                      options.triggerMetadata.allowList,
                    keyword_filter:                  options.triggerMetadata.keywordFilter,
                    mention_raid_protection_enabled: options.triggerMetadata.mentionRaidProtectionEnabled,
                    mention_total_limit:             options.triggerMetadata.mentionTotalLimit,
                    presets:                         options.triggerMetadata.presets,
                    regex_patterns:                  options.triggerMetadata.regexPatterns
                } : undefined
            },
            reason: options.reason
        }).then(data =>  this._manager.client.guilds.get(guildID)?.autoModerationRules.update(data) ?? new AutoModerationRule(data, this._manager.client));
    }

    /**
     * Edit the positions of channels in a guild.
     * @param guildID The ID of the guild.
     * @param options The channels to move. Unedited channels do not need to be specified.
     * @caching This method **does not** cache its result.
     */
    async editChannelPositions(guildID: string, options: Array<Types.Guilds.ModifyChannelPositionsEntry>): Promise<void> {
        options = this._manager.client.util._freeze(options);
        await this._manager.authRequest<null>({
            method: "PATCH",
            path:   Routes.GUILD_CHANNELS(guildID),
            json:   options.map(o => ({
                id:       o.id,
                // lock_permissions: o.lockPermissions ?? null,
                // parent_id:        o.parentID ?? null,
                position: o.position ?? null
            }))
        });
    }

    /**
     * Modify the current member in a guild.
     * @param guildID The ID of the guild.
     * @param options The options for editing the member.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#members | Guild#members}<br>{@link Guild#clientMember | Guild#clientMember}
     */
    async editCurrentMember(guildID: string, options: Types.Guilds.EditCurrentMemberOptions): Promise<Member> {
        options = this._manager.client.util._freeze(options);

        let avatar = options.avatar;
        let banner = options.banner;

        if (avatar) {
            avatar = this._manager.client.util._convertImage(avatar, "avatar");
        }

        if (banner) {
            banner = this._manager.client.util._convertImage(banner, "banner");
        }

        return this._manager.authRequest<Types.Guilds.RESTMember>({
            method: "PATCH",
            path:   Routes.GUILD_MEMBER(guildID, "@me"),
            json:   { nick: options.nick, banner, avatar, bio: options.bio },
            reason: options.reason
        }).then(data => this._manager.client.util.updateMember(guildID, data.user.id, data));
    }

    /**
     * Edit the current member's voice state in a guild. `channelID` is required, and the current member must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-current-user-voice-state-caveats) for more information.
     * @param guildID The ID of the guild.
     * @param options The options for editing the voice state.
     * @caching This method **does not** cache its result.
     */
    async editCurrentUserVoiceState(guildID: string, options: Types.Guilds.EditCurrentUserVoiceStateOptions): Promise<void> {
        options = this._manager.client.util._freeze(options);
        await this._manager.authRequest<null>({
            method: "PATCH",
            path:   Routes.GUILD_VOICE_STATE(guildID, "@me"),
            json:   {
                channel_id:                 options.channelID,
                suppress:                   options.suppress,
                request_to_speak_timestamp: options.requestToSpeakTimestamp
            }
        });
    }

    /**
     * Edit an existing emoji.
     * @param guildID The ID of the guild the emoji is in.
     * @param options The options for editing the emoji.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#emojis | Guild#emojis}
     */
    async editEmoji(guildID: string, emojiID: string, options: Types.Guilds.EditGuildEmojiOptions): Promise<Types.Guilds.GuildEmoji> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.Guilds.RawGuildEmoji>({
            method: "PATCH",
            path:   Routes.GUILD_EMOJI(guildID, emojiID),
            json:   {
                name:  options.name,
                roles: options.roles
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.emojis.update(data) ?? this._manager.client.util.convertGuildEmoji(data));
    }

    /**
     * Edit the incident actions for a guild.
     * @param guildID The ID of the guild.
     * @param options The options for editing the incident actions.
     * @caching This method **does not** cache its result.
     */
    async editIncidentActions(guildID: string, options: Types.Guilds.EditIncidentActionsOptions): Promise<Types.Guilds.IncidentActions> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.Guilds.RawIncidentActions>({
            method: "PUT",
            path:   Routes.GUILD_INCIDENT_ACTIONS(guildID),
            json:   {
                dms_disabled_until:     options.dmsDisabledUntil,
                invites_disabled_until: options.invitesDisabledUntil
            },
            reason: options.reason
        }).then(data => ({
            dmsDisabledUntil:     data.dms_disabled_until,
            invitesDisabledUntil: data.invites_disabled_until
        }));
    }

    /**
     * Edit a guild member. Use editCurrentMember if you wish to update the nick of this client using the `CHANGE_NICKNAME` permission.
     * @param guildID The ID of the guild.
     * @param memberID The ID of the member.
     * @param options The options for editing the member.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#members | Guild#members}
     */
    async editMember(guildID: string, memberID: string, options: Types.Guilds.EditMemberOptions): Promise<Member> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.Guilds.RESTMember>({
            method: "PATCH",
            path:   Routes.GUILD_MEMBER(guildID, memberID),
            json:   {
                channel_id:                   options.channelID,
                communication_disabled_until: options.communicationDisabledUntil,
                deaf:                         options.deaf,
                flags:                        options.flags,
                mute:                         options.mute,
                nick:                         options.nick,
                roles:                        options.roles
            },
            reason: options.reason
        }).then(data => this._manager.client.util.updateMember(guildID, memberID, data));
    }

    /**
     * Edit a guild's onboarding configuration.
     * @param guildID The ID of the guild.
     * @param options The options for editing the onboarding configuration.
     * @caching This method **does not** cache its result.
     */
    async editOnboarding(guildID: string, options: Types.Guilds.EditOnboardingOptions): Promise<Types.Guilds.Onboarding> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.Guilds.RawOnboarding>({
            method: "PUT",
            path:   Routes.GUILD_ONBOARDING(guildID),
            json:   {
                enabled:             options.enabled,
                default_channel_ids: options.defaultChannelIDs,
                prompts:             options.prompts?.map(p => ({
                    id:           p.id,
                    in_oboarding: p.inOnboarding,
                    options:      p.options.map(o => ({
                        channel_ids: o.channelIDs,
                        description: o.description,
                        emoji:       o.emoji,
                        id:          o.id,
                        role_ids:    o.roleIDs,
                        title:       o.title
                    })),
                    required:      p.required,
                    single_select: p.singleSelect,
                    title:         p.title
                })),
                mode: options.mode
            },
            reason: options.reason
        }).then(data => ({
            defaultChannelIDs: data.default_channel_ids,
            enabled:           data.enabled,
            guildID:           data.guild_id,
            mode:              data.mode,
            prompts:           data.prompts.map(p => ({
                id:           p.id,
                inOnboarding: p.in_onboarding,
                options:      p.options.map(o => ({
                    channelIDs:  o.channel_ids,
                    description: o.description,
                    emoji:       o.emoji,
                    id:          o.id,
                    roleIDs:     o.role_ids,
                    title:       o.title
                })),
                required:     p.required,
                singleSelect: p.single_select,
                title:        p.title
            }))
        }));
    }

    /**
     * Edit an existing role.
     * @param guildID The ID of the guild.
     * @param options The options for editing the role.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#roles | Guild#roles}
     */
    async editRole(guildID: string, roleID: string, options: Types.Guilds.EditRoleOptions): Promise<Role> {
        options = this._manager.client.util._freeze(options);
        let icon: string | undefined;
        if (options.icon) {
            icon = this._manager.client.util._convertImage(options.icon, "icon");
        }
        return this._manager.authRequest<Types.Guilds.RawRole>({
            method: "PATCH",
            path:   Routes.GUILD_ROLE(guildID, roleID),
            json:   {
                colors: options?.colors || options?.color ? {
                    primary_color:   options.colors?.primaryColor ?? options.color,
                    secondary_color: options.colors?.secondaryColor,
                    tertiary_color:  options.colors?.tertiaryColor
                } : undefined,
                hoist:         options.hoist,
                icon,
                mentionable:   options.mentionable,
                name:          options.name,
                permissions:   options.permissions,
                unicode_emoji: options.unicodeEmoji
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.roles.update(data, guildID) ?? new Role(data, this._manager.client, guildID));
    }

    /**
     * Edit the position of roles in a guild.
     * @param guildID The ID of the guild.
     * @param options The roles to move.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#roles | Guild#roles}
     */
    async editRolePositions(guildID: string, options: Array<Types.Guilds.EditRolePositionsEntry>, reason?: string): Promise<Array<Role>> {
        options = this._manager.client.util._freeze(options);
        const guild = this._manager.client.guilds.get(guildID);
        return this._manager.authRequest<Array<Types.Guilds.RawRole>>({
            method: "PATCH",
            path:   Routes.GUILD_ROLES(guildID),
            json:   options.map(o => ({
                id:       o.id,
                position: o.position
            })),
            reason
        }).then(data => data.map(role => guild?.roles.update(role, guildID) ?? new Role(role, this._manager.client, guildID)));
    }

    /**
     * Edit an existing scheduled event in a guild.
     * @param guildID The ID of the guild.
     * @param scheduledEventID The ID of the scheduled event.
     * @param options The options for editing the scheduled event.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#scheduledEvents | Guild#scheduledEvents}
     */
    async editScheduledEvent(guildID: string, scheduledEventID: string, options: Types.ScheduledEvents.EditScheduledEventOptions): Promise<GuildScheduledEvent> {
        options = this._manager.client.util._freeze(options);
        let image: string | undefined;
        if (options.image) {
            image = this._manager.client.util._convertImage(options.image, "image");
        }
        return this._manager.authRequest<Types.ScheduledEvents.RawScheduledEvent>({
            method: "PATCH",
            path:   Routes.GUILD_SCHEDULED_EVENT(guildID, scheduledEventID),
            json:   {
                channel_id:           options.channelID,
                description:          options.description,
                entity_metadata:      options.entityMetadata ? { location: options.entityMetadata.location } : undefined,
                entity_type:          options.entityType,
                image,
                name:                 options.name,
                privacy_level:        options.privacyLevel,
                status:               options.status,
                scheduled_end_time:   options.scheduledEndTime,
                scheduled_start_time: options.scheduledStartTime
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.scheduledEvents.update(data) ?? new GuildScheduledEvent(data, this._manager.client));
    }

    /**
     * Edit an exception to the recurrence rule for a scheduled event.
     * @param guildID The ID of the guild.
     * @param eventID The ID of the scheduled event.
     * @param exceptionID The ID of the scheduled event exception.
     * @param options The options for editing the scheduled event exception.
     * @caching This method **may** cache its result. The result will not be cached if the scheduled event is not cached.
     * @caches {@link GuildScheduledEvent#exceptions | GuildScheduledEvent#exceptions}
     */
    async editScheduledEventException(guildID: string, eventID: string, exceptionID: string, options: Types.ScheduledEvents.EditScheduledEventExceptionOptions): Promise<Types.ScheduledEvents.ScheduledEventException> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.ScheduledEvents.RawScheduledEventException>({
            method: "PATCH",
            path:   Routes.GUILD_SCHEDULED_EVENT_EXCEPTION(guildID, eventID, exceptionID),
            json:   {
                is_canceled:          options.isCanceled,
                scheduled_end_time:   options.scheduledEndTime,
                scheduled_start_time: options.scheduledStartTime
            },
            reason: options.reason
        }).then(data => {
            const exception = this._manager.client.util.convertScheduledEventException(data);
            const event = this._manager.client.guilds.get(guildID)?.scheduledEvents.get(eventID);
            if (event) {
                const existing = event.exceptions.findIndex(e => e.eventExceptionID === exception.eventExceptionID);
                if (existing === -1) {
                    event.exceptions.push(exception);
                } else {
                    event.exceptions[existing] = exception;
                }
            }
            return exception;
        });
    }

    /**
     * Edit a soundboard sound.
     * @param guildID The ID of the guild.
     * @param soundID The ID of the soundboard sound to edit.
     * @param options The options for editing the soundboard sound.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#soundboardSounds | Guild#soundboardSounds}
     */
    async editSoundboardSound(guildID: string, soundID: string, options: Types.Guilds.EditSoundboardSoundOptions): Promise<Soundboard> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.Channels.RawSoundboard>({
            method: "PATCH",
            path:   Routes.SOUNDBOARD_SOUND(guildID, soundID),
            json:   {
                emoji_id:   options.emojiID,
                emoji_name: options.emojiName,
                name:       options.name,
                volume:     options.volume
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.soundboardSounds.update(data) ?? new Soundboard(data, this._manager.client));
    }

    /**
     * Edit a sticker.
     * @param guildID The ID of the guild.
     * @param options The options for editing the sticker.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#stickers | Guild#stickers}
     */
    async editSticker(guildID: string, stickerID: string, options: Types.Guilds.EditStickerOptions): Promise<Types.Guilds.Sticker> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.Guilds.RawSticker>({
            method: "PATCH",
            path:   Routes.GUILD_STICKER(guildID, stickerID),
            json:   {
                description: options.description,
                name:        options.name,
                tags:        options.tags
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.stickers.update(data) ?? this._manager.client.util.convertSticker(data));
    }

    /**
     * Edit a guild template.
     * @param guildID The ID of the guild.
     * @param code The code of the template.
     * @param options The options for editing the template.
     * @caching This method **does not** cache its result.
     */
    async editTemplate(guildID: string, code: string, options: Types.GuildTemplate.EditGuildTemplateOptions): Promise<GuildTemplate> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.GuildTemplate.RawGuildTemplate>({
            method: "PATCH",
            path:   Routes.GUILD_TEMPLATE(guildID, code),
            json:   {
                code,
                description: options.description,
                name:        options.name
            }
        }).then(data => new GuildTemplate(data, this._manager.client));
    }

    /**
     * Edit a guild member's voice state. `channelID` is required, and the user must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-user-voice-state) for more information.
     * @param guildID The ID of the guild.
     * @param memberID The ID of the member.
     * @param options The options for editing the voice state.
     * @caching This method **does not** cache its result.
     */
    async editUserVoiceState(guildID: string, memberID: string, options: Types.Guilds.EditUserVoiceStateOptions): Promise<void> {
        options = this._manager.client.util._freeze(options);
        await this._manager.authRequest<null>({
            method: "PATCH",
            path:   Routes.GUILD_VOICE_STATE(guildID, memberID),
            json:   {
                channel_id: options.channelID,
                suppress:   options.suppress
            }
        });
    }

    /**
     * Edit the welcome screen in a guild.
     * @param guildID The ID of the guild.
     * @param options The options for editing the welcome screen.
     * @caching This method **does not** cache its result.
     */
    async editWelcomeScreen(guildID: string, options: Types.Guilds.EditWelcomeScreenOptions): Promise<Types.Guilds.WelcomeScreen> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.Guilds.RawWelcomeScreen>({
            method: "PATCH",
            path:   Routes.GUILD_WELCOME_SCREEN(guildID),
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
            reason: options.reason
        }).then(data => ({
            description:     data.description,
            welcomeChannels: data.welcome_channels.map(channel => ({
                channelID:   channel.channel_id,
                description: channel.description,
                emojiID:     channel.emoji_id,
                emojiName:   channel.emoji_name
            }))
        }));
    }

    /**
     * Edit the widget of a guild.
     * @param guildID The ID of the guild.
     * @param options The options for editing the widget.
     * @caching This method **does not** cache its result.
     */
    async editWidget(guildID: string, options: Types.Guilds.WidgetSettings): Promise<Types.Guilds.Widget> {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest<Types.Guilds.RawWidget>({
            method: "PATCH",
            path:   Routes.GUILD_WIDGET(guildID),
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
                tag:           m.username,
                username:      m.username
            })),
            name:          data.name,
            presenceCount: data.presence_count
        }));
    }

    /**
     * Get a guild.
     * @param guildID The ID of the guild.
     * @param withCounts If the approximate number of members and online members should be included.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not already cached.
     * @caches {@link Client#guilds | Client#guilds}
     */
    async get(guildID: string, withCounts?: boolean): Promise<Guild> {
        const query = new QueryBuilder();
        query.setIfPresent("with_counts", withCounts);
        return this._manager.authRequest<Types.Guilds.RawGuild>({
            method: "GET",
            path:   Routes.GUILD(guildID),
            query
        }).then(data => this._manager.client.guilds.has(guildID) ? this._manager.client.guilds.update(data, true) : new Guild(data, this._manager.client, true));
    }

    /**
     * Get the active threads in a guild.
     * @param guildID The ID of the guild.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#threads | Guild#threads}
     */
    async getActiveThreads(guildID: string): Promise<Types.Guilds.GetActiveThreadsResponse> {
        return this._manager.authRequest<{ members: Array<Types.Channels.RawThreadMember>; threads: Array<Types.Channels.RawThreadChannel>; }>({
            method: "GET",
            path:   Routes.GUILD_ACTIVE_THREADS(guildID)
        }).then(data => ({
            members: data.members.map(member => ({
                flags:         member.flags,
                id:            member.id,
                joinTimestamp: new Date(member.join_timestamp),
                userID:        member.user_id
            })),
            threads: data.threads.map(rawThread => this._manager.client.util.updateThread(rawThread))
        }));
    }

    /**
     * Get a guild's audit log.
     * @param guildID The ID of the guild.
     * @param options The options for getting the audit logs.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#autoModerationRules | Guild#autoModerationRules}<br>{@link Guild#scheduledEvents | Guild#scheduledEvents}<br>{@link Guild#integrations | Guild#integrations}<br>{@link Guild#threads | Guild#threads}<br>{@link Client#users | Client#users}
     */
    async getAuditLog(guildID: string, options?: Types.AuditLog.GetAuditLogOptions): Promise<Types.AuditLog.AuditLog> {
        const guild = this._manager.client.guilds.get(guildID);
        const query = new QueryBuilder();
        query.setIfPresent("action_type", options?.actionType);
        query.setIfPresent("before", options?.before);
        query.setIfPresent("limit", options?.limit);
        query.setIfPresent("user_id", options?.userID);
        return this._manager.authRequest<Types.AuditLog.RawAuditLog>({
            method: "GET",
            path:   Routes.GUILD_AUDIT_LOG(guildID),
            query
        }).then(data => ({
            applicationCommands:  data.application_commands.map(command => new ApplicationCommand(command, this._manager.client)),
            autoModerationRules:  data.auto_moderation_rules.map(rule => guild?.autoModerationRules.update(rule) ?? new AutoModerationRule(rule, this._manager.client)),
            entries:              data.audit_log_entries.map(entry => new AuditLogEntry(entry, this._manager.client)),
            guildScheduledEvents: data.guild_scheduled_events.map(event => guild?.scheduledEvents.update(event) ?? new GuildScheduledEvent(event, this._manager.client)),
            integrations:         data.integrations.map(integration => guild?.integrations.update(integration, guildID) ?? new Integration(integration, this._manager.client, guildID)),
            threads:              data.threads.map(rawThread => this._manager.client.util.updateThread(rawThread)),
            users:                data.users.map(user => this._manager.client.users.update(user)),
            webhooks:             data.webhooks.map(webhook => new Webhook(webhook, this._manager.client))
        }));
    }

    /**
     * Get an auto moderation rule for a guild.
     * @param guildID The ID of the guild.
     * @param ruleID The ID of the rule to get.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#autoModerationRules | Guild#autoModerationRules}
     */
    async getAutoModerationRule(guildID: string, ruleID: string): Promise<AutoModerationRule> {
        return this._manager.authRequest<Types.AutoModeration.RawAutoModerationRule>({
            method: "GET",
            path:   Routes.GUILD_AUTOMOD_RULE(guildID, ruleID)
        }).then(data => this._manager.client.guilds.get(guildID)?.autoModerationRules.update(data) ?? new AutoModerationRule(data, this._manager.client));
    }

    /**
     * Get the auto moderation rules for a guild.
     * @param guildID The ID of the guild.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#autoModerationRules | Guild#autoModerationRules}
     */
    async getAutoModerationRules(guildID: string): Promise<Array<AutoModerationRule>> {
        const guild = this._manager.client.guilds.get(guildID);
        return this._manager.authRequest<Array<Types.AutoModeration.RawAutoModerationRule>>({
            method: "GET",
            path:   Routes.GUILD_AUTOMOD_RULES(guildID)
        }).then(data => data.map(rule => guild?.autoModerationRules.update(rule) ?? new AutoModerationRule(rule, this._manager.client)));
    }

    /**
     * Get a ban.
     * @param guildID The ID of the guild.
     * @param userID The ID of the user to get the ban of.
     * @caching This method **does** cache part of its result.
     * @caches {@link Client#users | Client#users}
     */
    async getBan(guildID: string, userID: string): Promise<Types.Guilds.Ban> {
        return this._manager.authRequest<Types.Guilds.RawBan>({
            method: "GET",
            path:   Routes.GUILD_BAN(guildID, userID)
        }).then(data => ({
            reason: data.reason,
            user:   this._manager.client.users.update(data.user)
        }));
    }

    /**
     * Get the bans in a guild.
     * @param guildID The ID of the guild.
     * @param options The options for getting the bans.
     * @caching This method **does** cache part of its result.
     * @caches {@link Client#users | Client#users}
     */
    async getBans(guildID: string, options?: Types.Guilds.GetBansOptions): Promise<Array<Types.Guilds.Ban>> {
        const _getBans = async (_options?: Types.Guilds.GetBansOptions): Promise<Array<Types.Guilds.Ban>> => {
            const query = new QueryBuilder();
            query.setIfPresent("after", _options?.after);
            query.setIfPresent("before", _options?.before);
            query.setIfPresent("limit", _options?.limit);
            return this._manager.authRequest<Array<Types.Guilds.RawBan>>({
                method: "GET",
                path:   Routes.GUILD_BANS(guildID),
                query
            }).then(data => data.map(ban => ({
                reason: ban.reason,
                user:   this._manager.client.users.update(ban.user)
            })));
        };

        const limit = options?.limit ?? 1000;
        let chosenOption: "after" | "before";
        if (options?.after) {
            chosenOption = "after";
        } else if (options?.before) {
            chosenOption = "before";
        } else {
            chosenOption = "after";
        }
        let optionValue = options?.[chosenOption] ?? undefined;

        let bans: Array<Types.Guilds.Ban> = [];
        while (bans.length < limit) {
            const limitLeft = limit - bans.length;
            const limitToFetch = Math.min(limitLeft, 1000);
            this._manager.client.emit("debug", `Getting ${limitLeft} more ban${limitLeft === 1 ? "" : "s"} for ${guildID}: ${optionValue ?? ""}`);
            const bansChunk = await _getBans({
                limit:          limitToFetch,
                [chosenOption]: optionValue
            });

            if (bansChunk.length === 0) {
                break;
            }

            bans = bans.concat(bansChunk);
            optionValue = bansChunk.at(-1)!.user.id;

            if (bansChunk.length < 1000) {
                break;
            }
        }

        return bans;
    }

    /**
     * Get the channels in a guild. Does not include threads.
     * @param guildID The ID of the guild.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#channels | Guild#channels}
     */
    async getChannels(guildID: string): Promise<Array<Types.Channels.AnyGuildChannelWithoutThreads>> {
        return this._manager.authRequest<Array<Types.Channels.RawGuildChannel>>({
            method: "GET",
            path:   Routes.GUILD_CHANNELS(guildID)
        }).then(data => data.map(d => this._manager.client.util.updateChannel(d)));
    }

    /**
     * Get an emoji in a guild.
     * @param guildID The ID of the guild.
     * @param emojiID The ID of the emoji to get.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#emojis | Guild#emojis}
     */
    async getEmoji(guildID: string, emojiID: string): Promise<Types.Guilds.GuildEmoji> {
        return this._manager.authRequest<Types.Guilds.RawGuildEmoji>({
            method: "GET",
            path:   Routes.GUILD_EMOJI(guildID, emojiID)
        }).then(data => this._manager.client.guilds.get(guildID)?.emojis.update(data) ?? this._manager.client.util.convertGuildEmoji(data));
    }

    /**
     * Get the emojis in a guild.
     * @param guildID The ID of the guild.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#emojis | Guild#emojis} (will be completely cleared and refilled)
     */
    async getEmojis(guildID: string): Promise<Array<Types.Guilds.GuildEmoji>> {
        return this._manager.authRequest<Array<Types.Guilds.RawGuildEmoji>>({
            method: "GET",
            path:   Routes.GUILD_EMOJIS(guildID)
        }).then(data => {
            const guild = this._manager.client.guilds.get(guildID);
            guild?.emojis.clear();
            return data.map(emoji => guild?.emojis.update(emoji) ?? this._manager.client.util.convertGuildEmoji(emoji));
        });
    }

    /**
     * Get the integrations in a guild.
     * @param guildID The ID of the guild.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#integrations | Guild#integrations}
     */
    async getIntegrations(guildID: string): Promise<Array<Integration>> {
        const guild = this._manager.client.guilds.get(guildID);
        return this._manager.authRequest<Array<Types.Guilds.RawIntegration>>({
            method: "GET",
            path:   Routes.GUILD_INTEGRATIONS(guildID)
        }).then(data => data.map(integration => guild?.integrations.update(integration, guildID) ?? new Integration(integration, this._manager.client, guildID)));
    }

    /**
     * Get the invites of a guild.
     * @param guildID The ID of the guild to get the invites of.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#invites | Guild#invites}
     */
    async getInvites<CH extends Types.Invites.GuildInviteChannel = Types.Invites.GuildInviteChannel>(guildID: string): Promise<Array<InviteWithMetadata<CH>>> {
        const guild = this._manager.client.guilds.get(guildID);
        return this._manager.authRequest<Array<Types.Invites.RawInvite>>({
            method: "GET",
            path:   Routes.GUILD_INVITES(guildID)
        }).then(data => data.map(invite => guild?.invites.update(invite) as InviteWithMetadata<CH> ?? Invite.withMetadata<CH>(invite, this._manager.client)));
    }

    /**
     * Get guild join requests.
     * @param guildID The ID of the guild.
     * @param options The options for getting join requests.
     * @caching This method **may** cache its result. The results will not be cached if the guild is not cached.
     * @caches {@link Guild#joinRequests | Guild#joinRequests}
     */
    async getJoinRequests(guildID: string, options: Types.Guilds.GetGuildJoinRequestsOptions): Promise<Types.Guilds.GuildJoinRequests> {
        options = this._manager.client.util._freeze(options);
        const query = new QueryBuilder();
        query.setIfPresent("after", options.after);
        query.setIfPresent("before", options.before);
        query.setIfPresent("limit", options.limit);
        query.set("status", options.status);
        return this._manager.authRequest<Types.Guilds.RawGuildJoinRequestsResponse>({
            method: "GET",
            path:   Routes.GUILD_JOIN_REQUESTS(guildID),
            query
        }).then(data => {
            const guild = this._manager.client.guilds.get(guildID);
            return {
                guildJoinRequests: data.guild_join_requests.map(request => guild?.joinRequests.update(request) ?? new GuildJoinRequest(request, this._manager.client)),
                total:             data.total
            };
        });
    }

    /**
     * Get a guild member.
     * @param guildID The ID of the guild.
     * @param memberID The ID of the member.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#members | Guild#members}
     */
    async getMember(guildID: string, memberID: string): Promise<Member> {
        return this._manager.authRequest<Types.Guilds.RESTMember>({
            method: "GET",
            path:   Routes.GUILD_MEMBER(guildID, memberID)
        }).then(data => this._manager.client.util.updateMember(guildID, memberID, data));
    }

    /**
     * Get a guild's members. This requires the `GUILD_MEMBERS` intent.
     * @param guildID The ID of the guild.
     * @param options The options for getting the members.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#members | Guild#members}}
     */
    async getMembers(guildID: string, options?: Types.Guilds.GetMembersOptions): Promise<Array<Member>> {
        const query = new QueryBuilder();
        query.setIfPresent("after", options?.after);
        query.setIfPresent("limit", options?.limit);
        return this._manager.authRequest<Array<Types.Guilds.RESTMember>>({
            method: "GET",
            path:   Routes.GUILD_MEMBERS(guildID),
            query
        }).then(data => data.map(d => this._manager.client.util.updateMember(guildID, d.user.id, d)));
    }

    /**
     * Get a guild's new member welcome info.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getNewMemberWelcome(guildID: string): Promise<Types.Guilds.NewMemberWelcome | null> {
        return this._manager.authRequest<Types.Guilds.RawNewMemberWelcome | null>({
            method: "GET",
            path:   Routes.GUILD_NEW_MEMBER_WELCOME(guildID)
        }).then(data => data === null ? null : {
            enabled:          data.enabled,
            guildID:          data.guild_id,
            newMemberActions: data.new_member_actions.map(action => action === null ? null : {
                actionType:  action.action_type,
                channelID:   action.channel_id,
                description: action.description,
                emoji:       action.emoji,
                icon:        action.icon,
                title:       action.title
            }),
            resourceChannels: data.resource_channels.map(channel => channel === null ? null : {
                channelID:   channel.channel_id,
                description: channel.description,
                emoji:       channel.emoji,
                icon:        channel.icon,
                title:       channel.title
            }),
            welcomeMessage: {
                authorIDs: data.welcome_message.author_ids,
                message:   data.welcome_message.message
            }
        });
    }

    /**
     * Get a guild's onboarding info.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getOnboarding(guildID: string): Promise<Types.Guilds.Onboarding> {
        return this._manager.authRequest<Types.Guilds.RawOnboarding>({
            method: "GET",
            path:   Routes.GUILD_ONBOARDING(guildID)
        }).then(data => ({
            defaultChannelIDs: data.default_channel_ids,
            enabled:           data.enabled,
            guildID:           data.guild_id,
            mode:              data.mode,
            prompts:           data.prompts.map(p => ({
                id:           p.id,
                inOnboarding: p.in_onboarding,
                options:      p.options.map(o => ({
                    channelIDs:  o.channel_ids,
                    description: o.description,
                    emoji:       o.emoji,
                    id:          o.id,
                    roleIDs:     o.role_ids,
                    title:       o.title
                })),
                required:     p.required,
                singleSelect: p.single_select,
                title:        p.title
            }))
        }));
    }

    /**
     * Get a preview of a guild. If the client is not already in this guild, the guild must be lurkable.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getPreview(guildID: string): Promise<GuildPreview> {
        return this._manager.authRequest<Types.Guilds.RawGuildPreview>({
            method: "GET",
            path:   Routes.GUILD_PREVIEW(guildID)
        }).then(data => new GuildPreview(data, this._manager.client));
    }

    /**
     * Get the prune count of a guild.
     * @param guildID The ID of the guild.
     * @param options The options for getting the prune count.
     * @caching This method **does not** cache its result.
     */
    async getPruneCount(guildID: string, options?: Types.Guilds.GetPruneCountOptions): Promise<number> {
        const query = new QueryBuilder();
        query.setIfPresent("days", options?.days);
        query.setIfPresent("include_roles", options?.includeRoles?.join(","));
        return this._manager.authRequest<{ pruned: number; }>({
            method: "GET",
            path:   Routes.GUILD_PRUNE(guildID),
            query
        }).then(data => data.pruned);
    }

    /**
     * Get a role in a guild.
     * @param guildID The ID of the guild.
     * @param roleID The ID of the role to get.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#roles | Guild#roles}
     */
    async getRole(guildID: string, roleID: string): Promise<Role> {
        const guild = this._manager.client.guilds.get(guildID);
        return this._manager.authRequest<Types.Guilds.RawRole>({
            method: "GET",
            path:   Routes.GUILD_ROLE(guildID, roleID)
        }).then(data => guild?.roles.update(data, guildID) ?? new Role(data, this._manager.client, guildID));
    }

    /**
     * Get the member count of the roles in a guild. The result is a key-value map of role id to member count.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getRoleMemberCounts(guildID: string): Promise<Record<string, number>> {
        return this._manager.authRequest<Record<string, number>>({
            method: "GET",
            path:   Routes.GUILD_ROLE_MEMBER_COUNTS(guildID)
        });
    }

    /**
     * Get the roles in a guild.
     * @param guildID The ID of the guild.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#roles | Guild#roles}
     */
    async getRoles(guildID: string): Promise<Array<Role>> {
        const guild = this._manager.client.guilds.get(guildID);
        return this._manager.authRequest<Array<Types.Guilds.RawRole>>({
            method: "GET",
            path:   Routes.GUILD_ROLES(guildID)
        }).then(data => data.map(role => guild?.roles.update(role, guildID) ?? new Role(role, this._manager.client, guildID)));
    }

    /**
     * Get a scheduled event.
     * @param guildID The ID of the guild.
     * @param eventID The ID of the scheduled event to get.
     * @param withUserCount If the number of users subscribed to the event should be included.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#scheduledEvents | Guild#scheduledEvents}
     */
    async getScheduledEvent(guildID: string, eventID: string, withUserCount?: number): Promise<GuildScheduledEvent> {
        const guild = this._manager.client.guilds.get(guildID);
        const query = new QueryBuilder();
        query.setIfPresent("with_user_count", withUserCount);
        return this._manager.authRequest<Types.ScheduledEvents.RawScheduledEvent>({
            method: "GET",
            path:   Routes.GUILD_SCHEDULED_EVENT(guildID, eventID),
            query
        }).then(data => guild?.scheduledEvents.update(data) ?? new GuildScheduledEvent(data, this._manager.client));
    }

    /**
     * Get users subscribed to an exception for a scheduled event.
     * @param guildID The ID of the guild.
     * @param eventID The ID of the scheduled event.
     * @param exceptionID The ID of the scheduled event exception.
     * @param options The options for getting the users.
     * @caching This method **does** cache part of its result. Members will not be cached if the guild is not cached.
     * @caches {@link Client#users | Client#users}<br>{@link Guild#members | Guild#members}
     */
    async getScheduledEventExceptionUsers(guildID: string, eventID: string, exceptionID: string, options?: Types.ScheduledEvents.GetScheduledEventUsersOptions): Promise<Array<Types.ScheduledEvents.ScheduledEventUser>> {
        const guild = this._manager.client.guilds.get(guildID);
        const query = new QueryBuilder();
        query.setIfPresent("after", options?.after);
        query.setIfPresent("before", options?.before);
        query.setIfPresent("limit", options?.limit);
        query.setIfPresent("with_member", options?.withMember);
        return this._manager.authRequest<Array<Types.ScheduledEvents.RawScheduledEventUser>>({
            method: "GET",
            path:   Routes.GUILD_SCHEDULED_EVENT_EXCEPTION_USERS(guildID, eventID, exceptionID),
            query
        }).then(data => data.map(d => ({
            guildScheduledEvent:            guild?.scheduledEvents.get(d.guild_scheduled_event_id),
            guildScheduledEventExceptionID: d.guild_scheduled_event_exception_id,
            guildScheduledEventID:          d.guild_scheduled_event_id,
            member:                         d.member ? this._manager.client.util.updateMember(guildID, d.member.user!.id, d.member) : undefined,
            response:                       d.response,
            user:                           this._manager.client.users.update(d.user),
            userID:                         d.user_id
        })));
    }

    /**
     * Get user counts for a scheduled event and optionally specific exceptions.
     * @param guildID The ID of the guild.
     * @param eventID The ID of the scheduled event.
     * @param options The options for getting the user counts.
     * @caching This method **may** cache the event user count. The count will not be cached if the scheduled event is not cached.
     * @caches {@link GuildScheduledEvent#userCount | GuildScheduledEvent#userCount}
     */
    async getScheduledEventUserCounts(guildID: string, eventID: string, options?: Types.ScheduledEvents.GetScheduledEventUserCountsOptions): Promise<Types.ScheduledEvents.ScheduledEventUserCounts> {
        const query = new QueryBuilder();
        for (const exceptionID of options?.guildScheduledEventExceptionIDs ?? []) {
            query.append("guild_scheduled_event_exception_ids", exceptionID);
        }
        return this._manager.authRequest<Types.ScheduledEvents.RawScheduledEventUserCounts>({
            method: "GET",
            path:   Routes.GUILD_SCHEDULED_EVENT_USER_COUNTS(guildID, eventID),
            query
        }).then(data => {
            const event = this._manager.client.guilds.get(guildID)?.scheduledEvents.get(eventID);
            if (event) {
                event.userCount = data.guild_scheduled_event_count;
            }
            return {
                guildScheduledEventCount:           data.guild_scheduled_event_count,
                guildScheduledEventExceptionCounts: data.guild_scheduled_event_exception_counts
            };
        });
    }

    /**
     * Get the users subscribed to a scheduled event.
     * @param guildID The ID of the guild.
     * @param eventID The ID of the scheduled event.
     * @param options The options for getting the users.
     * @caching This method **does** cache part of its result. Members will not be cached if the guild is not cached.
     * @caches {@link Client#users | Client#users}<br>{@link Guild#members | Guild#members}
     */
    async getScheduledEventUsers(guildID: string, eventID: string, options?: Types.ScheduledEvents.GetScheduledEventUsersOptions): Promise<Array<Types.ScheduledEvents.ScheduledEventUser>> {
        const guild = this._manager.client.guilds.get(guildID);
        const query = new QueryBuilder();
        query.setIfPresent("after", options?.after);
        query.setIfPresent("before", options?.before);
        query.setIfPresent("limit", options?.limit);
        query.setIfPresent("with_member", options?.withMember);
        return this._manager.authRequest<Array<Types.ScheduledEvents.RawScheduledEventUser>>({
            method: "GET",
            path:   Routes.GUILD_SCHEDULED_EVENT_USERS(guildID, eventID),
            query
        }).then(data => data.map(d => ({
            guildScheduledEvent:            guild?.scheduledEvents.get(d.guild_scheduled_event_id),
            guildScheduledEventExceptionID: d.guild_scheduled_event_exception_id,
            guildScheduledEventID:          d.guild_scheduled_event_id,
            member:                         d.member ? this._manager.client.util.updateMember(guildID, d.member.user!.id, d.member) : undefined,
            response:                       d.response,
            user:                           this._manager.client.users.update(d.user),
            userID:                         d.user_id
        })));
    }

    /**
     * Get a guild's scheduled events.
     * @param guildID The ID of the guild.
     * @param withUserCount If the number of users subscribed to the event should be included.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#scheduledEvents | Guild#scheduledEvents}
     */
    async getScheduledEvents(guildID: string, withUserCount?: number): Promise<Array<GuildScheduledEvent>> {
        const guild = this._manager.client.guilds.get(guildID);
        const query = new QueryBuilder();
        query.setIfPresent("with_user_count", withUserCount);
        return this._manager.authRequest<Array<Types.ScheduledEvents.RawScheduledEvent>>({
            method: "GET",
            path:   Routes.GUILD_SCHEDULED_EVENTS(guildID),
            query
        }).then(data => data.map(d => guild?.scheduledEvents.update(d) ?? new GuildScheduledEvent(d, this._manager.client)));
    }

    /**
     * Get a soundboard sound.
     * @param guildID The ID of the guild.
     * @param soundID The ID of the soundboard sound to get.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#soundboardSounds | Guild#soundboardSounds}
     */
    async getSoundboardSound(guildID: string, soundID: string): Promise<Soundboard> {
        const guild = this._manager.client.guilds.get(guildID);
        return this._manager.authRequest<Types.Channels.RawSoundboard>({
            method: "GET",
            path:   Routes.SOUNDBOARD_SOUND(guildID, soundID)
        }).then(data => guild?.soundboardSounds.update(data) ?? new Soundboard(data, this._manager.client));
    }

    /**
     * Get a guild's soundboard sounds.
     * @param guildID The ID of the guild.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#soundboardSounds | Guild#soundboardSounds}
     */
    async getSoundboardSounds(guildID: string): Promise<Array<Soundboard>> {
        const guild = this._manager.client.guilds.get(guildID);
        return this._manager.authRequest<{ items: Array<Types.Channels.RawSoundboard>; }>({
            method: "GET",
            path:   Routes.SOUNDBOARD_SOUNDS(guildID)
        }).then(data => data.items.map(d => guild?.soundboardSounds.update(d) ?? new Soundboard(d, this._manager.client)));
    }

    /**
     * Get a sticker. Response will include a user if the client has the `MANAGE_EMOJIS_AND_STICKERS` permissions.
     * @param guildID The ID of the guild.
     * @param stickerID The ID of the sticker to get.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#stickers | Guild#stickers}
     */
    async getSticker(guildID: string, stickerID: string): Promise<Types.Guilds.Sticker> {
        return this._manager.authRequest<Types.Guilds.RawSticker>({
            method: "GET",
            path:   Routes.GUILD_STICKER(guildID, stickerID)
        }).then(data => this._manager.client.guilds.get(guildID)?.stickers.update(data) ?? this._manager.client.util.convertSticker(data));
    }

    /**
     * Get a guild's stickers. Stickers will include a user if the client has the `MANAGE_EMOJIS_AND_STICKERS` permissions.
     * @param guildID The ID of the guild.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#stickers | Guild#stickers} (will be completely cleared and refilled)
     */
    async getStickers(guildID: string): Promise<Array<Types.Guilds.Sticker>> {
        return this._manager.authRequest<Array<Types.Guilds.RawSticker>>({
            method: "GET",
            path:   Routes.GUILD_STICKERS(guildID)
        }).then(data => {
            const guild = this._manager.client.guilds.get(guildID);
            guild?.stickers.clear();
            return data.map(sticker => guild?.stickers.update(sticker) ?? this._manager.client.util.convertSticker(sticker));
        });
    }

    /**
     * Get a guild template.
     * @param code The code of the template to get.
     * @caching This method **does not** cache its result.
     */
    async getTemplate(code: string): Promise<GuildTemplate> {
        return this._manager.authRequest<Types.GuildTemplate.RawGuildTemplate>({
            method: "GET",
            path:   Routes.GUILD_TEMPLATE_CODE(code)
        }).then(data => new GuildTemplate(data, this._manager.client));
    }

    /**
     * Get a guild's templates.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getTemplates(guildID: string): Promise<Array<GuildTemplate>> {
        return this._manager.authRequest<Array<Types.GuildTemplate.RawGuildTemplate>>({
            method: "GET",
            path:   Routes.GUILD_TEMPLATES(guildID)
        }).then(data => data.map(d => new GuildTemplate(d, this._manager.client)));
    }

    /**
     * Get the vanity url of a guild.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getVanityURL(guildID: string): Promise<Types.Guilds.GetVanityURLResponse> {
        return this._manager.authRequest<Types.Guilds.GetVanityURLResponse>({
            method: "GET",
            path:   Routes.GUILD_VANITY_URL(guildID)
        });
    }

    /**
     * Get the list of usable voice regions for a guild. This will return VIP servers when the guild is VIP-enabled.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getVoiceRegions(guildID: string): Promise<Array<Types.Voice.VoiceRegion>> {
        return this._manager.authRequest<Array<Types.Voice.VoiceRegion>>({
            method: "GET",
            path:   Routes.GUILD_VOICE_REGIONS(guildID)
        });
    }

    /**
     * Get the voice state of a member.
     * @param guildID The ID of the guild.
     * @param memberID The ID of the member. Use `@me` for the bot user.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#voiceStates | Guild#voiceStates}
     */
    async getVoiceState(guildID: string, memberID: string): Promise<VoiceState> {
        return this._manager.authRequest<Types.Voice.RawVoiceState>({
            method: "GET",
            path:   Routes.GUILD_VOICE_STATE(guildID, memberID)
        }).then(data => this._manager.client.guilds.get(guildID)?.voiceStates.update(data) ?? new VoiceState(data, this._manager.client));
    }

    /**
     * Get the welcome screen for a guild.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getWelcomeScreen(guildID: string): Promise<Types.Guilds.WelcomeScreen> {
        return this._manager.authRequest<Types.Guilds.RawWelcomeScreen>({
            method: "GET",
            path:   Routes.GUILD_WELCOME_SCREEN(guildID)
        }).then(data => ({
            description:     data.description,
            welcomeChannels: data.welcome_channels.map(channel => ({
                channelID:   channel.channel_id,
                description: channel.description,
                emojiID:     channel.emoji_id,
                emojiName:   channel.emoji_name
            }))
        }));
    }

    /**
     * Get the widget of a guild.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getWidget(guildID: string): Promise<Types.Guilds.Widget> {
        return this._manager.authRequest<Types.Guilds.RawWidget>({
            method: "GET",
            path:   Routes.GUILD_WIDGET(guildID)
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
                tag:           m.username,
                username:      m.username
            })),
            name:          data.name,
            presenceCount: data.presence_count
        }));
    }

    /**
     * Get the widget image of a guild.
     * @param guildID The ID of the guild.
     * @param style The style of the image.
     * @caching This method **does not** cache its result.
     */
    async getWidgetImage(guildID: string, style?: Types.Guilds.WidgetImageStyle): Promise<Buffer> {
        const query = new QueryBuilder();
        query.setIfPresent("style", style);
        return this._manager.request<Buffer>({
            method: "GET",
            path:   Routes.GUILD_WIDGET_IMAGE(guildID),
            query
        });
    }

    /**
     * Get the raw JSON widget of a guild.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getWidgetJSON(guildID: string): Promise<Types.Guilds.RawWidget> {
        return this._manager.request<Types.Guilds.RawWidget>({
            method: "GET",
            path:   Routes.GUILD_WIDGET_JSON(guildID)
        });
    }

    /**
     * Get a guild's widget settings.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getWidgetSettings(guildID: string): Promise<Types.Guilds.WidgetSettings> {
        return this._manager.authRequest<Types.Guilds.RawWidgetSettings>({
            method: "GET",
            path:   Routes.GUILD_WIDGET(guildID)
        }).then(data => ({
            channelID: data.channel_id,
            enabled:   data.enabled
        }));
    }

    /**
     * Search a guild's members.
     * @param guildID The ID of the guild.
     * @param options The options to search with.
     * @param retryOnIndexNotAvailable If the search should be retried if Discord replies with an index unavailable response. This will retry at most one time, waiting for `retry_after` or 15-45 seconds.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#members | Guild#members}
     */
    async memberSearch(guildID: string, options?: Types.Guilds.MemberSearchOptions, retryOnIndexNotAvailable = true): Promise<Types.Guilds.MemberSearchResults> {
        /* eslint-disable @typescript-eslint/explicit-function-return-type, unicorn/consistent-function-scoping */
        const formatRange = <T>(data: Types.Guilds.MemberSearchRangeQuery<T>) => ({
            range: data.range === undefined ? undefined : {
                gte: data.range.gte,
                lte: data.range.lte
            }
        });
        const formatOrQuery = <T>(data: Types.Guilds.MemberSearchOrQuery<T>) => ({
            or_query: data.orQuery
        });
        const formatOrQueryRange = <T>(data: Types.Guilds.MemberSearchOrQueryRange<T>) => ({
            or_query: data.orQuery,
            range:    data.range === undefined ? undefined : {
                gte: data.range.gte,
                lte: data.range.lte
            }
        });
        const formatAndOrQuery = <T>(data: Types.Guilds.MemberSearchAndOrQuery<T>) => ({
            and_query: data.andQuery,
            or_query:  data.orQuery
        });
        const formatSearchFilter = (data: Types.Guilds.MemberSearchFilter) => ({
            did_rejoin:       data.didRejoin,
            guild_joined_at:  data.guildJoinedAt === undefined ? undefined : formatRange(data.guildJoinedAt),
            is_pending:       data.isPending,
            join_source_type: data.joinSourceType === undefined ? undefined : formatOrQuery(data.joinSourceType),
            role_ids:         data.roleIDs === undefined ? undefined : formatAndOrQuery(data.roleIDs),
            safety_signals:   data.safetySignals === undefined ? undefined : {
                automod_quarantined_username: data.safetySignals.automodQuarantinedUsername,
                communication_disabled_until: data.safetySignals.communicationDisabledUntil === undefined ? undefined : formatRange(data.safetySignals.communicationDisabledUntil),
                unusual_account_activity:     data.safetySignals.unusualAccountActivity,
                unusual_dm_activity_until:    data.safetySignals.unusualDmActivityUntil === undefined ? undefined : formatRange(data.safetySignals.unusualDmActivityUntil)
            },
            source_invite_code: data.sourceInviteCode === undefined ? undefined : formatOrQuery(data.sourceInviteCode),
            user_id:            data.userID === undefined ? undefined : formatOrQueryRange(data.userID),
            usernames:          data.usernames === undefined ? undefined : formatOrQuery(data.usernames)
        });
        const formatPaginationFilter = (data: Types.Guilds.MemberSearchPaginationFilter) => ({
            guild_joined_at: data.guildJoinedAt,
            user_id:         data.userID
        });
        /* eslint-enable @typescript-eslint/explicit-function-return-type, unicorn/consistent-function-scoping */
        return this._manager.authRequest<Types.Guilds.RawMemberSearchResults | Types.Guilds.MemberSearchNotIndexedResult>({
            method: "POST",
            path:   Routes.GUILD_MEMBERS_SEARCH(guildID),
            json:   {
                after:     options?.after === undefined ? undefined : formatPaginationFilter(options.after),
                and_query: options?.andQuery === undefined ? undefined : formatSearchFilter(options.andQuery),
                before:    options?.before === undefined ? undefined : formatPaginationFilter(options.before),
                limit:     options?.limit,
                or_query:  options?.orQuery === undefined ? undefined : formatSearchFilter(options.orQuery),
                sort:      options?.sort
            }
        }).then(async data => {
            if ("retry_after" in data) {
                if (!retryOnIndexNotAvailable) {
                    throw new Error(`Member search for guild ${guildID} failed due to the index not being available.`);
                }

                let retryAfter = data.retry_after;
                if (retryAfter === 0) {
                    retryAfter = Math.floor(Math.random() * 30) + 15;
                }
                this._manager.client.emit("debug", `Retrying member search for ${guildID} in ${retryAfter} seconds...`);
                await setTimeout(retryAfter * 1000);
                return this.memberSearch(guildID, options, false);
            }

            return {
                guildID: data.guild_id,
                members: data.members.map(m => ({
                    integrationType:  m.integration_type,
                    inviterID:        m.inviter_id,
                    joinSourceType:   m.join_source_type,
                    member:           this._manager.client.util.updateMember(guildID, m.member.user.id, m.member),
                    sourceInviteCode: m.source_invite_code
                })),
                pageResultCount:  data.page_result_count,
                totalResultCount: data.total_result_count
            };
        });
    }

    /**
     * Remove a ban.
     * @param guildID The ID of the guild.
     * @param userID The ID of the user to remove the ban from.
     * @param reason The reason for removing the ban.
     * @caching This method **does not** cache its result.
     */
    async removeBan(guildID: string, userID: string, reason?: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_BAN(guildID, userID),
            reason
        });
    }

    /**
     * Remove a member from a guild.
     * @param guildID The ID of the guild.
     * @param memberID The ID of the user to remove.
     * @param reason The reason for the removal.
     * @caching This method **does not** cache its result.
     */
    async removeMember(guildID: string, memberID: string, reason?: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_MEMBER(guildID, memberID),
            reason
        });
    }

    /**
     * Remove a role from a member.
     * @param guildID The ID of the guild.
     * @param memberID The ID of the member.
     * @param roleID The ID of the role to remove.
     * @param reason The reason for removing the role.
     * @caching This method **does not** cache its result.
     */
    async removeMemberRole(guildID: string, memberID: string, roleID: string, reason?: string): Promise<void> {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_MEMBER_ROLE(guildID, memberID, roleID),
            reason
        });
    }

    /**
     * Search the username & nicknames of members in a guild. See {@link REST/Guilds#memberSearch | memberSearch} for a more detailed search.
     * @param guildID The ID of the guild.
     * @param options The options to search with.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#members | Guild#members}
     */
    async searchMembers(guildID: string, options: Types.Guilds.SearchMembersOptions): Promise<Array<Member>> {
        options = this._manager.client.util._freeze(options);
        const query = new QueryBuilder();
        query.set("query", options.query);
        query.setIfPresent("limit", options.limit);
        return this._manager.authRequest<Array<Types.Guilds.RESTMember>>({
            method: "GET",
            path:   Routes.GUILD_SEARCH_MEMBERS(guildID),
            query
        }).then(data => data.map(d => this._manager.client.util.updateMember(guildID, d.user.id, d)));
    }

    /**
     * Search messages in a guild.
     * @param guildID The ID of the guild.
     * @param options The options to search with.
     * @param retryOnIndexNotAvailable If the search should be retried if Discord replies with an index unavailable response. This will retry at most one time, waiting for `retry_after` or 15-45 seconds.
     * @caching This method **may** cache its result. The messages, channels, and threads will not be cached if the guild is not cached.
     * @caches {@link TextableChannel#messages | TextableChannel#messages}<br>{@link ThreadChannel#messages | ThreadChannel#messages}<br>{@link Guild#channels | Guild#channels}<br>{@link Guild#threads | Guild#threads}
     */
    async searchMessages<T extends Types.Channels.AnyTextableGuildChannel | Types.Shared.Uncached = Types.Channels.AnyTextableGuildChannel | Types.Shared.Uncached>(guildID: string, options?: Types.Guilds.SearchMessagesOptions, retryOnIndexNotAvailable = true): Promise<Types.Guilds.MessageSearchResults<T>> {
        options = this._manager.client.util._freeze(options);
        const query = new QueryBuilder();
        const append = (name: string, value: string | Array<string> | undefined): void => {
            if (Array.isArray(value)) {
                for (const item of value) {
                    query.append(name, item);
                }
            } else if (value !== undefined) {
                query.append(name, value);
            }
        };
        query.setIfPresent("content", options?.content);
        query.setIfPresent("offset", options?.offset);
        query.setIfPresent("min_id", options?.minID);
        query.setIfPresent("max_id", options?.maxID);
        query.setIfPresent("pinned", options?.pinned);
        query.setIfPresent("command_id", options?.commandID);
        query.setIfPresent("command_name", options?.commandName);
        query.setIfPresent("include_nsfw", options?.includeNSFW);
        query.setIfPresent("sort_by", options?.sortBy);
        query.setIfPresent("sort_order", options?.sortOrder);
        append("author_id", options?.authorIDs);
        append("channel_id", options?.channelIDs);
        append("has", options?.has);
        append("mentions", options?.mentions);
        return this._manager.authRequest<Types.Guilds.RawMessageSearchResults | Types.Guilds.MessageSearchNotIndexedResult>({
            method: "GET",
            path:   Routes.GUILD_MESSAGES_SEARCH(guildID),
            query
        }).then(async data => {
            if ("retry_after" in data) {
                if (!retryOnIndexNotAvailable) {
                    throw new Error(`Message search for guild ${guildID} failed due to the index not being available.`);
                }

                let retryAfter = data.retry_after;
                if (retryAfter === 0) {
                    retryAfter = Math.floor(Math.random() * 30) + 15;
                }
                this._manager.client.emit("debug", `Retrying message search for guild ${guildID} in ${retryAfter} seconds...`);
                await setTimeout(retryAfter * 1000);
                return this.searchMessages<T>(guildID, options, false);
            }

            const guild = this._manager.client.guilds.get(guildID);
            return {
                analyticsID:              data.analytics_id,
                channels:                 data.channels?.map(c => guild?.channels.update(guild) ?? Channel.from<Types.Channels.AnyGuildChannelWithoutThreads>(c, this._manager.client)),
                doingDeepHistoricalIndex: data.doing_deep_historical_index,
                documentsIndexed:         data.documents_indexed,
                members:                  data.members?.map(m => ({
                    flags:         m.flags,
                    id:            m.id,
                    joinTimestamp: new Date(m.join_timestamp),
                    member:        m.member && guild?.members.update(m.member, guildID),
                    userID:        m.user_id
                })),
                messages:     data.messages.map(messages => messages.map(message => this._manager.client.util.updateMessage<T>(message))),
                threads:      data.threads?.map(thread => this._manager.client.util.updateThread(thread)),
                totalResults: data.total_results
            };
        });
    }

    /**
     * Sync a guild template.
     * @param guildID The ID of the guild.
     * @param code The code of the template to sync.
     * @caching This method **does not** cache its result.
     */
    async syncTemplate(guildID: string, code: string): Promise<GuildTemplate> {
        return this._manager.authRequest<Types.GuildTemplate.RawGuildTemplate>({
            method: "PUT",
            path:   Routes.GUILD_TEMPLATE(guildID, code)
        }).then(data => new GuildTemplate(data, this._manager.client));
    }
}
