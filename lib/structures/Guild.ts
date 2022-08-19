import Role from "./Role";
import Base from "./Base";
import GuildChannel from "./GuildChannel";
import Member from "./Member";
import type ScheduledEvent from "./ScheduledEvent";
import ThreadChannel from "./ThreadChannel";
import type {
	AutoModerationActionTypes,
	AutoModerationEventTypes,
	AutoModerationKeywordPresetTypes,
	AutoModerationTriggerTypes,
	DefaultMessageNotificationLevels,
	ExplicitContentFilterLevels,
	GuildFeature,
	GuildNSFWLevels,
	ImageFormat,
	MFALevels,
	PremiumTiers,
	VerificationLevels
} from "../Constants";
import * as Routes from "../util/Routes";
import type Client from "../Client";
import Collection from "../util/Collection";
import type { AnyThreadChannel, RawGuildChannel, RawThreadChannel } from "../types/channels";
import type {
	CreateEmojiOptions,
	EditEmojiOptions,
	GuildEmoji,
	RawGuild,
	RawMember,
	RawRole,
	Sticker,
	WelcomeScreen
} from "../types/guilds";
import type { RawScheduledEvent } from "../types/scheduled-events";
import type { AutoModerationRule, CreateAutoModerationRuleOptions, EditAutoModerationRuleOptions } from "../types/auto-moderation";

export default class Guild extends Base {
	/** The id of this guild's AFK channel. */
	afkChannelID: string | null;
	/** The seconds after which voice users will be moved to the afk channel. */
	afkTimeout: number;
	/** The id of the application that created this guild, if applicable. */
	applicationID: string | null;
	/** The approximate number of members in this guild (if retreived with counts). */
	approximateMemberCount?: number;
	/** The approximate number of non-offline members in this guild (if retreived with counts). */
	approximatePresenceCount?: number;
	/** The hash of this guild's banner. */
	banner: string | null;
	/** The channels in this guild. */
	channels: Collection<string, RawGuildChannel, GuildChannel>;
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
	/** The maximum amount of members this guild can have. */
	maxMembers?: number;
	/** The maximum amount of people that can be present at a time in this guild. Only present for very large guilds. */
	maxPresences?: number;
	/** The maximum amount of users that can be present in a video channel. */
	maxVideoChannelUsers?: number;
	/** The cached members in this guild. */
	members: Collection<string, RawMember & { id: string; }, Member, [guildID: string]>;
	/** The required [mfa level](https://discord.com/developers/docs/resources/guild#guild-object-mfa-level) for moderators of this guild. */
	mfaLevel: MFALevels;
	/** The name of this guild. */
	name: string;
	/** The [nsfw level](https://discord.com/developers/docs/resources/guild#guild-object-guild-nsfw-level) of this guild. */
	nsfwLevel: GuildNSFWLevels;
	/** If the current user is the owner of this guild (only present when getting the current user's guilds). */
	owner?: boolean;
	/** The id of the owner of this guild. */
	ownerID: string;
	/** The permissions of the current user in this guild (only present when getting the current user's guilds). */
	permissions?: string;
	/** The [preferred locale](https://discord.com/developers/docs/reference#locales) of this guild. */
	preferredLocale: string;
	/** If this guild has the boost progress bar enabled. */
	premiumProgressBarEnabled: boolean;
	/** The number of nitro boosts this guild has. */
	premiumSubscriptionCount?: number;
	/** The [boost level](https://discord.com/developers/docs/resources/guild#guild-object-premium-tier) of this guild. */
	premiumTier: PremiumTiers;
	/** The id of the channel where notices from Discord are recieved. Only present in guilds with the `COMMUNITY` feature. */
	publicUpdatesChannelID: string | null;
	/** @deprecated The region of this guild.*/
	region?: string | null;
	/** The roles in this guild. */
	roles: Collection<string, RawRole, Role, [guildID: string]>;
	/** The id of the channel where rules/guidelines are displayed. Only present in guilds with the `COMMUNITY` feature. */
	rulesChannelID: string | null;
	/** The scheduled events in this guild. */
	scheduledEvents: Collection<string, RawScheduledEvent, ScheduledEvent>;
	/** The invite splash hash of this guild. */
	splash: string | null;
	/** The custom stickers of this guild. */
	stickers?: Array<Sticker>;
	/** The [flags](https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags) for the system channel. */
	systemChannelFlags: number;
	/** The id of the channel where welcome messages and boosts notices are posted. */
	systemChannelID: string | null;
	/** The threads in this guild. */
	threads: Collection<string, RawThreadChannel, AnyThreadChannel>;
	/** The vanity url of this guild. Only present in guilds with the `VANITY_URL` feature. */
	vanityURLCode: string | null;
	/** The [verfication level](https://discord.com/developers/docs/resources/guild#guild-object-verification-level) of this guild. */
	verificationLevel: VerificationLevels;
	/** The welcome screen configuration. Only present in guilds with the `WELCOME_SCREEN_ENABLED` feature. */
	welcomeScreen?: WelcomeScreen;
	/** The id of the channel the widget will generate an invite to, or `null` if set to no invite. */
	widgetChannelID?: string | null;
	/** If the widget is enabled. */
	widgetEnabled?: boolean;
	constructor(data: RawGuild, client: Client) {
		super(data.id, client);
		this.channels = new Collection(GuildChannel, client);
		this.threads = new Collection(ThreadChannel, client) as Collection<string, RawThreadChannel, AnyThreadChannel>;
		this.members = new Collection<string, RawMember & { id: string; }, Member, [guildID: string]>(Member, client);
		this.roles = new Collection(Role, client);
		data.roles.map(role => this.roles.update(role, data.id));
		this.update(data);
	}

	protected update(data: RawGuild) {
		this.afkChannelID                = data.afk_channel_id;
		this.afkTimeout                  = data.afk_timeout;
		this.applicationID               = data.application_id;
		this.approximateMemberCount      = data.approximate_member_count;
		this.approximatePresenceCount    = data.approximate_presence_count;
		this.banner                      = data.banner;
		this.defaultMessageNotifications = data.default_message_notifications;
		this.description                 = data.description;
		this.discoverySplash             = data.discovery_splash;
		this.emojis                      = data.emojis.map(e => ({
			...e,
			user: !e.user ? undefined : this._client.users.update(e.user)
		}));
		this.explicitContentFilter       = data.explicit_content_filter;
		this.features                    = data.features;
		this.icon                        = data.icon;
		this.maxMembers                  = data.max_members;
		this.maxPresences                = data.max_presences;
		this.maxVideoChannelUsers        = data.max_video_channel_users;
		this.mfaLevel                    = data.mfa_level;
		this.name                        = data.name;
		this.nsfwLevel                   = data.nsfw_level;
		this.ownerID                     = data.owner_id;
		this.preferredLocale             = data.preferred_locale;
		this.premiumProgressBarEnabled   = data.premium_progress_bar_enabled;
		this.premiumSubscriptionCount    = data.premium_subscription_count;
		this.premiumTier                 = data.premium_tier;
		this.publicUpdatesChannelID      = data.public_updates_channel_id;
		this.region                      = data.region;
		this.rulesChannelID              = data.rules_channel_id;
		this.splash                      = data.splash;
		this.stickers                    = data.stickers;
		this.systemChannelFlags          = data.system_channel_flags;
		this.systemChannelID             = data.system_channel_id;
		this.vanityURLCode               = data.vanity_url_code;
		this.verificationLevel           = data.verification_level;
		this.welcomeScreen               = data.welcome_screen;
		this.widgetChannelID             = data.widget_channel_id;
		this.widgetEnabled               = data.widget_enabled;
	}

	/**
	 * The url of this guild's banner.
	 *
	 * @param {ImageFormat} format - The format the url should be.
	 * @param {Number} size - The dimensions of the image.
	 * @returns {(String | null)}
	 */
	bannerURL(format?: ImageFormat, size?: number) {
		return this.banner === null ? null : this._client._formatImage(Routes.BANNER(this.id, this.banner), format, size);
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
	 * The url of this guild's icon.
	 *
	 * @param {ImageFormat} format - The format the url should be.
	 * @param {Number} size - The dimensions of the image.
	 * @returns {(String | null)}
	 */
	iconURL(format?: ImageFormat, size?: number) {
		return this.icon === null ? null : this._client._formatImage(Routes.GUILD_ICON(this.id, this.icon), format, size);
	}
}
