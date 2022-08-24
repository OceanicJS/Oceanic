import type { RawUser } from "./users";
import type { AnyThreadChannel, OverwriteOptions, RawChannel, RESTThreadMember } from "./channels";
import type {
	ChannelTypes,
	DefaultMessageNotificationLevels,
	ExplicitContentFilterLevels,
	GuildChannelTypesWithoutThreads,
	GuildFeature,
	GuildNSFWLevels,
	IntegrationExpireBehaviors,
	IntegrationType,
	MFALevels,
	PremiumTiers,
	StickerFormatTypes,
	StickerTypes,
	ThreadAutoArchiveDuration,
	VerificationLevels,
	VideoQualityModes
} from "../Constants";
import type User from "../structures/User";

export interface RESTGuild {
	afk_channel_id: string | null;
	afk_timeout: number;
	application_id: string | null;
	approximate_member_count?: number;
	approximate_presence_count?: number;
	banner: string | null;
	default_message_notifications: DefaultMessageNotificationLevels;
	description: string | null;
	discovery_splash: string | null;
	emojis: Array<RawGuildEmoji>;
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
	vanity_url_code: string | null;
	verification_level: VerificationLevels;
	welcome_screen?: RawWelcomeScreen;
	widget_channel_id?: string | null;
	widget_enabled?: boolean;
}
export type RawGuild = Omit<RESTGuild, "owner" | "permissions" | "icon_hash">;
export type PartialGuild = Pick<RawGuild, "id" | "name" | "splash" | "banner" | "description" | "icon" | "features" | "verification_level" | "vanity_url_code" | "premium_subscription_count" | "nsfw_level">;

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
export interface Emoji {
	animated?: boolean;
	available?: boolean;
	id: string;
	managed?: boolean;
	name: string | null; // null in reaction emoji objects?
	require_colons?: boolean;
	roles?: Array<string>;
	user?: RawUser;
}
export type RawGuildEmoji = Required<Omit<Emoji, "name" | "user">> & { name: string; user?: RawUser; };
export type GuildEmoji = Omit<RawGuildEmoji, "user"> & { user?: User; };
export interface RawWelcomeScreen {
	description: string | null;
	welcome_channels: Array<RawWelcomeScreenChannel>;
}
export interface RawWelcomeScreenChannel {
	channel_id: string;
	description: string;
	emoji_id: string | null;
	emoji_name: string | null;
}
export interface WelcomeScreen {
	description: string | null;
	welcomeChannels: Array<WelcomeScreenChannel>;
}
export interface WelcomeScreenChannel {
	channelID: string;
	description: string;
	emojiID: string | null;
	emojiName: string | null;
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
	user?: RawUser;
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
	user?: RawUser;
}
export type RESTMember = Required<Omit<RawMember, "permissions">>;
export type InteractionMember = Required<RawMember>;

export interface RawIntegration {
	account: IntegrationAccount;
	application?: RawIntegrationApplication;
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
	user?: RawUser;
}

export interface IntegrationAccount {
	id: string;
	name: string;
}

export interface RawIntegrationApplication {
	bot?: RawUser;
	description: string;
	icon: string | null;
	id: string;
	name: string;
}

export type PartialEmoji = Pick<Emoji, "id" | "name" | "animated">;

export interface CreateEmojiOptions {
	image: Buffer | string;
	name: string;
	reason?: string;
	roles?: Array<string>;
}

export interface EditEmojiOptions {
	name?: string;
	reason?: string;
	roles?: Array<string> | null;
}

export interface RawGuildPreview {
	approximate_member_count: number;
	approximate_presence_count: number;
	description: string | null;
	discovery_splash: string | null;
	emojis: Array<RawGuildEmoji>;
	features: Array<GuildFeature>;
	icon: string | null;
	id: string;
	name: string;
	splash: string | null;
	stickers: Array<Sticker>;
}

export interface CreateGuildOptions {
	afkChannelID?: string;
	afkTimeout?: number;
	channels?: Array<CreateChannelOptions>;
	defaultMessageNotifications?: DefaultMessageNotificationLevels;
	explicitContentFilter?: ExplicitContentFilterLevels;
	icon?: Buffer | string;
	name: string;
	/** @deprecated */
	region?: string | null;
	roles?: Array<Omit<CreateRoleOptions, "reason">>;
	systemChannelFlags?: number;
	systemChannelID?: string;
	verificationLevel?: VerificationLevels;
}

export interface EditGuildOptions {
	afkChannelID?: string | null;
	afkTimeout?: number;
	banner?: Buffer | string | null;
	defaultMessageNotifications?: DefaultMessageNotificationLevels;
	description?: string | null;
	discoverySplash?: Buffer | string | null;
	explicitContentFilter?: ExplicitContentFilterLevels;
	features?: Array<GuildFeature>;
	icon?: Buffer | string | null;
	name?: string;
	ownerID?: string;
	preferredLocale?: string | null;
	premiumProgressBarEnabled?: boolean;
	publicUpdatesChannelID?: string | null;
	reason?: string;
	/** @deprecated */
	region?: string | null;
	rulesChannelID?: string | null;
	splash?: Buffer | string | null;
	systemChannelFlags?: number;
	systemChannelID?: string | null;
	verificationLevel?: VerificationLevels;
}

export interface CreateChannelOptions<T extends GuildChannelTypesWithoutThreads = GuildChannelTypesWithoutThreads> {
	defaultAutoArchiveDuration?: ThreadAutoArchiveDuration;
	name: string;
	nsfw?: boolean;
	parentID?: string;
	permissionOverwrites?: Array<OverwriteOptions>;
	position?: number;
	rateLimitPerUser?: number;
	reason?: string;
	rtcRegion?: string;
	topic?: string;
	type: T;
	userLimit?: number;
	videoQualityMode?: VideoQualityModes;
}

export type CreateTextChannelOptions = Omit<CreateChannelOptions<ChannelTypes.GUILD_TEXT>, "rtcRegion" | "userLimit" | "videoQualityMode">;
export type CreateVoiceChannelOptions = Omit<CreateChannelOptions<ChannelTypes.GUILD_VOICE>, "defaultAutoArchiveDuration" | "topic">;
export type CreateCategoryChannelOptions = Omit<CreateChannelOptions<ChannelTypes.GUILD_CATEGORY>, "defaultAutoArchiveDuration" | "nsfw" | "parentID" | "rtcRegion" | "topic" | "userLimit" | "videoQualityMode">;
export type CreateAnnouncementChannelOptions = Omit<CreateChannelOptions<ChannelTypes.GUILD_ANNOUNCEMENT>, "rtcRegion" | "userLimit" | "videoQualityMode">;
export type CreateStageChannelOptions = Omit<CreateChannelOptions<ChannelTypes.GUILD_STAGE_VOICE>, "defaultAutoArchiveDuration" | "nsfw" | "rtcRegion" | "topic" | "userLimit" | "videoQualityMode">;

export interface CreateRoleOptions {
	color?: number;
	hoist?: boolean;
	icon?: Buffer | string | null;
	mentionable?: boolean;
	name?: string;
	permissions?: string;
	reason?: string;
	unicodeEmoji?: string | null;
}

export interface ModifyChannelPositionsEntry {
	id: string;
	lockPermissions?: boolean;
	parentID?: string;
	position?: number;
}

export interface GetActiveThreadsResponse {
	members: Array<RESTThreadMember>;
	threads: Array<AnyThreadChannel>;
}

export interface GetMembersOptions {
	after?: string;
	limit?: number;
}

export interface SearchMembersOptions {
	limit?: number;
	query: string;
}

export interface AddMemberOptions {
	accessToken: string;
	deaf?: boolean;
	mute?: boolean;
	nick?: string;
	roles?: Array<string>;
}

export interface EditMemberOptions {
	channelID?: string | null;
	communicationDisabledUntil?: string | null;
	deaf?: boolean;
	mute?: boolean;
	nick?: string | null;
	reason?: string;
	roles?: string;
}

export type EditCurrentMemberOptions = Pick<EditMemberOptions, "nick" | "reason">;

export interface GetBansOptions {
	after?: string;
	before?: string;
	limit?: number;
}

export interface RawBan {
	reason: string | null;
	user: RawUser;
}

export interface Ban {
	reason: string | null;
	user: User;
}

export interface CreateBanOptions {
	deleteMessageDays?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
	deleteMessageSeconds?: number;
	reason?: string;
}

export interface EditRolePositionsEntry {
	id: string;
	position?: number | null;
}

export type EditRoleOptions = CreateRoleOptions;

export interface GetPruneCountOptions {
	days?: number;
	includeRoles?: Array<string>;
}

export interface BeginPruneOptions extends GetPruneCountOptions {
	computePruneCount?: boolean;
	reason?: string;
}

export interface RawWidgetSettings {
	channel_id: string;
	enabled: boolean;
}

export interface WidgetSettings {
	channelID: string;
	enabled: boolean;
}

export interface GetVanityURLResponse {
	code: string | null;
	uses: number;
}

export interface RawWidget {
	channels: Array<Required<Pick<RawChannel, "id" | "name" | "position">>>;
	id: string;
	instant_invite: string | null;
	members: Array<RawWidgetUser>;
	name: string;
	presence_count: number;
}

export interface Widget {
	channels: Array<Required<Pick<RawChannel, "id" | "name" | "position">>>;
	id: string;
	instantInvite: string | null;
	members: Array<WidgetUser>;
	name: string;
	presenceCount: number;
}

export interface RawWidgetUser {
	activity?: {
		name: string;
	};
	avatar: null;
	avatar_url: string;
	discriminator: string;
	id: string;
	status: "online" | "idle" | "dnd";
	username: string;
}

export interface WidgetUser {
	activity?: {
		name: string;
	};
	avatar: null;
	avatarURL: string;
	discriminator: string;
	id: string;
	status: "online" | "idle" | "dnd";
	tag: string;
	username: string;
}

export type WidgetImageStyle = "shield" | "banner1" | "banner2" | "banner3" | "banner4";

export interface EditWelcomeScreenOptions extends WelcomeScreen {
	enabled?: boolean;
	reason?: string;
}

export interface EditUserVoiceStateOptions {
	channelID: string;
	suppress?: boolean;
}

export interface EditCurrentUserVoiceStateOptions extends EditUserVoiceStateOptions {
	requestToSpeakTimestamp?: string | null;
}
