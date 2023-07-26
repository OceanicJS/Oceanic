/* eslint-disable unicorn/prefer-math-trunc */
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
import type { ReverseMap, StringMap } from "./types/misc";
import type {
    RawAnnouncementChannel,
    RawAnnouncementThreadChannel,
    RawCategoryChannel,
    RawForumChannel,
    RawGroupChannel,
    RawMediaChannel,
    RawPrivateChannel,
    RawPrivateThreadChannel,
    RawPublicThreadChannel,
    RawStageChannel,
    RawTextChannel,
    RawVoiceChannel
} from "./types/channels";
import type MediaChannel from "./structures/MediaChannel";
import pkg from "../package.json";

export const GATEWAY_VERSION = 10;
export const REST_VERSION    = 10;
export const BASE_URL        = "https://discord.com";
export const API_URL         = `${BASE_URL}/api/v${REST_VERSION}`;
export const VERSION         = pkg.version;
export const USER_AGENT      = `Oceanic/${VERSION} (https://github.com/OceanicJS/Oceanic)`;
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
    APPLICATION      = 3,
}

export enum PremiumTypes {
    NONE          = 0,
    NITRO_CLASSIC = 1,
    NITRO         = 2,
    NITRO_BASIC   = 3,
}

// @TODO: bigints?
export enum UserFlags {
    STAFF                      = 1 << 0,
    PARTNER                    = 1 << 1,
    HYPESQUAD                  = 1 << 2,
    BUG_HUNTER_LEVEL_1         = 1 << 3,
    MFA_SMS                    = 1 << 4,
    PREMIUM_PROMO_DISMISSED    = 1 << 5,
    HYPESQUAD_BRAVERY          = 1 << 6,
    HYPESQUAD_BRILLIANCE       = 1 << 7,
    HYPESQUAD_BALANCE          = 1 << 8,
    EARLY_SUPPORTER            = 1 << 9,
    PSEUDO_TEAM_USER           = 1 << 10,
    INTERNAL_APPLICATION       = 1 << 11,
    SYSTEM                     = 1 << 12,
    HAS_UNREAD_URGENT_MESSAGES = 1 << 13,
    BUG_HUNTER_LEVEL_2         = 1 << 14,

    VERIFIED_BOT          = 1 << 16,
    VERIFIED_DEVELOPER    = 1 << 17,
    CERTIFIED_MODERATOR   = 1 << 18,
    BOT_HTTP_INTERACTIONS = 1 << 19,
    SPAMMER               = 1 << 20,

    ACTIVE_DEVELOPER = 1 << 22,

    HIGH_GLOBAL_RATE_LIMIT       = 2 ** 33,
    DELETED                      = 2 ** 34,
    DISABLED_SUSPICIOUS_ACTIVITY = 2 ** 35,
    SELF_DELETED                 = 2 ** 36,
    PREMIUM_DISCRIMINATOR        = 2 ** 37,
    USED_DESKTOP_CLIENT          = 2 ** 38,
    USED_WEB_CLIENT              = 2 ** 39,
    USED_MOBILE_CLIENT           = 2 ** 40,
    DISABLED                     = 2 ** 41,

    VERIFIED_EMAIL = 2 ** 43,
    QUARANTINED    = 2 ** 44,

    COLLABORATOR            = 2 ** 50,
    RESTRICTED_COLLABORATOR = 2 ** 51,
}

export enum ApplicationFlags {
    EMBEDDED_RELEASED                             = 1 << 1,
    MANAGED_EMOJI                                 = 1 << 2,
    EMBEDDED_IAP                                  = 1 << 3,
    GROUP_DM_CREATE                               = 1 << 4,
    RPC_PRIVATE_BETA                              = 1 << 5,
    /** Indicates if an app uses the {@link https://discord.com/developers/docs/resources/auto-moderation | Auto Moderation API}. Applications must have at least 100 enabled auto moderation rules to get the badge. */
    APPLICATION_AUTO_MODERATION_RULE_CREATE_BADGE = 1 << 6,

    ALLOW_ASSETS                                  = 1 << 8,
    ALLOW_ACTIVITY_ACTION_SPECTATE                = 1 << 9,
    ALLOW_ACTIVITY_ACTION_JOIN_REQUEST            = 1 << 10,
    RPC_HAS_CONNECTED_ACCOUNT                     = 1 << 11,
    /** Intent required for bots in **100 or more servers** to receive {@link ClientEvents.presenceUpdate | `presenceUpdate`} events. */
    GATEWAY_PRESENCE                              = 1 << 12,
    /** Intent required for bots in **under 100 servers** to receive {@link ClientEvents.presenceUpdate | `presenceUpdate`} events. */
    GATEWAY_PRESENCE_LIMITED                      = 1 << 13,
    /** Intent required for bots in **100 or more servers** to receive member-related events like {@link ClientEvents.guildMemberAdd | `guildMemberAdd`}. */
    GATEWAY_GUILD_MEMBERS                         = 1 << 14,
    /** Intent required for bots in **under 100 servers** to receive member-related events like {@link ClientEvents.guildMemberAdd | `guildMemberAdd`}. */
    GATEWAY_GUILD_MEMBERS_LIMITED                 = 1 << 15,
    /** Indicates unusual growth of an app that prevents verification */
    VERIFICATION_PENDING_GUILD_LIMIT              = 1 << 16,
    /** Indicates if an app is embedded within the Discord client (currently unavailable publicly) */
    EMBEDDED                                      = 1 << 17,
    /** Intent required for bots in **100 or more servers** to receive {@link https://support-dev.discord.com/hc/en-us/articles/4404772028055 | message content}. */
    GATEWAY_MESSAGE_CONTENT                       = 1 << 18,
    /** Intent required for bots in **under 100 servers** to receive {@link https://support-dev.discord.com/hc/en-us/articles/4404772028055 | message content}. */
    GATEWAY_MESSAGE_CONTENT_LIMITED               = 1 << 19,
    EMBEDDED_FIRST_PARTY                          = 1 << 20,

    /** Indicates if an app has registered global {@link https://discord.com/developers/docs/interactions/application-commands | application commands}. */
    APPLICATION_COMMAND_BADGE                     = 1 << 23,
    ACTIVE                                        = 1 << 24,
}

export const GuildFeatures = [
    "ANIMATED_BANNER",
    "ANIMATED_ICON",
    "APPLICATION_COMMAND_PERMISSIONS_V2",
    "AUTO_MODERATION",
    "BANNER",
    "BOT_DEVELOPER_EARLY_ACCESS",
    "CLYDE_ENABLED",
    "COMMUNITY_EXP_LARGE_GATED",
    "COMMUNITY_EXP_LARGE_UNGATED",
    "COMMUNITY_EXP_MEDIUM",
    "COMMUNITY",
    "CREATOR_MONETIZABLE_DISABLED",
    "CREATOR_MONETIZABLE_PROVISIONAL",
    "CREATOR_MONETIZABLE",
    "CREATOR_STORE_PAGE",
    "DEVELOPER_SUPPORT_SERVER",
    "DISCOVERABLE_DISABLED",
    "DISCOVERABLE",
    "ENABLED_DISCOVERABLE_BEFORE",
    "EXPOSED_TO_ACTIVITIES_WTP_EXPERIMENT",
    "FEATURABLE",
    "GUESTS_ENABLED",
    "GUILD_HOME_TEST",
    "GUILD_ONBOARDING_EVER_ENABLED",
    "GUILD_ONBOARDING_HAS_PROMPTS",
    "GUILD_ONBOARDING",
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
    "MEMBER_VERIFICATION_GATE_ENABLED",
    "MONETIZATION_ENABLED",
    "MORE_EMOJI",
    "MORE_EMOJIS",
    "MORE_STICKERS",
    "NEW_THREAD_PERMISSIONS",
    "NEWS",
    "PARTNERED",
    "PREVIEW_ENABLED",
    "PREVIOUSLY_DISCOVERABLE",
    "PRIVATE_THREADS",
    "RAID_ALERTS_ENABLED",
    "ROLE_ICONS",
    "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE",
    "ROLE_SUBSCRIPTIONS_ENABLED",
    "SEVEN_DAY_THREAD_ARCHIVE",
    "SOUNDBOARD",
    "TEXT_IN_VOICE_ENABLED",
    "THREADS_ENABLED_TESTING",
    "THREADS_ENABLED",
    "THREE_DAY_THREAD_ARCHIVE",
    "TICKETED_EVENTS_ENABLED",
    "VANITY_URL",
    "VERIFIED",
    "VIP_REGIONS",
    "WELCOME_SCREEN_ENABLED"
] as const;
export type GuildFeature = typeof GuildFeatures[number];
export type MutableGuildFeatures = "COMMUNITY" | "DISCOVERABLE" | "INVITES_DISABLED" | "RAID_ALERTS_ENABLED";

export enum DefaultMessageNotificationLevels {
    ALL_MESSAGES  = 0,
    ONLY_MENTIONS = 1,
    NO_MESSAGES   = 2,
    NULL          = 3,
}

export enum ExplicitContentFilterLevels {
    DISABLED              = 0,
    MEMBERS_WITHOUT_ROLES = 1,
    ALL_MEMBERS           = 2,
}

export enum MFALevels {
    NONE     = 0,
    ELEVATED = 1,
}

export enum VerificationLevels {
    NONE      = 0,
    LOW       = 1,
    MEDIUM    = 2,
    HIGH      = 3,
    VERY_HIGH = 4,
}

export enum GuildNSFWLevels {
    DEFAULT        = 0,
    EXPLICIT       = 1,
    SAFE           = 2,
    AGE_RESTRICTED = 3,
}

export enum PremiumTiers {
    NONE   = 0,
    TIER_1 = 1,
    TIER_2 = 2,
    TIER_3 = 3,
}

export enum SystemChannelFlags {
    SUPPRESS_JOIN_NOTIFICATIONS                              = 1 << 0,
    SUPPRESS_PREMIUM_SUBSCRIPTIONS                           = 1 << 1,
    SUPPRESS_GUILD_REMINDER_NOTIFICATIONS                    = 1 << 2,
    SUPPRESS_JOIN_NOTIFICATION_REPLIES                       = 1 << 3,
    SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATIONS        = 1 << 4,
    SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATION_REPLIES = 1 << 5,
}

export enum StickerTypes {
    STANDARD = 1,
    GUILD    = 2,
}

export enum StickerFormatTypes {
    PNG    = 1,
    APNG   = 2,
    LOTTIE = 3,
    GIF    = 4,
}

export enum ChannelTypes {
    GUILD_TEXT           = 0,
    DM                   = 1,
    GUILD_VOICE          = 2,
    GROUP_DM             = 3,
    GUILD_CATEGORY       = 4,
    GUILD_ANNOUNCEMENT   = 5,

    ANNOUNCEMENT_THREAD  = 10,
    PUBLIC_THREAD        = 11,
    PRIVATE_THREAD       = 12,
    GUILD_STAGE_VOICE    = 13,
    GUILD_DIRECTORY      = 14,
    GUILD_FORUM          = 15,
    GUILD_MEDIA          = 16,
}

function exclude<T extends ChannelTypes, E extends ChannelTypes>(original: ReadonlyArray<T>, excludeTypes: ReadonlyArray<E>): Array<Exclude<T, E>> {
    return original.filter((value: T) => !excludeTypes.includes(value as unknown as E)) as Array<Exclude<T, E>>;
}

export const AnyChannelTypes = Object.values(ChannelTypes).filter(v => typeof v === "number") as Array<ChannelTypes>;
export const NotImplementedChannelTypes = [ChannelTypes.GUILD_DIRECTORY] as const;
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
export const InviteChannelTypes = [ChannelTypes.GUILD_TEXT, ChannelTypes.GUILD_ANNOUNCEMENT, ...VoiceChannelTypes, ChannelTypes.GUILD_FORUM, ChannelTypes.GUILD_MEDIA] as const;
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
    [ChannelTypes.ANNOUNCEMENT_THREAD]: AnnouncementThreadChannel;
    [ChannelTypes.PUBLIC_THREAD]: PublicThreadChannel;
    [ChannelTypes.PRIVATE_THREAD]: PrivateThreadChannel;
    [ChannelTypes.GUILD_STAGE_VOICE]: StageChannel;
    [ChannelTypes.GUILD_DIRECTORY]: never;
    [ChannelTypes.GUILD_FORUM]: ForumChannel;
    [ChannelTypes.GUILD_MEDIA]: MediaChannel;
}
export interface RawChannelTypeMap {
    [ChannelTypes.GUILD_TEXT]: RawTextChannel;
    [ChannelTypes.DM]: RawPrivateChannel;
    [ChannelTypes.GUILD_VOICE]: RawVoiceChannel;
    [ChannelTypes.GROUP_DM]: RawGroupChannel;
    [ChannelTypes.GUILD_CATEGORY]: RawCategoryChannel;
    [ChannelTypes.GUILD_ANNOUNCEMENT]: RawAnnouncementChannel;
    [ChannelTypes.ANNOUNCEMENT_THREAD]: RawAnnouncementThreadChannel;
    [ChannelTypes.PUBLIC_THREAD]: RawPublicThreadChannel;
    [ChannelTypes.PRIVATE_THREAD]: RawPrivateThreadChannel;
    [ChannelTypes.GUILD_STAGE_VOICE]: RawStageChannel;
    [ChannelTypes.GUILD_DIRECTORY]: never;
    [ChannelTypes.GUILD_FORUM]: RawForumChannel;
    [ChannelTypes.GUILD_MEDIA]: RawMediaChannel;
}
/* eslint-enable @typescript-eslint/member-ordering */

export enum OverwriteTypes {
    ROLE   = 0,
    MEMBER = 1,
}

export enum VideoQualityModes {
    AUTO = 1,
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
    NONE     = 0,
    EVERYONE = 1,
}

export const ConnectionServices = [
    "battlenet",
    "ebay",
    "epicgames",
    "facebook",
    "github",
    "instagram",
    "leagueoflegends",
    "paypal",
    "playstation",
    "reddit",
    "riotgames",
    "spotify",
    "skype",
    "steam",
    "tiktok",
    "twitch",
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
    REMOVE_ROLE = 0,
    KICK        = 1,
}

// values won't be statically typed if we use bit shifting, and enums can't use bigints
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Permissions {
    export const CREATE_INSTANT_INVITE               = 1n;              // 1 << 0
    export const KICK_MEMBERS                        = 2n;              // 1 << 1
    export const BAN_MEMBERS                         = 4n;              // 1 << 2
    export const ADMINISTRATOR                       = 8n;              // 1 << 3
    export const MANAGE_CHANNELS                     = 16n;             // 1 << 4
    export const MANAGE_GUILD                        = 32n;             // 1 << 5
    export const ADD_REACTIONS                       = 64n;             // 1 << 6
    export const VIEW_AUDIT_LOG                      = 128n;            // 1 << 7
    export const PRIORITY_SPEAKER                    = 256n;            // 1 << 8
    export const STREAM                              = 512n;            // 1 << 9
    export const VIEW_CHANNEL                        = 1024n;           // 1 << 10
    export const SEND_MESSAGES                       = 2048n;           // 1 << 11
    export const SEND_TTS_MESSAGES                   = 4096n;           // 1 << 12
    export const MANAGE_MESSAGES                     = 8192n;           // 1 << 13
    export const EMBED_LINKS                         = 16384n;          // 1 << 14
    export const ATTACH_FILES                        = 32768n;          // 1 << 15
    export const READ_MESSAGE_HISTORY                = 65536n;          // 1 << 16
    export const MENTION_EVERYONE                    = 131072n;         // 1 << 17
    export const USE_EXTERNAL_EMOJIS                 = 262144n;         // 1 << 18
    export const VIEW_GUILD_INSIGHTS                 = 524288n;         // 1 << 19
    export const CONNECT                             = 1048576n;        // 1 << 20
    export const SPEAK                               = 2097152n;        // 1 << 21
    export const MUTE_MEMBERS                        = 4194304n;        // 1 << 22
    export const DEAFEN_MEMBERS                      = 8388608n;        // 1 << 23
    export const MOVE_MEMBERS                        = 16777216n;       // 1 << 24
    export const USE_VAD                             = 33554432n;       // 1 << 25
    export const CHANGE_NICKNAME                     = 67108864n;       // 1 << 26
    export const MANAGE_NICKNAMES                    = 134217728n;      // 1 << 27
    export const MANAGE_ROLES                        = 268435456n;      // 1 << 28
    export const MANAGE_WEBHOOKS                     = 536870912n;      // 1 << 29
    export const MANAGE_GUILD_EXPRESSIONS            = 1073741824n;     // 1 << 30
    /** @deprecated Use {@link Constants~Permissions | MANAGE_GUILD_EXPRESSIONS}. This will be removed in `1.8.0`.  */
    export const MANAGE_EMOJIS_AND_STICKERS          = 1073741824n;     // 1 << 30
    export const USE_APPLICATION_COMMANDS            = 2147483648n;     // 1 << 31
    export const REQUEST_TO_SPEAK                    = 4294967296n;     // 1 << 32
    export const MANAGE_EVENTS                       = 8589934592n;     // 1 << 33
    export const MANAGE_THREADS                      = 17179869184n;    // 1 << 34
    export const CREATE_PUBLIC_THREADS               = 34359738368n;    // 1 << 35
    export const CREATE_PRIVATE_THREADS              = 68719476736n;    // 1 << 36
    export const USE_EXTERNAL_STICKERS               = 137438953472n;   // 1 << 37
    export const SEND_MESSAGES_IN_THREADS            = 274877906944n;   // 1 << 38
    export const USE_EMBEDDED_ACTIVITIES             = 549755813888n;   // 1 << 39
    export const MODERATE_MEMBERS                    = 1099511627776n;  // 1 << 40
    export const VIEW_CREATOR_MONETIZATION_ANALYTICS = 2199023255552n;  // 1 << 41
    export const USE_SOUNDBOARD                      = 4398046511104n;  // 1 << 42
    export const CREATE_GUILD_EXPRESSIONS            = 8796093022208n;  // 1 << 43
    export const CREATE_EVENTS                       = 17592186044416n; // 1 << 44
    export const USE_EXTERNAL_SOUNDS                 = 35184372088832n; // 1 << 45
    export const SEND_VOICE_MESSAGES                 = 70368744177664n; // 1 << 46
}

// bigints can't be used as object keys, so we need to convert them to strings
const PermissionValueToName = Object.fromEntries(Object.entries(Permissions).map(([k, v]) => [String(v), k] as [string, string])) as ReverseMap<StringMap<typeof Permissions>>;

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
    Permissions.SEND_VOICE_MESSAGES
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
    Permissions.SEND_VOICE_MESSAGES
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
    Permissions.SEND_VOICE_MESSAGES
] as const;
export const AllStagePermissions = StagePermissions.reduce((all, p) => all | p, 0n);
export const AllStagePermissionNames = StagePermissions.map(p => PermissionValueToName[String(p) as `${typeof p}`]);

export const PermissionNames = Object.keys(Permissions) as Array<PermissionName>;
export type PermissionName = keyof typeof Permissions;

export enum ChannelFlags {
    GUILD_FEED_REMOVED                            = 1 << 0,
    /** For threads, if this thread is pinned in a forum channel. */
    PINNED                                        = 1 << 1,
    ACTIVE_CHANNELS_REMOVED                       = 1 << 2,

    /** For forums, if tags are required when creating threads. */
    REQUIRE_TAG                                   = 1 << 4,
    IS_SPAM                                       = 1 << 5,

    IS_GUILD_RESOURCE_CHANNEL                     = 1 << 7,
    CLYDE_AI                                      = 1 << 8,
    IS_SCHEDULED_FOR_DELETION                     = 1 << 9,
    IS_MEDIA_CHANNEL                              = 1 << 10,
    SUMMARIES_DISABLED                            = 1 << 11,
    APPLICATION_SHELF_CONSENT                     = 1 << 12,
    IS_ROLE_SUBSCRIPTION_TEMPLATE_PREVIEW_CHANNEL = 1 << 13,

    /** For media channls, hides the embedded media download options. */
    HIDE_MEDIA_DOWNLOAD_OPTIONS                   = 1 << 15,
}

export enum SortOrderTypes {
    /** Sort forum threads by activity. */
    LATEST_ACTIVITY = 0,
    /** Sort forum threads by creation time (from most recent to oldest). */
    CREATION_DATE = 1,
}

export enum ForumLayoutTypes {
    /** A preferred forum layout hasn't been set by a server admin. */
    DEFAULT = 0,
    /** List View: display forum posts in a text-focused list. */
    LIST = 1,
    /** Gallery View: display forum posts in a media-focused gallery. */
    GRID = 2,
}

export enum TeamMembershipState {
    INVITED  = 1,
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
    /** for local rpc server api access, this allows you to read messages from all client channels (otherwise restricted to channels/guilds your app creates) */
    MESSAGES_READ = "messages.read",
    /** allows your app to know a user's friends and implicit relationships - requires Discord approval */
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
    ACTION_ROW         = 1,
    BUTTON             = 2,
    STRING_SELECT      = 3,
    TEXT_INPUT         = 4,
    USER_SELECT        = 5,
    ROLE_SELECT        = 6,
    MENTIONABLE_SELECT = 7,
    CHANNEL_SELECT     = 8,
}

export type SelectMenuNonResolvedTypes = ComponentTypes.STRING_SELECT;
export type SelectMenuResolvedTypes = ComponentTypes.USER_SELECT | ComponentTypes.ROLE_SELECT | ComponentTypes.MENTIONABLE_SELECT | ComponentTypes.CHANNEL_SELECT;
export type SelectMenuTypes = SelectMenuNonResolvedTypes | SelectMenuResolvedTypes;

export type MessageComponentTypes = ComponentTypes.BUTTON | SelectMenuTypes;
export type ModalComponentTypes = ComponentTypes.TEXT_INPUT;

export enum ButtonStyles {
    PRIMARY   = 1,
    SECONDARY = 2,
    SUCCESS   = 3,
    DANGER    = 4,
    LINK      = 5,
}

export enum TextInputStyles {
    SHORT     = 1,
    PARAGRAPH = 2,
}

export enum MessageFlags {
    CROSSPOSTED                            = 1 << 0,
    IS_CROSSPOST                           = 1 << 1,
    SUPPRESS_EMBEDS                        = 1 << 2,
    SOURCE_MESSAGE_DELETED                 = 1 << 3,
    URGENT                                 = 1 << 4,
    HAS_THREAD                             = 1 << 5,
    EPHEMERAL                              = 1 << 6,
    LOADING                                = 1 << 7,
    FAILED_TO_MENTION_SOME_ROLES_IN_THREAD = 1 << 8,
    SHOULD_SHOW_LINK_NOT_DISCORD_WARNING   = 1 << 10,
    SUPPRESS_NOTIFICATIONS                 = 1 << 12,
    IS_VOICE_MESSAGE                       = 1 << 13,
}

export enum MessageTypes {
    DEFAULT                                      = 0,
    RECIPIENT_ADD                                = 1,
    RECIPIENT_REMOVE                             = 2,
    CALL                                         = 3,
    CHANNEL_NAME_CHANGE                          = 4,
    CHANNEL_ICON_CHANGE                          = 5,
    CHANNEL_PINNED_MESSAGE                       = 6,
    USER_JOIN                                    = 7,
    GUILD_BOOST                                  = 8,
    GUILD_BOOST_TIER_1                           = 9,
    GUILD_BOOST_TIER_2                           = 10,
    GUILD_BOOST_TIER_3                           = 11,
    CHANNEL_FOLLOW_ADD                           = 12,
    GUILD_STREAM                                 = 13,
    GUILD_DISCOVERY_DISQUALIFIED                 = 14,
    GUILD_DISCOVERY_REQUALIFIED                  = 15,
    GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
    GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING   = 17,
    THREAD_CREATED                               = 18,
    REPLY                                        = 19,
    CHAT_INPUT_COMMAND                           = 20,
    THREAD_STARTER_MESSAGE                       = 21,
    GUILD_INVITE_REMINDER                        = 22,
    CONTEXT_MENU_COMMAND                         = 23,
    AUTO_MODERATION_ACTION                       = 24,
    ROLE_SUBSCRIPTION_PURCHASE                   = 25,
    INTERACTION_PREMIUM_UPSELL                   = 26,
    STAGE_START                                  = 27,
    STAGE_END                                    = 28,
    STAGE_SPEAKER                                = 29,
    STAGE_RAISE_HAND                             = 30,
    STAGE_TOPIC_CHANGE                           = 31,
    GUILD_APPLICATION_PREMIUM_SUBSCRIPTION       = 32,
    PRIVATE_CHANNEL_INTEGRATION_ADDED            = 33,
    PRIVATE_CHANNEL_INTEGRATION_REMOVED          = 34,
    PREMIUM_REFERRAL                             = 35,
}

export enum MessageActivityTypes {
    JOIN         = 1,
    SPECTATE     = 2,
    LISTEN       = 3,
    WATCH        = 4,
    JOIN_REQUEST = 5,
}

export enum InteractionTypes {
    PING                             = 1,
    APPLICATION_COMMAND              = 2,
    MESSAGE_COMPONENT                = 3,
    APPLICATION_COMMAND_AUTOCOMPLETE = 4,
    MODAL_SUBMIT                     = 5,
}

export enum InviteTargetTypes {
    STREAM                      = 1,
    EMBEDDED_APPLICATION        = 2,
    ROLE_SUBSCRIPTIONS_PURCHASE = 3,
}

export enum GuildScheduledEventPrivacyLevels {
    GUILD_ONLY = 2,
}

export enum GuildScheduledEventStatuses {
    SCHEDULED = 1,
    ACTIVE    = 2,
    COMPLETED = 3,
    CANCELED  = 4,
}

export enum GuildScheduledEventEntityTypes {
    STAGE_INSTANCE = 1,
    VOICE          = 2,
    EXTERNAL       = 3,
}

export enum StageInstancePrivacyLevels {
    /** @deprecated */
    PUBLIC     = 1,
    GUILD_ONLY = 2,
}

export enum AutoModerationEventTypes {
    MESSAGE_SEND = 1,
}

export enum AutoModerationTriggerTypes {
    KEYWORD        = 1,
    SPAM           = 3,
    KEYWORD_PRESET = 4,
    MENTION_SPAM   = 5,
    MEMBER_PROFILE = 6,
}

export enum AutoModerationKeywordPresetTypes {
    PROFANITY      = 1,
    SEXUAL_CONTENT = 2,
    SLURS          = 3,
}

export enum AutoModerationActionTypes {
    BLOCK_MESSAGE      = 1,
    SEND_ALERT_MESSAGE = 2,
    TIMEOUT            = 3,
    QUARANTINE_USER    = 4,
}

export enum AuditLogActionTypes {
    GUILD_UPDATE = 1,

    CHANNEL_CREATE           = 10,
    CHANNEL_UPDATE           = 11,
    CHANNEL_DELETE           = 12,
    CHANNEL_OVERWRITE_CREATE = 13,
    CHANNEL_OVERWRITE_UPDATE = 14,
    CHANNEL_OVERWRITE_DELETE = 15,

    MEMBER_KICK        = 20,
    MEMBER_PRUNE       = 21,
    MEMBER_BAN_ADD     = 22,
    MEMBER_BAN_REMOVE  = 23,
    MEMBER_UPDATE      = 24,
    MEMBER_ROLE_UPDATE = 25,
    MEMBER_MOVE        = 26,
    MEMBER_DISCONNECT  = 27,
    BOT_ADD            = 28,

    ROLE_CREATE = 30,
    ROLE_UPDATE = 31,
    ROLE_DELETE = 32,

    INVITE_CREATE = 40,
    INVITE_UPDATE = 41,
    INVITE_DELETE = 42,

    WEBHOOK_CREATE = 50,
    WEBHOOK_UPDATE = 51,
    WEBHOOK_DELETE = 52,

    EMOJI_CREATE = 60,
    EMOJI_UPDATE = 61,
    EMOJI_DELETE = 62,

    MESSAGE_DELETE      = 72,
    MESSAGE_BULK_DELETE = 73,
    MESSAGE_PIN         = 74,
    MESSAGE_UNPIN       = 75,

    INTEGRATION_CREATE    = 80,
    INTEGRATION_UPDATE    = 81,
    INTEGRATION_DELETE    = 82,
    STAGE_INSTANCE_CREATE = 83,
    STAGE_INSTANCE_UPDATE = 84,
    STAGE_INSTANCE_DELETE = 85,

    STICKER_CREATE = 90,
    STICKER_UPDATE = 91,
    STICKER_DELETE = 92,

    GUILD_SCHEDULED_EVENT_CREATE = 100,
    GUILD_SCHEDULED_EVENT_UPDATE = 101,
    GUILD_SCHEDULED_EVENT_DELETE = 102,

    THREAD_CREATE = 110,
    THREAD_UPDATE = 111,
    THREAD_DELETE = 112,

    APPLICATION_COMMAND_PERMISSION_UPDATE = 121,

    SOUNDBOARD_SOUND_CREATE = 130,
    SOUNDBOARD_SOUND_UPDATE = 131,
    SOUNDBOARD_SOUND_DELETE = 132,

    AUTO_MODERATION_RULE_CREATE                 = 140,
    AUTO_MODERATION_RULE_UPDATE                 = 141,
    AUTO_MODERATION_RULE_DELETE                 = 142,
    AUTO_MODERATION_BLOCK_MESSAGE               = 143,
    AUTO_MODERATION_FLAG_TO_CHANNEL             = 144,
    AUTO_MODERATION_USER_COMMUNICATION_DISABLED = 145,
    AUTO_MODERATION_QUARANTINE_USER             = 146,

    CREATOR_MONETIZATION_REQUEST_CREATED = 150,
    CREATOR_MONETIZATION_TERMS_ACCEPTED  = 151,

    ROLE_PROMPT_CREATE       = 160,
    ROLE_PROMPT_UPDATE       = 161,
    ROLE_PROMPT_DELETE       = 162,
    ONBOARDING_PROMPT_CREATE = 163,
    ONBOARDING_PROMPT_UPDATE = 164,
    ONBOARDING_PROMPT_DELETE = 165,
    ONBOARDING_CREATE        = 166,
    ONBOARDING_UPDATE        = 167,

    GUILD_HOME_FEATURE_ITEM = 171,
    GUILD_HOME_REMOVE_ITEM  = 172,

    HARMFUL_LINKS_BLOCKED_MESSAGE = 180,

    HOME_SETTINGS_CREATE = 190,
    HOME_SETTINGS_UPDATE = 191,
}

export enum ApplicationCommandTypes {
    CHAT_INPUT = 1,
    USER       = 2,
    MESSAGE    = 3,
}

export enum ApplicationCommandOptionTypes {
    SUB_COMMAND       = 1,
    SUB_COMMAND_GROUP = 2,
    STRING            = 3,
    INTEGER           = 4,
    BOOLEAN           = 5,
    USER              = 6,
    CHANNEL           = 7,
    ROLE              = 8,
    MENTIONABLE       = 9,
    NUMBER            = 10,
    ATTACHMENT        = 11,
}

export enum ApplicationCommandPermissionTypes {
    ROLE    = 1,
    USER    = 2,
    CHANNEL = 3,
}

export enum InteractionResponseTypes {
    PONG                                    = 1,
    CHANNEL_MESSAGE_WITH_SOURCE             = 4,
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE    = 5,
    DEFERRED_UPDATE_MESSAGE                 = 6,
    UPDATE_MESSAGE                          = 7,
    APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8,
    MODAL                                   = 9,
}

export enum Intents {
    GUILDS                        = 1 << 0,
    GUILD_MEMBERS                 = 1 << 1,
    GUILD_MODERATION              = 1 << 2,
    GUILD_EMOJIS_AND_STICKERS     = 1 << 3,
    GUILD_INTEGRATIONS            = 1 << 4,
    GUILD_WEBHOOKS                = 1 << 5,
    GUILD_INVITES                 = 1 << 6,
    GUILD_VOICE_STATES            = 1 << 7,
    GUILD_PRESENCES               = 1 << 8,
    GUILD_MESSAGES                = 1 << 9,
    GUILD_MESSAGE_REACTIONS       = 1 << 10,
    GUILD_MESSAGE_TYPING          = 1 << 11,
    DIRECT_MESSAGES               = 1 << 12,
    DIRECT_MESSAGE_REACTIONS      = 1 << 13,
    DIRECT_MESSAGE_TYPING         = 1 << 14,
    MESSAGE_CONTENT               = 1 << 15,
    GUILD_SCHEDULED_EVENTS        = 1 << 16,
    AUTO_MODERATION_CONFIGURATION = 1 << 17,
    AUTO_MODERATION_EXECUTION     = 1 << 18,
}

export type IntentNames = keyof typeof Intents;

export const NonPrivilegedIntents = [
    Intents.GUILDS,
    Intents.GUILD_MODERATION,
    Intents.GUILD_EMOJIS_AND_STICKERS,
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
    Intents.AUTO_MODERATION_EXECUTION
] as const;
export const AllNonPrivilegedIntents = NonPrivilegedIntents.reduce((all, p) => all | p, 0);
export const PrivilegedIntents = [
    Intents.GUILD_MEMBERS,
    Intents.GUILD_PRESENCES,
    Intents.MESSAGE_CONTENT
] as const;
export const AllPrivilegedIntents = PrivilegedIntents.reduce((all, p) => all | p, 0);
export const AllIntents = AllNonPrivilegedIntents | AllPrivilegedIntents;

export enum GatewayOPCodes {
    DISPATCH              = 0,
    HEARTBEAT             = 1,
    IDENTIFY              = 2,
    PRESENCE_UPDATE       = 3,
    VOICE_STATE_UPDATE    = 4,
    RESUME                = 6,
    RECONNECT             = 7,
    REQUEST_GUILD_MEMBERS = 8,
    INVALID_SESSION       = 9,
    HELLO                 = 10,
    HEARTBEAT_ACK         = 11,
}

export enum GatewayCloseCodes {
    UNKNOWN_ERROR         = 4000,
    UNKNOWN_OPCODE        = 4001,
    DECODE_ERROR          = 4002,
    NOT_AUTHENTICATED     = 4003,
    AUTHENTICATION_FAILED = 4004,
    ALREADY_AUTHENTICATED = 4005,
    INVALID_SEQUENCE      = 4007,
    RATE_LIMITED          = 4008,
    SESSION_TIMEOUT       = 4009,
    INVALID_SHARD         = 4010,
    SHARDING_REQUIRED     = 4011,
    INVALID_API_VERSION   = 4012,
    INVALID_INTENTS       = 4013,
    DISALLOWED_INTENTS    = 4014,
}

export enum VoiceOPCodes {
    IDENTIFY            = 0,
    SELECT_PROTOCOL     = 1,
    READY               = 2,
    HEARTBEAT           = 3,
    SESSION_DESCRIPTION = 4,
    SPEAKING            = 5,
    HEARTBEAT_ACK       = 6,
    RESUME              = 7,
    HELLO               = 8,
    RESUMED             = 9,
    CLIENT_DISCONNECT   = 13,
}

export enum VoiceCloseCodes {
    UNKNOWN_OPCODE          = 4001,
    DECODE_ERROR            = 4002,
    NOT_AUTHENTICATED       = 4003,
    AUTHENTICATION_FAILED   = 4004,
    ALREADY_AUTHENTICATED   = 4005,
    INVALID_SESSION         = 4006,
    SESSION_TIMEOUT         = 4009,
    SERVER_NOT_FOUND        = 4011,
    UNKNOWN_PROTOCOL        = 4012,
    DISCONNECTED            = 4013,
    VOICE_SERVER_CRASHED    = 4014,
    UNKNOWN_ENCRYPTION_MODE = 4015,
}

export enum HubTypes {
    DEFAULT     = 0,
    HIGH_SCHOOL = 1,
    COLLEGE     = 2,
}

export enum ActivityTypes {
    GAME      = 0,
    STREAMING = 1,
    LISTENING = 2,
    WATCHING  = 3,
    CUSTOM    = 4,
    COMPETING = 5,
}

export enum ActivityFlags {
    INSTANCE                    = 1 << 0,
    JOIN                        = 1 << 1,
    SPECTATE                    = 1 << 2,
    JOIN_REQUEST                = 1 << 3,
    SYNC                        = 1 << 4,
    PLAY                        = 1 << 5,
    PARTY_PRIVACY_FRIENDS_ONLY  = 1 << 6,
    PARTY_PRIVACY_VOICE_CHANNEL = 1 << 7,
    EMBEDDED                    = 1 << 8,
}

export enum ThreadMemberFlags {
    HAS_INTERACTED = 1 << 0,
    ALL_MESSAGES   = 1 << 1,
    ONLY_MENTIONS  = 1 << 2,
    NO_MESSAGES    = 1 << 3,
}

export enum RoleConnectionMetadataTypes {
    INTEGER_LESS_THAN_OR_EQUAL     = 1,
    INTEGER_GREATER_THAN_OR_EQUAL  = 2,
    INTEGER_EQUAL                  = 3,
    INTEGER_NOT_EQUAL              = 4,
    DATETIME_LESS_THAN_OR_EQUAL    = 5,
    DATETIME_GREATER_THAN_OR_EQUAL = 6,
    BOOLEAN_EQUAL                  = 7,
    BOOLEAN_NOT_EQUAL              = 8,
}

export enum GuildMemberFlags {
    DID_REJOIN                                     = 1 << 0,
    COMPLETED_ONBOARDING                           = 1 << 1,
    BYPASSES_VERIFICATION                          = 1 << 2,
    STARTED_ONBOARDING                             = 1 << 3,
    IS_GUEST                                       = 1 << 4,
    STARTED_HOME_ACTIONS                           = 1 << 5,
    COMPLETED_HOME_ACTIONS                         = 1 << 6,
    AUTOMOD_QUARANTINED_USERNAME_OR_GUILD_NICKNAME = 1 << 7,
    AUTOMOD_QUARANTINED_BIO                        = 1 << 8,
}

export enum OnboardingPromptTypes {
    MULTIPLE_CHOICE = 0,
    DROPDOWN        = 1,
}

export enum AnimationTypes {
    PREMIUM = 0,
    BASIC   = 1,
}

export enum OnboardingModes {
    DEFAULT = 0,
    ADVANCED = 1,
}

export enum InviteFlags {
    GUEST = 1 << 0,
}

// entries are intentionally not aligned
/** The error codes that can be received. See [Discord's Documentation](https://discord.com/developers/docs/topics/opcodes-and-status-codes#json). */
export enum JSONErrorCodes {
    GENERAL_ERROR = 0,
    UNKNOWN_ACCOUNT = 10001,
    UNKNOWN_APPLICATION = 10002,
    UNKNOWN_CHANNEL = 10003,
    UNKNOWN_GUILD = 10004,
    UNKNOWN_INTEGRATION = 10005,
    UNKNOWN_INVITE = 10006,
    UNKNOWN_MEMBER = 10007,
    UNKNOWN_MESSAGE = 10008,
    UNKNOWN_OVERWRITE = 10009,
    UNKNOWN_PROVIDER = 10010,
    UNKNOWN_ROLE = 10011,
    UNKNOWN_TOKEN = 10012,
    UNKNOWN_USER = 10013,
    UNKNOWN_EMOJI = 10014,
    UNKNOWN_WEBHOOK = 10015,
    UNKNOWN_WEBHOOK_SERVICE = 10016,
    UNKNOWN_SESSION = 10020,
    UNKNOWN_BAN = 10026,
    UNKNOWN_SKU = 10027,
    UNKNOWN_STORE_LISTING = 10028,
    UNKNOWN_ENTITLEMENT = 10029,
    UNKNOWN_BUILD = 10030,
    UNKNOWN_LOBBY = 10031,
    UNKNOWN_BRANCH = 10032,
    UNKNOWN_STORE_DIRECTORY_LAYOUT = 10036,
    UNKNOWN_REDISTRIBUTABLE = 10037,
    UNKNOWN_GIFT_CODE = 10038,
    UNKNOWN_STREAM = 10049,
    UNKNOWN_PREMIUM_SERVER_SUBSCRIBE_COOLDOWN = 10050,
    UNKNOWN_GUILD_TEMPLATE = 10057,
    UNKNOWN_DISCOVERABLE_SERVER_CATEGORY = 10059,
    UNKNOWN_STICKER = 10060,
    UNKNOWN_INTERACTION = 10062,
    UNKNOWN_APPLICATION_COMMAND = 10063,
    UNKNOWN_APPLICATION_COMMAND_PERMISSIONS = 10066,
    UNKNOWN_STAGE_INSTANCE = 10067,
    UNKNOWN_GUILD_MEMBER_VERIFICATION_FORM = 10068,
    UNKNOWN_GUILD_WELCOME_SCREEN = 10069,
    UNKNOWN_GUILD_SCHEDULED_EVENT = 10070,
    UNKNOWN_GUILD_SCHEDULED_EVENT_USER = 10071,
    UNKNOWN_TAG = 10087,
    BOTS_CANNOT_USE_THIS_ENDPOINT = 20001,
    ONLY_BOTS_CAN_USE_THIS_ENDPOINT = 20002,
    EXPLICIT_CONTENT = 20009,
    NOT_AUTHORIZED_FOR_APPLICATION = 20012,
    SLOWMODE_RATE_LIMIT = 20016,
    ACCOUNT_OWNER_ONLY = 20018,
    ANNOUNCEMENT_EDIT_LIMIT_EXCEEDED = 20022,
    UNDER_MINIMUM_AGE = 20024,
    CHANNEL_WRITE_RATE_LIMIT = 20028,
    GUILD_WRITE_RATE_LIMIT = 20029,
    WORDS_NOT_ALLOWED = 20031,
    MAXIMUM_NUMBER_OF_GUILDS = 30001,
    MAXIMUM_NUMBER_OF_FRIENDS = 30002,
    MAXIMUM_NUMBER_OF_PINS = 30003,
    MAXIMUM_NUMBER_OF_RECIPIENTS = 30004,
    MAXIMUM_NUMBER_OF_GUILD_ROLES = 30005,
    MAXIMUM_NUMBER_OF_WEBHOOKS = 30007,
    MAXIMUM_NUMBER_OF_EMOJIS = 30008,
    MAXIMUM_NUMBER_OF_REACTIONS = 30010,
    MAXIMUM_NUMBER_OF_GROUP_CHANNELS = 30011,
    MAXIMUM_NUMBER_OF_CHANNELS = 30013,
    MAXIMUM_NUMBER_OF_ATTACHMENTS = 30015,
    MAXIMUM_NUMBER_OF_INVITES = 30016,
    MAXIMUM_NUMBER_OF_ANIMATED_EMOJIS = 30018,
    MAXIMUM_NUMBER_OF_SERVER_MEMBERS = 30019,
    MAXIMUM_NUMBER_OF_SERVER_CATEGORIES = 30030,
    GUILD_ALREADY_HAS_TEMPLATE = 30031,
    MAXIMUM_NUMBER_OF_APPLICATION_COMMANDS = 30032,
    MAXIMUM_NUMBER_OF_THREAD_PARTICIPANTS = 30033,
    MAXIMUM_NUMBER_OF_APPLICATION_COMMAND_CREATES = 30034,
    MAXIMUM_NUMBER_OF_BANS_FOR_NON_GUILD_MEMBERS = 30035,
    MAXIMUM_NUMBER_OF_BAN_FETCHES = 30037,
    MAXIMUM_NUMBER_OF_UNCOMPLETED_GUILD_SCHEDULED_EVENTS = 30038,
    MAXIMUM_NUMBER_OF_STICKERS = 30039,
    MAXIMUM_NUMBER_OF_PRUNE_REQUESTS = 30040,
    MAXIMUM_NUMBER_OF_GUILD_WIDGET_SETTINGS_UPDATES = 30042,
    MAXIMUM_NUMBER_OR_EDITS_TO_MESSAGES_OLDER_THAN_1_HOUR = 30046,
    MAXIMUM_NUMBER_OF_PINNED_THREADS = 30047,
    MAXIMUM_NUMBER_OF_FORUM_TAGS = 30048,
    BITRATE_TOO_HIGH = 30052,
    MAXIMUM_PREMIUM_EMOJIS = 30056,
    MAXIMUM_GUILD_WEBHOOKS = 30058,
    RESOURCE_RATE_LIMITED = 31002,
    UNAUTHORIZED = 40001,
    ACCOUNT_VERIFICATION_REQUIRED = 40002,
    DIRECT_MESSAGES_RATE_LIMIT = 40003,
    SENDING_MESSAGES_TEMPORARILY_DISABLED = 40004,
    REQUEST_ENTITY_TOO_LARGE = 40005,
    FEATURE_TEMPORARILY_DISABLED = 40006,
    USER_BANNED = 40007,
    CONNECTION_REVOKED = 40012,
    TARGET_USER_NOT_CONNECTED_TO_VOICE = 40032,
    ALREADY_CROSSPOSTED = 40033,
    APPLICATION_COMMAND_ALREADY_EXISTS = 40041,
    INTERACTION_FAILED_TO_SEND = 40043,
    CANNOT_SEND_MESSAGES_IN_FORUM_CHANNEL = 40058,
    INTERACTION_ALREADY_ACKNOWLEDGED = 40060,
    TAG_NAMES_MUST_BE_UNIQUE = 40061,
    SERVICE_RESOURCE_RATE_LIMITED = 40062,
    NO_NON_MODERATOR_TAGS = 40066,
    TAG_REQUIRED = 40067,
    MISSING_ACCESS = 50001,
    INVALID_ACCOUNT_TYPE = 50002,
    CANNOT_EXECUTE_ON_DM = 50003,
    GUILD_WIDGET_DISABLED = 50004,
    CANNOT_EDIT_MESSAGE_BY_OTHER = 50005,
    CANNOT_SEND_EMPTY_MESSAGE = 50006,
    CANNOT_MESSAGE_USER = 50007,
    CANNOT_SEND_MESSAGES_IN_NON_TEXT_CHANNEL = 50008,
    CHANNEL_VERIFICATION_LEVEL_TOO_HIGH = 50009,
    OAUTH2_APPLICATION_BOT_ABSENT = 50010,
    MAXIMUM_OAUTH2_APPLICATIONS = 50011,
    INVALID_OAUTH_STATE = 50012,
    YOU_LACK_PERMISSIONS = 50013,
    INVALID_AUTHENTICATION_TOKEN = 50014,
    NOTE_IS_TOO_LONG = 50015,
    INVALID_BULK_DELETE_QUANTITY = 50016,
    INVALID_MFA_LEVEL = 50017,
    INVALID_CHANNEL_PIN = 50019,
    INVALID_OR_TAKEN_INVITE_CODE = 50020,
    CANNOT_EXECUTE_ON_SYSTEM_MESSAGE = 50021,
    CANNOT_EXECUTE_ON_CHANNEL_TYPE = 50024,
    INVALID_OAUTH_TOKEN = 50025,
    MISSING_OAUTH_SCOPE = 50026,
    INVALID_WEBHOOK_TOKEN = 50027,
    INVALID_ROLE = 50028,
    INVALID_RECIPIENTS = 50033,
    BULK_DELETE_MESSAGE_TOO_OLD = 50034,
    INVALID_FORM_BODY = 50035,
    INVITE_ACCEPTED_TO_GUILD_NOT_CONTAINING_BOT = 50036,
    INVALID_ACTIVITY_ACTION = 500039,
    INVALID_API_VERSION = 50041,
    FILE_UPLOADED_EXCEEDS_MAXIMUM_SIZE = 50045,
    INVALID_FILE_UPLOADED = 50046,
    CANNOT_SELF_REDEEM_GIFT = 50054,
    INVALID_GUILD = 50055,
    INVALID_REQUEST_ORIGIN = 50067,
    INVALID_MESSAGE_TYPE = 50068,
    PAYMENT_SOURCE_REQUIRED = 50070,
    CANNOT_MODIFY_SYSTEM_WEBHOOK = 50073,
    CANNOT_DELETE_COMMUNITY_REQUIRED_CHANNEL = 50074,
    CANNOT_EDIT_MESSAGE_STICKERS = 50080,
    INVALID_STICKER_SENT = 50081,
    THREAD_ARCHIVED = 50083,
    INVALID_THREAD_NOTIFICATION_SETTINGS = 50084,
    BEFORE_EARLIER_THAN_THREAD_CREATION_DATE = 50085,
    COMMUNITY_CHANNELS_MUST_BE_TEXT = 50086,
    SERVER_NOT_AVAILABLE_IN_LOCATION = 50095,
    MONETIZATION_REQUIRED = 50097,
    BOOSTS_REQUIRED = 50101,
    INVALID_JSON = 50109,
    OWNER_CANNOT_BE_PENDING_MEMBER = 50131,
    OWNERSHIP_CANNOT_BE_TRANSFERRED_TO_BOT = 50132,
    FAILED_TO_RESIZE_ASSET = 50138,
    CANNOT_MIX_SUBSCRIPTION_AND_NON_SUBSCRIPTION_ROLES = 50144,
    CANNOT_CONVERT_BETWEEN_PREMIUM_AND_NORMAL_EMOJI = 50145,
    UPLOADED_FILE_NOT_FOUND = 50146,
    VOICE_MESSAGES_DO_NOT_SUPPORT_ADDITIONAL_CONTENT = 50159,
    VOICE_MESSAGES_MUST_HAVE_A_SINGLE_AUDIO_ATTACHMENT = 50160,
    VOICE_MESSAGES_MUST_HAVE_SUPPORTING_METADATA = 50161,
    VOICE_MESSAGES_CANNOT_BE_EDITED = 50162,
    CANNOT_DELETE_GUILD_SUBSCRIPTION_INTEGRATION = 50163,
    CANNOT_SEND_VOICE_MESSAGES_IN_CHANNEL = 50173,
    USER_MUST_FIRST_BE_VERIFIED = 50600,
    NO_PERMISSION_TO_SEND_STICKER = 50600,
    TWO_FACTOR_REQUIRED = 60003,
    NO_USERS_WITH_DISCORDTAG_EXIST = 80004,
    REACTION_BLOCKED = 90001,
    INELIGIBLE_FOR_SUBSCRIPTION = 100053,
    APPLICATION_NOT_AVAILABLE = 110001,
    API_RESOURCE_IS_CURRENTLY_OVERLOADED = 130000,
    STAGE_ALREADY_OPEN = 150006,
    CANNOT_REPLY_WITHOUT_READ_MESSAGE_HISTORY = 160002,
    THREAD_ALREADY_CREATED_FOR_MESSAGE = 160004,
    THREAD_IS_LOCKED = 160005,
    MAXIMUM_NUMBER_OF_ACTIVE_THREADS = 160006,
    MAXIMUM_NUMBER_OF_ACTIVE_ANNOUNCEMENT_THREADS = 160007,
    INVALID_LOTTIE_JSON = 170001,
    UPLOADED_LOTTIE_RASTERIZED = 170002,
    STICKER_MAXIMUM_FRAMERATE_EXCEEDED = 170003,
    STICKER_FRAME_COUNT_EXCEEDS_MAXIMUM = 170004,
    LOTTIE_ANIMATION_MAXIMUM_DIMENSIONS_EXCEEDED = 170005,
    STICKER_FRAME_RATE_TOO_SMALL_OR_LARGE = 170006,
    STICKER_ANIMATION_DURATION_TOO_LONG = 170007,
    CANNOT_UPDATE_FINISHED_EVENT = 180000,
    FAILED_TO_CREATE_STAGE_INSTANCE = 180002,
    MESSAGE_BLOCKED_BY_AUTOMATIC_MODERATION = 200000,
    TITLE_BLOCKED_BY_AUTOMATIC_MODERATION = 200001,
    WEBHOOKS_POSTED_TO_FORUM_CHANNELS_MUST_HAVE_THREAD_NAME_OR_THREAD_ID = 220001,
    WEBHOOKS_POSTED_TO_FORUM_CHANNELS_CANNOT_HAVE_BOTH_THREAD_NAME_AND_THREAD_ID = 220002,
    WEBHOOKS_CAN_ONLY_CREATE_THREADS_IN_FORUM_CHANNELS = 220003,
    WEBHOOK_SERVICES_CANNOT_BE_USED_IN_FORUM_CHANNELS = 220004,
    MESSAGE_BLOCKED_BY_HARMFUL_LINKS_FILTER = 220005,
}
