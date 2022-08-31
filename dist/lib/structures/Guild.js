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
const Constants_1 = require("../Constants");
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
        this.joinedAt = null;
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
     * @param userID The ID of the user to add.
     * @param options The options for adding the member.
     */
    async addMember(userID, options) {
        return this._client.rest.guilds.addMember(this.id, userID, options);
    }
    /**
     * Add a role to a member.
     * @param memberID The ID of the member.
     * @param roleID The ID of the role to add.
     * @param reason The reason for adding the role.
     */
    async addMemberRole(memberID, roleID, reason) {
        return this._client.rest.guilds.addMemberRole(this.id, memberID, roleID, reason);
    }
    /**
     * The url of this guild's banner.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    bannerURL(format, size) {
        return this.banner === null ? null : this._client.util.formatImage(Routes.BANNER(this.id, this.banner), format, size);
    }
    /**
     * Begine a prune.
     * @param options The options for the prune.
     */
    async beginPrune(options) {
        return this._client.rest.guilds.beginPrune(this.id, options);
    }
    /**
     * Create an auto moderation rule for this guild.
     * @param options The options for the rule.
     */
    async createAutoModerationRule(options) {
        return this._client.rest.guilds.createAutoModerationRule(this.id, options);
    }
    /**
     * Create a bon for a user.
     * @param userID The ID of the user.
     * @param options The options for creating the bon.
     */
    async createBan(userID, options) {
        return this._client.rest.guilds.createBan(this.id, userID, options);
    }
    /**
     * Create a channel in this guild.
     * @param options The options for creating the channel.
     */
    async createChannel(type, options) {
        return this._client.rest.guilds.createChannel(this.id, type, options);
    }
    /**
     * Create an emoji in this guild.
     * @param options The options for creating the emoji.
     */
    async createEmoji(options) {
        return this._client.rest.guilds.createEmoji(this.id, options);
    }
    /**
     * Create a role.
     * @param options The options for creating the role.
     */
    async createRole(options) {
        return this._client.rest.guilds.createRole(this.id, options);
    }
    /**
     * Create a scheduled event in this guild.
     * @param options The options for creating the scheduled event.
     */
    async createScheduledEvent(options) {
        return this._client.rest.guilds.createScheduledEvent(this.id, options);
    }
    /**
     * Create a guild template.
     * @param options The options for creating the template.
     */
    async createTemplate(options) {
        return this._client.rest.guilds.createTemplate(this.id, options);
    }
    /**
     * Delete this guild.
     */
    async delete() {
        return this._client.rest.guilds.delete(this.id);
    }
    /**
     * Delete an auto moderation rule in this guild.
     * @param ruleID The ID of the rule to delete.
     * @param reason The reason for deleting the rule.
     */
    async deleteAutoModerationRule(ruleID, reason) {
        return this._client.rest.guilds.deleteAutoModerationRule(this.id, ruleID, reason);
    }
    /**
     * Delete an emoji in this guild.
     * @param emojiID The ID of the emoji.
     * @param reason The reason for deleting the emoji.
     */
    async deleteEmoji(emojiID, reason) {
        return this._client.rest.guilds.deleteEmoji(this.id, emojiID, reason);
    }
    /**
     * Delete an integration.
     * @param integrationID The ID of the integration.
     * @param reason The reason for deleting the integration.
     */
    async deleteIntegration(integrationID, reason) {
        return this._client.rest.guilds.deleteIntegration(this.id, integrationID, reason);
    }
    /**
     * Delete a role.
     * @param roleID The ID of the role to delete.
     * @param reason The reason for deleting the role.
     */
    async deleteRole(roleID, reason) {
        return this._client.rest.guilds.deleteRole(this.id, roleID, reason);
    }
    /**
     * Delete a scheduled event.
     * @param eventID The ID of the scheduled event.
     * @param reason The reason for deleting the scheduled event. Discord's docs do not explicitly state a reason can be provided, so it may not be used.
     */
    async deleteScheduledEvent(eventID, reason) {
        return this._client.rest.guilds.deleteScheduledEvent(this.id, eventID, reason);
    }
    /**
     * Delete a template.
     * @param code The code of the template.
     */
    async deleteTemplate(code) {
        return this._client.rest.guilds.deleteTemplate(this.id, code);
    }
    /**
     * Edit this guild.
     * @param options The options for editing the guild.
     */
    async edit(options) {
        return this._client.rest.guilds.edit(this.id, options);
    }
    /**
     * Edit an existing auto moderation rule in this guild.
     * @param ruleID The ID of the rule to edit.
     * @param options The options for editing the rule.
     */
    async editAutoModerationRule(ruleID, options) {
        return this._client.rest.guilds.editAutoModerationRule(this.id, ruleID, options);
    }
    /**
     * Edit the positions of channels in this guild.
     * @param options The channels to move. Unedited channels do not need to be specifed.
     */
    async editChannelPositions(options) {
        return this._client.rest.guilds.editChannelPositions(this.id, options);
    }
    /**
     * Modify the current member in this guild.
     * @param options The options for editing the member.
     */
    async editCurrentMember(options) {
        return this._client.rest.guilds.editCurrentMember(this.id, options);
    }
    /**
     * Edit the current member's voice state in this guild. `channelID` is required, and the current member must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-current-user-voice-state-caveats) for more information.
     * @param options The options for editing the voice state.
     */
    async editCurrentUserVoiceState(options) {
        return this._client.rest.guilds.editCurrentUserVoiceState(this.id, options);
    }
    /**
     * Edit an existing emoji in this guild.
     * @param options The options for editing the emoji.
     */
    async editEmoji(emojiID, options) {
        return this._client.rest.guilds.editEmoji(this.id, emojiID, options);
    }
    /**
     * Edit the [mfa level](https://discord.com/developers/docs/resources/guild#guild-object-mfa-level) of this guild. This can only be used by the guild owner.
     * @param level The new MFA level.
     */
    async editMFALevel(level) {
        return this._client.rest.guilds.editMFALevel(this.id, level);
    }
    /**
     * Edit a member of this guild.
     * @param memberID The ID of the member.
     * @param options The options for editing the member.
     */
    async editMember(memberID, options) {
        return this._client.rest.guilds.editMember(this.id, memberID, options);
    }
    /**
     * Edit an existing role.
     * @param options The options for editing the role.
     */
    async editRole(roleID, options) {
        return this._client.rest.guilds.editRole(this.id, roleID, options);
    }
    /**
     * Edit the position of roles in this guild.
     * @param options The roles to move.
     */
    async editRolePositions(options, reason) {
        return this._client.rest.guilds.editRolePositions(this.id, options, reason);
    }
    /**
     * Edit an existing scheduled event in this guild.
     * @param options The options for editing the scheduled event.
     */
    async editScheduledEvent(options) {
        return this._client.rest.guilds.editScheduledEvent(this.id, options);
    }
    /**
     * Edit a template.
     * @param code The code of the template.
     * @param options The options for editing the template.
     */
    async editTemplate(code, options) {
        return this._client.rest.guilds.editTemplate(this.id, code, options);
    }
    /**
     * Edit a guild member's voice state. `channelID` is required, and the user must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-user-voice-state) for more information.
     * @param memberID The ID of the member.
     * @param options The options for editing the voice state.
     */
    async editUserVoiceState(memberID, options) {
        return this._client.rest.guilds.editUserVoiceState(this.id, memberID, options);
    }
    /**
     * Edit the welcome screen in this guild.
     * @param options The options for editing the welcome screen.
     */
    async editWelcomeScreen(options) {
        return this._client.rest.guilds.editWelcomeScreen(this.id, options);
    }
    /**
     * Edit the widget of this guild.
     * @param options The options for editing the widget.
     */
    async editWidget(options) {
        return this._client.rest.guilds.editWidget(this.id, options);
    }
    /**
     * Request members from this guild.
     * @param options The options for fetching the members.
     */
    async fetchMembers(options) {
        return this.shard.requestGuildMembers(this.id, options);
    }
    /**
     * Get the active threads in this guild.
     */
    async getActiveThreads() {
        return this._client.rest.guilds.getActiveThreads(this.id);
    }
    /**
     * Get this guild's audit log.
     * @param options The options for the audit log.
     */
    async getAuditLog(options) {
        return this._client.rest.guilds.getAuditLog(this.id, options);
    }
    /**
     * Get an auto moderation rule for this guild.
     * @param ruleID The ID of the rule to get.
     */
    async getAutoModerationRule(ruleID) {
        return this._client.rest.guilds.getAutoModerationRule(this.id, ruleID);
    }
    /**
     * Get the auto moderation rules for this guild.
     */
    async getAutoModerationRules() {
        return this._client.rest.guilds.getAutoModerationRules(this.id);
    }
    /**
     * Get a ban in this guild.
     * @param userID The ID of the user to get the ban of.
     */
    async getBan(userID) {
        return this._client.rest.guilds.getBan(this.id, userID);
    }
    /**
     * Get the bans in this guild.
     * @param options The options for getting the bans.
     */
    async getBans(options) {
        return this._client.rest.guilds.getBans(this.id, options);
    }
    /**
     * Get the channels in a guild. Does not include threads. Only use this if you need to. See the `channels` collection.
     */
    async getChannels() {
        return this._client.rest.guilds.getChannels(this.id);
    }
    /**
     * Get an emoji in this guild.
     * @param emojiID The ID of the emoji to get.
     */
    async getEmoji(emojiID) {
        return this._client.rest.guilds.getEmoji(this.id, emojiID);
    }
    /**
     * Get the emojis in this guild.
     */
    async getEmojis() {
        return this._client.rest.guilds.getEmojis(this.id);
    }
    /**
     * Get the integrations in this guild.
     */
    async getIntegrations() {
        return this._client.rest.guilds.getIntegrations(this.id);
    }
    /**
     * Get the invites of this guild.
     */
    async getInvites() {
        return this._client.rest.guilds.getInvites(this.id);
    }
    /**
     * Get a member of this guild.
     * @param memberID The ID of the member.
     */
    async getMember(memberID) {
        return this._client.rest.guilds.getMember(this.id, memberID);
    }
    /**
     * Get this guild's members. This requires the `GUILD_MEMBERS` intent.
     * @param options The options for getting the members.
     */
    async getMembers(options) {
        return this._client.rest.guilds.getMembers(this.id, options);
    }
    /**
     * Get a preview of this guild.
     */
    async getPreview() {
        return this._client.rest.guilds.getPreview(this.id);
    }
    /**
     * Get the prune count of this guild.
     * @param options The options for getting the prune count.
     */
    async getPruneCount(options) {
        return this._client.rest.guilds.getPruneCount(this.id, options);
    }
    /**
     * Get the roles in this guild. Only use this if you need to. See the `roles` collection.
     */
    async getRoles() {
        return this._client.rest.guilds.getRoles(this.id);
    }
    /**
     * Get a scheduled event.
     * @param eventID The ID of the scheduled event to get.
     * @param withUserCount If the number of users subscribed to the event should be included.
     */
    async getScheduledEvent(eventID, withUserCount) {
        return this._client.rest.guilds.getScheduledEvent(this.id, eventID, withUserCount);
    }
    /**
     * Get the users subscribed to a scheduled event.
     * @param eventID The ID of the scheduled event to get the users of.
     * @param options The options for getting the users.
     */
    async getScheduledEventUsers(eventID, options) {
        return this._client.rest.guilds.getScheduledEventUsers(this.id, eventID, options);
    }
    /**
     * Get this guild's scheduled events
     * @param withUserCount If the number of users subscribed to the event should be included.
     */
    async getScheduledEvents(withUserCount) {
        return this._client.rest.guilds.getScheduledEvents(this.id, withUserCount);
    }
    /**
     * Get this guild's templates.
     */
    async getTemplates() {
        return this._client.rest.guilds.getTemplates(this.id);
    }
    /**
     * Get the vanity url of this guild.
     */
    async getVanityURL() {
        return this._client.rest.guilds.getVanityURL(this.id);
    }
    /**
     * Get the list of usable voice regions for this guild. This will return VIP servers when the guild is VIP-enabled.
     */
    async getVoiceRegions() {
        return this._client.rest.guilds.getVoiceRegions(this.id);
    }
    /**
     * Get the welcome screen for this guild.
     */
    async getWelcomeScreen() {
        return this._client.rest.guilds.getWelcomeScreen(this.id);
    }
    /**
     * Get the widget of this guild.
     */
    async getWidget() {
        return this._client.rest.guilds.getWidget(this.id);
    }
    /**
     * Get the widget image of this guild.
     * @param style The style of the image.
     */
    async getWidgetImage(style) {
        return this._client.rest.guilds.getWidgetImage(this.id, style);
    }
    /**
     * Get the raw JSON widget of this guild.
     */
    async getWidgetJSON() {
        return this._client.rest.guilds.getWidgetJSON(this.id);
    }
    /**
     * Get this guild's widget settings.
     */
    async getWidgetSettings() {
        return this._client.rest.guilds.getWidgetSettings(this.id);
    }
    /**
     * The url of this guild's icon.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    iconURL(format, size) {
        return this.icon === null ? null : this._client.util.formatImage(Routes.GUILD_ICON(this.id, this.icon), format, size);
    }
    /**
     * Leave this guild.
     */
    async leave() {
        return this._client.rest.guilds.delete(this.id);
    }
    /**
     * Get the permissions of a member. If providing an id, the member must be cached.
     * @param member The member to get the permissions of.
     */
    permissionsOf(member) {
        if (typeof member === "string")
            member = this.members.get(member);
        if (!member)
            throw new Error("Member not found");
        if (member.id === this.owner.id)
            return new Permission_1.default(Constants_1.AllPermissions);
        else {
            let permissions = this.roles.get(this.id).permissions.allow;
            if (permissions & Constants_1.Permissions.ADMINISTRATOR)
                return new Permission_1.default(Constants_1.AllPermissions);
            for (const id of member.roles) {
                const role = this.roles.get(id);
                if (!role)
                    continue;
                if (role.permissions.allow & Constants_1.Permissions.ADMINISTRATOR) {
                    permissions = Constants_1.AllPermissions;
                    break;
                }
                else
                    permissions |= role.permissions.allow;
            }
            return new Permission_1.default(permissions);
        }
    }
    /**
     * Remove a ban.
     * @param userID The ID of the user to remove the ban from.
     * @param reason The reason for removing the ban.
     */
    async removeBan(userID, reason) {
        return this._client.rest.guilds.removeBan(this.id, userID, reason);
    }
    /**
     * Remove a member from this guild.
     * @param memberID The ID of the user to remove.
     * @param reason The reason for the removal.
     */
    async removeMember(memberID, reason) {
        return this._client.rest.guilds.removeMember(this.id, memberID, reason);
    }
    /**
     * remove a role from a member.
     * @param memberID The ID of the member.
     * @param roleID The ID of the role to remove.
     * @param reason The reason for removing the role.
     */
    async removeMemberRole(memberID, roleID, reason) {
        return this._client.rest.guilds.removeMemberRole(this.id, memberID, roleID, reason);
    }
    /**
     * Search the username & nicknames of members in this guild.
     * @param options The options for the search.
     */
    async searchMembers(options) {
        return this._client.rest.guilds.searchMembers(this.id, options);
    }
    /**
     * Sync a guild template.
     * @param code The code of the template to sync.
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
            joinedAt: this.joinedAt?.getTime() || null,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3VpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9HdWlsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLGtEQUEwQjtBQUMxQixrRUFBMEM7QUFDMUMsc0RBQThCO0FBRTlCLG9FQUE0QztBQU01QyxnRUFBd0M7QUFDeEMsOEVBQXNEO0FBQ3RELDhEQUFzQztBQUN0Qyw4REFBc0M7QUFDdEMsb0VBQTRDO0FBQzVDLHdEQUFnQztBQVloQyw0Q0FBMkQ7QUFDM0QsdURBQXlDO0FBRXpDLG9FQUE0QztBQWtENUMsbUNBQW1DO0FBQ25DLE1BQXFCLEtBQU0sU0FBUSxjQUFJO0lBQ25DLCtGQUErRjtJQUMvRixVQUFVLENBQWlDO0lBQzNDLDRFQUE0RTtJQUM1RSxVQUFVLENBQVM7SUFDbkIsdUhBQXVIO0lBQ3ZILFdBQVcsQ0FBc0M7SUFDakQsa0ZBQWtGO0lBQ2xGLHNCQUFzQixDQUFVO0lBQ2hDLDhGQUE4RjtJQUM5Rix3QkFBd0IsQ0FBVTtJQUNsQywrQ0FBK0M7SUFDL0MsbUJBQW1CLENBQWdFO0lBQ25GLHVDQUF1QztJQUN2QyxNQUFNLENBQWdCO0lBQ3RCLGtDQUFrQztJQUNsQyxRQUFRLENBQXFFO0lBQzdFLG9LQUFvSztJQUNwSywyQkFBMkIsQ0FBbUM7SUFDOUQscUNBQXFDO0lBQ3JDLFdBQVcsQ0FBZ0I7SUFDM0Isb0dBQW9HO0lBQ3BHLGVBQWUsQ0FBZ0I7SUFDL0IsdUNBQXVDO0lBQ3ZDLE1BQU0sQ0FBb0I7SUFDMUIsbUpBQW1KO0lBQ25KLHFCQUFxQixDQUE4QjtJQUNuRCxzSEFBc0g7SUFDdEgsUUFBUSxDQUFzQjtJQUM5QixtQ0FBbUM7SUFDbkMsSUFBSSxDQUFnQjtJQUNwQixzQ0FBc0M7SUFDdEMsWUFBWSxDQUFrRDtJQUM5RCwrQ0FBK0M7SUFDL0MsUUFBUSxDQUFjO0lBQ3RCLHlDQUF5QztJQUN6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