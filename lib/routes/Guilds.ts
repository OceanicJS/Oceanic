import BaseRoute from "./BaseRoute";
import type { RawPartialUser } from "./Users";
import * as Routes from "../util/Routes";
import type {
	DefaultMessageNotificationLevels,
	ExplicitContentFilterLevels,
	GuildFeature,
	GuildNSFWLevels,
	IntegrationExpireBehaviors,
	IntegrationType,
	MFALevels,
	PremiumTiers,
	StickerFormatTypes,
	StickerTypes,
	VerificationLevels
} from "../Constants";
import RESTGuild from "../structures/rest/RESTGuild";

export default class Guilds extends BaseRoute {
	async get(id: string) {
		return this._client.authRequest<RawRESTGuild>("GET", Routes.GUILD(id))
			.then(data => new RESTGuild(data, this._client));
	}
}

export interface RawGuild {
	afk_channel_id: string | null;
	afk_timeout: number;
	application_id: string | null;
	approximate_member_count?: number;
	approximate_presence_count?: number;
	banner: string | null;
	default_message_notifications: DefaultMessageNotificationLevels;
	description: string | null;
	discovery_splash: string | null;
	emojis: Array<GuildEmoji>;
	explicit_content_filter: ExplicitContentFilterLevels;
	features: Array<GuildFeature>;
	icon: string | null;
	icon_hash?: string | null;
	id: string;
	max_members?: number;
	max_presences?: number;
	max_video_channel_users?: number;
	mfa_level: MFALevels;
	name: string;
	nsfw_level: GuildNSFWLevels;
	owner?: boolean;
	owner_id: string;
	permissions?: string;
	preferred_locale: string;
	premium_progress_bar_enabled: boolean;
	premium_subscription_count?: number;
	premium_tier: PremiumTiers;
	public_updates_channel_id: string | null;
	/** @deprecated */
	region?: string | null;
	roles: Array<RawRole>;
	rules_channel_id: string | null;
	splash: string | null;
	stickers?: Array<Sticker>;
	system_channel_flags: number;
	system_channel_id: string | null;
	venity_url_code: string | null;
	verification_level: VerificationLevels;
	welcome_screen?: WelcomeScreen;
	widget_channel_id?: string | null;
	widget_enabled?: boolean;
}
export type RawRESTGuild = Omit<RawGuild, "owner" | "permissions" | "icon_hash">;

export interface RawRole {
	color: number;
	hoist: boolean;
	icon?: string | null;
	id: string;
	managed: boolean;
	mentionable: boolean;
	name: string;
	permissions: string;
	position: number;
	tags?: RoleTags;
	unicode_emoji?: string | null;
}
export interface RoleTags {
	bot_id?: string;
	integration_id?: string;
	premium_subscriber?: null;
}
export interface RawEmoji {
	animated?: boolean;
	available?: boolean;
	id: string;
	managed?: boolean;
	name: string | null; // null in reaction emoji objects?
	require_colons?: boolean;
	roles?: Array<string>;
	user?: RawPartialUser;
}
export type GuildEmoji = Omit<RawEmoji, "name"> & { name: string; };
export interface WelcomeScreen {
	description: string | null;
	welcome_channels: Array<WelcomeScreenChannel>;
}
export interface WelcomeScreenChannel {
	channel_id: string;
	description: string;
	emoji_id: string | null;
	emoji_name: string | null;
}
export interface Sticker {
	/** @deprecated */
	asset?: "";
	available?: boolean;
	description: string | null;
	format_type: StickerFormatTypes;
	guild_id?: string;
	id: string;
	name: string;
	pack_id?: string;
	sort_value?: number;
	tags: string;
	type: StickerTypes;
	user?: RawPartialUser;
}

export interface RawMember {
	avatar?: string | null;
	communication_disabled_until?: string | null;
	deaf: boolean;
	/** undocumented */
	flags?: number;
	/** undocumented */
	is_pending?: boolean;
	joined_at: string;
	mute: boolean;
	nick?: string | null;
	pending?: boolean;
	permissions?: string;
	premium_since?: string;
	roles: Array<string>;
	user?: RawPartialUser;
}
export type RawRESTMember = Required<Omit<RawMember, "permissions">>;

export interface RawIntegration {
	account: IntegrationAccount;
	application?: IntegrationApplication;
	enable_emoticons?: boolean;
	enabled?: boolean;
	expire_behavior?: IntegrationExpireBehaviors;
	expire_grace_period?: number;
	id: string;
	name: string;
	revoked?: boolean;
	role_id?: string;
	subscriber_count?: number;
	synced_at?: string;
	syncing?: boolean;
	type: IntegrationType;
	user?: RawPartialUser;
}

export interface IntegrationAccount {
	id: string;
	name: string;
}

export interface IntegrationApplication { // @TODO application class
	bot?: RawPartialUser;
	description: string;
	icon: string | null;
	id: string;
	name: string;
}
