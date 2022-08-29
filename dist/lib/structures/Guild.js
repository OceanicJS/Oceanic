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
const Role_1 = __importDefault(require("./Role"));
const Base_1 = __importDefault(require("./Base"));
const GuildChannel_1 = __importDefault(require("./GuildChannel"));
const Member_1 = __importDefault(require("./Member"));
const ThreadChannel_1 = __importDefault(require("./ThreadChannel"));
const Integration_1 = __importDefault(require("./Integration"));
const AutoModerationRule_1 = __importDefault(require("./AutoModerationRule"));
const Permission_1 = __importDefault(require("./Permission"));
const VoiceState_1 = __importDefault(require("./VoiceState"));
const StageInstance_1 = __importDefault(require("./StageInstance"));
const Channel_1 = __importDefault(require("./Channel"));
const Routes = __importStar(require("../util/Routes"));
const Collection_1 = __importDefault(require("../util/Collection"));
/** Represents a Discord server. */
class Guild extends Base_1.default {
    /** This guild's afk voice channel. This can be a partial object with just an `id` property. */
    afkChannel;
    /** The seconds after which voice users will be moved to the afk channel. */
    afkTimeout;
    /** The application that created this guild, if applicable. This can be a partial object with just an `id` property. */
    application;
    /** The approximate number of members in this guild (if retreived with counts). */
    approximateMemberCount;
    /** The approximate number of non-offline members in this guild (if retreived with counts). */
    approximatePresenceCount;
    /** The auto moderation rules in this guild. */
    autoModerationRules;
    /** The hash of this guild's banner. */
    banner;
    /** The channels in this guild. */
    channels;
    /** The default [message notifications level](https://discord.com/developers/docs/resources/guild#guild-object-default-message-notification-level) of this guild. */
    defaultMessageNotifications;
    /** The description of this guild. */
    description;
    /** The discovery splash of this guild. Only present if the guild has the `DISCOVERABLE` feature. */
    discoverySplash;
    /** The custom emojis of this guild. */
    emojis;
    /** The [explicit content filter](https://discord.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level) of this guild. */
    explicitContentFilter;
    /** The [features](https://discord.com/developers/docs/resources/guild#guild-object-guild-features) this guild has. */
    features;
    /** The icon hash of this guild. */
    icon;
    /** The integrations in this guild. */
    integrations;
    /** The date at which this guild was joined. */
    joinedAt;
    /** If this guild is considered large. */
    large;
    /** The maximum amount of members this guild can have. */
    maxMembers;
    /** The maximum amount of people that can be present at a time in this guild. Only present for very large guilds. */
    maxPresences;
    /** The maximum amount of users that can be present in a video channel. */
    maxVideoChannelUsers;
    /** The number of members in this guild. */
    memberCount;
    /** The cached members in this guild. */
    members;
    /** The required [mfa level](https://discord.com/developers/docs/resources/guild#guild-object-mfa-level) for moderators of this guild. */
    mfaLevel;
    /** The name of this guild. */
    name;
    /** The [nsfw level](https://discord.com/developers/docs/resources/guild#guild-object-guild-nsfw-level) of this guild. */
    nsfwLevel;
    /** If the current user is the owner of this guild (only present when getting the current user's guilds). */
    oauthOwner;
    /** The id of the owner of this guild. */
    owner;
    /** The permissions of the current user in this guild (only present when getting the current user's guilds). */
    permissions;
    /** The [preferred locale](https://discord.com/developers/docs/reference#locales) of this guild. */
    preferredLocale;
    /** If this guild has the boost progress bar enabled. */
    premiumProgressBarEnabled;
    /** The number of nitro boosts this guild has. */
    premiumSubscriptionCount;
    /** The [boost level](https://discord.com/developers/docs/resources/guild#guild-object-premium-tier) of this guild. */
    premiumTier;
    /** The id of the channel where notices from Discord are recieved. Only present in guilds with the `COMMUNITY` feature. */
    publicUpdatesChannel;
    /** @deprecated The region of this guild.*/
    region;
    /** The roles in this guild. */
    roles;
    /** The id of the channel where rules/guidelines are displayed. Only present in guilds with the `COMMUNITY` feature. */
    rulesChannel;
    /** The scheduled events in this guild. */
    scheduledEvents;
    /** The invite splash hash of this guild. */
    splash;
    /** The stage instances in this guild. */
    stageInstances;
    /** The custom stickers of this guild. */
    stickers;
    /** The id of the channel where welcome messages and boosts notices are posted. */
    systemChannel;
    /** The [flags](https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags) for the system channel. */
    systemChannelFlags;
    /** The threads in this guild. */
    threads;
    /** If this guild is unavailable. */
    unavailable;
    /** The vanity url of this guild. Only present in guilds with the `VANITY_URL` feature. */
    vanityURLCode;
    /** The [verfication level](https://discord.com/developers/docs/resources/guild#guild-object-verification-level) of this guild. */
    verificationLevel;
    /** The voice states of members in voice channels. */
    voiceStates;
    /** The welcome screen configuration. Only present in guilds with the `WELCOME_SCREEN_ENABLED` feature. */
    welcomeScreen;
    /** The id of the channel the widget will generate an invite to, or `null` if set to no invite. */
    widgetChannel;
    /** If the widget is enabled. */
    widgetEnabled;
    constructor(data, client) {
        super(data.id, client);
        this.autoModerationRules = new Collection_1.default(AutoModerationRule_1.default, client);
        this.emojis = [];
        this.channels = new Collection_1.default(GuildChannel_1.default, client);
        this.features = [];
        this.integrations = new Collection_1.default(Integration_1.default, client);
        this.memberCount = data.member_count || data.approximate_member_count || 0;
        this.members = new Collection_1.default(Member_1.default, client);
        this.roles = new Collection_1.default(Role_1.default, client);
        this.stageInstances = new Collection_1.default(StageInstance_1.default, client);
        this.threads = new Collection_1.default(ThreadChannel_1.default, client);
        this.stickers = [];
        this.voiceStates = new Collection_1.default(VoiceState_1.default, client);
        data.roles.forEach(role => this.roles.update(role, data.id));
        this.update(data);
        if (data.channels) {
            for (const channelData of data.channels) {
                channelData.guild_id = this.id;
                client.channelGuildMap[channelData.id] = this.id;
                this.channels.add(Channel_1.default.from(channelData, client)).guild = this;
            }
        }
        if (data.threads) {
            for (const threadData of data.threads) {
                threadData.guild_id = this.id;
                this.threads.add(Channel_1.default.from(threadData, client)).guild = this;
                client.threadGuildMap[threadData.id] = this.id;
            }
        }
        if (data.members) {
            for (const member of data.members) {
                this.members.update({ ...member, id: member.user.id }, this.id).guild = this;
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
                    delete presence.user;
                    member.presence = presence;
                }
                else {
                    client.emit("debug", `Rogue presence (user: ${presence.user.id}, guild: ${this.id})`);
                }
            }
        }
        if (data.voice_states) {
            for (const voiceState of data.voice_states) {
                if (!this.members.has(voiceState.user_id) || !voiceState.channel_id)
                    continue;
                voiceState.guild_id = this.id;
                this.voiceStates.update({ ...voiceState, id: voiceState.user_id });
                const channel = this.channels.get(voiceState.channel_id);
                const member = this.members.update({ id: voiceState.user_id, deaf: voiceState.deaf, mute: voiceState.mute }, this.id);
                if (channel && "voiceMembers" in channel)
                    channel.voiceMembers.add(member);
                // @TODO voice
                /* if (client.shards.options.seedVoiceConnections && voiceState.user_id === client.user!.id && !client.voiceConnections.has(this.id)) {
                    process.nextTick(() => client.joinVoiceChannel(voiceState.channel_id!));
                } */
            }
        }
    }
    update(data) {
        if (data.afk_channel_id !== undefined)
            this.afkChannel = data.afk_channel_id === null ? null : this._client.getChannel(data.afk_channel_id) || { id: data.afk_channel_id };
        if (data.afk_timeout !== undefined)
            this.afkTimeout = data.afk_timeout;
        if (data.application_id !== undefined)
            this.application = data.application_id === null ? null : this._client.application?.id === data.application_id ? this._client.application : { id: data.application_id };
        if (data.approximate_member_count !== undefined)
            this.approximateMemberCount = data.approximate_member_count;
        if (data.approximate_presence_count !== undefined)
            this.approximatePresenceCount = data.approximate_presence_count;
        if (data.banner !== undefined)
            this.banner = data.banner;
        if (data.default_message_notifications !== undefined)
            this.defaultMessageNotifications = data.default_message_notifications;
        if (data.description !== undefined)
            this.description = data.description;
        if (data.discovery_splash !== undefined)
            this.discoverySplash = data.discovery_splash;
        if (data.emojis !== undefined)
            this.emojis = data.emojis.map(emoji => ({
                ...emoji,
                user: !emoji.user ? undefined : this._client.users.update(emoji.user)
            }));
        if (data.explicit_content_filter !== undefined)
            this.explicitContentFilter = data.explicit_content_filter;
        if (data.features !== undefined)
            this.features = data.features;
        if (data.icon !== undefined)
            this.icon = data.icon;
        if (data.max_members !== undefined)
            this.maxMembers = data.max_members;
        if (data.max_presences !== undefined)
            this.maxPresences = data.max_presences;
        if (data.max_video_channel_users !== undefined)
            this.maxVideoChannelUsers = data.max_video_channel_users;
        if (data.member_count !== undefined)
            this.memberCount = data.member_count;
        if (data.mfa_level !== undefined)
            this.mfaLevel = data.mfa_level;
        if (data.name !== undefined)
            this.name = data.name;
        if (data.nsfw_level !== undefined)
            this.nsfwLevel = data.nsfw_level;
        if (data.owner !== undefined)
            this.oauthOwner = data.owner;
        if (data.owner_id !== undefined)
            this.owner = this._client.users.get(data.owner_id) || { id: data.owner_id };
        if (data.permissions !== undefined)
            this.permissions = new Permission_1.default(data.permissions);
        if (data.preferred_locale !== undefined)
            this.preferredLocale = data.preferred_locale;
        if (data.premium_progress_bar_enabled !== undefined)
            this.premiumProgressBarEnabled = data.premium_progress_bar_enabled;
        if (data.premium_subscription_count !== undefined)
            this.premiumSubscriptionCount = data.premium_subscription_count;
        if (data.premium_tier !== undefined)
            this.premiumTier = data.premium_tier;
        if (data.public_updates_channel_id !== undefined)
            this.publicUpdatesChannel = data.public_updates_channel_id === null ? null : this._client.getChannel(data.public_updates_channel_id) || { id: data.public_updates_channel_id };
        if (data.region !== undefined)
            this.region = data.region;
        if (data.rules_channel_id !== undefined)
            this.rulesChannel = data.rules_channel_id === null ? null : this._client.getChannel(data.rules_channel_id) || { id: data.rules_channel_id };
        if (data.splash !== undefined)
            this.splash = data.splash;
        if (data.stickers !== undefined)
            this.stickers = data.stickers;
        if (data.system_channel_flags !== undefined)
            this.systemChannelFlags = data.system_channel_flags;
        if (data.system_channel_id !== undefined)
            this.systemChannel = data.system_channel_id === null ? null : this._client.getChannel(data.system_channel_id) || { id: data.system_channel_id };
        if (data.vanity_url_code !== undefined)
            this.vanityURLCode = data.vanity_url_code;
        if (data.verification_level !== undefined)
            this.verificationLevel = data.verification_level;
        if (data.welcome_screen !== undefined)
            this.welcomeScreen = {
                description: data.welcome_screen.description,
                welcomeChannels: data.welcome_screen.welcome_channels.map(channel => ({
                    channelID: channel.channel_id,
                    description: channel.description,
                    emojiID: channel.emoji_id,
                    emojiName: channel.emoji_name
                }))
            };
        if (data.widget_channel_id !== undefined)
            this.widgetChannel = data.widget_channel_id === null ? null : this._client.getChannel(data.widget_channel_id) || { id: data.widget_channel_id };
        if (data.widget_enabled !== undefined)
            this.widgetEnabled = data.widget_enabled;
    }
    /** The shard this guild is on. Gateway only. */
    get shard() { return this._client.shards.get(this._client.guildShardMap[this.id]); }
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
    async addMember(userID, options) {
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
    async addMemberRole(memberID, roleID, reason) {
        return this._client.rest.guilds.addMemberRole(this.id, memberID, roleID, reason);
    }
    /**
     * The url of this guild's banner.
     *
     * @param {ImageFormat} format - The format the url should be.
     * @param {Number} size - The dimensions of the image.
     * @returns {(String | null)}
     */
    bannerURL(format, size) {
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
    async beginPrune(options) {
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
    async createAutoModerationRule(options) {
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
    async createBan(userID, options) {
        return this._client.rest.guilds.createBan(this.id, userID, options);
    }
    async createChannel(options) {
        return this._client.rest.guilds.createChannel(this.id, options);
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
    async createEmoji(options) {
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
    async createRole(options) {
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
    async createScheduledEvent(options) {
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
    async createTemplate(options) {
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
    async deleteAutoModerationRule(ruleID, reason) {
        return this._client.rest.guilds.deleteAutoModerationRule(this.id, ruleID, reason);
    }
    /**
     * Delete an emoji in this guild.
     *
     * @param {String} emojiID - The ID of the emoji.
     * @param {String} [reason] - The reason for deleting the emoji.
     * @returns {Promise<void>}
     */
    async deleteEmoji(emojiID, reason) {
        return this._client.rest.guilds.deleteEmoji(this.id, emojiID, reason);
    }
    /**
     * Delete an integration.
     *
     * @param {String} integrationID - The ID of the integration.
     * @param {String} [reason] - The reason for deleting the integration.
     * @returns {Promise<void>}
     */
    async deleteIntegration(integrationID, reason) {
        return this._client.rest.guilds.deleteIntegration(this.id, integrationID, reason);
    }
    /**
     * Delete a role.
     *
     * @param {String} roleID - The ID of the role to delete.
     * @param {String} [reason] - The reason for deleting the role.
     * @returns {Promise<void>}
     */
    async deleteRole(roleID, reason) {
        return this._client.rest.guilds.deleteRole(this.id, roleID, reason);
    }
    /**
     * Delete a scheduled event.
     *
     * @param {String} eventID - The ID of the scheduled event.
     * @param {String} reason - The reason for deleting the scheduled event. Discord's docs do not explicitly state a reason can be provided, so it may not be used.
     * @returns {Promise<void>}
     */
    async deleteScheduledEvent(eventID, reason) {
        return this._client.rest.guilds.deleteScheduledEvent(this.id, eventID, reason);
    }
    /**
     * Delete a template.
     *
     * @param {String} code - The code of the template.
     * @returns {Promise<void>}
     */
    async deleteTemplate(code) {
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
    async edit(options) {
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
    async editAutoModerationRule(ruleID, options) {
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
    async editChannelPositions(options) {
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
    async editCurrentMember(options) {
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
    async editCurrentUserVoiceState(options) {
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
    async editEmoji(emojiID, options) {
        return this._client.rest.guilds.editEmoji(this.id, emojiID, options);
    }
    /**
     * Edit the [mfa level](https://discord.com/developers/docs/resources/guild#guild-object-mfa-level) of this guild. This can only be used by the guild owner.
     *
     * @param {MFALevels} level - The new MFA level.
     * @returns {Promise<MFALevels>}
     */
    async editMFALevel(level) {
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
    async editMember(memberID, options) {
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
    async editRole(roleID, options) {
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
    async editRolePositions(options, reason) {
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
    async editScheduledEvent(options) {
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
    async editTemplate(code, options) {
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
    async editUserVoiceState(memberID, options) {
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
    async editWelcomeScreen(options) {
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
    async editWidget(options) {
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
    async fetchMembers(options) {
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
    async getAuditLog(options) {
        return this._client.rest.guilds.getAuditLog(this.id, options);
    }
    /**
     * Get an auto moderation rule for this guild.
     *
     * @param {String} ruleID - The ID of the rule to get.
     * @returns {Promise<AutoModerationRule>}
     */
    async getAutoModerationRule(ruleID) {
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
    async getBan(userID) {
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
    async getBans(options) {
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
    async getEmoji(emojiID) {
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
    async getMember(memberID) {
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
    async getMembers(options) {
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
    async getPruneCount(options) {
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
    async getScheduledEvent(eventID, withUserCount) {
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
    async getScheduledEventUsers(eventID, options) {
        return this._client.rest.guilds.getScheduledEventUsers(this.id, eventID, options);
    }
    /**
     * Get this guild's scheduled events
     *
     * @param {Number} [withUserCount] - If the number of users subscribed to the event should be included.
     * @returns {Promise<GuildScheduledEvent[]>}
     */
    async getScheduledEvents(withUserCount) {
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
    async getWidgetImage(style) {
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
    iconURL(format, size) {
        return this.icon === null ? null : this._client.util.formatImage(Routes.GUILD_ICON(this.id, this.icon), format, size);
    }
    /**
     * Remove a ban.
     *
     * @param {string} userID - The ID of the user to remove the ban from.
     * @param {String} [reason] - The reason for removing the ban.
     */
    async removeBan(userID, reason) {
        return this._client.rest.guilds.removeBan(this.id, userID, reason);
    }
    /**
     * Remove a member from this guild.
     *
     * @param {String} memberID - The ID of the user to remove.
     * @param {String} reason - The reason for the removal.
     * @returns {Promise<void>}
     */
    async removeMember(memberID, reason) {
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
    async removeMemberRole(memberID, roleID, reason) {
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
    async searchMembers(options) {
        return this._client.rest.guilds.searchMembers(this.id, options);
    }
    /**
     * Sync a guild template.
     *
     * @param {String} code - The code of the template to sync.
     * @returns {Promise<GuildTemplate>}
     */
    async syncTemplate(code) {
        return this._client.rest.guilds.syncTemplate(this.id, code);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            afkChannel: this.afkChannel?.id || null,
            afkTimeout: this.afkTimeout,
            application: this.application?.id,
            approximateMemberCount: this.approximateMemberCount,
            approximatePresenceCount: this.approximatePresenceCount,
            autoModerationRules: this.autoModerationRules.map(rule => rule.toJSON()),
            banner: this.banner,
            channels: this.channels.map(channel => channel.id),
            defaultMessageNotifications: this.defaultMessageNotifications,
            description: this.description,
            discoverySplash: this.discoverySplash,
            emojis: this.emojis,
            explicitContentFilter: this.explicitContentFilter,
            features: this.features,
            icon: this.icon,
            joinedAt: this.joinedAt.getTime(),
            large: this.large,
            maxMembers: this.maxMembers,
            maxPresences: this.maxPresences,
            maxVideoChannelUsers: this.maxVideoChannelUsers,
            memberCount: this.memberCount,
            members: this.members.map(member => member.id),
            mfaLevel: this.mfaLevel,
            name: this.name,
            nsfwLevel: this.nsfwLevel,
            owner: this.owner?.id,
            permissions: this.permissions?.toJSON(),
            preferredLocale: this.preferredLocale,
            premiumProgressBarEnabled: this.premiumProgressBarEnabled,
            premiumSubscriptionCount: this.premiumSubscriptionCount,
            premiumTier: this.premiumTier,
            publicUpdatesChannel: this.publicUpdatesChannel?.id || null,
            region: this.region,
            roles: this.roles.map(role => role.toJSON()),
            rulesChannel: this.rulesChannel?.id || null,
            scheduledEvents: this.scheduledEvents.map(event => event.toJSON()),
            splash: this.splash,
            stageInstances: this.stageInstances.map(instance => instance.toJSON()),
            stickers: this.stickers,
            systemChannel: this.systemChannel?.id || null,
            systemChannelFlags: this.systemChannelFlags,
            threads: this.threads.map(thread => thread.id),
            unavailable: this.unavailable,
            vanityURLCode: this.vanityURLCode,
            verificationLevel: this.verificationLevel,
            voiceStates: this.voiceStates.map(state => state.toJSON()),
            welcomeScreen: this.welcomeScreen,
            widgetChannel: this.widgetChannel === null ? null : this.widgetChannel?.id,
            widgetEnabled: this.widgetEnabled
        };
    }
}
exports.default = Guild;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3VpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9HdWlsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLGtEQUEwQjtBQUMxQixrRUFBMEM7QUFDMUMsc0RBQThCO0FBRTlCLG9FQUE0QztBQVM1QyxnRUFBd0M7QUFHeEMsOEVBQXNEO0FBQ3RELDhEQUFzQztBQUN0Qyw4REFBc0M7QUFDdEMsb0VBQTRDO0FBQzVDLHdEQUFnQztBQXVCaEMsdURBQXlDO0FBRXpDLG9FQUE0QztBQW9FNUMsbUNBQW1DO0FBQ25DLE1BQXFCLEtBQU0sU0FBUSxjQUFJO0lBQ25DLCtGQUErRjtJQUMvRixVQUFVLENBQWlDO0lBQzNDLDRFQUE0RTtJQUM1RSxVQUFVLENBQVM7SUFDbkIsdUhBQXVIO0lBQ3ZILFdBQVcsQ0FBc0M7SUFDakQsa0ZBQWtGO0lBQ2xGLHNCQUFzQixDQUFVO0lBQ2hDLDhGQUE4RjtJQUM5Rix3QkFBd0IsQ0FBVTtJQUNsQywrQ0FBK0M7SUFDL0MsbUJBQW1CLENBQWdFO0lBQ25GLHVDQUF1QztJQUN2QyxNQUFNLENBQWdCO0lBQ3RCLGtDQUFrQztJQUNsQyxRQUFRLENBQXFFO0lBQzdFLG9LQUFvSztJQUNwSywyQkFBMkIsQ0FBbUM7SUFDOUQscUNBQXFDO0lBQ3JDLFdBQVcsQ0FBZ0I7SUFDM0Isb0dBQW9HO0lBQ3BHLGVBQWUsQ0FBZ0I7SUFDL0IsdUNBQXVDO0lBQ3ZDLE1BQU0sQ0FBb0I7SUFDMUIsbUpBQW1KO0lBQ25KLHFCQUFxQixDQUE4QjtJQUNuRCxzSEFBc0g7SUFDdEgsUUFBUSxDQUFzQjtJQUM5QixtQ0FBbUM7SUFDbkMsSUFBSSxDQUFnQjtJQUNwQixzQ0FBc0M7SUFDdEMsWUFBWSxDQUFrRDtJQUM5RCwrQ0FBK0M7SUFDL0MsUUFBUSxDQUFPO0lBQ2YseUNBQXlDO0lBQ3pDLEtBQUssQ0FBVTtJ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