import pkg from "../package.json";

export const GATEWAY_VERSION = 10;
export const REST_VERSION    = 10;
export const BASE_URL        = `https://discord.com/api/v${REST_VERSION}`;
export const VERSION         = pkg.version;
export const USER_AGENT      = `Oceanic/${VERSION} (https://github.com/DonovanDMC/Oceanic)`;
export const MIN_IMAGE_SIZE  = 64;
export const MAX_IMAGE_SIZE  = 4096;

export const RESTMethods = [
	"GET",
	"POST",
	"PUT",
	"PATCH",
	"DELETE"
] as const;
export type RESTMethod = typeof RESTMethods[number];

export const ImageFormats = [
	"jpg",
	"jpeg",
	"png",
	"webp",
	"gif"
] as const;
export type ImageFormat = typeof ImageFormats[number];

export enum WebhookTypes {
	INCOMING         = 1,
	CHANNEL_FOLLOWER = 2,
	APPLICATION      = 3
}

export enum PremiumTypes {
	NONE          = 0,
	NITRO_CLASSIC = 1,
	NITRO         = 2
}

export enum UserFlags {
	STAFF             = 1 << 0,
	PARTNER           = 1 << 1,
	HYPESQUAD         = 1 << 2,
	BUGHUNTER_LEVEL_1 = 1 << 3,

	HYPESQUAD_BRAVERY    = 1 << 6,
	HYPESQUAD_BRILLIANCE = 1 << 7,
	HYPESQUAD_BALANCE    = 1 << 8,
	EARLY_SUPPORTER      = 1 << 9,
	PSUEDO_TEAM_USER     = 1 << 10,

	BUG_HUNTER_LEVEL_2 = 1 << 14,

	VERIFIED_BOT          = 1 << 16,
	VERIFIED_DEVELOPER    = 1 << 17,
	CERTIFIED_MODERATOR   = 1 << 18,
	BOT_HTTP_INTERACTIONS = 1 << 19
}

export const GuildFeatures = [
	"ANIMATED_BANNER",
	"ANIMATED_ICON",
	"BANNER",
	"COMMERCE",
	"COMMUNITY",
	"CREATOR_MONETIZABLE",
	"CREATOR_MONETIZABLE_DISABLED",
	"DISCOVERABLE",
	"DISCOVERABLE_DISABLED",
	"ENABLED_DISCOVERABLE_BEFORE",
	"FEATURABLE",
	"GUILD_HOME_TEST",
	"HAS_DIRECTORY_ENTRY",
	"HUB",
	"INVITE_SPLASH",
	"LINKED_TO_HUB",
	"MEMBER_VERIFICATION_GATE_ENABLED",
	"MONETIZATION_ENABLED",
	"MORE_EMOJI",
	"MORE_EMOJIS",
	"MORE_STICKERS",
	"NEWS",
	"NEW_THREAD_PERMISSIONS",
	"PARTNERED",
	"PREVIEW_ENABLED",
	"PREVIOUSLY_DISCOVERABLE",
	"PRIVATE_THREADS",
	"ROLE_ICONS",
	"ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE",
	"ROLE_SUBSCRIPTIONS_ENABLED",
	"SEVEN_DAY_THREAD_ARCHIVE",
	"TEXT_IN_VOICE_ENABLED",
	"THREADS_ENABLED",
	"THREADS_ENABLED_TESTING",
	"THREE_DAY_THREAD_ARCHIVE",
	"THREADS_ENABLED",
	"TICKETED_EVENTS_ENABLED",
	"VANITY_URL",
	"VERIFIED",
	"VIP_REGIONS",
	"WELCOME_SCREEN_ENABLED"
] as const;
export type GuildFeature = typeof GuildFeatures[number];

export enum DefaultMessageNotificationLevels {
	ALL_MESSAGES  = 0,
	ONLY_MENTIONS = 1
}

export enum ExplicitContentFilterLevels {
	DISABLED              = 0,
	MEMBERS_WITHOUT_ROLES = 1,
	ALL_MEMBERS           = 2
}

export enum MFALevels {
	NONE     = 0,
	ELEVATED = 1
}

export enum VerificationLevels {
	NONE      = 0,
	LOW       = 1,
	MEDIUM    = 2,
	HIGH      = 3,
	VERY_HIGH = 4
}

export enum GuildNSFWLevels {
	DEFAULT         = 0,
	EXPLICIT       = 1,
	SAFE           = 2,
	AGE_RESTRICTED = 3
}

export enum PremiumTiers {
	NONE   = 0,
	TIER_1 = 1,
	TIER_2 = 2,
	TIER_3 = 3
}

export enum SystemChannelFlags {
	SUPPRESS_JOIN_NOTIFICATIONS           = 1 << 0,
	SUPPRESS_PREMIUM_SUBSCRIPTIONS        = 1 << 1,
	SUPPRESS_GUILD_REMINDER_NOTIFICATIONS = 1 << 2,
	SUPPRESS_JOIN_NOTIFICATION_REPLIES    = 1 << 3,
}

export enum StickerTypes {
	STANDARD = 1,
	GUILD    = 2
}

export enum StickerFormatTypes {
	PNG    = 1,
	APNG   = 2,
	LOTTIE = 3
}

export enum ChannelTypes {
	GUILD_TEXT           = 0,
	DM                   = 1,
	GUILD_VOICE          = 2,
	GROUP_DM             = 3,
	GUILD_CATEGORY       = 4,
	GUILD_NEWS           = 5,

	GUILD_NEWS_THREAD    = 10,
	GUILD_PUBLIC_THREAD  = 11,
	GUILD_PRIVATE_THREAD = 12,
	GUILD_STAGE_VOICE    = 13,
	GUILD_DIRECTORY      = 14,
	GUILD_FORUM          = 15
}

export enum OverwriteTypes {
	ROLE   = 0,
	MEMBER = 1
}

export enum VideoQualityModes {
	AUTO = 1,
	FULL = 2
}

export const ThreadAutoArchiveDurations = [
	60,
	1440,
	4320,
	10080
] as const;
export type ThreadAutoArchiveDuration = typeof ThreadAutoArchiveDurations[number];

export enum VisibilityTypes {
	NONE     = 0,
	EVERYONE = 1
}

export const ConnectionServices = [
	"battlenet",
	"epicgames",
	"facebook",
	"github",
	"leagueoflegends",
	"playstation",
	"reddit",
	"samsunggalaxy",
	"spotify",
	"skype",
	"steam",
	"twitch",
	"twitter",
	"xbox",
	"youtube"
] as const;
export type ConnectionService = typeof ConnectionServices[number];

export const IntegrationTypes = [
	"twitch",
	"youtube",
	"discord"
] as const;
export type IntegrationType = typeof IntegrationTypes[number];

export enum IntegrationExpireBehaviors {
	REMOVE_ROLE = 0,
	KICK        = 1
}
