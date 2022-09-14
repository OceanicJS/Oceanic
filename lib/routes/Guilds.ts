/** @module Routes/Guilds */
import type {
    CreateEmojiOptions,
    CreateGuildOptions,
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
    EditCurrentUserVoiceStateOptions,
    CreateChannelReturn,
    CreateChannelOptions
} from "../types/guilds";
import * as Routes from "../util/Routes";
import type { CreateAutoModerationRuleOptions, EditAutoModerationRuleOptions, RawAutoModerationRule } from "../types/auto-moderation";
import type { GuildChannelTypesWithoutThreads, MFALevels } from "../Constants";
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
import GuildTemplate from "../structures/GuildTemplate";
import type { CreateGuildFromTemplateOptions, CreateTemplateOptions, EditGuildTemplateOptions, RawGuildTemplate } from "../types/guild-template";
import GuildPreview from "../structures/GuildPreview";
import type {
    AnyGuildChannelWithoutThreads,
    InviteChannel,
    PartialInviteChannel,
    RawGuildChannel,
    RawInvite,
    RawThreadChannel,
    RawThreadMember
} from "../types/channels";
import Role from "../structures/Role";
import type { VoiceRegion } from "../types/voice";
import Invite from "../structures/Invite";
import Integration from "../structures/Integration";
import AutoModerationRule from "../structures/AutoModerationRule";
import AuditLogEntry from "../structures/AuditLogEntry";
import type RESTManager from "../rest/RESTManager";
import Guild from "../structures/Guild";
import Member from "../structures/Member";
import type { Uncached } from "../types/shared";

/** Various methods for interacting with guilds. */
export default class Guilds {
    #manager: RESTManager;
    constructor(manager: RESTManager) {
        this.#manager = manager;
    }

    /**
     * Add a member to a guild. Requires an access token with the `guilds.join` scope.
     *
     * Returns the newly added member upon success, or void if the member is already in the guild.
     * @param id The ID of the guild.
     * @param userID The ID of the user to add.
     * @param options The options for adding the member.
     */
    async addMember(id: string, userID: string, options: AddMemberOptions): Promise<void | Member> {
        const res = await this.#manager.authRequest<RawMember | null>({
            method: "PUT",
            path:   Routes.GUILD_MEMBER(id, userID),
            json:   {
                access_token: options.accessToken,
                deaf:         options.deaf,
                mute:         options.mute,
                nick:         options.nick,
                roles:        options.roles
            }
        }).then(data => data === null ? undefined : this.#manager.client.util.updateMember(id, userID, data));
        if (res !== undefined) {
            return res;
        }
    }

    /**
     * Add a role to a member.
     * @param id The ID of the guild.
     * @param memberID The ID of the member.
     * @param roleID The ID of the role to add.
     * @param reason The reason for adding the role.
     */
    async addMemberRole(id: string, memberID: string, roleID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "PUT",
            path:   Routes.GUILD_MEMBER_ROLE(id, memberID, roleID),
            reason
        });
    }

    /**
     * Begine a prune.
     * @param id The ID of the guild.
     * @param options The options for the prune.
     */
    async beginPrune(id: string, options?: BeginPruneOptions): Promise<number | null> {
        const reason = options?.reason;
        if (options?.reason) {
            delete options.reason;
        }
        return this.#manager.authRequest<{ pruned: number | null; }>({
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
     * Note: This does NOT add the guild to the client's cache.
     * @param options The options for creating the guild.
     */
    async create(options: CreateGuildOptions): Promise<Guild> {
        if (options.icon) {
            options.icon = this.#manager.client.util._convertImage(options.icon, "icon");
        }
        return this.#manager.authRequest<RawGuild>({
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
        }).then(data => new Guild(data, this.#manager.client));
    }

    /**
     * Create an auto moderation rule for a guild.
     * @param id The ID of the guild.
     * @param options The options for creating the rule.
     */
    async createAutoModerationRule(id: string, options: CreateAutoModerationRuleOptions): Promise<AutoModerationRule> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        return this.#manager.authRequest<RawAutoModerationRule>({
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
        }).then(data => this.#manager.client.guilds.get(id)?.autoModerationRules.update(data) ?? new AutoModerationRule(data, this.#manager.client));
    }

    /**
     * Create a bon for a user.
     * @param guildID The ID of the guild.
     * @param userID The ID of the user to ban.
     * @param options The options for creating the bon.
     */
    async createBan(guildID: string, userID: string, options?: CreateBanOptions): Promise<void> {
        const reason = options?.reason;
        if (options?.reason) {
            delete options.reason;
        }
        if (options?.deleteMessageDays !== undefined && !Object.hasOwn(options, "deleteMessageSeconds")) {
            options.deleteMessageSeconds = options.deleteMessageDays * 86400;
        }
        await this.#manager.authRequest<null>({
            method: "PUT",
            path:   Routes.GUILD_BAN(guildID, userID),
            json:   { delete_message_seconds: options?.deleteMessageSeconds },
            reason
        });
    }

    /**
     * Create a channel in a guild.
     * @param id The ID of the guild.
     * @param options The options for creating the channel.
     */
    async createChannel<T extends GuildChannelTypesWithoutThreads>(id: string, type: T, options: Omit<CreateChannelOptions, "type">): Promise<CreateChannelReturn<T>> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        return this.#manager.authRequest<RawGuildChannel>({
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
                type,
                user_limit:                    options.userLimit,
                video_quality_mode:            options.videoQualityMode
            },
            reason
        }).then(data => this.#manager.client.util.updateChannel(data)) as never;
    }

    /**
     * Create an emoji in a guild.
     * @param id The ID of the guild.
     * @param options The options for creating the emoji.
     */
    async createEmoji(id: string, options: CreateEmojiOptions): Promise<GuildEmoji> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        if (options.image) {
            options.image = this.#manager.client.util._convertImage(options.image, "image");
        }
        return this.#manager.authRequest<RawGuildEmoji>({
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
            user: !data.user ? undefined : this.#manager.client.users.update(data.user)
        }));
    }

    /**
     * Create a guild from a template. This can only be used by bots in less than 10 guilds.
     *
     * Note: This does NOT add the guild to the client's cache.
     * @param code The code of the template to use.
     * @param options The options for creating the guild.
     */
    async createFromTemplate(code: string, options: CreateGuildFromTemplateOptions): Promise<Guild> {
        if (options.icon) {
            options.icon = this.#manager.client.util._convertImage(options.icon, "icon");
        }
        return this.#manager.authRequest<RawGuild>({
            method: "POST",
            path:   Routes.GUILD_TEMPLATE_CODE(code),
            json:   {
                icon: options.icon,
                name: options.name
            }
        }).then(data => new Guild(data, this.#manager.client));
    }

    /**
     * Create a role.
     * @param id The ID of the guild.
     * @param options The options for creating the role.
     */
    async createRole(id: string, options?: CreateRoleOptions): Promise<Role> {
        const reason = options?.reason;
        if (options?.reason) {
            delete options.reason;
        }
        if (options?.icon) {
            options.icon = this.#manager.client.util._convertImage(options.icon, "icon");
        }
        return this.#manager.authRequest<RawRole>({
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
        }).then(data => this.#manager.client.guilds.get(id)?.roles.update(data, id) ?? new Role(data, this.#manager.client, id));
    }

    /**
     * Create a scheduled event in a guild.
     * @param id The ID of the guild.
     * @param options The options for creating the scheduled event.
     */
    async createScheduledEvent(id: string, options: CreateScheduledEventOptions): Promise<GuildScheduledEvent> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        if (options.image) {
            options.image = this.#manager.client.util._convertImage(options.image, "image");
        }
        return this.#manager.authRequest<RawScheduledEvent>({
            method: "POST",
            path:   Routes.GUILD_SCHEDULED_EVENTS(id),
            json:   {
                channel_id:           options.channelID,
                description:          options.description,
                entity_metadata:      !options.entityMetadata ? undefined : { location: options.entityMetadata.location },
                entity_type:          options.entityType,
                image:                options.image,
                name:                 options.name,
                privacy_level:        options.privacyLevel,
                scheduled_end_time:   options.scheduledEndTime,
                scheduled_start_time: options.scheduledStartTime
            },
            reason
        }).then(data => this.#manager.client.guilds.get(id)?.scheduledEvents.update(data) ?? new GuildScheduledEvent(data, this.#manager.client));
    }

    /**
     * Create a guild template.
     * @param id The ID of the guild to create a template from.
     * @param options The options for creating the template.
     */
    async createTemplate(id: string, options: CreateTemplateOptions): Promise<GuildTemplate> {
        return this.#manager.authRequest<RawGuildTemplate>({
            method: "POST",
            path:   Routes.GUILD_TEMPLATES(id),
            json:   {
                description: options.description,
                name:        options.name
            }
        }).then(data => new GuildTemplate(data, this.#manager.client));
    }

    /**
     * Delete a guild.
     * @param id The ID of the guild.
     */
    async delete(id: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD(id)
        });
    }

    /**
     * Delete an auto moderation rule.
     * @param id The ID of the guild.
     * @param ruleID The ID of the rule to delete.
     * @param reason The reason for deleting the rule.
     */
    async deleteAutoModerationRule(id: string, ruleID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_AUTOMOD_RULE(id, ruleID),
            reason
        });
    }

    /**
     * Delete an emoji.
     * @param id The ID of the guild.
     * @param emojiID The ID of the emoji.
     * @param reason The reason for deleting the emoji.
     */
    async deleteEmoji(id: string, emojiID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_EMOJI(id, emojiID),
            reason
        });
    }

    /**
     * Delete an integration.
     * @param id The ID of the guild.
     * @param integrationID The ID of the integration.
     * @param reason The reason for deleting the integration.
     */
    async deleteIntegration(id: string, integrationID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_INTEGRATION(id, integrationID),
            reason
        });
    }

    /**
     * Delete a role.
     * @param id The ID of the guild.
     * @param roleID The ID of the role to delete.
     * @param reason The reason for deleting the role.
     */
    async deleteRole(id: string, roleID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_ROLE(id, roleID),
            reason
        });
    }

    /**
     * Delete a scheduled event.
     * @param id The ID of the guild.
     * @param eventID The ID of the scheduled event.
     * @param reason The reason for deleting the scheduled event. Discord's docs do not explicitly state a reason can be provided, so it may not be used.
     */
    async deleteScheduledEvent(id: string, eventID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_SCHEDULED_EVENT(id, eventID),
            reason
        });
    }

    /**
     * Delete a template.
     * @param id The ID of the guild.
     * @param code The code of the template.
     */
    async deleteTemplate(id: string, code: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_TEMPLATE(id, code)
        });
    }

    /**
     * Edit a guild.
     *
     * Note: If the client's cache does not already contain the guild, it will not be added.
     * @param id The ID of the guild.
     * @param options The options for editing the guild.
     */
    async edit(id: string, options: EditGuildOptions): Promise<Guild> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        if (options.banner) {
            options.banner = this.#manager.client.util._convertImage(options.banner, "banner");
        }
        if (options.discoverySplash) {
            options.discoverySplash = this.#manager.client.util._convertImage(options.discoverySplash, "discovery splash");
        }
        if (options.icon) {
            options.icon = this.#manager.client.util._convertImage(options.icon, "icon");
        }
        if (options.splash) {
            options.splash = this.#manager.client.util._convertImage(options.splash, "splash");
        }
        return this.#manager.authRequest<RawGuild>({
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
        }).then(data => this.#manager.client.guilds.has(id) ? this.#manager.client.guilds.update(data) : new Guild(data, this.#manager.client));
    }

    /**
     * Edit an existing auto moderation rule.
     * @param id The ID of the guild.
     * @param ruleID The ID of the rule to edit.
     * @param options The options for editing the rule.
     */
    async editAutoModerationRule(id: string, ruleID: string, options: EditAutoModerationRuleOptions): Promise<AutoModerationRule> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        return this.#manager.authRequest<RawAutoModerationRule>({
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
        }).then(data =>  this.#manager.client.guilds.get(id)?.autoModerationRules.update(data) ?? new AutoModerationRule(data, this.#manager.client));
    }

    /**
     * Edit the positions of channels in a guild.
     * @param id The ID of the guild.
     * @param options The channels to move. Unedited channels do not need to be specifed.
     */
    async editChannelPositions(id: string, options: Array<ModifyChannelPositionsEntry>): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "PATCH",
            path:   Routes.GUILD_CHANNELS(id),
            json:   options.map(o => ({
                id:               o.id,
                lock_permissions: o.lockPermissions ?? null,
                parent_id:        o.parentID ?? null,
                position:         o.position ?? null
            }))
        });
    }

    /**
     * Modify the current member in a guild.
     * @param id The ID of the guild.
     * @param options The options for editing the member.
     */
    async editCurrentMember(id: string, options: EditCurrentMemberOptions): Promise<Member> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        return this.#manager.authRequest<RawMember>({
            method: "PATCH",
            path:   Routes.GUILD_MEMBER(id, "@me"),
            json:   { nick: options.nick },
            reason
        }).then(data => this.#manager.client.util.updateMember(id, data.user!.id, data));
    }

    /**
     * Edit the current member's voice state in a guild. `channelID` is required, and the current member must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-current-user-voice-state-caveats) for more information.
     * @param id The ID of the guild.
     * @param options The options for editing the voice state.
     */
    async editCurrentUserVoiceState(id: string, options: EditCurrentUserVoiceStateOptions): Promise<void> {
        await this.#manager.authRequest<null>({
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
     * @param id The ID of the guild the emoji is in.
     * @param options The options for editing the emoji.
     */
    async editEmoji(id: string, emojiID: string, options: EditEmojiOptions): Promise<GuildEmoji> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        return this.#manager.authRequest<RawGuildEmoji>({
            method: "POST",
            path:   Routes.GUILD_EMOJI(id, emojiID),
            json:   {
                name:  options.name,
                roles: options.roles
            },
            reason
        }).then(data => ({
            ...data,
            user: !data.user ? undefined : this.#manager.client.users.update(data.user)
        }));
    }

    /**
     * Edit the [mfa level](https://discord.com/developers/docs/resources/guild#guild-object-mfa-level) of a guild. This can only be used by the guild owner.
     * @param id The ID of the guild.
     * @param level The new MFA level.
     */
    async editMFALevel(id: string, level: MFALevels): Promise<MFALevels> {
        return this.#manager.authRequest<MFALevels>({
            method: "PATCH",
            path:   Routes.GUILD_MFA(id),
            json:   { level }
        });
    }

    /**
     * Edit a guild member. Use editCurrentMember if you wish to update the nick of this client using the CHANGE_NICKNAME permission.
     * @param id The ID of the guild.
     * @param memberID The ID of the member.
     * @param options The options for editing the member.
     */
    async editMember(id: string, memberID: string, options: EditMemberOptions): Promise<Member> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        return this.#manager.authRequest<RawMember>({
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
        }).then(data => this.#manager.client.util.updateMember(id, memberID, data));
    }

    /**
     * Edit an existing role.
     * @param id The ID of the guild.
     * @param options The options for editing the role.
     */
    async editRole(id: string, roleID: string, options: EditRoleOptions): Promise<Role> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        if (options.icon) {
            options.icon = this.#manager.client.util._convertImage(options.icon, "icon");
        }
        return this.#manager.authRequest<RawRole>({
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
        }).then(data => this.#manager.client.guilds.get(id)?.roles.update(data, id) ?? new Role(data, this.#manager.client, id));
    }

    /**
     * Edit the position of roles in a guild.
     * @param id The ID of the guild.
     * @param options The roles to move.
     */
    async editRolePositions(id: string, options: Array<EditRolePositionsEntry>, reason?: string): Promise<Array<Role>> {
        const guild = this.#manager.client.guilds.get(id);
        return this.#manager.authRequest<Array<RawRole>>({
            method: "PATCH",
            path:   Routes.GUILD_ROLES(id),
            json:   options.map(o => ({
                id:       o.id,
                position: o.position
            })),
            reason
        }).then(data => data.map(role => guild?.roles.update(role, id) ?? new Role(role, this.#manager.client, id)));
    }

    /**
     * Edit an existing scheduled event in a guild.
     * @param id The ID of the guild.
     * @param options The options for editing the scheduled event.
     */
    async editScheduledEvent(id: string, options: EditScheduledEventOptions): Promise<GuildScheduledEvent> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        if (options.image) {
            options.image = this.#manager.client.util._convertImage(options.image, "image");
        }
        return this.#manager.authRequest<RawScheduledEvent>({
            method: "POST",
            path:   Routes.GUILD_SCHEDULED_EVENTS(id),
            json:   {
                channel_id:           options.channelID,
                description:          options.description,
                entity_metadata:      !options.entityMetadata ? undefined : { location: options.entityMetadata.location },
                entity_type:          options.entityType,
                image:                options.image,
                name:                 options.name,
                privacy_level:        options.privacyLevel,
                status:               options.status,
                scheduled_end_time:   options.scheduledEndTime,
                scheduled_start_time: options.scheduledStartTime
            },
            reason
        }).then(data => this.#manager.client.guilds.get(id)?.scheduledEvents.update(data) ?? new GuildScheduledEvent(data, this.#manager.client));
    }

    /**
     * Edit a guild template.
     * @param id The ID of the guild.
     * @param code The code of the template.
     * @param options The options for editing the template.
     */
    async editTemplate(id: string, code: string, options: EditGuildTemplateOptions): Promise<GuildTemplate> {
        return this.#manager.authRequest<RawGuildTemplate>({
            method: "POST",
            path:   Routes.GUILD_TEMPLATE(id, code),
            json:   {
                code,
                description: options.description,
                name:        options.name
            }
        }).then(data => new GuildTemplate(data, this.#manager.client));
    }

    /**
     * Edit a guild member's voice state. `channelID` is required, and the user must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-user-voice-state) for more information.
     * @param id The ID of the guild.
     * @param memberID The ID of the member.
     * @param options The options for editing the voice state.
     */
    async editUserVoiceState(id: string, memberID: string, options: EditUserVoiceStateOptions): Promise<void> {
        await this.#manager.authRequest<null>({
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
     * @param id The ID of the guild.
     * @param options The options for editing the welcome screen.
     */
    async editWelcomeScreen(id: string, options: EditWelcomeScreenOptions): Promise<WelcomeScreen> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        return this.#manager.authRequest<RawWelcomeScreen>({
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
        }));
    }

    /**
     * Edit the widget of a guild.
     * @param id The ID of the guild.
     * @param options The options for editing the widget.
     */
    async editWidget(id: string, options: WidgetSettings): Promise<Widget> {
        return this.#manager.authRequest<RawWidget>({
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
        }));
    }

    /**
     * Get a guild.
     *
     * Note: If the guild is not already in the client's cache, this will not add it.
     * @param id The ID of the guild.
     * @param withCounts If the approximate number of members and online members should be included.
     */
    async get(id: string, withCounts?: number): Promise<Guild> {
        const query = new URLSearchParams();
        if (withCounts) {
            query.set("with_counts", withCounts.toString());
        }
        return this.#manager.authRequest<RawGuild>({
            method: "GET",
            path:   Routes.GUILD(id),
            query
        }).then(data => this.#manager.client.guilds.has(id) ? this.#manager.client.guilds.update(data) : new Guild(data, this.#manager.client));
    }

    /**
     * Get the active threads in a guild.
     * @param id The ID of the guild.
     */
    async getActiveThreads(id: string): Promise<GetActiveThreadsResponse> {
        return this.#manager.authRequest<{ members: Array<RawThreadMember>; threads: Array<RawThreadChannel>; }>({
            method: "GET",
            path:   Routes.GUILD_ACTIVE_THREADS(id)
        }).then(data => ({
            members: data.members.map(member => ({
                flags:         member.flags,
                id:            member.id,
                joinTimestamp: new Date(member.join_timestamp),
                userID:        member.user_id
            })),
            threads: data.threads.map(rawThread => this.#manager.client.util.updateThread(rawThread))
        }));
    }

    /**
     * Get a guild's audit log.
     * @param id The ID of the guild.
     * @param options The options for getting the audit logs.
     */
    async getAuditLog(id: string, options?: GetAuditLogOptions): Promise<AuditLog> {
        const guild = this.#manager.client.guilds.get(id);
        const query = new URLSearchParams();
        if (options?.actionType) {
            query.set("action_type", options.actionType.toString());
        }
        if (options?.before) {
            query.set("before", options.before);
        }
        if (options?.limit) {
            query.set("limit", options.limit.toString());
        }
        if (options?.userID) {
            query.set("user_id", options.userID);
        }
        return this.#manager.authRequest<RawAuditLog>({
            method: "GET",
            path:   Routes.GUILD_AUDIT_LOG(id),
            query
        }).then(data => ({
            autoModerationRules:  data.auto_moderation_rules.map(rule => guild ? guild.autoModerationRules.update(rule) : new AutoModerationRule(rule, this.#manager.client)),
            entries:              data.audit_log_entries.map(entry => new AuditLogEntry(entry, this.#manager.client)),
            guildScheduledEvents: data.guild_scheduled_events.map(event => guild ? guild.scheduledEvents.update(event) : new GuildScheduledEvent(event, this.#manager.client)),
            integrations:         data.integrations.map(integration => guild ? guild.integrations.update(integration, id) : new Integration(integration, this.#manager.client, id)),
            threads:              data.threads.map(rawThread => this.#manager.client.util.updateThread(rawThread)),
            users:                data.users.map(user => this.#manager.client.users.update(user)),
            webhooks:             data.webhooks.map(webhook => new Webhook(webhook, this.#manager.client))
        }));
    }

    /**
     * Get an auto moderation rule for a guild.
     * @param id The ID of the guild.
     * @param ruleID The ID of the rule to get.
     */
    async getAutoModerationRule(id: string, ruleID: string): Promise<AutoModerationRule> {
        return this.#manager.authRequest<RawAutoModerationRule>({
            method: "GET",
            path:   Routes.GUILD_AUTOMOD_RULE(id, ruleID)
        }).then(data => this.#manager.client.guilds.get(id)?.autoModerationRules.update(data) ?? new AutoModerationRule(data, this.#manager.client));
    }

    /**
     * Get the auto moderation rules for a guild.
     * @param id The ID of the guild.
     */
    async getAutoModerationRules(id: string): Promise<Array<AutoModerationRule>> {
        return this.#manager.authRequest<Array<RawAutoModerationRule>>({
            method: "GET",
            path:   Routes.GUILD_AUTOMOD_RULES(id)
        }).then(data => data.map(rule => this.#manager.client.guilds.get(id)?.autoModerationRules.update(rule) ?? new AutoModerationRule(rule, this.#manager.client)));
    }

    /**
     * Get a ban.
     * @param id The ID of the guild.
     * @param userID The ID of the user to get the ban of.
     */
    async getBan(id: string, userID: string): Promise<Ban> {
        return this.#manager.authRequest<RawBan>({
            method: "GET",
            path:   Routes.GUILD_BAN(id, userID)
        }).then(data => ({
            reason: data.reason,
            user:   this.#manager.client.users.update(data.user)
        }));
    }

    /**
     * Get the bans in a guild.
     * @param id The ID of the guild.
     * @param options The options for getting the bans.
     */
    async getBans(id: string, options?: GetBansOptions): Promise<Array<Ban>> {
        const _getBans = async (_id: string, _options?: GetBansOptions): Promise<Array<Ban>> => {
            const query = new URLSearchParams();
            if (_options?.after) {
                query.set("after", _options.after);
            }
            if (_options?.before) {
                query.set("before", _options.before);
            }
            if (_options?.limit) {
                query.set("limit", _options.limit.toString());
            }
            return this.#manager.authRequest<Array<RawBan>>({
                method: "GET",
                path:   Routes.GUILD_BANS(_id),
                query
            }).then(data => data.map(ban => ({
                reason: ban.reason,
                user:   this.#manager.client.users.update(ban.user)
            })));
        };

        const limit = options?.limit ?? 1000;
        let after = options?.after;

        let bans: Array<Ban> = [];
        while (bans.length < limit) {
            const limitLeft = limit - bans.length;
            const limitToFetch = limitLeft <= 1000 ? limitLeft : 1000;
            this.#manager.client.emit("debug", `Getting ${limitToFetch} more bans for ${id}. ${limitLeft} left to get.`);
            const bansChunk = await _getBans(id, {
                after,
                before: options?.before,
                limit:  limitToFetch
            });

            if (bansChunk.length === 0) {
                break;
            }

            bans = bans.concat(bansChunk);
            after = bansChunk.at(-1)!.user.id;

            if (bansChunk.length < 1000) {
                break;
            }
        }

        return bans;
    }

    /**
     * Get the channels in a guild. Does not include threads.
     * @param id The ID of the guild.
     */
    async getChannels(id: string): Promise<Array<AnyGuildChannelWithoutThreads>> {
        return this.#manager.authRequest<Array<RawGuildChannel>>({
            method: "GET",
            path:   Routes.GUILD_CHANNELS(id)
        }).then(data => data.map(d => this.#manager.client.util.updateChannel(d)));
    }

    /**
     * Get an emoji in a guild.
     * @param id The ID of the guild.
     * @param emojiID The ID of the emoji to get.
     */
    async getEmoji(id: string, emojiID: string): Promise<GuildEmoji> {
        return this.#manager.authRequest<RawGuildEmoji>({
            method: "GET",
            path:   Routes.GUILD_EMOJI(id, emojiID)
        }).then(data => ({
            ...data,
            user: !data.user ? undefined : this.#manager.client.users.update(data.user)
        }));
    }

    /**
     * Get the emojis in a guild.
     * @param id The ID of the guild.
     */
    async getEmojis(id: string): Promise<Array<GuildEmoji>> {
        return this.#manager.authRequest<Array<RawGuildEmoji>>({
            method: "GET",
            path:   Routes.GUILD_EMOJIS(id)
        }).then(data => data.map(d => ({
            ...d,
            user: !d.user ? undefined : this.#manager.client.users.update(d.user)
        })));
    }

    /**
     * Get the integrations in a guild.
     * @param id The ID of the guild.
     */
    async getIntegrations(id: string): Promise<Array<Integration>> {
        return this.#manager.authRequest<Array<RawIntegration>>({
            method: "GET",
            path:   Routes.GUILD_INTEGRATIONS(id)
        }).then(data => data.map(integration => this.#manager.client.guilds.get(id)?.integrations.update(integration, id) ?? new Integration(integration, this.#manager.client, id)));
    }

    /**
     * Get the invites of a guild.
     * @param id The ID of the guild to get the invites of.
     */
    async getInvites<CH extends InviteChannel | PartialInviteChannel | Uncached = InviteChannel | PartialInviteChannel | Uncached>(id: string): Promise<Array<Invite<"withMetadata", CH>>> {
        return this.#manager.authRequest<Array<RawInvite>>({
            method: "GET",
            path:   Routes.GUILD_INVITES(id)
        }).then(data => data.map(invite => new Invite<"withMetadata", CH>(invite, this.#manager.client)));
    }

    /**
     * Get a guild member.
     * @param id The ID of the guild.
     * @param memberID The ID of the member.
     */
    async getMember(id: string, memberID: string): Promise<Member> {
        return this.#manager.authRequest<RawMember>({
            method: "GET",
            path:   Routes.GUILD_MEMBER(id, memberID)
        }).then(data => this.#manager.client.util.updateMember(id, memberID, data));
    }

    /**
     * Get a guild's members. This requires the `GUILD_MEMBERS` intent.
     * @param id The ID of the guild.
     * @param options The options for getting the members.
     */
    async getMembers(id: string, options?: GetMembersOptions): Promise<Array<Member>> {
        const query = new URLSearchParams();
        if (options?.after) {
            query.set("after", options.after);
        }
        if (options?.limit) {
            query.set("limit", options.limit.toString());
        }
        return this.#manager.authRequest<Array<RawMember>>({
            method: "GET",
            path:   Routes.GUILD_MEMBERS(id),
            query
        }).then(data => data.map(d => this.#manager.client.util.updateMember(id, d.user!.id, d)));
    }

    /**
     * Get a preview of a guild. If the client is not already in this guild, the guild must be lurkable.
     * @param id The ID of the guild.
     */
    async getPreview(id: string): Promise<GuildPreview> {
        return this.#manager.authRequest<RawGuildPreview>({
            method: "GET",
            path:   Routes.GUILD_PREVIEW(id)
        }).then(data => new GuildPreview(data, this.#manager.client));
    }

    /**
     * Get the prune count of a guild.
     * @param id The ID of the guild.
     * @param options The options for getting the prune count.
     */
    async getPruneCount(id: string, options?: GetPruneCountOptions): Promise<number> {
        const query = new URLSearchParams();
        if (options?.days) {
            query.set("days", options.days.toString());
        }
        if (options?.includeRoles) {
            query.set("include_roles", options.includeRoles.join(","));
        }
        return this.#manager.authRequest<{ pruned: number; }>({
            method: "GET",
            path:   Routes.GUILD_PRUNE(id),
            query
        }).then(data => data.pruned);
    }

    /**
     * Get the roles in a guild.
     * @param id The ID of the guild.
     */
    async getRoles(id: string): Promise<Array<Role>> {
        const guild = this.#manager.client.guilds.get(id);
        return this.#manager.authRequest<Array<RawRole>>({
            method: "GET",
            path:   Routes.GUILD_ROLES(id)
        }).then(data => data.map(role => guild ? guild.roles.update(role, id) : new Role(role, this.#manager.client, id)));
    }

    /**
     * Get a scheduled event.
     * @param id The ID of the guild.
     * @param eventID The ID of the scheduled event to get.
     * @param withUserCount If the number of users subscribed to the event should be included.
     */
    async getScheduledEvent(id: string, eventID: string, withUserCount?: number): Promise<GuildScheduledEvent> {
        const query = new URLSearchParams();
        if (withUserCount) {
            query.set("with_user_count", withUserCount.toString());
        }
        return this.#manager.authRequest<RawScheduledEvent>({
            method: "GET",
            path:   Routes.GUILD_SCHEDULED_EVENT(id, eventID),
            query
        }).then(data => this.#manager.client.guilds.get(id)?.scheduledEvents.update(data) ?? new GuildScheduledEvent(data, this.#manager.client));
    }

    /**
     * Get the users subscribed to a scheduled event.
     * @param id The ID of the guild.
     * @param eventID The ID of the scheduled event.
     * @param options The options for getting the users.
     */
    async getScheduledEventUsers(id: string, eventID: string, options?: GetScheduledEventUsersOptions): Promise<Array<ScheduledEventUser>> {
        const guild = this.#manager.client.guilds.get(id);
        const query = new URLSearchParams();
        if (options?.after) {
            query.set("after", options.after);
        }
        if (options?.before) {
            query.set("before", options.before);
        }
        if (options?.limit) {
            query.set("limit", options.limit.toString());
        }
        if (options?.withMember !== undefined) {
            query.set("with_member", options.withMember ? "true" : "false");
        }
        return this.#manager.authRequest<Array<RawScheduledEventUser>>({
            method: "GET",
            path:   Routes.GUILD_SCHEDULED_EVENT_USERS(id, eventID)
        }).then(data => data.map(d => ({
            guildScheduledEvent:   guild?.scheduledEvents.get(d.guild_scheduled_event_id),
            guildScheduledEventID: d.guild_scheduled_event_id,
            user:                  this.#manager.client.users.update(d.user),
            member:                d.member ? this.#manager.client.util.updateMember(id, d.member.user!.id, d.member) : undefined
        })));
    }

    /**
     * Get a guild's scheduled events
     * @param id The ID of the guild.
     * @param withUserCount If the number of users subscribed to the event should be included.
     */
    async getScheduledEvents(id: string, withUserCount?: number): Promise<Array<GuildScheduledEvent>> {
        const guild = this.#manager.client.guilds.get(id);
        const query = new URLSearchParams();
        if (withUserCount) {
            query.set("with_user_count", withUserCount.toString());
        }
        return this.#manager.authRequest<Array<RawScheduledEvent>>({
            method: "GET",
            path:   Routes.GUILD_SCHEDULED_EVENTS(id),
            query
        }).then(data => data.map(d => guild?.scheduledEvents.update(d) ?? new GuildScheduledEvent(d, this.#manager.client)));
    }

    /**
     * Get a guild template.
     * @param code The code of the template to get.
     */
    async getTemplate(code: string): Promise<GuildTemplate> {
        return this.#manager.authRequest<RawGuildTemplate>({
            method: "GET",
            path:   Routes.GUILD_TEMPLATE_CODE(code)
        }).then(data => new GuildTemplate(data, this.#manager.client));
    }

    /**
     * Get a guild's templates.
     * @param id The ID of the guild.
     */
    async getTemplates(id: string): Promise<Array<GuildTemplate>> {
        return this.#manager.authRequest<Array<RawGuildTemplate>>({
            method: "GET",
            path:   Routes.GUILD_TEMPLATES(id)
        }).then(data => data.map(d => new GuildTemplate(d, this.#manager.client)));
    }

    /**
     * Get the vanity url of a guild.
     * @param id The ID of the guild.
     */
    async getVanityURL(id: string): Promise<GetVanityURLResponse> {
        return this.#manager.authRequest<GetVanityURLResponse>({
            method: "GET",
            path:   Routes.GUILD_VANITY_URL(id)
        });
    }

    /**
     * Get the list of usable voice regions for a guild. This will return VIP servers when the guild is VIP-enabled.
     * @param id The ID of the guild.
     */
    async getVoiceRegions(id: string): Promise<Array<VoiceRegion>> {
        return this.#manager.authRequest<Array<VoiceRegion>>({
            method: "GET",
            path:   Routes.GUILD_VOICE_REGIONS(id)
        });
    }

    /**
     * Get the welcome screen for a guild.
     * @param id The ID of the guild.
     */
    async getWelcomeScreen(id: string): Promise<WelcomeScreen> {
        return this.#manager.authRequest<RawWelcomeScreen>({
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
        }));
    }

    /**
     * Get the widget of a guild.
     * @param id The ID of the guild.
     */
    async getWidget(id: string): Promise<Widget> {
        return this.#manager.authRequest<RawWidget>({
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
        }));
    }

    /**
     * Get the widget image of a guild.
     * @param id The ID of the guild.
     * @param style The style of the image.
     */
    async getWidgetImage(id: string, style?: WidgetImageStyle): Promise<Buffer> {
        const query = new URLSearchParams();
        if (style) {
            query.set("style", style.toString());
        }
        return this.#manager.request<Buffer>({
            method: "GET",
            path:   Routes.GUILD_WIDGET_IMAGE(id),
            query
        });
    }

    /**
     * Get the raw JSON widget of a guild.
     * @param id The ID of the guild.
     */
    async getWidgetJSON(id: string): Promise<RawWidget> {
        return this.#manager.request<RawWidget>({
            method: "GET",
            path:   Routes.GUILD_WIDGET_JSON(id)
        });
    }

    /**
     * Get a guild's widget settings.
     * @param id The ID of the guild.
     */
    async getWidgetSettings(id: string): Promise<WidgetSettings> {
        return this.#manager.authRequest<RawWidgetSettings>({
            method: "GET",
            path:   Routes.GUILD_WIDGET(id)
        }).then(data => ({
            channelID: data.channel_id,
            enabled:   data.enabled
        }));
    }

    /**
     * Remove a ban.
     * @param id The ID of the guild.
     * @param userID The ID of the user to remove the ban from.
     * @param reason The reason for removing the ban.
     */
    async removeBan(id: string, userID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_BAN(id, userID),
            reason
        });
    }

    /**
     * Remove a member from a guild.
     * @param id The ID of the guild.
     * @param memberID The ID of the user to remove.
     * @param reason The reason for the removal.
     */
    async removeMember(id: string, memberID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_MEMBER(id, memberID),
            reason
        });
    }

    /**
     * remove a role from a member.
     * @param id The ID of the guild.
     * @param memberID The ID of the member.
     * @param roleID The ID of the role to remove.
     * @param reason The reason for removing the role.
     */
    async removeMemberRole(id: string, memberID: string, roleID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GUILD_MEMBER_ROLE(id, memberID, roleID),
            reason
        });
    }

    /**
     * Search the username & nicknames of members in a guild.
     * @param id The ID of the guild.
     * @param options The options to search with.
     */
    async searchMembers(id: string, options: SearchMembersOptions): Promise<Array<Member>> {
        const query = new URLSearchParams();
        query.set("query", options.query);
        if (options.limit) {
            query.set("limit", options.limit.toString());
        }
        return this.#manager.authRequest<Array<RawMember>>({
            method: "GET",
            path:   Routes.GUILD_SEARCH_MEMBERS(id),
            query
        }).then(data => data.map(d => this.#manager.client.util.updateMember(id, d.user!.id, d)));
    }

    /**
     * Sync a guild template.
     * @param id The ID of the guild.
     * @param code The code of the template to sync.
     */
    async syncTemplate(id: string, code: string): Promise<GuildTemplate> {
        return this.#manager.authRequest<RawGuildTemplate>({
            method: "POST",
            path:   Routes.GUILD_TEMPLATE(id, code)
        }).then(data => new GuildTemplate(data, this.#manager.client));
    }
}
