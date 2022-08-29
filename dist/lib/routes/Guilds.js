"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = __importDefault(require("./BaseRoute"));
const Routes = __importStar(require("../util/Routes"));
const GuildScheduledEvent_1 = __importDefault(require("../structures/GuildScheduledEvent"));
const Webhook_1 = __importDefault(require("../structures/Webhook"));
const GuildTemplate_1 = __importDefault(require("../structures/GuildTemplate"));
const GuildPreview_1 = __importDefault(require("../structures/GuildPreview"));
const Role_1 = __importDefault(require("../structures/Role"));
const Invite_1 = __importDefault(require("../structures/Invite"));
const Integration_1 = __importDefault(require("../structures/Integration"));
const AutoModerationRule_1 = __importDefault(require("../structures/AutoModerationRule"));
const Channel_1 = __importDefault(require("../structures/Channel"));
const AuditLogEntry_1 = __importDefault(require("../structures/AuditLogEntry"));
class Guilds extends BaseRoute_1.default {
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
    async addMember(id, userID, options) {
        return this._manager.authRequest({
            method: "PUT",
            path: Routes.GUILD_MEMBER(id, userID),
            json: {
                access_token: options.accessToken,
                deaf: options.deaf,
                mute: options.mute,
                nick: options.nick,
                roles: options.roles
            }
        }).then(data => data === null ? undefined : this._client.util.updateMember(id, userID, data));
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
    async addMemberRole(id, memberID, roleID, reason) {
        await this._manager.authRequest({
            method: "PUT",
            path: Routes.GUILD_MEMBER_ROLE(id, memberID, roleID),
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
    async beginPrune(id, options) {
        const reason = options?.reason;
        if (options?.reason)
            delete options.reason;
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_PRUNE(id),
            json: {
                days: options?.days,
                compute_prune_count: options?.computePruneCount,
                include_roles: options?.includeRoles
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
    async create(options) {
        if (options.icon)
            options.icon = this._client.util._convertImage(options.icon, "icon");
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILDS,
            json: {
                afk_channel_id: options.afkChannelID,
                afk_timeout: options.afkTimeout,
                channels: options.channels,
                default_message_notifications: options.defaultMessageNotifications,
                explicit_content_filter: options.explicitContentFilter,
                icon: options.icon,
                name: options.name,
                region: options.region,
                roles: options.roles,
                system_channel_flags: options.systemChannelFlags,
                system_channel_id: options.systemChannelID,
                verification_level: options.verificationLevel
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
    async createAutoModerationRule(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_AUTOMOD_RULES(id),
            json: {
                actions: options.actions.map(a => ({
                    metadata: {
                        channel_id: a.metadata.channelID,
                        duration_seconds: a.metadata.durationSeconds
                    },
                    type: a.type
                })),
                event_type: options.eventType,
                exempt_channels: options.exemptChannels,
                exempt_roles: options.exemptRoles,
                name: options.name,
                trigger_metadata: !options.triggerMetadata ? undefined : {
                    allow_list: options.triggerMetadata.allowList,
                    keyword_filter: options.triggerMetadata.keywordFilter,
                    mention_total_limit: options.triggerMetadata.mentionTotalLimit,
                    presets: options.triggerMetadata.presets
                },
                trigger_type: options.triggerType
            },
            reason
        }).then(data => this._client.guilds.has(id) ? this._client.guilds.get(id)?.autoModerationRules.update(data) : new AutoModerationRule_1.default(data, this._client));
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
    async createBan(guildID, userID, options) {
        const reason = options?.reason;
        if (options?.reason)
            delete options.reason;
        if (options?.deleteMessageDays !== undefined && !Object.hasOwn(options, "deleteMessageSeconds"))
            options.deleteMessageSeconds = options.deleteMessageDays * 86400;
        await this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_BAN(guildID, userID),
            json: {
                delete_message_seconds: options?.deleteMessageSeconds
            },
            reason
        });
    }
    async createChannel(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_CHANNELS(id),
            json: {
                default_auto_archive_duration: options.defaultAutoArchiveDuration,
                name: options.name,
                nsfw: options.nsfw,
                parent_id: options.parentID,
                permission_overwrites: options.permissionOverwrites,
                position: options.position,
                rate_limit_per_user: options.rateLimitPerUser,
                rtc_region: options.rtcRegion,
                topic: options.topic,
                type: options.type,
                user_limit: options.userLimit,
                video_quality_mode: options.videoQualityMode
            },
            reason
        }).then(data => Channel_1.default.from(data, this._client));
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
    async createEmoji(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        if (options.image)
            options.image = this._client.util._convertImage(options.image, "image");
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_EMOJIS(id),
            json: {
                image: options.image,
                name: options.name,
                roles: options.roles
            },
            reason
        }).then(data => ({
            ...data,
            user: !data.user ? undefined : this._client.users.update(data.user)
        }));
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
    async createFromTemplate(code, options) {
        if (options.icon)
            options.icon = this._client.util._convertImage(options.icon, "icon");
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_TEMPLATE_CODE(code),
            json: {
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
    async createRole(id, options) {
        const reason = options?.reason;
        if (options?.reason)
            delete options.reason;
        if (options?.icon)
            options.icon = this._client.util._convertImage(options.icon, "icon");
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_ROLES(id),
            json: {
                color: options?.color,
                hoist: options?.hoist,
                icon: options?.icon,
                mentionable: options?.mentionable,
                name: options?.name,
                permissions: options?.permissions,
                unicode_emoji: options?.unicodeEmoji
            },
            reason
        }).then(data => this._client.guilds.has(id) ? this._client.guilds.get(id).roles.update(data, id) : new Role_1.default(data, this._client, id));
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
    async createScheduledEvent(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        if (options.image)
            options.image = this._client.util._convertImage(options.image, "image");
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_SCHEDULED_EVENTS(id),
            json: {
                channel_id: options.channelID,
                description: options.description,
                entity_metadata: !options.entityMetadata ? undefined : {
                    location: options.entityMetadata.location
                },
                entity_type: options.entityType,
                image: options.image,
                name: options.name,
                privacy_level: options.privacyLevel,
                scheduled_end_time: options.scheduledEndTime,
                scheduled_start_time: options.scheduledStartTime
            },
            reason
        }).then(data => new GuildScheduledEvent_1.default(data, this._client));
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
    async createTemplate(id, options) {
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_TEMPLATES(id),
            json: {
                description: options.description,
                name: options.name
            }
        }).then(data => new GuildTemplate_1.default(data, this._client));
    }
    /**
     * Delete a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<void>}
     */
    async delete(id) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD(id)
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
    async deleteAutoModerationRule(id, ruleID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_AUTOMOD_RULE(id, ruleID),
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
    async deleteEmoji(id, emojiID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_EMOJI(id, emojiID),
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
    async deleteIntegration(id, integrationID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_INTEGRATION(id, integrationID),
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
    async deleteRole(id, roleID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_ROLE(id, roleID),
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
    async deleteScheduledEvent(id, eventID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_SCHEDULED_EVENT(id, eventID),
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
    async deleteTemplate(id, code) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_TEMPLATE(id, code)
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
    async edit(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        if (options.banner)
            options.banner = this._client.util._convertImage(options.banner, "banner");
        if (options.discoverySplash)
            options.discoverySplash = this._client.util._convertImage(options.discoverySplash, "discovery splash");
        if (options.icon)
            options.icon = this._client.util._convertImage(options.icon, "icon");
        if (options.splash)
            options.splash = this._client.util._convertImage(options.splash, "splash");
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD(id),
            json: {
                afk_channel_id: options.afkChannelID,
                afk_timeout: options.afkTimeout,
                banner: options.banner,
                default_message_notifications: options.defaultMessageNotifications,
                description: options.description,
                discovery_splash: options.discoverySplash,
                explicit_content_filter: options.explicitContentFilter,
                features: options.features,
                icon: options.icon,
                name: options.name,
                owner_id: options.ownerID,
                preferred_locale: options.preferredLocale,
                premium_progress_bar_enabled: options.premiumProgressBarEnabled,
                public_updates_channel_id: options.publicUpdatesChannelID,
                region: options.region,
                rules_channel_id: options.rulesChannelID,
                splash: options.splash,
                system_channel_flags: options.systemChannelFlags,
                system_channel_id: options.systemChannelID,
                verification_level: options.verificationLevel
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
    async editAutoModerationRule(id, ruleID, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_AUTOMOD_RULE(id, ruleID),
            json: {
                actions: options.actions?.map(a => ({
                    metadata: {
                        channel_id: a.metadata.channelID,
                        duration_seconds: a.metadata.durationSeconds
                    },
                    type: a.type
                })),
                event_type: options.eventType,
                exempt_channels: options.exemptChannels,
                exempt_roles: options.exemptRoles,
                name: options.name,
                trigger_metadata: !options.triggerMetadata ? undefined : {
                    allow_list: options.triggerMetadata.allowList,
                    keyword_filter: options.triggerMetadata.keywordFilter,
                    mention_total_limit: options.triggerMetadata.mentionTotalLimit,
                    presets: options.triggerMetadata.presets
                }
            },
            reason
        }).then(data => this._client.guilds.has(id) ? this._client.guilds.get(id)?.autoModerationRules.update(data) : new AutoModerationRule_1.default(data, this._client));
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
    async editChannelPositions(id, options) {
        await this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_CHANNELS(id),
            json: options.map(o => ({
                id: o.id,
                lock_permissions: o.lockPermissions ?? null,
                parent_id: o.parentID || null,
                position: o.position ?? null
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
    async editCurrentMember(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_MEMBER(id, "@me"),
            json: {
                nick: options.nick
            },
            reason
        }).then(data => this._client.util.updateMember(id, data.user.id, data));
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
    async editCurrentUserVoiceState(id, options) {
        await this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_VOICE_STATE(id, "@me"),
            json: {
                channel_id: options.channelID,
                suppress: options.suppress,
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
    async editEmoji(id, emojiID, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_EMOJI(id, emojiID),
            json: {
                name: options.name,
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
    async editMFALevel(id, level) {
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_MFA(id),
            json: {
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
    async editMember(id, memberID, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_MEMBER(id, memberID),
            json: {
                channel_id: options.channelID,
                communication_disabled_until: options.communicationDisabledUntil,
                deaf: options.deaf,
                mute: options.mute,
                nick: options.nick,
                roles: options.roles
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
    async editRole(id, roleID, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        if (options.icon)
            options.icon = this._client.util._convertImage(options.icon, "icon");
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_ROLE(id, roleID),
            json: {
                color: options.color,
                hoist: options.hoist,
                icon: options.icon,
                mentionable: options.mentionable,
                name: options.name,
                permissions: options.permissions,
                unicode_emoji: options.unicodeEmoji
            },
            reason
        }).then(data => this._client.guilds.has(id) ? this._client.guilds.get(id).roles.update(data, id) : new Role_1.default(data, this._client, id));
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
    async editRolePositions(id, options, reason) {
        const guild = this._client.guilds.get(id);
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_ROLES(id),
            json: options.map(o => ({
                id: o.id,
                position: o.position
            })),
            reason
        }).then(data => data.map(role => guild ? guild.roles.update(role, id) : new Role_1.default(role, this._client, id)));
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
    async editScheduledEvent(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        if (options.image)
            options.image = this._client.util._convertImage(options.image, "image");
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_SCHEDULED_EVENTS(id),
            json: {
                channel_id: options.channelID,
                description: options.description,
                entity_metadata: !options.entityMetadata ? undefined : {
                    location: options.entityMetadata.location
                },
                entity_type: options.entityType,
                image: options.image,
                name: options.name,
                privacy_level: options.privacyLevel,
                status: options.status,
                scheduled_end_time: options.scheduledEndTime,
                scheduled_start_time: options.scheduledStartTime
            },
            reason
        }).then(data => new GuildScheduledEvent_1.default(data, this._client));
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
    async editTemplate(id, code, options) {
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_TEMPLATE(id, code),
            json: {
                code,
                description: options.description,
                name: options.name
            }
        }).then(data => new GuildTemplate_1.default(data, this._client));
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
    async editUserVoiceState(id, memberID, options) {
        await this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_VOICE_STATE(id, memberID),
            json: {
                channel_id: options.channelID,
                suppress: options.suppress
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
    async editWelcomeScreen(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_WELCOME_SCREEN(id),
            json: {
                description: options.description,
                enabled: options.enabled,
                welcome_channels: options.welcomeChannels.map(ch => ({
                    channel_id: ch.channelID,
                    description: ch.description,
                    emoji_id: ch.emojiID,
                    emoji_name: ch.emojiName
                }))
            },
            reason
        }).then(data => ({
            description: data.description,
            welcomeChannels: data.welcome_channels.map(channel => ({
                channelID: channel.channel_id,
                description: channel.description,
                emojiID: channel.emoji_id,
                emojiName: channel.emoji_name
            }))
        }));
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
    async editWidget(id, options) {
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_WIDGET(id),
            json: {
                channel_id: options.channelID,
                enabled: options.enabled
            }
        }).then(data => ({
            channels: data.channels,
            id: data.id,
            instantInvite: data.instant_invite,
            members: data.members.map(m => ({
                activity: m.activity,
                avatar: m.avatar,
                avatarURL: m.avatar_url,
                discriminator: m.discriminator,
                id: m.id,
                status: m.status,
                tag: `${m.username}#${m.discriminator}`,
                username: m.username
            })),
            name: data.name,
            presenceCount: data.presence_count
        }));
    }
    /**
     * Get a guild.
     *
     * @param {String} id - The ID of the guild.
     * @param {Number} [withCounts=false] - If the approximate number of members and online members should be included.
     * @returns {Promise<Guild>}
     */
    async get(id, withCounts) {
        const query = new URLSearchParams();
        if (withCounts)
            query.set("with_counts", withCounts.toString());
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD(id),
            query
        }).then(data => this._client.guilds.update(data));
    }
    /**
     * Get the active threads in a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<GetActiveThreadsResponse>}
     */
    async getActiveThreads(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_ACTIVE_THREADS(id)
        }).then(data => ({
            members: data.members.map(member => ({
                flags: member.flags,
                id: member.id,
                joinTimestamp: new Date(member.join_timestamp),
                userID: member.user_id
            })),
            threads: data.threads.map(thread => Channel_1.default.from(thread, this._client))
        }));
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
    async getAuditLog(id, options) {
        const guild = this._client.guilds.get(id);
        const query = new URLSearchParams();
        if (options?.actionType)
            query.set("action_type", options.actionType.toString());
        if (options?.before)
            query.set("before", options.before);
        if (options?.limit)
            query.set("limit", options.limit.toString());
        if (options?.userID)
            query.set("user_id", options.userID);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_AUDIT_LOG(id),
            query
        }).then(data => ({
            autoModerationRules: data.auto_moderation_rules.map(rule => guild ? guild.autoModerationRules.update(rule) : new AutoModerationRule_1.default(rule, this._client)),
            entries: data.audit_log_entries.map(entry => new AuditLogEntry_1.default(entry, this._client)),
            guildScheduledEvents: data.guild_scheduled_events.map(event => guild ? guild.scheduledEvents.update(event) : new GuildScheduledEvent_1.default(event, this._client)),
            integrations: data.integrations.map(integration => new Integration_1.default(integration, this._client)),
            threads: data.threads.map(thread => guild ? guild.threads.update(thread) : Channel_1.default.from(thread, this._client)),
            users: data.users.map(user => this._client.users.update(user)),
            webhooks: data.webhooks.map(webhook => new Webhook_1.default(webhook, this._client))
        }));
    }
    /**
     * Get an auto moderation rule for a guild.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} ruleID - The ID of the rule to get.
     * @returns {Promise<AutoModerationRule>}
     */
    async getAutoModerationRule(id, ruleID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_AUTOMOD_RULE(id, ruleID)
        }).then(data => this._client.guilds.has(id) ? this._client.guilds.get(id).autoModerationRules.update(data) : new AutoModerationRule_1.default(data, this._client));
    }
    /**
     * Get the auto moderation rules for a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<AutoModerationRule[]>}
     */
    async getAutoModerationRules(id) {
        const guild = this._client.guilds.get(id);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_AUTOMOD_RULES(id)
        }).then(data => data.map(rule => guild ? guild.autoModerationRules.update(rule) : new AutoModerationRule_1.default(rule, this._client)));
    }
    /**
     * Get a ban.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} userID - The ID of the user to get the ban of.
     * @returns {Promise<Ban>}
     */
    async getBan(id, userID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_BAN(id, userID)
        }).then(data => ({
            reason: data.reason,
            user: this._client.users.update(data.user)
        }));
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
    async getBans(id, options) {
        const query = new URLSearchParams();
        if (options?.after)
            query.set("after", options.after);
        if (options?.before)
            query.set("before", options.before);
        if (options?.limit)
            query.set("limit", options.limit.toString());
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_BANS(id),
            query
        }).then(data => data.map(ban => ({
            reason: ban.reason,
            user: this._client.users.update(ban.user)
        })));
    }
    /**
     * Get the channels in a guild. Does not include threads.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<AnyGuildChannelWithoutThreads[]>}
     */
    async getChannels(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_CHANNELS(id)
        }).then(data => data.map(d => Channel_1.default.from(d, this._client)));
    }
    /**
     * Get an emoji in a guild.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} emojiID - The ID of the emoji to get.
     * @returns {Promise<GuildEmoji>}
     */
    async getEmoji(id, emojiID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_EMOJI(id, emojiID)
        }).then(data => ({
            ...data,
            user: !data.user ? undefined : this._client.users.update(data.user)
        }));
    }
    /**
     * Get the emojis in a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<GuildEmoji[]>}
     */
    async getEmojis(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_EMOJIS(id)
        }).then(data => data.map(d => ({
            ...d,
            user: !d.user ? undefined : this._client.users.update(d.user)
        })));
    }
    /**
     * Get the integrations in a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<Integration[]>}
     */
    async getIntegrations(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_INTEGRATIONS(id)
        }).then(data => data.map(integration => new Integration_1.default(integration, this._client)));
    }
    /**
     * Get the invites of a guild.
     *
     * @param {String} id - The id of the guild to get the invites of.
     * @returns {Promise<Invite[]>} - An array of invites with metadata.
     */
    async getInvites(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_INVITES(id)
        }).then(data => data.map(invite => new Invite_1.default(invite, this._client)));
    }
    /**
     * Get a guild member.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} memberID - The ID of the member.
     * @returns {Promise<Member>}
     */
    async getMember(id, memberID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_MEMBER(id, memberID)
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
    async getMembers(id, options) {
        const query = new URLSearchParams();
        if (options?.after)
            query.set("after", options.after);
        if (options?.limit)
            query.set("limit", options.limit.toString());
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_MEMBERS(id),
            query
        }).then(data => data.map(d => this._client.util.updateMember(id, d.user.id, d)));
    }
    /**
     * Get a preview of a guild. If the client is not already in this guild, the guild must be lurkable.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<GuildPreview>}
     */
    async getPreview(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_PREVIEW(id)
        }).then(data => new GuildPreview_1.default(data, this._client));
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
    async getPruneCount(id, options) {
        const query = new URLSearchParams();
        if (options?.days)
            query.set("days", options.days.toString());
        if (options?.includeRoles)
            query.set("include_roles", options.includeRoles.join(","));
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_PRUNE(id),
            query
        }).then(data => data.pruned);
    }
    /**
     * Get the roles in a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<Role[]>}
     */
    async getRoles(id) {
        const guild = this._client.guilds.get(id);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_ROLES(id)
        }).then(data => data.map(role => guild ? guild.roles.update(role, id) : new Role_1.default(role, this._client, id)));
    }
    /**
     * Get a scheduled event.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} eventID - The ID of the scheduled event to get.
     * @param {Number} [withUserCount] - If the number of users subscribed to the event should be included.
     * @returns {Promise<GuildScheduledEvent>}
     */
    async getScheduledEvent(id, eventID, withUserCount) {
        const query = new URLSearchParams();
        if (withUserCount)
            query.set("with_user_count", withUserCount.toString());
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_SCHEDULED_EVENT(id, eventID),
            query
        }).then(data => new GuildScheduledEvent_1.default(data, this._client));
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
    async getScheduledEventUsers(id, eventID, options) {
        const guild = this._client.guilds.get(id);
        const query = new URLSearchParams();
        if (options?.after)
            query.set("after", options.after);
        if (options?.before)
            query.set("before", options.before);
        if (options?.limit)
            query.set("limit", options.limit.toString());
        if (options?.withMember !== undefined)
            query.set("with_member", options.withMember ? "true" : "false");
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_SCHEDULED_EVENT_USERS(id, eventID)
        }).then(data => data.map(d => ({
            guildScheduledEvent: guild?.scheduledEvents.get(d.guild_scheduled_event_id) || { id: d.guild_scheduled_event_id },
            user: this._client.users.update(d.user),
            member: d.member ? this._client.util.updateMember(id, d.member.user.id, d.member) : undefined
        })));
    }
    /**
     * Get a guild's scheduled events
     *
     * @param {String} id - The ID of the guild.
     * @param {Number} [withUserCount] - If the number of users subscribed to the event should be included.
     * @returns {Promise<GuildScheduledEvent[]>}
     */
    async getScheduledEvents(id, withUserCount) {
        const query = new URLSearchParams();
        if (withUserCount)
            query.set("with_user_count", withUserCount.toString());
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_SCHEDULED_EVENTS(id),
            query
        }).then(data => data.map(d => new GuildScheduledEvent_1.default(d, this._client)));
    }
    /**
     * Get a guild template.
     *
     * @param {String} code - The code of the template to get.
     * @returns {Promise<GuildTemplate>}
     */
    async getTemplate(code) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_TEMPLATE_CODE(code)
        }).then(data => new GuildTemplate_1.default(data, this._client));
    }
    /**
     * Get a guild's templates.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<GuildTemplate[]>}
     */
    async getTemplates(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_TEMPLATES(id)
        }).then(data => data.map(d => new GuildTemplate_1.default(d, this._client)));
    }
    /**
     * Get the vanity url of a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<GetVanityURLResponse>}
     */
    async getVanityURL(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_VANITY_URL(id)
        });
    }
    /**
     * Get the list of usable voice regions for a guild. This will return VIP servers when the guild is VIP-enabled.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<VoiceRegion[]>}
     */
    async getVoiceRegions(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_VOICE_REGIONS(id)
        });
    }
    /**
     * Get the welcome screen for a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<WelcomeScreen>}
     */
    async getWelcomeScreen(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_WELCOME_SCREEN(id)
        }).then(data => ({
            description: data.description,
            welcomeChannels: data.welcome_channels.map(channel => ({
                channelID: channel.channel_id,
                description: channel.description,
                emojiID: channel.emoji_id,
                emojiName: channel.emoji_name
            }))
        }));
    }
    /**
     * Get the widget of a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<Widget>}
     */
    async getWidget(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_WIDGET(id)
        }).then(data => ({
            channels: data.channels,
            id: data.id,
            instantInvite: data.instant_invite,
            members: data.members.map(m => ({
                activity: m.activity,
                avatar: m.avatar,
                avatarURL: m.avatar_url,
                discriminator: m.discriminator,
                id: m.id,
                status: m.status,
                tag: `${m.username}#${m.discriminator}`,
                username: m.username
            })),
            name: data.name,
            presenceCount: data.presence_count
        }));
    }
    /**
     * Get the widget image of a guild.
     *
     * @param {String} id - The ID of the guild.
     * @param {WidgetImageStyle} [style=shield] - The style of the image.
     * @returns {Promise<Buffer>}
     */
    async getWidgetImage(id, style) {
        const query = new URLSearchParams();
        if (style)
            query.set("style", style.toString());
        return this._manager.request({
            method: "GET",
            path: Routes.GUILD_WIDGET_IMAGE(id),
            query
        });
    }
    /**
     * Get the raw JSON widget of a guild.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<RawWidget>}
     */
    async getWidgetJSON(id) {
        return this._manager.request({
            method: "GET",
            path: Routes.GUILD_WIDGET_JSON(id)
        });
    }
    /**
     * Get a guild's widget settings.
     *
     * @param {String} id - The ID of the guild.
     * @returns {Promise<WidgetSettings>}
     */
    async getWidgetSettings(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_WIDGET(id)
        }).then(data => ({
            channelID: data.channel_id,
            enabled: data.enabled
        }));
    }
    /**
     * Remove a ban.
     *
     * @param {String} id - The ID of the guild.
     * @param {string} userID - The ID of the user to remove the ban from.
     * @param {String} [reason] - The reason for removing the ban.
     */
    async removeBan(id, userID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_BAN(id, userID),
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
    async removeMember(id, memberID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_MEMBER(id, memberID),
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
    async removeMemberRole(id, memberID, roleID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_MEMBER_ROLE(id, memberID, roleID),
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
    async searchMembers(id, options) {
        const query = new URLSearchParams();
        query.set("query", options.query);
        if (options.limit)
            query.set("limit", options.limit.toString());
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_SEARCH_MEMBERS(id),
            query
        }).then(data => data.map(d => this._client.util.updateMember(id, d.user.id, d)));
    }
    /**
     * Sync a guild template.
     *
     * @param {String} id - The ID of the guild.
     * @param {String} code - The code of the template to sync.
     * @returns {Promise<GuildTemplate>}
     */
    async syncTemplate(id, code) {
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_TEMPLATE(id, code)
        }).then(data => new GuildTemplate_1.default(data, this._client));
    }
}
exports.default = Guilds;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3VpbGRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3JvdXRlcy9HdWlsZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDREQUFvQztBQStDcEMsdURBQXlDO0FBd0J6Qyw0RkFBb0U7QUFDcEUsb0VBQTRDO0FBVTVDLGdGQUF3RDtBQUV4RCw4RUFBc0Q7QUFnQnRELDhEQUFzQztBQUV0QyxrRUFBMEM7QUFDMUMsNEVBQW9EO0FBQ3BELDBGQUFrRTtBQUNsRSxvRUFBNEM7QUFDNUMsZ0ZBQXdEO0FBRXhELE1BQXFCLE1BQU8sU0FBUSxtQkFBUztJQUN6Qzs7Ozs7Ozs7Ozs7Ozs7T0FjRztJQUNILEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBVSxFQUFFLE1BQWMsRUFBRSxPQUF5QjtRQUNqRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFtQjtZQUMvQyxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUM7WUFDdkMsSUFBSSxFQUFJO2dCQUNKLFlBQVksRUFBRSxPQUFPLENBQUMsV0FBVztnQkFDakMsSUFBSSxFQUFVLE9BQU8sQ0FBQyxJQUFJO2dCQUMxQixJQUFJLEVBQVUsT0FBTyxDQUFDLElBQUk7Z0JBQzFCLElBQUksRUFBVSxPQUFPLENBQUMsSUFBSTtnQkFDMUIsS0FBSyxFQUFTLE9BQU8sQ0FBQyxLQUFLO2FBQzlCO1NBQ0osQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQWlCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDMUcsQ0FBQztJQUVEOzs7Ozs7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