import type * as Types from "./types/namespaced";
/* eslint-disable unicorn/prefer-math-trunc, @typescript-eslint/no-duplicate-enum-values */
/** @module Constants */
import type PrivateChannel from "./structures/PrivateChannel";
import type TextChannel from "./structures/TextChannel";
import type VoiceChannel from "./structures/VoiceChannel";
import type GroupChannel from "./structures/GroupChannel";
import type CategoryChannel from "./structures/CategoryChannel";
import type AnnouncementChannel from "./structures/AnnouncementChannel";
import type AnnouncementThreadChannel from "./structures/AnnouncementThreadChannel";
import type PublicThreadChannel from "./structures/PublicThreadChannel";
import type PrivateThreadChannel from "./structures/PrivateThreadChannel";
import type StageChannel from "./structures/StageChannel";
import type ForumChannel from "./structures/ForumChannel";
import type MediaChannel from "./structures/MediaChannel";
import pkg from "../package.json";

export const GATEWAY_VERSION = 10;
export const REST_VERSION    = 10;
export const BASE_URL        = "https://discord.com";
export const API_URL         = `${BASE_URL}/api/v${REST_VERSION}`;
export const VERSION         = pkg.version;
export const USER_AGENT      = `Oceanic/${VERSION} (https://github.com/OceanicJS/Oceanic)`;
export const MEDIA_PROXY_SIZES = [
    16, 20, 22, 24, 28, 32, 40, 44, 48, 56, 60, 64, 80, 96, 100,
    128, 160, 240, 256, 300, 320, 480, 512, 600, 640, 1024, 1280, 1536,
    2048, 3072, 4096
];

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

export type FilterFileTypes = "image" | "video" | "audio" | `.${string}`;

export enum WebhookTypes {
    /** Incoming webhooks can post messages to channels with a generated token */
    INCOMING         = 1,
    /** Channel Follower webhooks are internal webhooks used to post new messages into channels */
    CHANNEL_FOLLOWER = 2,
    /** Application webhooks are webhooks used with interactions */
    APPLICATION      = 3,
}

export enum PremiumTypes {
    /** No Nitro. Also returned when the OAuth request did not include the approved `identify.premium` scope. */
    NONE          = 0,
    /** Nitro Classic */
    NITRO_CLASSIC = 1,
    /** Nitro */
    NITRO         = 2,
    /** Nitro Basic */
    NITRO_BASIC   = 3,
}

// @TODO: bigints?
export enum UserFlags {
    /** Discord Staff */
    STAFF                      = 2 ** 0,
    /** Partnered Server Owner */
    PARTNER                    = 2 ** 1,
    /** HypeSquad Events */
    HYPESQUAD                  = 2 ** 2,
    /** Level 1 Discord Bug Hunter */
    BUG_HUNTER_LEVEL_1         = 2 ** 3,
    /** SMS enabled as a multi-factor authentication backup */
    MFA_SMS                    = 2 ** 4,
    /** User has dismissed the current premium (Nitro) promotion */
    PREMIUM_PROMO_DISMISSED    = 2 ** 5,
    HYPESQUAD_BRAVERY          = 2 ** 6,
    HYPESQUAD_BRILLIANCE       = 2 ** 7,
    HYPESQUAD_BALANCE          = 2 ** 8,
    EARLY_SUPPORTER            = 2 ** 9,
    PSEUDO_TEAM_USER           = 2 ** 10,
    /** User is registered on Discord's HubSpot customer platform, used for official Discord programs (e.g. partner) */
    IS_HUBSPOT_CONTACT         = 2 ** 11,
    /** @deprecated User is a system user (i.e. official Discord account) */
    SYSTEM                     = 2 ** 12,
    /** User has unread urgent system messages; an urgent message is one sent from Trust and Safety */
    HAS_UNREAD_URGENT_MESSAGES = 2 ** 13,
    /** Level 2 Discord Bug Hunter */
    BUG_HUNTER_LEVEL_2         = 2 ** 14,
    /** User is scheduled for deletion for being under the minimum required age */
    UNDERAGE_DELETED           = 2 ** 15,
    /** Verified Bot */
    VERIFIED_BOT               = 2 ** 16,
    /** Early Verified Bot Developer */
    VERIFIED_DEVELOPER         = 2 ** 17,
    /** Moderator Programs Alumni */
    CERTIFIED_MODERATOR        = 2 ** 18,
    /** Bot uses only HTTP interactions and is shown in the online member list */
    BOT_HTTP_INTERACTIONS      = 2 ** 19,
    /** User is marked as a spammer and has their messages collapsed in the UI */
    SPAMMER                    = 2 ** 20,
    /** @deprecated User has manually disabled premium (Nitro) features */
    DISABLE_PREMIUM            = 2 ** 21,
    /** @deprecated Active Developer */
    ACTIVE_DEVELOPER           = 2 ** 22,
    /** User is a provisional account used with the social layer integration */
    PROVISIONAL_ACCOUNT        = 2 ** 23,

    /** User has their global ratelimit raised to 1,200 requests per second */
    HIGH_GLOBAL_RATE_LIMIT       = 2 ** 33,
    /** User's account is deleted */
    DELETED                      = 2 ** 34,
    /** User's account is disabled for suspicious activity and must reset their password to regain access */
    DISABLED_SUSPICIOUS_ACTIVITY = 2 ** 35,
    /** User deleted their own account */
    SELF_DELETED                 = 2 ** 36,
    /** @deprecated User has a premium (Nitro) custom discriminator */
    PREMIUM_DISCRIMINATOR        = 2 ** 37,
    /** User has used the desktop client */
    USED_DESKTOP_CLIENT          = 2 ** 38,
    /** User has used the web client */
    USED_WEB_CLIENT              = 2 ** 39,
    /** User has used the mobile client */
    USED_MOBILE_CLIENT           = 2 ** 40,
    /** User's account is disabled */
    DISABLED                     = 2 ** 41,

    VERIFIED_EMAIL = 2 ** 43,
    /** User is quarantined and cannot create DMs or accept invites */
    QUARANTINED    = 2 ** 44,

    /** User is eligible for early access to unique usernames */
    PREMIUM_ELIGIBLE_FOR_UNIQUE_USERNAME = 2 ** 47,

    /** User is a collaborator and is considered staff */
    COLLABORATOR            = 2 ** 50,
    /** User is a restricted collaborator and is considered staff */
    RESTRICTED_COLLABORATOR = 2 ** 51,
}

export enum ApplicationIntegrationTypes {
    /** Guild installation context */
    GUILD_INSTALL = 0,
    /** User installation context */
    USER_INSTALL  = 1,
}

export enum InteractionContextTypes {
    /** The interaction can be triggered within guilds */
    GUILD           = 0,
    /** The interaction can be triggered within DM channel with the application */
    BOT_DM          = 1,
    /** The interaction can be triggered in all DM and group DMs */
    PRIVATE_CHANNEL = 2,
}

export enum ApplicationFlags {
    /** Embedded application is released to the public (see also release phases) */
    EMBEDDED_RELEASED                             = 2 ** 1,
    /** Application can create managed emoji */
    MANAGED_EMOJI                                 = 2 ** 2,
    /** Embedded application can use in-app purchases */
    EMBEDDED_IAP                                  = 2 ** 3,
    /** Application can create group DMs without limit */
    GROUP_DM_CREATE                               = 2 ** 4,
    /** Application can use the `rpc` scope without limitation */
    RPC_PRIVATE_BETA                              = 2 ** 5,
    APPLICATION_AUTO_MODERATION_RULE_CREATE_BADGE = 2 ** 6,
    /** Application has its game profile page disabled */
    GAME_PROFILE_DISABLED                         = 2 ** 7,
    /** @deprecated Application can use activity assets */
    ALLOW_ASSETS                                  = 2 ** 8,
    /** Application's OAuth2 credentials are considered public and a client secret is not required */
    PUBLIC_OAUTH2_CLIENT                          = 2 ** 8,
    /** @deprecated Application can enable spectating activities */
    ALLOW_ACTIVITY_ACTION_SPECTATE                = 2 ** 9,
    /** Embedded application's activity can be launched without a context */
    CONTEXTLESS_ACTIVITY                          = 2 ** 9,
    /** @deprecated Application can enable activity join requests */
    ALLOW_ACTIVITY_ACTION_JOIN_REQUEST            = 2 ** 10,
    /** Application has limited access to the social layer SDK */
    SOCIAL_LAYER_INTEGRATION_LIMITED              = 2 ** 10,
    /** Application is trialing cloud gaming features */
    CLOUD_GAMING_DEMO                             = 2 ** 11,
    /** Intent required for bots in 100 or more guilds to receive Presence Update Gateway events */
    GATEWAY_PRESENCE                              = 2 ** 12,
    /** Intent required for bots in under 100 guilds to receive Presence Update Gateway events */
    GATEWAY_PRESENCE_LIMITED                      = 2 ** 13,
    /** Intent required for bots in 100 or more guilds to receive guild member-related events like Guild Member Add */
    GATEWAY_GUILD_MEMBERS                         = 2 ** 14,
    /** Intent required for bots in under 100 guilds to receive guild member-related events like Guild Member Add */
    GATEWAY_GUILD_MEMBERS_LIMITED                 = 2 ** 15,
    /** Indicates unusual growth of an application that prevents verification */
    VERIFICATION_PENDING_GUILD_LIMIT              = 2 ** 16,
    /** Application can be embedded within the Discord client */
    EMBEDDED                                      = 2 ** 17,
    /** Intent required for bots in 100 or more guilds to receive message content */
    GATEWAY_MESSAGE_CONTENT                       = 2 ** 18,
    /** Intent required for bots in under 100 guilds to receive message content */
    GATEWAY_MESSAGE_CONTENT_LIMITED               = 2 ** 19,
    /** Embedded application is created by Discord */
    EMBEDDED_FIRST_PARTY                          = 2 ** 20,
    APPLICATION_COMMAND_MIGRATED                  = 2 ** 21,

    /** Application has registered global application commands */
    APPLICATION_COMMAND_BADGE = 2 ** 23,
    /** Application has had at least one global application command used in the last 30 days */
    ACTIVE                    = 2 ** 24,
    /** Application has not had any global application commands used in the last 30 days and has lost the `ACTIVE` flag */
    ACTIVE_GRACE_PERIOD       = 2 ** 25,
    /** Application can use IFrames within modals */
    IFRAME_MODAL              = 2 ** 26,
    /** Application can use the social layer SDK */
    SOCIAL_LAYER_INTEGRATION  = 2 ** 27,

    /** Application is promoted by Discord in the application directory */
    PROMOTED = 2 ** 28,
    /** Application is a Discord partner */
    PARTNER  = 2 ** 29,

    /** Application is a parent of a child application */
    PARENT                      = 2 ** 33,
    /** Application cannot access relationship information */
    DISABLE_RELATIONSHIP_ACCESS = 2 ** 34,
}

export const GuildFeatures = [
    "ACTIVITIES_ALPHA",
    "ACTIVITIES_EMPLOYEE",
    "ACTIVITIES_INTERNAL_DEV",
    "ANIMATED_BANNER",
    "ANIMATED_ICON",
    "APPLICATION_COMMAND_PERMISSIONS_V2",
    "AUTO_MODERATION",
    "AUTOMOD_TRIGGER_USER_PROFILE",
    "BANNER",
    "BOT_DEVELOPER_EARLY_ACCESS",
    "BURST_REACTIONS",
    "CHANNEL_HIGHLIGHTS_DISABLED",
    "CHANNEL_HIGHLIGHTS",
    "CHANNEL_ICON_EMOJIS_GENERATED",
    "CLYDE_DISABLED",
    "CLYDE_ENABLED",
    "CLYDE_EXPERIMENT_ENABLED",
    "COMMERCE",
    "COMMUNITY_CANARY",
    "COMMUNITY_EXP_LARGE_GATED",
    "COMMUNITY_EXP_LARGE_UNGATED",
    "COMMUNITY_EXP_MEDIUM",
    "COMMUNITY",
    "CREATOR_ACCEPTED_NEW_TERMS",
    "CREATOR_MONETIZABLE_DISABLED",
    "CREATOR_MONETIZABLE_PENDING_NEW_OWNER_ONBOARDING",
    "CREATOR_MONETIZABLE_PROVISIONAL",
    "CREATOR_MONETIZABLE_RESTRICTED",
    "CREATOR_MONETIZABLE_WHITEGLOVE",
    "CREATOR_MONETIZABLE",
    "CREATOR_STORE_PAGE",
    "DEVELOPER_SUPPORT_SERVER",
    "DISCOVERABLE_DISABLED",
    "DISCOVERABLE",
    "ENABLED_DISCOVERABLE_BEFORE",
    "ENABLED_MODERATION_EXPERIENCE_FOR_NON_COMMUNITY",
    "ENHANCED_ROLE_COLORS",
    "EXPOSED_TO_ACTIVITIES_WTP_EXPERIMENT",
    "FEATURABLE",
    "GUESTS_ENABLED",
    "GUILD_HOME_DEPRECATION_OVERRIDE",
    "GUILD_HOME_OVERRIDE",
    "GUILD_HOME_TEST",
    "GUILD_ONBOARDING_EVER_ENABLED",
    "GUILD_ONBOARDING_HAS_PROMPTS",
    "GUILD_ONBOARDING",
    "GUILD_ROLE_SUBSCRIPTION_TIER_TEMPLATE",
    "GUILD_SERVER_GUIDE",
    "GUILD_WEB_PAGE_VANITY_URL",
    "HAD_EARLY_ACTIVITIES_ACCESS",
    "HAS_DIRECTORY_ENTRY",
    "HUB",
    "INCREASED_THREAD_LIMIT",
    "INTERNAL_EMPLOYEE_ONLY",
    "INVITE_SPLASH",
    "INVITES_DISABLED",
    "LINKED_TO_HUB",
    "MARKETPLACES_CONNECTION_ROLES",
    "MEMBER_PROFILES",
    "MEMBER_SAFETY_PAGE_ROLLOUT",
    "MEMBER_VERIFICATION_GATE_ENABLED",
    "MONETIZATION_ENABLED",
    "MORE_EMOJI",
    "MORE_EMOJIS",
    "MORE_SOUNDBOARD",
    "MORE_STICKERS",
    "NEW_THREAD_PERMISSIONS",
    "NEWS",
    "NON_COMMUNITY_RAID_ALERTS",
    "PARTNERED",
    "PREVIEW_ENABLED",
    "PREVIOUSLY_DISCOVERABLE",
    "PRIVATE_THREADS",
    "PRODUCTS_AVAILABLE_FOR_PURCHASE",
    "RAID_ALERTS_DISABLED",
    "RAID_ALERTS_ENABLED",
    "ROLE_ICONS",
    "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE",
    "ROLE_SUBSCRIPTIONS_ENABLED",
    "SEVEN_DAY_THREAD_ARCHIVE",
    "SHARD",
    "SOUNDBOARD",
    "SUMMARIES_DISABLED_BY_USER",
    "SUMMARIES_ENABLED_BY_USER",
    "SUMMARIES_ENABLED_GA",
    "SUMMARIES_ENABLED",
    "SUMMARIES_OPT_OUT_EXPERIENCE",
    "SUMMARIES_PAUSED",
    "TEXT_IN_STAGE_ENABLED",
    "TEXT_IN_VOICE_ENABLED",
    "THREADS_ENABLED_TESTING",
    "THREADS_ENABLED",
    "THREE_DAY_THREAD_ARCHIVE",
    "TICKETED_EVENTS_ENABLED",
    "VANITY_URL",
    "VERIFIED",
    "VIP_REGIONS",
    "VOICE_IN_THREADS",
    "WELCOME_SCREEN_ENABLED"
] as const;
export type GuildFeature = typeof GuildFeatures[number];
export type MutableGuildFeatures = "COMMUNITY" | "DISCOVERABLE" | "INVITES_DISABLED" | "RAID_ALERTS_ENABLED";

export enum DefaultMessageNotificationLevels {
    /** Receive notifications for all messages */
    ALL_MESSAGES  = 0,
    /** Receive notifications only for messages that @mention you */
    ONLY_MENTIONS = 1,
    /** Don't receive notifications */
    NO_MESSAGES   = 2,
    NULL          = 3,
}

export enum ExplicitContentFilterLevels {
    /** Media content will not be scanned */
    DISABLED              = 0,
    /** Media content sent by members without roles will be scanned */
    MEMBERS_WITHOUT_ROLES = 1,
    /** Media content sent by all members will be scanned */
    ALL_MEMBERS           = 2,
}

export enum MFALevels {
    /** Guild has no MFA requirement for moderation actions */
    NONE     = 0,
    /** Guild has a MFA requirement for moderation actions */
    ELEVATED = 1,
}

export enum VerificationLevels {
    /** Unrestricted */
    NONE      = 0,
    /** Must have a verified email on file */
    LOW       = 1,
    /** Must be registered on Discord for longer than 5 minutes */
    MEDIUM    = 2,
    /** Must be a member of the server for longer than 10 minutes */
    HIGH      = 3,
    /** Must have a verified phone number on file */
    VERY_HIGH = 4,
}

export enum GuildNSFWLevels {
    /** Guild is not yet rated by Discord */
    DEFAULT        = 0,
    /** Guild has mature content only suitable for users over 18 */
    EXPLICIT       = 1,
    /** Guild is safe for work */
    SAFE           = 2,
    /** Guild has mildly mature content that may not be suitable for users under 18 */
    AGE_RESTRICTED = 3,
}

export enum PremiumTiers {
    /** Guild has not unlocked any Server Boost perks */
    NONE   = 0,
    /** Guild has unlocked Server Boost level 1 perks */
    TIER_1 = 1,
    /** Guild has unlocked Server Boost level 2 perks */
    TIER_2 = 2,
    /** Guild has unlocked Server Boost level 3 perks */
    TIER_3 = 3,
}

export enum SystemChannelFlags {
    /** Suppress member join notifications */
    SUPPRESS_JOIN_NOTIFICATIONS                              = 1 << 0,
    /** Suppress premium subscription (boost) notifications */
    SUPPRESS_PREMIUM_SUBSCRIPTIONS                           = 1 << 1,
    /** Suppress guild setup tips */
    SUPPRESS_GUILD_REMINDER_NOTIFICATIONS                    = 1 << 2,
    /** Hide member join sticker reply buttons */
    SUPPRESS_JOIN_NOTIFICATION_REPLIES                       = 1 << 3,
    /** Suppress role subscription purchase and renewal notifications */
    SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATIONS        = 1 << 4,
    /** Hide role subscription sticker reply buttons */
    SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATION_REPLIES = 1 << 5,

    /** Suppress dead chat channel prompts */
    SUPPRESS_CHANNEL_PROMPT_DEADCHAT = 1 << 7,
}

export enum StickerTypes {
    /** An official sticker in a current or legacy purchasable pack */
    STANDARD = 1,
    /** A sticker uploaded to a guild for the guild's members */
    GUILD    = 2,
}

export enum StickerFormatTypes {
    /** A PNG image */
    PNG    = 1,
    /** An animated PNG image, using the APNG format */
    APNG   = 2,
    /** A lottie animation; requires the `VERIFIED` and/or `PARTNERED` guild feature */
    LOTTIE = 3,
    /** An animated GIF image */
    GIF    = 4,
}

export enum ChannelTypes {
    /** A text channel within a guild */
    GUILD_TEXT           = 0,
    /** A private channel between two users */
    DM                   = 1,
    /** A voice channel within a guild */
    GUILD_VOICE          = 2,
    /** A private channel between multiple users */
    GROUP_DM             = 3,
    /** An organizational category that contains up to 50 channels */
    GUILD_CATEGORY       = 4,
    /** Almost identical to `GUILD_TEXT`, a channel that users can follow and crosspost into their own guild */
    GUILD_ANNOUNCEMENT   = 5,
    /** @deprecated A channel in which developers can showcase their SKUs */
    GUILD_STORE          = 6,
    /** @deprecated A channel where users can match up for various games */
    GUILD_LFG            = 7,
    /** @deprecated A private channel between multiple users for a group within an LFG channel */
    LFG_GROUP_DM         = 8,
    /** @deprecated The first iteration of the threads feature, never widely used */
    THREAD_ALPHA         = 9,
    /** A temporary sub-channel within a `GUILD_NEWS` channel */
    ANNOUNCEMENT_THREAD  = 10,
    /** a temporary sub-channel within a `GUILD_TEXT`, `GUILD_FORUM`, or `GUILD_MEDIA` channel */
    PUBLIC_THREAD        = 11,
    /** a temporary sub-channel within a `GUILD_TEXT` channel that is only viewable by those invited and those with the `MANAGE_THREADS` permission */
    PRIVATE_THREAD       = 12,
    /** A voice channel for hosting events with an audience in a guild */
    GUILD_STAGE_VOICE    = 13,
    /** The main channel in a hub containing the listed guilds */
    GUILD_DIRECTORY      = 14,
    /** A channel that can only contain threads */
    GUILD_FORUM          = 15,
    /** A channel that can only contain threads in a gallery view */
    GUILD_MEDIA          = 16,
    /** A game lobby channel */
    LOBBY                = 17,
    /** A private channel created by the social layer SDK */
    EPHEMERAL_DM         = 18,
}

function exclude<T extends ChannelTypes, E extends ChannelTypes>(original: ReadonlyArray<T>, excludeTypes: ReadonlyArray<E>): Array<Exclude<T, E>> {
    return original.filter((value: T) => !excludeTypes.includes(value as unknown as E)) as Array<Exclude<T, E>>;
}

export const AnyChannelTypes = Object.values(ChannelTypes).filter(v => typeof v === "number") as Array<ChannelTypes>;
export const NotImplementedChannelTypes = [ChannelTypes.GUILD_STORE, ChannelTypes.GUILD_LFG, ChannelTypes.LFG_GROUP_DM, ChannelTypes.THREAD_ALPHA, ChannelTypes.GUILD_DIRECTORY, ChannelTypes.LOBBY, ChannelTypes.EPHEMERAL_DM] as const;
export const ImplementedChannelTypes = exclude(AnyChannelTypes, NotImplementedChannelTypes);
export const GuildChannelTypes = [ChannelTypes.GUILD_TEXT, ChannelTypes.GUILD_VOICE, ChannelTypes.GUILD_CATEGORY, ChannelTypes.GUILD_ANNOUNCEMENT, ChannelTypes.ANNOUNCEMENT_THREAD, ChannelTypes.PUBLIC_THREAD, ChannelTypes.PRIVATE_THREAD, ChannelTypes.GUILD_STAGE_VOICE, ChannelTypes.GUILD_DIRECTORY, ChannelTypes.GUILD_FORUM, ChannelTypes.GUILD_MEDIA] as const;
export const ThreadChannelTypes = [ChannelTypes.ANNOUNCEMENT_THREAD, ChannelTypes.PUBLIC_THREAD, ChannelTypes.PRIVATE_THREAD] as const;
export const GuildChannelsWithoutThreadsTypes = exclude(GuildChannelTypes, ThreadChannelTypes);
export const PrivateChannelTypes = [ChannelTypes.DM, ChannelTypes.GROUP_DM] as const;
export const EditableChannelTypes = exclude([ChannelTypes.GROUP_DM, ...GuildChannelTypes], NotImplementedChannelTypes);
export const TextableChannelTypes = exclude([ChannelTypes.DM, ...GuildChannelTypes], [...NotImplementedChannelTypes, ChannelTypes.GUILD_CATEGORY, ChannelTypes.GUILD_FORUM, ChannelTypes.GUILD_MEDIA]);
export const TextableGuildChannelTypes = exclude(TextableChannelTypes, [ChannelTypes.DM]);
export const TextableChannelsWithoutThreadsTypes = exclude(TextableChannelTypes, ThreadChannelTypes);
export const TextableGuildChannelsWithoutThreadsTypes = exclude(TextableGuildChannelTypes, ThreadChannelTypes);
export const VoiceChannelTypes = [ChannelTypes.GUILD_VOICE, ChannelTypes.GUILD_STAGE_VOICE] as const;
export const GuildInviteChannelTypes = [ChannelTypes.GUILD_TEXT, ChannelTypes.GUILD_ANNOUNCEMENT, ...VoiceChannelTypes, ChannelTypes.GUILD_FORUM, ChannelTypes.GUILD_MEDIA] as const;
export const DMInviteChannelTypes = [ChannelTypes.GROUP_DM] as const;
export const InviteChannelTypes = [...GuildInviteChannelTypes, ...DMInviteChannelTypes] as const;
export const InteractionChannelTypes = [...TextableChannelTypes, ChannelTypes.GROUP_DM] as const;
export const ThreadOnlyChannelTypes = [ChannelTypes.GUILD_FORUM, ChannelTypes.GUILD_MEDIA] as const;

/* eslint-disable @typescript-eslint/member-ordering */
export interface ChannelTypeMap {
    [ChannelTypes.GUILD_TEXT]: TextChannel;
    [ChannelTypes.DM]: PrivateChannel;
    [ChannelTypes.GUILD_VOICE]: VoiceChannel;
    [ChannelTypes.GROUP_DM]: GroupChannel;
    [ChannelTypes.GUILD_CATEGORY]: CategoryChannel;
    [ChannelTypes.GUILD_ANNOUNCEMENT]: AnnouncementChannel;
    [ChannelTypes.GUILD_STORE]: never;
    [ChannelTypes.GUILD_LFG]: never;
    [ChannelTypes.LFG_GROUP_DM]: never;
    [ChannelTypes.THREAD_ALPHA]: never;
    [ChannelTypes.ANNOUNCEMENT_THREAD]: AnnouncementThreadChannel;
    [ChannelTypes.PUBLIC_THREAD]: PublicThreadChannel;
    [ChannelTypes.PRIVATE_THREAD]: PrivateThreadChannel;
    [ChannelTypes.GUILD_STAGE_VOICE]: StageChannel;
    [ChannelTypes.GUILD_DIRECTORY]: never;
    [ChannelTypes.GUILD_FORUM]: ForumChannel;
    [ChannelTypes.GUILD_MEDIA]: MediaChannel;
    [ChannelTypes.LOBBY]: never;
    [ChannelTypes.EPHEMERAL_DM]: never;
}
export interface RawChannelTypeMap {
    [ChannelTypes.GUILD_TEXT]: Types.Channels.RawTextChannel;
    [ChannelTypes.DM]: Types.Channels.RawPrivateChannel;
    [ChannelTypes.GUILD_VOICE]: Types.Channels.RawVoiceChannel;
    [ChannelTypes.GROUP_DM]: Types.Channels.RawGroupChannel;
    [ChannelTypes.GUILD_CATEGORY]: Types.Channels.RawCategoryChannel;
    [ChannelTypes.GUILD_ANNOUNCEMENT]: Types.Channels.RawAnnouncementChannel;
    [ChannelTypes.GUILD_STORE]: never;
    [ChannelTypes.GUILD_LFG]: never;
    [ChannelTypes.LFG_GROUP_DM]: never;
    [ChannelTypes.THREAD_ALPHA]: never;
    [ChannelTypes.ANNOUNCEMENT_THREAD]: Types.Channels.RawAnnouncementThreadChannel;
    [ChannelTypes.PUBLIC_THREAD]: Types.Channels.RawPublicThreadChannel;
    [ChannelTypes.PRIVATE_THREAD]: Types.Channels.RawPrivateThreadChannel;
    [ChannelTypes.GUILD_STAGE_VOICE]: Types.Channels.RawStageChannel;
    [ChannelTypes.GUILD_DIRECTORY]: never;
    [ChannelTypes.GUILD_FORUM]: Types.Channels.RawForumChannel;
    [ChannelTypes.GUILD_MEDIA]: Types.Channels.RawMediaChannel;
    [ChannelTypes.LOBBY]: never;
    [ChannelTypes.EPHEMERAL_DM]: never;
}
export interface JSONChannelTypeMap {
    [ChannelTypes.GUILD_TEXT]: Types.JSON.JSONTextChannel;
    [ChannelTypes.DM]: Types.JSON.JSONPrivateChannel;
    [ChannelTypes.GUILD_VOICE]: Types.JSON.JSONVoiceChannel;
    [ChannelTypes.GROUP_DM]: Types.JSON.JSONGroupChannel;
    [ChannelTypes.GUILD_CATEGORY]: Types.JSON.JSONCategoryChannel;
    [ChannelTypes.GUILD_ANNOUNCEMENT]: Types.JSON.JSONAnnouncementChannel;
    [ChannelTypes.ANNOUNCEMENT_THREAD]: Types.JSON.JSONAnnouncementThreadChannel;
    [ChannelTypes.PUBLIC_THREAD]: Types.JSON.JSONPublicThreadChannel;
    [ChannelTypes.PRIVATE_THREAD]: Types.JSON.JSONPrivateThreadChannel;
    [ChannelTypes.GUILD_STAGE_VOICE]: Types.JSON.JSONStageChannel;
    [ChannelTypes.GUILD_DIRECTORY]: never;
    [ChannelTypes.GUILD_FORUM]: Types.JSON.JSONForumChannel;
    [ChannelTypes.GUILD_MEDIA]: Types.JSON.JSONMediaChannel;
}
/* eslint-enable @typescript-eslint/member-ordering */

export enum OverwriteTypes {
    ROLE   = 0,
    MEMBER = 1,
}

export enum VideoQualityModes {
    /** Discord chooses the quality for optimal performance */
    AUTO = 1,
    /** 720p quality */
    FULL = 2,
}

export const ThreadAutoArchiveDurations = [
    60,
    1440,
    4320,
    10080
] as const;
export type ThreadAutoArchiveDuration = typeof ThreadAutoArchiveDurations[number];

export enum ConnectionVisibilityTypes {
    /** Connection is not visible. */
    NONE     = 0,
    /** Connection is visible to everyone. */
    EVERYONE = 1,
}

export const ConnectionServices = [
    "battlenet",
    "bluesky",
    "crunchyroll",
    "domain",
    "ebay",
    "epicgames",
    "facebook",
    "github",
    "instagram",
    "leagueoflegends",
    "mastodon",
    "paypal",
    "playstation",
    "reddit",
    "riotgames",
    "skype",
    "spotify",
    "steam",
    "tiktok",
    "twitch",
    "twitter_legacy",
    "twitter",
    "xbox",
    "youtube"
] as const;
export type ConnectionService = typeof ConnectionServices[number];

export const IntegrationTypes = [
    "twitch",
    "youtube",
    "discord",
    "guild_subscription"
] as const;
export type IntegrationType = typeof IntegrationTypes[number];

export enum IntegrationExpireBehaviors {
    /** Remove the integration role when a subscription lapses. */
    REMOVE_ROLE = 0,
    /** Kick the member when a subscription lapses. */
    KICK        = 1,
}

// values won't be statically typed if we use bit shifting, and enums can't use bigints
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Permissions {
    export const CREATE_INSTANT_INVITE               = 1n;               // 1 << 0
    export const KICK_MEMBERS                        = 2n;               // 1 << 1
    export const BAN_MEMBERS                         = 4n;               // 1 << 2
    export const ADMINISTRATOR                       = 8n;               // 1 << 3
    export const MANAGE_CHANNELS                     = 16n;              // 1 << 4
    export const MANAGE_GUILD                        = 32n;              // 1 << 5
    export const ADD_REACTIONS                       = 64n;              // 1 << 6
    export const VIEW_AUDIT_LOG                      = 128n;             // 1 << 7
    export const PRIORITY_SPEAKER                    = 256n;             // 1 << 8
    export const STREAM                              = 512n;             // 1 << 9
    export const VIEW_CHANNEL                        = 1024n;            // 1 << 10
    export const SEND_MESSAGES                       = 2048n;            // 1 << 11
    export const SEND_TTS_MESSAGES                   = 4096n;            // 1 << 12
    export const MANAGE_MESSAGES                     = 8192n;            // 1 << 13
    export const EMBED_LINKS                         = 16384n;           // 1 << 14
    export const ATTACH_FILES                        = 32768n;           // 1 << 15
    export const READ_MESSAGE_HISTORY                = 65536n;           // 1 << 16
    export const MENTION_EVERYONE                    = 131072n;          // 1 << 17
    export const USE_EXTERNAL_EMOJIS                 = 262144n;          // 1 << 18
    export const VIEW_GUILD_INSIGHTS                 = 524288n;          // 1 << 19
    export const CONNECT                             = 1048576n;         // 1 << 20
    export const SPEAK                               = 2097152n;         // 1 << 21
    export const MUTE_MEMBERS                        = 4194304n;         // 1 << 22
    export const DEAFEN_MEMBERS                      = 8388608n;         // 1 << 23
    export const MOVE_MEMBERS                        = 16777216n;        // 1 << 24
    export const USE_VAD                             = 33554432n;        // 1 << 25
    export const CHANGE_NICKNAME                     = 67108864n;        // 1 << 26
    export const MANAGE_NICKNAMES                    = 134217728n;       // 1 << 27
    export const MANAGE_ROLES                        = 268435456n;       // 1 << 28
    export const MANAGE_WEBHOOKS                     = 536870912n;       // 1 << 29
    export const MANAGE_GUILD_EXPRESSIONS            = 1073741824n;      // 1 << 30
    export const USE_APPLICATION_COMMANDS            = 2147483648n;      // 1 << 31
    export const REQUEST_TO_SPEAK                    = 4294967296n;      // 1 << 32
    export const MANAGE_EVENTS                       = 8589934592n;      // 1 << 33
    export const MANAGE_THREADS                      = 17179869184n;     // 1 << 34
    export const CREATE_PUBLIC_THREADS               = 34359738368n;     // 1 << 35
    export const CREATE_PRIVATE_THREADS              = 68719476736n;     // 1 << 36
    export const USE_EXTERNAL_STICKERS               = 137438953472n;    // 1 << 37
    export const SEND_MESSAGES_IN_THREADS            = 274877906944n;    // 1 << 38
    export const USE_EMBEDDED_ACTIVITIES             = 549755813888n;    // 1 << 39
    export const MODERATE_MEMBERS                    = 1099511627776n;   // 1 << 40
    export const VIEW_CREATOR_MONETIZATION_ANALYTICS = 2199023255552n;   // 1 << 41
    export const USE_SOUNDBOARD                      = 4398046511104n;   // 1 << 42
    export const CREATE_GUILD_EXPRESSIONS            = 8796093022208n;   // 1 << 43
    export const CREATE_EVENTS                       = 17592186044416n;  // 1 << 44
    export const USE_EXTERNAL_SOUNDS                 = 35184372088832n;  // 1 << 45
    export const SEND_VOICE_MESSAGES                 = 70368744177664n;  // 1 << 46
    /** @deprecated Allows members to interact with the Clyde AI integration. */
    export const USE_CLYDE_AI                        = 140737488355328n; // 1 << 47
    export const SET_VOICE_CHANNEL_STATUS            = 281474976710656n; // 1 << 48
    export const SEND_POLLS                          = 562949953421312n; // 1 << 49
    export const USE_EXTERNAL_APPS                   = 1125899906842624n; // 1 << 50
    export const PIN_MESSAGES                        = 2251799813685248n; // 1 << 51
    export const BYPASS_SLOWMODE                     = 4503599627370496n; // 1 << 52
    /** Allows members to mark messages as official in verified guilds */
    export const MANAGE_OFFICIAL_MESSAGES            = 9007199254740992n; // 1 << 53
}

// bigints can't be used as object keys, so we need to convert them to strings
export const PermissionValueToName = Object.fromEntries(Object.entries(Permissions).map(([k, v]) => [String(v), k] as [string, string])) as Types.Shared.ReverseMap<Types.Shared.StringMap<typeof Permissions>>;

export const AllPermissions = Object.values(Permissions).reduce((a, b) => a | b, 0n);
export const TextPermissions = [
    Permissions.CREATE_INSTANT_INVITE,
    Permissions.MANAGE_CHANNELS,
    Permissions.ADD_REACTIONS,
    Permissions.VIEW_CHANNEL,
    Permissions.SEND_MESSAGES,
    Permissions.SEND_TTS_MESSAGES,
    Permissions.MANAGE_MESSAGES,
    Permissions.EMBED_LINKS,
    Permissions.ATTACH_FILES,
    Permissions.READ_MESSAGE_HISTORY,
    Permissions.MENTION_EVERYONE,
    Permissions.USE_EXTERNAL_EMOJIS,
    Permissions.MANAGE_ROLES,
    Permissions.MANAGE_WEBHOOKS,
    Permissions.USE_APPLICATION_COMMANDS,
    Permissions.MANAGE_THREADS,
    Permissions.CREATE_PUBLIC_THREADS,
    Permissions.CREATE_PRIVATE_THREADS,
    Permissions.USE_EXTERNAL_STICKERS,
    Permissions.SEND_MESSAGES_IN_THREADS,
    Permissions.SEND_VOICE_MESSAGES,
    Permissions.USE_CLYDE_AI,
    Permissions.SEND_POLLS,
    Permissions.USE_EXTERNAL_APPS,
    Permissions.PIN_MESSAGES,
    Permissions.BYPASS_SLOWMODE
] as const;
export const AllTextPermissions = TextPermissions.reduce((all, p) => all | p, 0n);
export const AllTextPermissionNames = TextPermissions.map(p => PermissionValueToName[String(p) as `${typeof p}`]);

export const VoicePermissions = [
    Permissions.CREATE_INSTANT_INVITE,
    Permissions.MANAGE_CHANNELS,
    Permissions.ADD_REACTIONS,
    Permissions.PRIORITY_SPEAKER,
    Permissions.STREAM,
    Permissions.VIEW_CHANNEL,
    Permissions.SEND_MESSAGES,
    Permissions.SEND_TTS_MESSAGES,
    Permissions.MANAGE_MESSAGES,
    Permissions.EMBED_LINKS,
    Permissions.ATTACH_FILES,
    Permissions.READ_MESSAGE_HISTORY,
    Permissions.MENTION_EVERYONE,
    Permissions.USE_EXTERNAL_EMOJIS,
    Permissions.CONNECT,
    Permissions.SPEAK,
    Permissions.MUTE_MEMBERS,
    Permissions.DEAFEN_MEMBERS,
    Permissions.MOVE_MEMBERS,
    Permissions.USE_VAD,
    Permissions.MANAGE_ROLES,
    Permissions.MANAGE_WEBHOOKS,
    Permissions.USE_APPLICATION_COMMANDS,
    Permissions.MANAGE_EVENTS,
    Permissions.USE_EXTERNAL_STICKERS,
    Permissions.USE_EMBEDDED_ACTIVITIES,
    Permissions.USE_SOUNDBOARD,
    Permissions.USE_EXTERNAL_SOUNDS,
    Permissions.SEND_VOICE_MESSAGES,
    Permissions.USE_CLYDE_AI,
    Permissions.SET_VOICE_CHANNEL_STATUS,
    Permissions.SEND_POLLS,
    Permissions.USE_EXTERNAL_APPS,
    Permissions.BYPASS_SLOWMODE
] as const;
export const AllVoicePermissions = VoicePermissions.reduce((all, p) => all | p, 0n);
export const AllVoicePermissionNames = VoicePermissions.map(p => PermissionValueToName[String(p) as `${typeof p}`]);

export const StagePermissions = [
    Permissions.CREATE_INSTANT_INVITE,
    Permissions.MANAGE_CHANNELS,
    Permissions.ADD_REACTIONS,
    Permissions.STREAM,
    Permissions.VIEW_CHANNEL,
    Permissions.SEND_MESSAGES,
    Permissions.SEND_TTS_MESSAGES,
    Permissions.MANAGE_MESSAGES,
    Permissions.EMBED_LINKS,
    Permissions.ATTACH_FILES,
    Permissions.READ_MESSAGE_HISTORY,
    Permissions.MENTION_EVERYONE,
    Permissions.USE_EXTERNAL_EMOJIS,
    Permissions.CONNECT,
    Permissions.MUTE_MEMBERS,
    Permissions.MOVE_MEMBERS,
    Permissions.MANAGE_ROLES,
    Permissions.MANAGE_WEBHOOKS,
    Permissions.USE_APPLICATION_COMMANDS,
    Permissions.REQUEST_TO_SPEAK,
    Permissions.MANAGE_EVENTS,
    Permissions.USE_EXTERNAL_STICKERS,
    Permissions.SEND_VOICE_MESSAGES,
    Permissions.USE_CLYDE_AI,
    Permissions.SEND_POLLS,
    Permissions.USE_EXTERNAL_APPS,
    Permissions.BYPASS_SLOWMODE
] as const;
export const AllStagePermissions = StagePermissions.reduce((all, p) => all | p, 0n);
export const AllStagePermissionNames = StagePermissions.map(p => PermissionValueToName[String(p) as `${typeof p}`]);

/** These permissions require the bot owner's account to have 2FA enabled in guilds where 2FA is a requirement. */
export const ModeratorPermissions = [
    Permissions.KICK_MEMBERS,
    Permissions.BAN_MEMBERS,
    Permissions.ADMINISTRATOR,
    Permissions.MANAGE_CHANNELS,
    Permissions.MANAGE_GUILD,
    Permissions.MANAGE_MESSAGES,
    Permissions.MANAGE_ROLES,
    Permissions.MANAGE_WEBHOOKS,
    Permissions.MANAGE_GUILD_EXPRESSIONS,
    Permissions.MANAGE_THREADS,
    Permissions.MODERATE_MEMBERS,
    Permissions.VIEW_CREATOR_MONETIZATION_ANALYTICS
] as const;
export const AllModeratorPermissions = ModeratorPermissions.reduce((all, p) => all | p, 0n);
export const AllModeratorPermissionNames = ModeratorPermissions.map(p => PermissionValueToName[String(p) as `${typeof p}`]);

export const PermissionNames = Object.keys(Permissions) as Array<PermissionName>;
export type PermissionName = keyof typeof Permissions;

export enum ChannelFlags {
    /** Guild channel is hidden from the guild's feed */
    GUILD_FEED_REMOVED                            = 1 << 0,
    /** Thread is pinned to the top of its parent thread-only channel */
    PINNED                                        = 1 << 1,
    /** Guild channel has been removed from the guild's active channels */
    ACTIVE_CHANNELS_REMOVED                       = 1 << 2,

    /** Thread-only channel requires a tag to create threads in */
    REQUIRE_TAG                                   = 1 << 4,
    /** Channel is marked as spam */
    IS_SPAM                                       = 1 << 5,

    /** Guild channel is used as a read-only resource for onboarding and is not shown in the channel list */
    IS_GUILD_RESOURCE_CHANNEL                     = 1 << 7,
    /** Channel is created by Clyde AI, which has full access to all message content */
    CLYDE_AI                                      = 1 << 8,
    /** Guild channel is scheduled for deletion and is not shown in the UI */
    IS_SCHEDULED_FOR_DELETION                     = 1 << 9,
    /** @deprecated Forum channel is a media channel */
    IS_MEDIA_CHANNEL                              = 1 << 10,
    /** Guild channel has summaries disabled */
    SUMMARIES_DISABLED                            = 1 << 11,
    /** @deprecated Private channel's recipients consented to the application shelf */
    APPLICATION_SHELF_CONSENT                     = 1 << 12,
    /** Role subscription tier for this guild channel has not been published yet */
    IS_ROLE_SUBSCRIPTION_TEMPLATE_PREVIEW_CHANNEL = 1 << 13,
    /** Group DM is used for broadcasting a live stream */
    IS_BROADCASTING                               = 1 << 14,
    /** Media channel has the embedded download options hidden for media attachments */
    HIDE_MEDIA_DOWNLOAD_OPTIONS                   = 1 << 15,
    /** Group DM is used for guild join request interviews */
    IS_JOIN_REQUEST_INTERVIEW_CHANNEL             = 1 << 16,
    /** User does not have permission to view the channel */
    OBFUSCATED                                    = 1 << 17,

    /** Forum channel is the guild's moderator queue */
    IS_MODERATOR_REPORT_CHANNEL = 1 << 19,

    /** Channel is marked as a spoiler channel */
    IS_SPOILER_CHANNEL = 1 << 21,
}

export enum SortOrderTypes {
    /** Sort by the most recently active threads */
    LATEST_ACTIVITY = 0,
    CREATION_DATE   = 1,
}

export enum ForumLayoutTypes {
    /** No layout type explicitly set */
    DEFAULT = 0,
    /** Threads are displayed in a list */
    LIST    = 1,
    /** Threads are displayed in a collection of tiles */
    GRID    = 2,
}

export enum TeamMembershipState {
    /** The user is invited */
    INVITED  = 1,
    /** The user has accepted the invite */
    ACCEPTED = 2,
}

export enum OAuthScopes {
    /** allows your app to fetch data from a user's "Now Playing/Recently Played" list - requires Discord approval */
    ACTIVITIES_READ = "activities.read",
    /** allows your app to update a user's activity - requires Discord approval (NOT REQUIRED FOR [GAMESDK ACTIVITY MANAGER](https://discord.com/developers/docs/game-sdk/activities)) */
    ACTIVITIES_WRITE = "activities.write",
    /** allows your app to read build data for a user's applications */
    APPLICATIONS_BUILDS_READ = "applications.builds.read",
    /** allows your app to upload/update builds for a user's applications - requires Discord approval */
    APPLICATIONS_BUILDS_UPLOAD = "applications.builds.upload",
    /** allows your app to use [commands](https://discord.com/developers/docs/interactions/application-commands) in a guild */
    APPLICATIONS_COMMANDS = "applications.commands",
    APPLICATIONS_COMMANDS_PERMISSIONS_UPDATE = "applications.commands.permissions.update",
    /** allows your app to update its [commands](https://discord.com/developers/docs/interactions/application-commands) using a Bearer token - [client credentials grant](https://discord.com/developers/docs/topics/oauth2#client-credentials-grant) only */
    APPLICATIONS_COMMANDS_UPDATE = "applications.commands.update",
    /** allows your app to read entitlements for a user's applications */
    APPLICATIONS_ENTITLEMENTS = "applications.entitlements",
    /** allows your app to read and update store data (SKUs, store listings, achievements, etc.) for a user's applications */
    APPLICATIONS_STORE_UPDATE = "applications.store.update",
    /** for oauth2 bots, this puts the bot in the user's selected guild by default */
    BOT = "bot",
    /** allows [/users/@me/connections](https://discord.com/developers/docs/resources/user#get-user-connections) to return linked third-party accounts */
    CONNECTIONS = "connections",
    /** allows your app to see information about the user's DMs and group DMs - requires Discord approval */
    DM_CHANNELS_READ = "dm_channels.read",
    /** enables [/users/@me](https://discord.com/developers/docs/resources/user#get-current-user) to return an `email` */
    EMAIL = "email",
    /** allows your app to [join users to a group dm](https://discord.com/developers/docs/resources/channel#group-dm-add-recipient) */
    GDM_JOIN = "gdm.join",
    /** allows [/users/@me/guilds](https://discord.com/developers/docs/resources/user#get-current-user-guilds) to return basic information about all of a user's guilds */
    GUILDS = "guilds",
    /** allows [/guilds/\{guild.id\}/members/\{user.id\}](https://discord.com/developers/docs/resources/guild#add-guild-member) to be used for joining users to a guild */
    GUILDS_JOIN = "guilds.join",
    /** allows [/users/@me/guilds/\{guild.id\}/member](https://discord.com/developers/docs/resources/user#get-current-user-guild-member) to return a user's member information in a guild */
    GUILDS_MEMBERS_READ = "guilds.members.read",
    /** allows [/users/@me](https://discord.com/developers/docs/resources/user#get-current-user) without `email` */
    IDENTIFY = "identify",
    /** allows your app to read a user's Nitro subscription type as defined by `premium_type` on the User object - only available to approved partners */
    IDENTIFY_PREMIUM = "identify.premium",
    /** for local rpc server api access, this allows you to read messages from all client channels (otherwise restricted to channels/guilds your app creates) */
    MESSAGES_READ = "messages.read",
    /** enables OpenID Connect endpoints and ID token claims */
    OPENID = "openid",
    /** allows your app to know a user's friends and implicit relationships */
    RELATIONSHIPS_READ = "relationships.read",
    /** allows your app to update a user's connection and metadata for the app */
    ROLE_CONNECTIONS_WRITE = "role_connections.write",
    /** for local rpc server access, this allows you to control a user's local Discord client - requires Discord approval */
    RPC = "rpc",
    /** for local rpc server access, this allows you to receive notifications pushed out to the user - requires Discord approval */
    RPC_ACTIVITIES_READ = "rpc.activities.read",
    /** for local rpc server access, this allows you to update a user's activity - requires Discord approval */
    RPC_ACTIVITIES_WRITE = "rpc.activities.write",
    /** for local rpc server access, this allows you to receive notifications pushed out to the user - requires Discord approval */
    RPC_NOTIFICATIONS_READ = "rpc.notifications.read",
    /** for local rpc server access, this allows you to read a user's voice settings and listen for voice events - requires Discord approval */
    RPC_VOICE_READ = "rpc.voice.read",
    /** for local rpc server access, this allows you to update a user's voice settings - requires Discord approval */
    RPC_VOICE_WRITE = "rpc.voice.write",
    /** allows your app to connect to voice on user's behalf and see all the voice members - requires Discord approval */
    VOICE = "voice",
    /** This generates a webhook that is returned in the oauth token response for authorization code grants. */
    WEBHOOK_INCOMING = "webhook.incoming",
}

export enum ComponentTypes {
    /** A container for other components */
    ACTION_ROW         = 1,
    /** A button object */
    BUTTON             = 2,
    /** Select menu for picking from defined text options */
    STRING_SELECT      = 3,
    /** Text input object */
    TEXT_INPUT         = 4,
    /** Select menu for users */
    USER_SELECT        = 5,
    /** Select menu for roles */
    ROLE_SELECT        = 6,
    /** Select menu for mentionables (users and roles) */
    MENTIONABLE_SELECT = 7,
    /** Select menu for channels */
    CHANNEL_SELECT     = 8,
    /** Container to display text alongside an accessory component */
    SECTION            = 9,
    /** Markdown text */
    TEXT_DISPLAY       = 10,
    /** Small image that can be used as an accessory */
    THUMBNAIL          = 11,
    /** Display images and other media */
    MEDIA_GALLERY      = 12,
    /** Displays an attached file */
    FILE               = 13,
    /** Component to add vertical padding between other components */
    SEPARATOR          = 14,

    /** Displays an activity feed entry */
    CONTENT_INVENTORY_ENTRY = 16,
    /** Container that visually groups a set of components */
    CONTAINER               = 17,
    /** Container associating a label and description with a component */
    LABEL                   = 18,
    /** Component to upload one or more files */
    FILE_UPLOAD             = 19,

    /** Single-choice set of radio options */
    RADIO_GROUP    = 21,
    /** Multi-select group of checkboxes */
    CHECKBOX_GROUP = 22,
    /** Single checkbox for binary choice */
    CHECKBOX       = 23,
}

export type SelectMenuNonResolvedTypes = ComponentTypes.STRING_SELECT;
export type SelectMenuResolvedTypes = ComponentTypes.USER_SELECT | ComponentTypes.ROLE_SELECT | ComponentTypes.MENTIONABLE_SELECT | ComponentTypes.CHANNEL_SELECT;
export type SelectMenuTypes = SelectMenuNonResolvedTypes | SelectMenuResolvedTypes;

export type MessageComponentTypes = ComponentTypes.BUTTON | SelectMenuTypes;
export type ModalComponentTypes = ComponentTypes.CHECKBOX | ComponentTypes.CHECKBOX_GROUP | ComponentTypes.RADIO_GROUP | ComponentTypes.TEXT_INPUT | SelectMenuTypes | ComponentTypes.FILE_UPLOAD;

export enum ButtonStyles {
    /** The most important or recommended action in a group of options */
    PRIMARY   = 1,
    /** Alternative or supporting actions */
    SECONDARY = 2,
    /** Positive confirmation or completion actions */
    SUCCESS   = 3,
    /** An action with irreversible consequences */
    DANGER    = 4,
    /** Navigates to a URL */
    LINK      = 5,
    /** Purchase */
    PREMIUM   = 6,
}

export enum TextInputStyles {
    /** Single-line input */
    SHORT     = 1,
    /** Multi-line input */
    PARAGRAPH = 2,
}

export enum MessageFlags {
    /** Message has been published to subscribed channels (via Channel Following) */
    CROSSPOSTED                            = 1 << 0,
    /** Message originated from a message in another channel (via Channel Following) */
    IS_CROSSPOST                           = 1 << 1,
    /** Embeds will not be included when serializing this message */
    SUPPRESS_EMBEDS                        = 1 << 2,
    /** Source message for this crosspost has been deleted (via Channel Following) */
    SOURCE_MESSAGE_DELETED                 = 1 << 3,
    /** Message came from the urgent message system */
    URGENT                                 = 1 << 4,
    /** Message has an associated thread, with the same ID as the message */
    HAS_THREAD                             = 1 << 5,
    /** Message is only visible to the user who invoked the interaction */
    EPHEMERAL                              = 1 << 6,
    /** Message is an interaction response and the bot is "thinking" */
    LOADING                                = 1 << 7,
    /** Some roles were not mentioned and added to the thread (caps at 250) */
    FAILED_TO_MENTION_SOME_ROLES_IN_THREAD = 1 << 8,
    /** Message is hidden from the guild's feed */
    GUILD_FEED_HIDDEN                      = 1 << 9,
    /** Message contains a link that impersonates Discord */
    SHOULD_SHOW_LINK_NOT_DISCORD_WARNING   = 1 << 10,
    /** Message will not trigger push and desktop notifications */
    SUPPRESS_NOTIFICATIONS                 = 1 << 12,
    /** Message's audio attachment is rendered as a voice message */
    IS_VOICE_MESSAGE                       = 1 << 13,
    /** Message has a forwarded message snapshot attached */
    HAS_SNAPSHOT                           = 1 << 14,
    /** Message contains components from version 2 of the UI kit */
    IS_COMPONENTS_V2                       = 1 << 15,
    /** Message was triggered by the social layer integration */
    SENT_BY_SOCIAL_LAYER_INTEGRATION       = 1 << 16,
    /** Message is hidden because the author is suspended */
    HIDDEN_SUSPENDED_USER                  = 1 << 17,
    /** Marks guild boosted message as the first person to boost the guild */
    IS_FIRST_BOOSTER                       = 1 << 18,
    /** Message is marked as official for the verified guild */
    IS_GUILD_OFFICIAL                      = 1 << 19,
}

export enum MessageTypes {
    /** A default message (see below) */
    DEFAULT                                      = 0,
    /** A message sent when a user is added to a group DM or thread */
    RECIPIENT_ADD                                = 1,
    /** A message sent when a user is removed from a group DM or thread */
    RECIPIENT_REMOVE                             = 2,
    /** A message sent when a user creates a call in a private channel */
    CALL                                         = 3,
    /** A message sent when a group DM or thread's name is changed */
    CHANNEL_NAME_CHANGE                          = 4,
    /** A message sent when a group DM's icon is changed */
    CHANNEL_ICON_CHANGE                          = 5,
    /** A message sent when a message is pinned in a channel */
    CHANNEL_PINNED_MESSAGE                       = 6,
    /** A message sent when a user joins a guild */
    USER_JOIN                                    = 7,
    /** A message sent when a user subscribes to (boosts) a guild */
    GUILD_BOOST                                  = 8,
    /** A message sent when a user subscribes to (boosts) a guild to tier 1 */
    GUILD_BOOST_TIER_1                           = 9,
    /** A message sent when a user subscribes to (boosts) a guild to tier 2 */
    GUILD_BOOST_TIER_2                           = 10,
    /** A message sent when a user subscribes to (boosts) a guild to tier 3 */
    GUILD_BOOST_TIER_3                           = 11,
    /** A message sent when a news channel is followed */
    CHANNEL_FOLLOW_ADD                           = 12,
    /** @deprecated A message sent when a user starts streaming in a guild */
    GUILD_STREAM                                 = 13,
    /** A message sent when a guild is disqualified from discovery */
    GUILD_DISCOVERY_DISQUALIFIED                 = 14,
    /** A message sent when a guild requalifies for discovery */
    GUILD_DISCOVERY_REQUALIFIED                  = 15,
    /** A message sent when a guild has failed discovery requirements for a week */
    GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
    /** A message sent when a guild has failed discovery requirements for 3 weeks */
    GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING   = 17,
    /** A message sent when a thread is created */
    THREAD_CREATED                               = 18,
    /** A message sent when a user replies to a message */
    REPLY                                        = 19,
    /** A message sent when a user uses a slash command */
    CHAT_INPUT_COMMAND                           = 20,
    /** A message sent when a thread starter message is added to a thread */
    THREAD_STARTER_MESSAGE                       = 21,
    /** A message sent to remind users to invite friends to a guild */
    GUILD_INVITE_REMINDER                        = 22,
    /** A message sent when a user uses a context menu command */
    CONTEXT_MENU_COMMAND                         = 23,
    /** A message sent when auto moderation takes an action */
    AUTO_MODERATION_ACTION                       = 24,
    /** A message sent when a user purchases or renews a role subscription */
    ROLE_SUBSCRIPTION_PURCHASE                   = 25,
    /** A message sent when a user is upsold to a premium interaction */
    INTERACTION_PREMIUM_UPSELL                   = 26,
    /** A message sent when a stage channel starts */
    STAGE_START                                  = 27,
    /** A message sent when a stage channel ends */
    STAGE_END                                    = 28,
    /** A message sent when a user starts speaking in a stage channel */
    STAGE_SPEAKER                                = 29,
    /** A message sent when a user raises their hand in a stage channel */
    STAGE_RAISE_HAND                             = 30,
    /** A message sent when a stage channel's topic is changed */
    STAGE_TOPIC_CHANGE                           = 31,
    /** A message sent when a user purchases an application premium subscription */
    GUILD_APPLICATION_PREMIUM_SUBSCRIPTION       = 32,
    /** @deprecated A message sent when a user adds an application to group DM */
    PRIVATE_CHANNEL_INTEGRATION_ADDED            = 33,
    /** @deprecated A message sent when a user removed an application from a group DM */
    PRIVATE_CHANNEL_INTEGRATION_REMOVED          = 34,
    /** A message sent when a user gifts a premium (Nitro) referral */
    PREMIUM_REFERRAL                             = 35,
    /** A message sent when a user enabled lockdown for the guild */
    GUILD_INCIDENT_ALERT_MODE_ENABLED            = 36,
    /** A message sent when a user disables lockdown for the guild */
    GUILD_INCIDENT_ALERT_MODE_DISABLED           = 37,
    /** A message sent when a user reports a raid for the guild */
    GUILD_INCIDENT_REPORT_RAID                   = 38,
    /** A message sent when a user reports a false alarm for the guild */
    GUILD_INCIDENT_REPORT_FALSE_ALARM            = 39,
    /** A message sent when no one sends a message in the current channel for 1 hour */
    GUILD_DEADCHAT_REVIVE_PROMPT                 = 40,
    /** A message sent when a user buys another user a gift */
    CUSTOM_GIFT                                  = 41,
    GUILD_GAMING_STATS_PROMPT                    = 42,
    /** @deprecated A message sent when a user posts a poll */
    POLL                                         = 43,
    /** A message sent when a user purchases a guild product */
    PURCHASE_NOTIFICATION                        = 44,
    /** @deprecated A message sent when a user invites another user to hangout in a voice channel */
    VOICE_HANGOUT_INVITE                         = 45,
    /** A message sent when a poll is finalized */
    POLL_RESULT                                  = 46,
    /** A message sent by the Discord Updates account when a new changelog is posted */
    CHANGELOG                                    = 47,
    /** A message sent when a Nitro promotion is triggered */
    NITRO_NOTIFICATION                           = 48,
    /** A message sent when a voice channel is linked to a lobby */
    CHANNEL_LINKED_TO_LOBBY                      = 49,
    /** A local-only ephemeral message sent when a user is prompted to gift Nitro to a friend on their friendship anniversary */
    GIFTING_PROMPT                               = 50,
    /** A local-only message sent when a user receives an in-game message NUX */
    IN_GAME_MESSAGE_NUX                          = 51,
    /** A message sent when a user accepts a guild join request */
    GUILD_JOIN_REQUEST_ACCEPT_NOTIFICATION       = 52,
    /** A message sent when a user rejects a guild join request */
    GUILD_JOIN_REQUEST_REJECT_NOTIFICATION       = 53,
    /** A message sent when a user withdraws a guild join request */
    GUILD_JOIN_REQUEST_WITHDRAWN_NOTIFICATION    = 54,
    /** A message sent when a user upgrades to HD streaming */
    HD_STREAMING_UPGRADED                        = 55,
    /** @deprecated A message sent when a user sets a DM wallpaper */
    CHAT_WALLPAPER_SET                           = 56,
    /** @deprecated A message sent when a user removes a DM wallpaper */
    CHAT_WALLPAPER_REMOVE                        = 57,
    /** A message sent when a user resolves a moderation report by deleting the offending message */
    REPORT_TO_MOD_DELETED_MESSAGE                = 58,
    /** A message sent when a user resolves a moderation report by timing out the offending user */
    REPORT_TO_MOD_TIMEOUT_USER                   = 59,
    /** A message sent when a user resolves a moderation report by kicking the offending user */
    REPORT_TO_MOD_KICK_USER                      = 60,
    /** A message sent when a user resolves a moderation report by banning the offending user */
    REPORT_TO_MOD_BAN_USER                       = 61,
    /** A message sent when a user resolves a moderation report */
    REPORT_TO_MOD_CLOSED_REPORT                  = 62,
    /** @deprecated A message sent when a user adds a new emoji to a guild */
    EMOJI_ADDED                                  = 63,
    /** A message sent when a user invites another user to join a group Nitro subscription */
    PREMIUM_GROUP_INVITE                         = 64,
    /** A message sent when a user starts a voice channel in a small guild */
    VOICE_SESSION                                = 65,
    /** A local-only ephemeral message asking the user to be the first to boost a guild */
    GUILD_BOOST_UPSELL                           = 66,
    /** A message sent when a user accepts another user's friend request */
    FRIEND_REQUEST_ACCEPTED                      = 67,
    MEDIA_MENTION_MESSAGE                        = 68,
}

/** Messages of these types cannot be deleted. */
export const UndeletableMessageTypes = [
    MessageTypes.RECIPIENT_ADD,
    MessageTypes.RECIPIENT_REMOVE,
    MessageTypes.CALL,
    MessageTypes.CHANNEL_NAME_CHANGE,
    MessageTypes.CHANNEL_ICON_CHANGE,
    MessageTypes.THREAD_STARTER_MESSAGE
] as const;

export enum MessageActivityTypes {
    /** Join activity invite. */
    JOIN         = 1,
    /** Spectate activity invite. */
    SPECTATE     = 2,
    /** Listen activity invite. */
    LISTEN       = 3,
    /** Watch activity invite. */
    WATCH        = 4,
    /** Join request activity invite. */
    JOIN_REQUEST = 5,
}

export enum InteractionTypes {
    /** Discord is pinging the application */
    PING                             = 1,
    /** User uses an application command */
    APPLICATION_COMMAND              = 2,
    /** User triggers a message component */
    MESSAGE_COMPONENT                = 3,
    /** User is requesting an application command option to be auto-completed */
    APPLICATION_COMMAND_AUTOCOMPLETE = 4,
    /** User submits a modal */
    MODAL_SUBMIT                     = 5,
}

export enum InviteTypes {
    /** Joins the user to a guild */
    GUILD =     0,
    /** Joins the user to a group DM */
    GROUP_DM =  1,
    /** Adds the user as a friend to the inviter */
    FRIEND =    2,
}

export enum InviteTargetTypes {
    /** The invite is for a stream in a voice channel */
    STREAM                      = 1,
    /** The invite is for an embedded application (activity) in a voice channel */
    EMBEDDED_APPLICATION        = 2,
    ROLE_SUBSCRIPTIONS_PURCHASE = 3,
}

export enum GuildScheduledEventPrivacyLevels {
    /** Scheduled event or stage instance is only visible to guild members */
    GUILD_ONLY = 2,
}

export enum GuildScheduledEventStatuses {
    /** Scheduled event has not started. */
    SCHEDULED = 1,
    /** Scheduled event is currently active. */
    ACTIVE    = 2,
    /** Scheduled event completed. */
    COMPLETED = 3,
    /** Scheduled event was canceled. */
    CANCELED  = 4,
}

export enum GuildScheduledEventEntityTypes {
    /** Scheduled event is for a stage instance. */
    STAGE_INSTANCE = 1,
    /** Scheduled event is for a voice channel. */
    VOICE          = 2,
    /** Scheduled event is external. */
    EXTERNAL       = 3,
}

export enum StageInstancePrivacyLevels {
    /** @deprecated Scheduled event or stage instance is visible publicly */
    PUBLIC     = 1,
    /** Scheduled event or stage instance is only visible to guild members */
    GUILD_ONLY = 2,
}

export enum AutoModerationEventTypes {
    /** When a member sends or edits a message in the guild */
    MESSAGE_SEND  = 1,
    MEMBER_UPDATE = 2,
}

export enum AutoModerationTriggerTypes {
    /** When message content contains words from a user defined list of keywords (max 6) */
    KEYWORD        = 1,
    /** When message content represents generic spam (max 1) */
    SPAM           = 3,
    /** When message content contains words from internal predefined wordsets (max 1) */
    KEYWORD_PRESET = 4,
    /** When message content contains more unique mentions than allowed (max 1) */
    MENTION_SPAM   = 5,
    MEMBER_PROFILE = 6,
}

export enum AutoModerationKeywordPresetTypes {
    /** Words that may be considered forms of swearing or cursing */
    PROFANITY      = 1,
    /** Words that refer to sexually explicit behavior or activity */
    SEXUAL_CONTENT = 2,
    /** Personal insults or words that may be considered hate speech */
    SLURS          = 3,
}

export enum AutoModerationActionTypes {
    /** Block a member's message and prevent it from being posted; a custom explanation can be specified and shown to members whenever their message is blocked */
    BLOCK_MESSAGE            = 1,
    /** Log user content to a specified channel */
    SEND_ALERT_MESSAGE       = 2,
    TIMEOUT                  = 3,
    BLOCK_MEMBER_INTERACTION = 4,
}

export enum AuditLogActionTypes {
    /** Guild settings were updated */
    GUILD_UPDATE = 1,

    /** Channel was created */
    CHANNEL_CREATE           = 10,
    /** Channel settings were updated */
    CHANNEL_UPDATE           = 11,
    /** Channel was deleted */
    CHANNEL_DELETE           = 12,
    /** Permission overwrite was added to a channel */
    CHANNEL_OVERWRITE_CREATE = 13,
    /** Permission overwrite was updated for a channel */
    CHANNEL_OVERWRITE_UPDATE = 14,
    /** Permission overwrite was deleted from a channel */
    CHANNEL_OVERWRITE_DELETE = 15,

    /** Member was removed from guild */
    MEMBER_KICK        = 20,
    /** Members were pruned from guild */
    MEMBER_PRUNE       = 21,
    /** Member was banned from guild */
    MEMBER_BAN_ADD     = 22,
    /** Member was unbanned from guild */
    MEMBER_BAN_REMOVE  = 23,
    /** Member was updated in guild */
    MEMBER_UPDATE      = 24,
    /** Member was added or removed from a role */
    MEMBER_ROLE_UPDATE = 25,
    /** Member was moved to a different voice channel */
    MEMBER_MOVE        = 26,
    /** Member was disconnected from a voice channel */
    MEMBER_DISCONNECT  = 27,
    /** Bot user was added to guild */
    BOT_ADD            = 28,

    /** Role was created */
    ROLE_CREATE = 30,
    /** Role was edited */
    ROLE_UPDATE = 31,
    /** Role was deleted */
    ROLE_DELETE = 32,

    /** Guild invite was created */
    INVITE_CREATE = 40,
    /** Guild invite was updated */
    INVITE_UPDATE = 41,
    /** Guild invite was deleted */
    INVITE_DELETE = 42,

    /** Webhook was created */
    WEBHOOK_CREATE = 50,
    /** Webhook properties or channel were updated */
    WEBHOOK_UPDATE = 51,
    /** Webhook was deleted */
    WEBHOOK_DELETE = 52,

    /** Emoji was created */
    EMOJI_CREATE = 60,
    /** Emoji name was updated */
    EMOJI_UPDATE = 61,
    /** Emoji was deleted */
    EMOJI_DELETE = 62,

    /** Single message was deleted */
    MESSAGE_DELETE      = 72,
    /** Multiple messages were deleted */
    MESSAGE_BULK_DELETE = 73,
    /** Message was pinned to a channel */
    MESSAGE_PIN         = 74,
    /** Message was unpinned from a channel */
    MESSAGE_UNPIN       = 75,

    /** Integration was added to guild */
    INTEGRATION_CREATE    = 80,
    /** Integration was updated (e.g. its scopes were updated) */
    INTEGRATION_UPDATE    = 81,
    /** Integration was removed from guild */
    INTEGRATION_DELETE    = 82,
    /** Stage instance was created (stage channel becomes live) */
    STAGE_INSTANCE_CREATE = 83,
    /** Stage instance details were updated */
    STAGE_INSTANCE_UPDATE = 84,
    /** Stage instance was deleted (stage channel no longer live) */
    STAGE_INSTANCE_DELETE = 85,

    /** Sticker was created */
    STICKER_CREATE = 90,
    /** Sticker details were updated */
    STICKER_UPDATE = 91,
    /** Sticker was deleted */
    STICKER_DELETE = 92,

    /** Event was created */
    GUILD_SCHEDULED_EVENT_CREATE = 100,
    /** Event was updated */
    GUILD_SCHEDULED_EVENT_UPDATE = 101,
    /** Event was cancelled */
    GUILD_SCHEDULED_EVENT_DELETE = 102,

    /** Thread was created in a channel */
    THREAD_CREATE = 110,
    /** Thread was updated */
    THREAD_UPDATE = 111,
    /** Thread was deleted */
    THREAD_DELETE = 112,

    /** Permissions were updated for a command */
    APPLICATION_COMMAND_PERMISSION_UPDATE = 121,

    /** Soundboard sound was created */
    SOUNDBOARD_SOUND_CREATE = 130,
    /** Soundboard sound was updated */
    SOUNDBOARD_SOUND_UPDATE = 131,
    /** Soundboard sound was deleted */
    SOUNDBOARD_SOUND_DELETE = 132,

    /** AutoMod rule was created */
    AUTO_MODERATION_RULE_CREATE                 = 140,
    /** AutoMod rule was updated */
    AUTO_MODERATION_RULE_UPDATE                 = 141,
    /** AutoMod rule was deleted */
    AUTO_MODERATION_RULE_DELETE                 = 142,
    /** Message was blocked by AutoMod */
    AUTO_MODERATION_BLOCK_MESSAGE               = 143,
    /** Message was flagged by AutoMod */
    AUTO_MODERATION_FLAG_TO_CHANNEL             = 144,
    /** Member was timed out by AutoMod */
    AUTO_MODERATION_USER_COMMUNICATION_DISABLED = 145,
    /** Member was quarantined by AutoMod */
    AUTO_MODERATION_QUARANTINE_USER             = 146,

    /** Creator monetization request was created */
    CREATOR_MONETIZATION_REQUEST_CREATED = 150,
    /** Creator monetization terms were accepted */
    CREATOR_MONETIZATION_TERMS_ACCEPTED  = 151,

    ROLE_PROMPT_CREATE       = 160,
    ROLE_PROMPT_UPDATE       = 161,
    ROLE_PROMPT_DELETE       = 162,
    /** Onboarding prompt was created */
    ONBOARDING_PROMPT_CREATE = 163,
    /** Onboarding prompt was updated */
    ONBOARDING_PROMPT_UPDATE = 164,
    /** Onboarding prompt was deleted */
    ONBOARDING_PROMPT_DELETE = 165,
    /** Onboarding was initialized */
    ONBOARDING_CREATE        = 166,
    /** Onboarding was updated */
    ONBOARDING_UPDATE        = 167,

    /** Message was featured in guild home */
    GUILD_HOME_FEATURE_ITEM = 171,
    /** Message was removed from guild home */
    GUILD_HOME_REMOVE_ITEM  = 172,

    /** @deprecated Message blocked by harmful links filter */
    HARMFUL_LINKS_BLOCKED_MESSAGE = 180,

    /** New member welcome was initialized */
    HOME_SETTINGS_CREATE        = 190,
    /** New member welcome was updated */
    HOME_SETTINGS_UPDATE        = 191,
    /** Voice channel status was updated */
    VOICE_CHANNEL_STATUS_CREATE = 192,
    /** Voice channel status was deleted */
    VOICE_CHANNEL_STATUS_DELETE = 193,
    /** @deprecated Clyde AI profile was updated */
    CLYDE_AI_PROFILE_UPDATE     = 194,

    /** Exception was created for a guild scheduled event */
    GUILD_SCHEDULED_EVENT_EXCEPTION_CREATE = 200,
    /** Exception was updated for a guild scheduled event */
    GUILD_SCHEDULED_EVENT_EXCEPTION_UPDATE = 201,
    /** Exception was deleted for a guild scheduled event */
    GUILD_SCHEDULED_EVENT_EXCEPTION_DELETE = 202,

    /** Member verification settings were updated */
    GUILD_MEMBER_VERIFICATION_UPDATE         = 210,
    /** Guild profile was updated */
    GUILD_PROFILE_UPDATE                     = 211,
    PIN_PERMISSION_MIGRATION_COMPLETE        = 212,
    BYPASS_SLOWMODE_PERMISSION_MIGRATION_COM = 213,
}

export enum ApplicationCommandTypes {
    /** Slash commands; a text-based command that shows up when a user types `/` */
    CHAT_INPUT          = 1,
    /** An UI-based command that shows up when you right click or tap on an user */
    USER                = 2,
    /** An UI-based command that shows up when you right click or tap on a message */
    MESSAGE             = 3,
    /** An UI-based command that represents the primary way to invoke an app's activity */
    PRIMARY_ENTRY_POINT = 4,
}

export enum ApplicationCommandOptionTypes {
    /** A subcommand */
    SUB_COMMAND       = 1,
    /** A group of subcommands */
    SUB_COMMAND_GROUP = 2,
    /** A string */
    STRING            = 3,
    /** An integer between -253 and */
    INTEGER           = 4,
    /** A boolean */
    BOOLEAN           = 5,
    /** An user */
    USER              = 6,
    /** A channel (includes all channel types by default) */
    CHANNEL           = 7,
    /** A role */
    ROLE              = 8,
    /** A mentionable entity (currently only users and roles) */
    MENTIONABLE       = 9,
    /** A float/integer between -253 and */
    NUMBER            = 10,
    /** An attachment */
    ATTACHMENT        = 11,
}

export enum ApplicationCommandPermissionTypes {
    /** A role within a guild */
    ROLE    = 1,
    /** A guild member */
    USER    = 2,
    /** A channel within a guild */
    CHANNEL = 3,
}

export enum InteractionResponseTypes {
    /** Acknowledge a `PING` interaction */
    PONG                                    = 1,
    /** Respond to an interaction with a message */
    CHANNEL_MESSAGE_WITH_SOURCE             = 4,
    /** Acknowledge an interaction and send a message later; the user sees a loading state */
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE    = 5,
    /** Acknowledge an interaction and edit the original message later; the user does not see a loading state */
    DEFERRED_UPDATE_MESSAGE                 = 6,
    /** Edit the message that the interacted component was attached to */
    UPDATE_MESSAGE                          = 7,
    /** Respond to an autocomplete interaction with suggested choices */
    APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8,
    /** Respond to an interaction with a popup modal */
    MODAL                                   = 9,
    /** @deprecated */
    PREMIUM_REQUIRED                        = 10,
    /** Launch an embedded activity associated with the application */
    LAUNCH_ACTIVITY                         = 12,
}

export enum EntryPointCommandHandlerTypes {
    /** The application handles the interaction using an interaction token */
    APP_HANDLER             = 1,
    /** Discord handles the interaction by launching an embedded activity and sending a follow-up message without coordinating with the app */
    DISCORD_LAUNCH_ACTIVITY = 2,
}

export enum Intents {
    /** Guilds and unavailable guild events. */
    GUILDS                        = 1 << 0,
    /** Guild member events. */
    GUILD_MEMBERS                 = 1 << 1,
    /** Guild moderation events, including bans. */
    GUILD_MODERATION              = 1 << 2,
    /** @deprecated Guild emoji and sticker events. Use `GUILD_EXPRESSIONS`. */
    GUILD_EMOJIS_AND_STICKERS     = 1 << 3,
    /** Guild emoji, sticker, and soundboard expression events. */
    GUILD_EXPRESSIONS             = 1 << 3,
    /** Guild integration events. */
    GUILD_INTEGRATIONS            = 1 << 4,
    /** Guild webhook events. */
    GUILD_WEBHOOKS                = 1 << 5,
    /** Guild invite events. */
    GUILD_INVITES                 = 1 << 6,
    /** Guild voice state events. */
    GUILD_VOICE_STATES            = 1 << 7,
    /** Guild presence events. */
    GUILD_PRESENCES               = 1 << 8,
    /** Guild message create/update/delete events. */
    GUILD_MESSAGES                = 1 << 9,
    /** Guild message reaction events. */
    GUILD_MESSAGE_REACTIONS       = 1 << 10,
    /** Guild message typing events. */
    GUILD_MESSAGE_TYPING          = 1 << 11,
    /** Direct message create/update/delete events. */
    DIRECT_MESSAGES               = 1 << 12,
    /** Direct message reaction events. */
    DIRECT_MESSAGE_REACTIONS      = 1 << 13,
    /** Direct message typing events. */
    DIRECT_MESSAGE_TYPING         = 1 << 14,
    /** Message content fields for message events. */
    MESSAGE_CONTENT               = 1 << 15,
    /** Guild scheduled event events. */
    GUILD_SCHEDULED_EVENTS        = 1 << 16,
    /** Auto Moderation rule create/update/delete events. */
    AUTO_MODERATION_CONFIGURATION = 1 << 20,
    /** Auto Moderation action execution events. */
    AUTO_MODERATION_EXECUTION     = 1 << 21,
    /** Guild poll vote events. */
    GUILD_MESSAGE_POLLS           = 1 << 24,
    /** Direct message poll vote events. */
    DIRECT_MESSAGE_POLLS          = 1 << 25,
}

export type IntentNames = keyof typeof Intents;
export type PrivilegedIntentNames = "GUILD_MEMBERS" | "GUILD_PRESENCES" | "MESSAGE_CONTENT";
// @TODO: find a way to make the above not manual, if possible

export const NonPrivilegedIntents = [
    Intents.GUILDS,
    Intents.GUILD_MODERATION,
    Intents.GUILD_EXPRESSIONS,
    Intents.GUILD_INTEGRATIONS,
    Intents.GUILD_WEBHOOKS,
    Intents.GUILD_INVITES,
    Intents.GUILD_VOICE_STATES,
    Intents.GUILD_MESSAGES,
    Intents.GUILD_MESSAGE_REACTIONS,
    Intents.GUILD_MESSAGE_TYPING,
    Intents.DIRECT_MESSAGES,
    Intents.DIRECT_MESSAGE_REACTIONS,
    Intents.DIRECT_MESSAGE_TYPING,
    Intents.GUILD_SCHEDULED_EVENTS,
    Intents.AUTO_MODERATION_CONFIGURATION,
    Intents.AUTO_MODERATION_EXECUTION,
    Intents.GUILD_MESSAGE_POLLS,
    Intents.DIRECT_MESSAGE_POLLS
] as const;
export const AllNonPrivilegedIntents = NonPrivilegedIntents.reduce((all, p) => all | p, 0);
export const PrivilegedIntents = [
    Intents.GUILD_MEMBERS,
    Intents.GUILD_PRESENCES,
    Intents.MESSAGE_CONTENT
] as const;
export const AllPrivilegedIntents = PrivilegedIntents.reduce((all, p) => all | p, 0);
export const AllIntents = AllNonPrivilegedIntents | AllPrivilegedIntents;

export const PrivilegedIntentMapping = [
    [Intents.GUILD_PRESENCES, [ApplicationFlags.GATEWAY_PRESENCE, ApplicationFlags.GATEWAY_PRESENCE_LIMITED]],
    [Intents.GUILD_MEMBERS, [ApplicationFlags.GATEWAY_GUILD_MEMBERS, ApplicationFlags.GATEWAY_GUILD_MEMBERS_LIMITED]],
    [Intents.MESSAGE_CONTENT, [ApplicationFlags.GATEWAY_MESSAGE_CONTENT, ApplicationFlags.GATEWAY_MESSAGE_CONTENT_LIMITED]]
] as Array<[intent: Intents, allowed: Array<ApplicationFlags>]>;

export enum GatewayOPCodes {
    /** An event was dispatched */
    DISPATCH                  = 0,
    /** Keep the WebSocket connection alive */
    HEARTBEAT                 = 1,
    /** Start a new session during the initial handshake */
    IDENTIFY                  = 2,
    /** Update the client's presence */
    PRESENCE_UPDATE           = 3,
    /** Join/leave or move between voice channels and calls */
    VOICE_STATE_UPDATE        = 4,
    /** Resume a previous session that was disconnected */
    RESUME                    = 6,
    /** You should attempt to reconnect and resume immediately */
    RECONNECT                 = 7,
    /** Request information about guild members */
    REQUEST_GUILD_MEMBERS     = 8,
    /** The session has been invalidated. You should reconnect and identify/resume accordingly */
    INVALID_SESSION           = 9,
    /** Sent immediately after connecting, contains the `heartbeat_interval` to use */
    HELLO                     = 10,
    /** Acknowledge a received heartbeat */
    HEARTBEAT_ACK             = 11,
    /** Request soundboard sounds for guilds */
    REQUEST_SOUNDBOARD_SOUNDS = 31,
    /** Request extra voice channel fields for a guild */
    REQUEST_CHANNEL_INFO      = 43,
}

export enum GatewayCloseCodes {
    /** We're not sure what went wrong. Try reconnecting? */
    UNKNOWN_ERROR         = 4000,
    /** You sent an invalid Gateway opcode or an invalid payload for an opcode. Don't do that! */
    UNKNOWN_OPCODE        = 4001,
    /** You sent an invalid payload. Don't do that! */
    DECODE_ERROR          = 4002,
    /** You sent us a payload prior to identifying, or this session has been invalidated */
    NOT_AUTHENTICATED     = 4003,
    /** The account token sent with your identify payload is incorrect */
    AUTHENTICATION_FAILED = 4004,
    /** You sent more than one identify payload. Don't do that! */
    ALREADY_AUTHENTICATED = 4005,
    /** The sequence sent when resuming the session was invalid. Reconnect and start a new session */
    INVALID_SEQUENCE      = 4007,
    /** Woah nelly! You're sending payloads too quickly. Slow it down! You will be disconnected on receiving this */
    RATE_LIMITED          = 4008,
    /** Your session timed out. Reconnect and start a new one */
    SESSION_TIMEOUT       = 4009,
    /** You sent us an invalid shard when identifying */
    INVALID_SHARD         = 4010,
    /** The session would have handled too many guilds—you are required to shard your connection in order to connect */
    SHARDING_REQUIRED     = 4011,
    /** You sent an invalid version for the Gateway */
    INVALID_API_VERSION   = 4012,
    /** You sent an invalid intent for a Gateway intent. You may have incorrectly calculated the bitwise value */
    INVALID_INTENTS       = 4013,
    /** You sent a disallowed intent for a Gateway intent. You may have tried to specify an intent that you have not enabled or are not approved for */
    DISALLOWED_INTENTS    = 4014,
}

export enum VoiceOPCodes {
    /** Start a new voice WebSocket connection */
    IDENTIFY            = 0,
    /** Select the voice protocol */
    SELECT_PROTOCOL     = 1,
    /** Complete the WebSocket handshake */
    READY               = 2,
    /** Keep the WebSocket connection alive */
    HEARTBEAT           = 3,
    /** Describe the session */
    SESSION_DESCRIPTION = 4,
    /** Indicate which users are speaking */
    SPEAKING            = 5,
    /** Acknowledge a received heartbeat */
    HEARTBEAT_ACK       = 6,
    /** Resume a previous session that was disconnected */
    RESUME              = 7,
    /** Sent immediately after connecting, contains the `heartbeat_interval` to use */
    HELLO               = 8,
    /** Response to acknowledging a successful resume */
    RESUMED             = 9,
    /** Indicate that clients have connected to the voice channel */
    CLIENTS_CONNECT     = 11,
    /** Indicate that a client has disconnected from the voice channel */
    CLIENT_DISCONNECT   = 13,
}

export enum VoiceCloseCodes {
    /** You sent an invalid opcode */
    UNKNOWN_OPCODE          = 4001,
    /** You sent a invalid payload in your identifying to the Gateway */
    DECODE_ERROR            = 4002,
    /** You sent a payload before identifying with the Gateway */
    NOT_AUTHENTICATED       = 4003,
    /** The token you sent in your identify payload is incorrect */
    AUTHENTICATION_FAILED   = 4004,
    /** You sent more than one identify payload. Stahp */
    ALREADY_AUTHENTICATED   = 4005,
    /** Your session is no longer valid */
    INVALID_SESSION         = 4006,
    /** Your session has timed out */
    SESSION_TIMEOUT         = 4009,
    /** We can't find the server you're trying to connect to */
    SERVER_NOT_FOUND        = 4011,
    /** We didn't recognize the protocol you sent */
    UNKNOWN_PROTOCOL        = 4012,
    /** Disconnect individual client (you were kicked, the main Gateway session was dropped, etc.). Should not reconnect */
    DISCONNECTED            = 4013,
    /** The server crashed. Our bad! Try resuming */
    VOICE_SERVER_CRASHED    = 4014,
    /** We didn't recognize your encryption */
    UNKNOWN_ENCRYPTION_MODE = 4015,
}

export enum HubTypes {
    /** Student hub is not categorized as a high school or post-secondary institution */
    DEFAULT     = 0,
    /** Student hub is for a high school */
    HIGH_SCHOOL = 1,
    /** Student hub is for a post-secondary institution (college or university) */
    COLLEGE     = 2,
}

export enum ActivityTypes {
    GAME        = 0,
    STREAMING   = 1,
    LISTENING   = 2,
    WATCHING    = 3,
    CUSTOM      = 4,
    COMPETING   = 5,
    HANG_STATUS = 6,
}

export enum ActivityFlags {
    /** Activity is an instanced game session (a match that will end) */
    INSTANCE                    = 1 << 0,
    /** Activity can be joined by other users */
    JOIN                        = 1 << 1,
    SPECTATE                    = 1 << 2,
    /** @deprecated Activity requires a request to join */
    JOIN_REQUEST                = 1 << 3,
    /** Activity can be synced */
    SYNC                        = 1 << 4,
    /** Activity can be played */
    PLAY                        = 1 << 5,
    PARTY_PRIVACY_FRIENDS_ONLY  = 1 << 6,
    /** Activity's party can be joined by users in the same voice channel */
    PARTY_PRIVACY_VOICE_CHANNEL = 1 << 7,
    /** Activity is embedded within the Discord client */
    EMBEDDED                    = 1 << 8,
}

export enum ThreadMemberFlags {
    /** User has interacted with the thread */
    HAS_INTERACTED = 1 << 0,
    /** User receives notifications for all messages */
    ALL_MESSAGES   = 1 << 1,
    /** User receives notifications only for messages that @mention them */
    ONLY_MENTIONS  = 1 << 2,
    /** User does not receive any notifications */
    NO_MESSAGES    = 1 << 3,
}

export enum RoleConnectionMetadataTypes {
    /** The metadata value (`integer`) is less than or equal to the guild's configured value (`integer`) */
    INTEGER_LESS_THAN_OR_EQUAL     = 1,
    /** The metadata value (`integer`) is greater than or equal to the guild's configured value (`integer`) */
    INTEGER_GREATER_THAN_OR_EQUAL  = 2,
    /** The metadata value (`integer`) is equal to the guild's configured value (`integer`) */
    INTEGER_EQUAL                  = 3,
    /** The metadata value (`integer`) is not equal to the guild's configured value (`integer`) */
    INTEGER_NOT_EQUAL              = 4,
    /** The metadata value (`ISO8601 string`) is less than or equal to the guild's configured value (`integer`; `days before current date`) */
    DATETIME_LESS_THAN_OR_EQUAL    = 5,
    /** The metadata value (`ISO8601 string`) is greater than or equal to the guild's configured value (`integer`; `days before current date`) */
    DATETIME_GREATER_THAN_OR_EQUAL = 6,
    /** The metadata value (`integer`) is equal to the guild's configured value (`integer`; `1`) */
    BOOLEAN_EQUAL                  = 7,
    /** The metadata value (`integer`) is not equal to the guild's configured value (`integer`; `1`) */
    BOOLEAN_NOT_EQUAL              = 8,
}

export enum GuildMemberFlags {
    /** Guild member has left and rejoined the guild */
    DID_REJOIN                                     = 1 << 0,
    /** Guild member has completed onboarding */
    COMPLETED_ONBOARDING                           = 1 << 1,
    /** Guild member bypasses guild verification requirements and member verification */
    BYPASSES_VERIFICATION                          = 1 << 2,
    /** Guild member has started onboarding */
    STARTED_ONBOARDING                             = 1 << 3,
    /** Guild member is a guest and not a true member */
    IS_GUEST                                       = 1 << 4,
    /** Guild member has started the new member actions in the server guide */
    STARTED_HOME_ACTIONS                           = 1 << 5,
    /** Guild member has completed all of the new member actions in the server guide */
    COMPLETED_HOME_ACTIONS                         = 1 << 6,
    AUTOMOD_QUARANTINED_USERNAME_OR_GUILD_NICKNAME = 1 << 7,
    /** @deprecated Guild member has been indefinitely quarantined by an AutoMod Rule for their bio */
    AUTOMOD_QUARANTINED_BIO                        = 1 << 8,
    /** Guild member has acknowledged the DM privacy settings upsell modal */
    DM_SETTINGS_UPSELL_ACKNOWLEDGED                = 1 << 9,
    AUTOMOD_QUARANTINED_CLAN_TAG                   = 1 << 10,
}

export enum OnboardingPromptTypes {
    /** Prompt offers multiple options to select from */
    MULTIPLE_CHOICE = 0,
    /** Prompt offers a dropdown menu to select from */
    DROPDOWN        = 1,
}

export enum AnimationTypes {
    /** Premium animation type. */
    PREMIUM = 0,
    /** Basic animation type. */
    BASIC   = 1,
}

export enum OnboardingModes {
    DEFAULT  = 0,
    ADVANCED = 1,
}

export enum InviteFlags {
    /** Invite grants one-time access to a voice channel in the guild */
    IS_GUEST_INVITE = 1 << 0,
}

export enum ReactionType {
    /** A normal reaction */
    NORMAL = 0,
    SUPER  = 1,
}

export enum AttachmentFlags {
    /** Attachment is a clipped recording of a stream */
    IS_CLIP                 = 1 << 0,
    /** Attachment is a thumbnail */
    IS_THUMBNAIL            = 1 << 1,
    /** Attachment has been remixed */
    IS_REMIX                = 1 << 2,
    /** Attachment is a spoiler */
    IS_SPOILER              = 1 << 3,
    /** Attachment was flagged as sensitive content */
    CONTAINS_EXPLICIT_MEDIA = 1 << 4,
    /** Attachment is an animated image */
    IS_ANIMATED             = 1 << 5,
}

export enum SKUTypes {
    /** Primary durable item */
    DURABLE_PRIMARY    = 1,
    /** Durable item */
    DURABLE            = 2,
    /** Consumable item */
    CONSUMABLE         = 3,
    /** Bundle of items */
    BUNDLE             = 4,
    /** Subscription item */
    SUBSCRIPTION       = 5,
    /** Group of subscription items */
    SUBSCRIPTION_GROUP = 6,
}

export enum SKUFlags {
    /** SKU is available for free to premium users */
    PREMIUM_PURCHASE                   = 1 << 0,
    /** SKU has free content for premium users */
    HAS_FREE_PREMIUM_CONTENT           = 1 << 1,
    /** SKU is available for purchase */
    AVAILABLE                          = 1 << 2,
    /** SKU is available for free to premium users and purchasable normally */
    PREMIUM_AND_DISTRIBUTION           = 1 << 3,
    STICKER_PACK                       = 1 << 4,
    /** SKU is a guild role subscription or ticketed event */
    GUILD_ROLE                         = 1 << 5,
    /** SKU is a giftable Discord premium subscription */
    AVAILABLE_FOR_SUBSCRIPTION_GIFTING = 1 << 6,
    /** SKU is an application subscription for guilds */
    APPLICATION_GUILD_SUBSCRIPTION     = 1 << 7,
    GUILD_SUBSCRIPTION                 = 1 << 7,
    /** SKU is an application subscription for users */
    APPLICATION_USER_SUBSCRIPTION      = 1 << 8,
    USER_SUBSCRIPTION                  = 1 << 8,
}

export enum EntitlementTypes {
    /** Entitlement was purchased by a user */
    PURCHASE                 = 1,
    /** Entitlement is for a premium (Nitro) subscription */
    PREMIUM_SUBSCRIPTION     = 2,
    /** Entitlement was gifted by a developer */
    DEVELOPER_GIFT           = 3,
    /** Entitlement was purchased by a developer in application test mode */
    TEST_MODE_PURCHASE       = 4,
    /** Entitlement was granted when the SKU was free */
    FREE_PURCHASE            = 5,
    /** Entitlement was gifted by another user */
    USER_GIFT                = 6,
    /** Entitlement was claimed for free via a premium subscription */
    PREMIUM_PURCHASE         = 7,
    /** Entitlement is for an application subscription */
    APPLICATION_SUBSCRIPTION = 8,
}

export enum EntitlementOwnerTypes {
    /** Entitlement is for a guild */
    GUILD = 1,
    /** Entitlement is for a user */
    USER  = 2,
}

export enum SKUAccessTypes {
    PUBLIC = 1,
}

export enum SubscriptionStatuses {
    /** Subscription is active */
    ACTIVE   = 0,
    INACTIVE = 1,
    ENDING   = 2,
}

export enum PollLayoutType {
    /** The default layout type */
    DEFAULT = 1,
}

export enum ApplicationMonetizationState {
    /** This application does not have monetization set up */
    NONE    = 1,
    /** This application has monetization set up */
    ENABLED = 2,
    /** This application has been blocked from monetizing */
    BLOCKED = 3,
}

export enum ApplicationDiscoverabilityState {
    /** This application is ineligible for the application directory */
    INELIGIBLE       = 1,
    /** This application is not listed in the application directory */
    NOT_DISCOVERABLE = 2,
    /** This application is listed in the application directory */
    DISCOVERABLE     = 3,
    FEATURABLE       = 4,
    /** This application has been blocked from appearing in the application directory */
    BLOCKED          = 5,
}

export enum ApplicationDiscoveryEligibilityFlags {
    /** Application is verified */
    VERIFIED                = 1 << 0,
    /** Application has at least one tag set */
    TAG                     = 1 << 1,
    /** Application has a description */
    DESCRIPTION             = 1 << 2,
    /** Application has terms of service set */
    TERMS_OF_SERVICE        = 1 << 3,
    /** Application has a privacy policy set */
    PRIVACY_POLICY          = 1 << 4,
    /** Application has a custom install URL or install parameters */
    INSTALL_PARAMS          = 1 << 5,
    /** Application's name is safe for work */
    SAFE_NAME               = 1 << 6,
    /** Application's description is safe for work */
    SAFE_DESCRIPTION        = 1 << 7,
    /** Application has the message content intent approved or utilizes application commands */
    APPROVED_COMMANDS       = 1 << 8,
    /** Application has a support guild set */
    SUPPORT_GUILD           = 1 << 9,
    /** Application's commands are safe for work */
    SAFE_COMMANDS           = 1 << 10,
    /** Application's owner has MFA enabled */
    MFA                     = 1 << 11,
    /** Application's directory long description is safe for work */
    SAFE_DIRECTORY_OVERVIEW = 1 << 12,
    /** Application has at least one supported locale set */
    SUPPORTED_LOCALES       = 1 << 13,
    /** Application's directory short description is safe for work */
    SAFE_SHORT_DESCRIPTION  = 1 << 14,
    /** Application's role connections metadata is safe for work */
    SAFE_ROLE_CONNECTIONS   = 1 << 15,
}

export enum ApplicationExplicitContentFilterLevel {
    DISABLED = 0,
    ENABLED  = 1,
}

export enum ApplicationInteractionsVersion {
    /** Only Interaction Create events are sent as documented (default) */
    VERSION_1 = 1,
    /** A selection of chosen events are sent */
    VERSION_2 = 2,
}

export enum ApplicationMonetizationEligibilityFlags {
    /** Application is verified */
    VERIFIED                    = 1 << 0,
    /** Application is owned by a team */
    HAS_TEAM                    = 1 << 1,
    /** Application has the message content intent approved or utilizes application commands */
    APPROVED_COMMANDS           = 1 << 2,
    /** Application has terms of service set */
    TERMS_OF_SERVICE            = 1 << 3,
    /** Application has a privacy policy set */
    PRIVACY_POLICY              = 1 << 4,
    /** Application's name is safe for work */
    SAFE_NAME                   = 1 << 5,
    /** Application's description is safe for work */
    SAFE_DESCRIPTION            = 1 << 6,
    /** Application's role connections metadata is safe for work */
    SAFE_ROLE_CONNECTIONS       = 1 << 7,
    /** Application is not quarantined */
    NOT_QUARANTINED             = 1 << 9,
    /** User's locale is supported by monetization */
    USER_LOCALE_SUPPORTED       = 1 << 10,
    /** User is old enough to use monetization */
    USER_AGE_SUPPORTED          = 1 << 11,
    /** User has a date of birth defined on their account */
    USER_DATE_OF_BIRTH_DEFINED  = 1 << 12,
    /** User has MFA enabled */
    USER_MFA_ENABLED            = 1 << 13,
    /** User's email is verified */
    USER_EMAIL_VERIFIED         = 1 << 14,
    /** All members of the team that owns the application have verified emails */
    TEAM_MEMBERS_EMAIL_VERIFIED = 1 << 15,
    /** All members of the team that owns the application have MFA enabled */
    TEAM_MEMBERS_MFA_ENABLED    = 1 << 16,
    /** This application has no issues blocking monetization */
    NO_BLOCKING_ISSUES          = 1 << 17,
    /** Owning team has a valid payout status */
    VALID_PAYOUT_STATUS         = 1 << 18,
}

export enum RPCApplicationState {
    /** This application does not have access to RPC */
    DISABLED    = 0,
    /** This application has not yet been applied for RPC access */
    UNSUBMITTED = 1,
    /** This application has submitted a RPC access request */
    SUBMITTED   = 2,
    /** This application has been approved for RPC access */
    APPROVED    = 3,
    /** This application has been rejected from RPC access */
    REJECTED    = 4,
}

export enum StoreApplicationState {
    /** This application does not have a commerce license */
    NONE      = 1,
    /** This application has a commerce license but has not yet submitted a store approval request */
    PAID      = 2,
    /** This application has submitted a store approval request */
    SUBMITTED = 3,
    /** This application has been approved for the store */
    APPROVED  = 4,
    /** This application has been rejected from the store */
    REJECTED  = 5,
}

export enum ApplicationVerificationState {
    /** This application is ineligible for verification */
    INELIGIBLE  = 1,
    /** This application has not yet been applied for verification */
    UNSUBMITTED = 2,
    /** This application has submitted a verification request */
    SUBMITTED   = 3,
    SUCCEEDED   = 4,
}

export enum RoleFlags {
    /** Role is part of an onboarding prompt option */
    IN_PROMPT = 1 << 0,
}

export enum MemberSearchSortType {
    /** Sort by when the user joined the guild descending (default) */
    JOINED_AT_DESC  = 1,
    /** Sort by when the user joined the guild ascending */
    JOINED_AT_ASC   = 2,
    /** Sort by when the user joined Discord descending */
    USER_ID_DESC    = 3,
    /** Sort by when the user joined Discord ascending */
    USER_ID_ASC     = 4,
}

export enum MemberJoinSourceType {
    /** The user joined the guild through an unknown source */
    UNSPECIFIED                = 0,
    /** The user was added to the guild by a bot using the `guilds.join` OAuth2 scope */
    BOT                        = 1,
    /** The user was added to the guild by an integration (e.g. Twitch) */
    INTEGRATION                = 2,
    /** The user joined the guild through guild discovery */
    DISCOVERY                  = 3,
    /** The user joined the guild through a student hub */
    HUB                        = 4,
    /** The user joined the guild through an invite */
    INVITE                     = 5,
    /** The user joined the guild through a vanity URL */
    VANITY_URL                 = 6,
    /** The user was accepted into the guild after applying for membership */
    MANUAL_MEMBER_VERIFICATION = 7,
}

export enum ActivityLocationKind {
    GUILD_CHANNEL   = "gc",
    PRIVATE_CHANNEL = "pc",
}

export enum ApplicationEventWebhookStatus {
    /** Event webhooks are disabled */
    DISABLED            = 1,
    /** Event webhooks are enabled */
    ENABLED             = 2,
    DISABLED_BY_DISCORD = 3,
}

export const ApplicationEventWebhookEventTypes = [
    "APPLICATION_AUTHORIZED",
    "APPLICATION_DEAUTHORIZED",
    "ENTITLEMENT_CREATE",
    "QUEST_USER_ENROLLMENT"
] as const;
export type ApplicationEventWebhookEventType = typeof ApplicationEventWebhookEventTypes[number];

export enum EmbedFlags {
    /** Embed was flagged as sensitive content */
    CONTAINS_EXPLICIT_MEDIA    = 1 << 4,
    IS_CONTENT_INVENTORY_ENTRY = 1 << 5,
}

export enum EmbedMediaFlags {
    IS_ANIMATED = 1 << 5,
}

export enum SeparatorSpacingSize {
    /** 8px gap between elements, 16px with divider hidden */
    SMALL = 1,
    /** 16px gap between elements, 32px with divider hidden */
    LARGE = 2,
}

export enum DisplayNameFont {
    /** Bangers */
    BANGERS       = 1,
    /** BioRhyme */
    BIO_RHYME     = 2,
    /** Cherry Bomb One */
    CHERRY_BOMB   = 3,
    /** Chicle */
    CHICLE        = 4,
    /** Compagnon */
    COMPAGNON     = 5,
    /** MuseoModerno */
    MUSEO_MODERNO = 6,
    /** Néo-Castel */
    NEO_CASTEL    = 7,
    PIXELFY       = 8,
    /** Ribes */
    RIBES         = 9,
    /** Sinistre */
    SINISTRE      = 10,
    /** Default font */
    DEFAULT       = 11,
    /** Zilla Slab */
    ZILLA_SLAB    = 12,
}

export enum DisplayNameEffect {
    /** Displays the first color provided */
    SOLID    = 1,
    /** Two color gradient */
    GRADIENT = 2,
    /** Glow around the name */
    NEON     = 3,
    /** Subtle vertical gradient and stroke */
    TOON     = 4,
    /** Colored dropshadow */
    POP      = 5,
    /** Alternate gradient style */
    GLOW     = 6,
}

export enum InviteTargetUsersJobStatus {
    /** Job status is unspecified */
    UNSPECIFIED = 0,
    /** Job is currently being processed */
    PROCESSING  = 1,
    /** Job has been completed */
    COMPLETED   = 2,
    /** Job has failed (see `error_message`) */
    FAILED      = 3,
}

export enum ApplicationInternalGuildRestriction {
    JOIN_ALL           = 1,
    JOIN_EXTERNAL_ONLY = 2,
    JOIN_INTERNAL_ONLY = 3,
}

export enum EmbeddedActivityOrientationLockStateType {
    /** Unrestricted orientation */
    UNLOCKED  = 1,
    /** Portrait only */
    PORTRAIT  = 2,
    /** Landscape only */
    LANDSCAPE = 3,
}

export enum EmbeddedActivityLabelType {
    /** No special label */
    NONE    = 0,
    /** The activity is new */
    NEW     = 1,
    /** The activity has been recently updated */
    UPDATED = 2,
}

export const EmbeddedActivityReleasePhases = ["in_development", "activities_team", "employee_release", "soft_launch", "soft_launch_multi_geo", "global_launch"] as const;
export type EmbeddedActivityReleasePhase = typeof EmbeddedActivityReleasePhases[number];
export const EmbeddedActivitySurfaces = ["voice_launcher", "text_launcher"] as const;
export type EmbeddedActivitySurface = typeof EmbeddedActivitySurfaces[number];
export const EmbeddedActivityPlatformTypes = ["web", "android", "ios"] as const;
export type EmbeddedActivityPlatformType = typeof EmbeddedActivityPlatformTypes[number];
export const PricingLocalizationStrategies = ["localized_price_sets"] as const;
export type PricingLocalizationStrategy = typeof PricingLocalizationStrategies[number];
export const OperatingSystemTypes = ["windows", "osx", "linux", "android", "ios", "playstation", "xbox", "unknown"] as const;
export type OperatingSystemType = typeof OperatingSystemTypes[number];
export const TeamMemberRoleTypes = ["admin", "developer", "read_only"] as const;
export type TeamMemberRoleType = typeof TeamMemberRoleTypes[number];

export enum ApprovableConsoleType {
    /** Xbox */
    XBOX          = 1,
    /** PlayStation */
    PLAYSTATION_5 = 2,
    /** PlayStation */
    PLAYSTATION_4 = 3,
}

export enum OverlayMethodFlags {
    /** Overlay can be rendered out of process */
    OUT_OF_PROCESS = 1 << 0,
}

export enum TeamPayoutAccountStatus {
    /** Team has not submitted a payout account application */
    UNSUBMITTED     = 1,
    /** Team's payout account application is pending approval */
    PENDING         = 2,
    /** Team's payout account requires action to receive payouts */
    ACTION_REQUIRED = 3,
    /** Team's payout account is active and can receive payouts */
    ACTIVE          = 4,
    /** Team's payout account is blocked and cannot receive payouts */
    BLOCKED         = 5,
    /** Team's payout account is suspended and cannot receive payouts */
    SUSPENDED       = 6,
}

export enum TeamPayoutGateway {
    /** Stripe Top-Up */
    STRIPE_TOPUP   = 1,
    /** Tipalti */
    TIPALTI        = 2,
    /** Stripe */
    STRIPE_PRIMARY = 3,
}

export enum ApplicationType {
    /** A game integrating with Discord through the legacy GameSDK or sold on the defunct game store */
    DEPRECATED_GAME      = 1,
    /** @deprecated A music service integrating with Discord */
    MUSIC                = 2,
    /** A limited application used for ticketed event SKUs */
    TICKETED_EVENTS      = 3,
    /** A limited application used for creator monetization (e.g. role subscription) SKUs */
    CREATOR_MONETIZATION = 4,
    /** A game integrating with Discord */
    GAME                 = 5,
}

export enum LobbyMemberFlags {
    CAN_LINK_LOBBY = 1 << 0,
}

export enum MessageReferenceType {
    /** A standard reference used by replies and system messages */
    DEFAULT = 0,
    /** A reference used to point to a message at a point in time */
    FORWARD = 1,
}

export enum StatusDisplayType {
    /** Display the `name` field */
    NAME = 0,
    /** Display the `state` field */
    STATE = 1,
    /** Display the `details` field */
    DETAILS = 2,
}

// entries are intentionally not aligned
/** The error codes that can be received. See [Discord's Documentation](https://discord.com/developers/docs/topics/opcodes-and-status-codes#json). */
export enum JSONErrorCodes {
    GENERAL_ERROR = 0,
    UNKNOWN_ACCOUNT = 10_001,
    UNKNOWN_APPLICATION = 10_002,
    UNKNOWN_CHANNEL = 10_003,
    UNKNOWN_GUILD = 10_004,
    UNKNOWN_INTEGRATION = 10_005,
    UNKNOWN_INVITE = 10_006,
    UNKNOWN_MEMBER = 10_007,
    UNKNOWN_MESSAGE = 10_008,
    UNKNOWN_OVERWRITE = 10_009,
    UNKNOWN_PROVIDER = 10_010,
    UNKNOWN_PLATFORM = 10_010,
    UNKNOWN_ROLE = 10_011,
    UNKNOWN_TOKEN = 10_012,
    UNKNOWN_USER = 10_013,
    UNKNOWN_EMOJI = 10_014,
    UNKNOWN_WEBHOOK = 10_015,
    UNKNOWN_WEBHOOK_SERVICE = 10_016,
    UNKNOWN_SESSION = 10_020,
    UNKNOWN_ASSET = 10_021,
    UNKNOWN_BAN = 10_026,
    UNKNOWN_SKU = 10_027,
    UNKNOWN_STORE_LISTING = 10_028,
    UNKNOWN_ENTITLEMENT = 10_029,
    UNKNOWN_BUILD = 10_030,
    UNKNOWN_LOBBY = 10_031,
    UNKNOWN_BRANCH = 10_032,
    UNKNOWN_STORE_DIRECTORY_LAYOUT = 10_036,
    UNKNOWN_REDISTRIBUTABLE = 10_037,
    UNKNOWN_GIFT_CODE = 10_038,
    UNKNOWN_STREAM = 10_049,
    UNKNOWN_PREMIUM_SERVER_SUBSCRIBE_COOLDOWN = 10_050,
    UNKNOWN_GUILD_TEMPLATE = 10_057,
    UNKNOWN_DISCOVERABLE_SERVER_CATEGORY = 10_059,
    UNKNOWN_STICKER = 10_060,
    UNKNOWN_INTERACTION = 10_062,
    UNKNOWN_APPLICATION_COMMAND = 10_063,
    UNKNOWN_APPLICATION_COMMAND_PERMISSIONS = 10_066,
    UNKNOWN_STAGE_INSTANCE = 10_067,
    UNKNOWN_GUILD_MEMBER_VERIFICATION_FORM = 10_068,
    UNKNOWN_GUILD_WELCOME_SCREEN = 10_069,
    UNKNOWN_GUILD_SCHEDULED_EVENT = 10_070,
    UNKNOWN_GUILD_SCHEDULED_EVENT_USER = 10_071,
    UNKNOWN_TAG = 10_087,
    UNKNOWN_SOUND = 10_097,
    BOT_DISALLOWED = 20_001,
    BOTS_CANNOT_USE_THIS_ENDPOINT = 20_001,
    BOT_REQUIRED = 20_002,
    ONLY_BOTS_CAN_USE_THIS_ENDPOINT = 20_002,
    RPC_PROXY_DISALLOWED = 20_003,
    EXPLICIT_CONTENT = 20_009,
    ACCOUNT_SCHEDULED_FOR_DELETION = 20_011,
    NOT_AUTHORIZED_FOR_APPLICATION = 20_012,
    ACCOUNT_DISABLED = 20_013,
    SLOWMODE_RATE_LIMITED = 20_016,
    ACCOUNT_OWNER_ONLY = 20_018,
    CHANNEL_FOLLOWING_EDIT_RATE_LIMITED = 20_022,
    UNDER_MINIMUM_AGE = 20_024,
    QUARANTINED = 20_026,
    CHANNEL_WRITE_RATE_LIMIT = 20_028,
    GUILD_WRITE_RATE_LIMIT = 20_029,
    WORDS_NOT_ALLOWED = 20_031,
    VANITY_URL_REQUIRED_FOR_PUBLISHED_GUILDS = 20_040,
    VANITY_URL_EMPLOYEE_ONLY_GUILD_DISABLED = 20_044,
    VANITY_URL_REQUIREMENTS_NOT_MET = 20_045,
    TOO_MANY_GUILDS = 30_001,
    TOO_MANY_FRIENDS = 30_002,
    TOO_MANY_PINS_IN_CHANNEL = 30_003,
    TOO_MANY_RECIPIENTS = 30_004,
    TOO_MANY_GUILD_ROLES = 30_005,
    TOO_MANY_USING_USERNAME = 30_006,
    TOO_MANY_WEBHOOKS = 30_007,
    TOO_MANY_EMOJI = 30_008,
    TOO_MANY_REACTIONS = 30_010,
    TOO_MANY_GROUP_CHANNELS = 30_011,
    TOO_MANY_CHANNELS = 30_013,
    TOO_MANY_ATTACHMENTS = 30_015,
    TOO_MANY_INVITES = 30_016,
    TOO_MANY_ANIMATED_EMOJI = 30_018,
    GUILD_AT_CAPACITY = 30_019,
    NOT_ENOUGH_GUILD_MEMBERS = 30_029,
    TOO_MANY_SERVER_CATEGORIES = 30_030,
    GUILD_ALREADY_HAS_TEMPLATE = 30_031,
    TOO_MANY_APPLICATION_COMMANDS = 30_032,
    TOO_MANY_THREAD_MEMBERS = 30_033,
    TOO_MANY_APPLICATION_COMMAND_CREATES = 30_034,
    TOO_MANY_BANS_FOR_NON_GUILD_MEMBERS = 30_035,
    TOO_MANY_BAN_FETCHES = 30_037,
    TOO_MANY_UNCOMPLETED_GUILD_SCHEDULED_EVENTS = 30_038,
    TOO_MANY_STICKERS = 30_039,
    TOO_MANY_PRUNE_REQUESTS = 30_040,
    TOO_MANY_GUILD_WIDGET_SETTINGS_UPDATES = 30_042,
    TOO_MANY_SOUNDBOARD_SOUNDS = 30_045,
    MAXIMUM_NUMBER_OR_EDITS_TO_MESSAGES_OLDER_THAN_1_HOUR = 30_046,
    TOO_MANY_PINNED_THREADS = 30_047,
    TOO_MANY_FORUM_TAGS = 30_048,
    BITRATE_TOO_HIGH = 30_052,
    TOO_MANY_PREMIUM_EMOJIS = 30_056,
    TOO_MANY_GUILD_WEBHOOKS = 30_058,
    TOO_MANY_BLOCKED_USERS = 30_059,
    TOO_MANY_PUBLISHED_PRODUCT_LISTINGS = 30_065,
    RESOURCE_RATE_LIMITED = 31_002,
    UNAUTHORIZED = 40_001,
    EMAIL_VERIFICATION_REQUIRED = 40_002,
    RATE_LIMIT_DM_OPEN = 40_003,
    DIRECT_MESSAGES_RATE_LIMIT = 40_003,
    SENDING_MESSAGES_TEMPORARILY_DISABLED = 40_004,
    ENTITY_TOO_LARGE = 40_005,
    REQUEST_ENTITY_TOO_LARGE = 40_005,
    ENTITY_EMPTY = 40_006,
    FEATURE_TEMPORARILY_DISABLED = 40_006,
    USER_BANNED = 40_007,
    CONNECTION_REVOKED = 40_012,
    DELETE_ACCOUNT_TRANSFER_TEAM_OWNERSHIP = 40_028,
    TARGET_USER_NOT_CONNECTED_TO_VOICE = 40_032,
    ALREADY_CROSSPOSTED = 40_033,
    APPLICATION_COMMAND_ALREADY_EXISTS = 40_041,
    INTERACTION_FAILED_TO_SEND = 40_043,
    CANNOT_SEND_MESSAGES_IN_FORUM_CHANNEL = 40_058,
    INTERACTION_ALREADY_ACKNOWLEDGED = 40_060,
    TAG_NAMES_MUST_BE_UNIQUE = 40_061,
    SERVICE_RESOURCE_RATE_LIMITED = 40_062,
    NON_MODERATED_TAG_REQUIRED = 40_066,
    TAG_REQUIRED = 40_067,
    USER_QUARANTINED = 40_068,
    INVITES_DISABLED = 40_069,
    ENTITLEMENT_ALREADY_GRANTED = 40_074,
    CLOUDFLARE_BLOCKING_REQUEST = 40_333,
    INVALID_ACCESS = 50_001,
    MISSING_ACCESS = 50_001,
    INVALID_ACCOUNT_TYPE = 50_002,
    INVALID_ACTION_DM = 50_003,
    INVALID_EMBED_DISABLED = 50_004,
    INVALID_MESSAGE_AUTHOR = 50_005,
    INVALID_MESSAGE_EMPTY = 50_006,
    INVALID_MESSAGE_SEND_USER = 50_007,
    INVALID_MESSAGE_SEND_NON_TEXT = 50_008,
    INVALID_MESSAGE_VERIFICATION_LEVEL = 50_009,
    INVALID_OAUTH_APP_BOT = 50_010,
    INVALID_OAUTH_APP_LIMIT = 50_011,
    INVALID_OAUTH_STATE = 50_012,
    INVALID_PERMISSIONS = 50_013,
    INVALID_TOKEN = 50_014,
    INVALID_NOTE = 50_015,
    INVALID_BULK_DELETE_COUNT = 50_016,
    INVALID_MFA_LEVEL = 50_017,
    INVALID_PASSWORD = 50_018,
    INVALID_PIN_MESSAGE_CHANNEL = 50_019,
    INVALID_INVITE_CODE = 50_020,
    CANNOT_EXECUTE_ON_SYSTEM_MESSAGE = 50_021,
    INVALID_PHONE_NUMBER = 50_022,
    INVALID_CLIENT_ID = 50_023,
    INVALID_CHANNEL_TYPE = 50_024,
    INVALID_OAUTH2_ACCESS_TOKEN = 50_025,
    INVALID_OAUTH2_MISSING_SCOPE = 50_026,
    INVALID_WEBHOOK_TOKEN = 50_027,
    INVALID_ROLE = 50_028,
    INVALID_RECIPIENTS = 50_033,
    BULK_DELETE_MESSAGE_TOO_OLD = 50_034,
    INVALID_FORM_BODY = 50_035,
    INVITE_ACCEPTED_TO_GUILD_NOT_CONTAINING_BOT = 50_036,
    INVALID_ACTIVITY_ACTION = 500_039,
    INVALID_API_VERSION = 50_041,
    INVALID_FILE_ASSET_SIZE = 50_045,
    INVALID_FILE_ASSET = 50_046,
    INVALID_GIFT_REDEMPTION_EXHAUSTED = 50_050,
    INVALID_GIFT_REDEMPTION_OWNED = 50_051,
    INVALID_GIFT_SELF_REDEMPTION = 50_054,
    INVALID_GUILD = 50_055,
    INVALID_REQUEST_ORIGIN = 50_067,
    INVALID_MESSAGE_TYPE = 50_068,
    PAYMENT_SOURCE_REQUIRED = 50_070,
    CANNOT_MODIFY_SYSTEM_WEBHOOK = 50_073,
    CANNOT_DELETE_COMMUNITY_REQUIRED_CHANNEL = 50_074,
    CANNOT_EDIT_MESSAGE_STICKERS = 50_080,
    INVALID_STICKER_SENT = 50_081,
    THREAD_ARCHIVED = 50_083,
    INVALID_THREAD_NOTIFICATION_SETTINGS = 50_084,
    BEFORE_EARLIER_THAN_THREAD_CREATION_DATE = 50_085,
    COMMUNITY_CHANNELS_MUST_BE_TEXT = 50_086,
    INVALID_COUNTRY_CODE = 50_095,
    INVALID_CANNOT_FRIEND_SELF = 50_096,
    INVALID_GIFT_REDEMPTION_FRAUD_REJECTED = 50_097,
    MONETIZATION_REQUIRED = 50_097,
    BOOSTS_REQUIRED = 50_101,
    INVALID_USER_SETTINGS_DATA = 50_105,
    INVALID_ACTIVITY_LAUNCH_NO_ACCESS = 50_106,
    INVALID_ACTIVITY_LAUNCH_PREMIUM_TIER = 50_107,
    INVALID_ACTIVITY_LAUNCH_CONCURRENT_ACTIVITIES = 50_108,
    INVALID_JSON = 50_109,
    INVALID_PROVIDED_FILE = 50_110,
    INVALID_PROVIDED_FILE_TYPE = 50_123,
    INVALID_PROVIDED_FILE_DURATION = 50_124,
    OWNER_CANNOT_BE_PENDING_MEMBER = 50_131,
    OWNERSHIP_CANNOT_BE_TRANSFERRED_TO_BOT = 50_132,
    INVALID_FILE_ASSET_SIZE_RESIZE_GIF = 50_138,
    CANNOT_MIX_SUBSCRIPTION_AND_NON_SUBSCRIPTION_ROLES = 50_144,
    CANNOT_CONVERT_BETWEEN_PREMIUM_AND_NORMAL_EMOJI = 50_145,
    UPLOADED_FILE_NOT_FOUND = 50_146,
    INVALID_SPECIFIED_EMOJI = 50_151,
    INVALID_ACTIVITY_LAUNCH_AFK_CHANNEL = 50_148,
    VOICE_MESSAGES_DO_NOT_SUPPORT_ADDITIONAL_CONTENT = 50_159,
    VOICE_MESSAGES_MUST_HAVE_A_SINGLE_AUDIO_ATTACHMENT = 50_160,
    VOICE_MESSAGES_MUST_HAVE_SUPPORTING_METADATA = 50_161,
    VOICE_MESSAGES_CANNOT_BE_EDITED = 50_162,
    CANNOT_DELETE_GUILD_SUBSCRIPTION_INTEGRATION = 50_163,
    NEW_OWNER_INELIGIBLE_FOR_SERVER_SUBSCRIPTION = 50_164,
    INVALID_ACTIVITY_LAUNCH_AGE_GATED = 50_165,
    CANNOT_SEND_VOICE_MESSAGES_IN_CHANNEL = 50_173,
    USER_MUST_FIRST_BE_VERIFIED = 50_178,
    PROVIDED_FILE_HAS_INVALID_DURATION = 50_192,
    INVALID_SKU_ATTACHMENT_NO_ARCHIVES = 50_186,
    NO_PERMISSION_TO_SEND_STICKER = 50_600,
    MFA_ENABLED = 60_001,
    MFA_DISABLED = 60_002,
    MFA_REQUIRED = 60_003,
    MFA_UNVERIFIED = 60_004,
    MFA_INVALID_SECRET = 60_005,
    MFA_INVALID_TICKET = 60_006,
    MFA_INVALID_CODE = 60_008,
    MFA_INVALID_SESSION = 60_009,
    PHONE_NUMBER_UNABLE_TO_SEND = 70_003,
    PHONE_VERIFICATION_REQUIRED = 70_007,
    RELATIONSHIP_INCOMING_DISABLED = 80_000,
    RELATIONSHIP_INCOMING_BLOCKED = 80_001,
    RELATIONSHIP_INVALID_USER_BOT = 80_002,
    RELATIONSHIP_INVALID_SELF = 80_003,
    RELATIONSHIP_INVALID_DISCORD_TAG = 80_004,
    RELATIONSHIP_ALREADY_FRIENDS = 80_007,
    REACTION_BLOCKED = 90_001,
    USER_CANNOT_USE_BURST_REACTIONS = 90_002,
    INVALID_GIFT_REDEMPTION_SUBSCRIPTION_MANAGED = 100_021,
    INVALID_GIFT_REDEMPTION_SUBSCRIPTION_INCOMPATIBLE = 100_023,
    INVALID_GIFT_REDEMPTION_INVOICE_OPEN = 100_024,
    INELIGIBLE_FOR_SUBSCRIPTION = 100_053,
    BILLING_NON_REFUNDABLE_PAYMENT_SOURCE = 100_060,
    INDEX_NOT_YET_AVAILABLE = 110_000,
    APPLICATION_NOT_AVAILABLE = 110_001,
    LISTING_ALREADY_JOINED = 120_000,
    LISTING_TOO_MANY_MEMBERS = 120_001,
    LISTING_JOIN_BLOCKED = 120_002,
    API_RESOURCE_IS_CURRENTLY_OVERLOADED = 130_000,
    STAGE_ALREADY_OPEN = 150_006,
    CANNOT_REPLY_WITHOUT_READ_MESSAGE_HISTORY = 160_002,
    THREAD_ALREADY_CREATED_FOR_MESSAGE = 160_004,
    THREAD_IS_LOCKED = 160_005,
    TOO_MANY_THREADS = 160_006,
    TOO_MANY_ANNOUNCEMENT_THREADS = 160_007,
    INVALID_LOTTIE_JSON = 170_001,
    UPLOADED_LOTTIE_RASTERIZED = 170_002,
    STICKER_MAXIMUM_FRAMERATE_EXCEEDED = 170_003,
    STICKER_FRAME_COUNT_EXCEEDS_MAXIMUM = 170_004,
    LOTTIE_ANIMATION_MAXIMUM_DIMENSIONS_EXCEEDED = 170_005,
    STICKER_FRAME_RATE_TOO_SMALL_OR_LARGE = 170_006,
    STICKER_ANIMATION_DURATION_TOO_LONG = 170_007,
    POGGERMODE_TEMPORARILY_DISABLED = 170_008,
    CANNOT_UPDATE_FINISHED_EVENT = 180_000,
    FAILED_TO_CREATE_STAGE_INSTANCE = 180_002,
    AUTOMOD_MESSAGE_BLOCKED = 200_000,
    AUTOMOD_TITLE_BLOCKED = 200_001,
    AUTOMOD_INVALID_RUST_SERVICE_RESPONSE = 200_002,
    MONETIZATION_TERMS_NOT_ACCEPTED = 210_003,
    TWO_FA_NOT_ENABLED = 210_011,
    GUILD_PRODUCT_LISTING_CANNOT_PUBLISH_WITHOUT_BENEFIT = 210_021,
    CREATOR_MONETIZATION_PAYMENT_TEAM_REQUIRED = 210_026,
    CREATOR_MONETIZATION_PAYMENT_ACCOUNT_VERIFICATION_REQUIRED = 210_027,
    WEBHOOKS_POSTED_TO_FORUM_CHANNELS_MUST_HAVE_THREAD_NAME_OR_THREAD_ID = 220_001,
    WEBHOOKS_POSTED_TO_FORUM_CHANNELS_CANNOT_HAVE_BOTH_THREAD_NAME_AND_THREAD_ID = 220_002,
    WEBHOOKS_CAN_ONLY_CREATE_THREADS_IN_FORUM_CHANNELS = 220_003,
    WEBHOOK_SERVICES_CANNOT_BE_USED_IN_FORUM_CHANNELS = 220_004,
    MESSAGE_BLOCKED_BY_HARMFUL_LINKS_FILTER = 220_005,
    HARMFUL_LINK_MESSAGE_BLOCKED = 240_000,
    CLYDE_CONSENT_REQUIRED = 310_000,
    CLYDE_UNSAFE_PERSONALITY = 310_003,
    USER_LIMITED_ACCESS_DEFAULT = 340_000,
    USER_FRIEND_REQUEST_LIMITED_ACCESS = 340_007,
    USER_LIMITED_ACCESS_MAX = 349_999,
    CANNOT_ENABLE_ONBOARDING_REQUIREMENTS_NOT_MET = 350_000,
    CANNOT_ENABLE_ONBOARDING_BELOW_REQUIREMENTS = 350_001,
    GUILD_LIMITED_ACCESS_DEFAULT = 400_000,
    GUILD_FILE_UPLOAD_RATE_LIMITED_ACCESS = 400_001,
    GUILD_JOIN_INVITE_LIMITED_ACCESS = 400_002,
    GUILD_GO_LIVE_LIMITED_ACCESS = 400_003,
    GUILD_LIMITED_ACCESS_MAX = 409_999,
    FAILED_TO_BAN_USERS = 500_000,
    POLL_VOTING_BLOCKED = 520_000,
    POLL_EXPIRED = 520_001,
    INVALID_CHANNEL_TYPE_FOR_POLL_CREATION = 520_002,
    CANNOT_EDIT_POLL_MESSAGE = 520_003,
    CANNOT_USE_AN_EMOJI_INCLUDED_WITH_THE_POLL = 520_004,
    CANNOT_EXPIRE_A_NON_POLL_MESSAGE = 520_006,
    POLL_IS_ALREADY_EXPIRED = 520_007,
    APPLICATION_PROVISIONAL_ACCOUNTS_NOT_GRANTED = 530_000,
    JWT_TOKEN_EXPIRED = 530_001,
    JWT_TOKEN_ISSUER_MISMATCH = 530_002,
    JWT_TOKEN_AUDIENCE_MISMATCH = 530_003,
    JWT_TOKEN_ISSUED_TOO_LONG_AGO = 530_004,
    UNIQUE_USERNAME_GENERATION_FAILED = 530_006,
    CLIENT_SECRET_INVALID = 530_007,
}
