/** @module Constants */
import pkg from "../package.json";

export const GATEWAY_VERSION = 10;
export const REST_VERSION    = 10;
export const BASE_URL        = "https://discord.com";
export const API_URL        = `${BASE_URL}/api/v${REST_VERSION}`;
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
    PSEUDO_TEAM_USER     = 1 << 10,

    SYSTEM = 1 << 12,

    BUG_HUNTER_LEVEL_2 = 1 << 14,

    VERIFIED_BOT          = 1 << 16,
    VERIFIED_DEVELOPER    = 1 << 17,
    CERTIFIED_MODERATOR   = 1 << 18,
    BOT_HTTP_INTERACTIONS = 1 << 19,
    SPAMMER               = 1 << 20
}

export enum ApplicationFlags {
    EMBEDDED_RELEASED                = 2,
    MANAGED_EMOJI                    = 4,
    GROUP_DM_CREATE                  = 16,
    GATEWAY_PRESENCE                 = 4096,
    GATEWAY_PRESENCE_LIMITED         = 8192,
    GATEWAY_GUILD_MEMBERS            = 16384,
    GATEWAY_GUILD_MEMBERS_LIMITED    = 32768,
    VERIFICATION_PENDING_GUILD_LIMIT = 65536,
    EMBEDDED                         = 131072,
    GATEWAY_MESSAGE_CONTENT          = 262144,
    GATEWAY_MESSAGE_CONTENT_LIMITED  = 524288,
    EMBEDDED_FIRST_PARTY             = 1048576,
    APPLICATION_COMMAND_BADGE        = 2097152,
}

export const GuildFeatures = [
    "ANIMATED_BANNER",
    "ANIMATED_ICON",
    "AUTO_MODERATION",
    "BANNER",
    "CREATOR_MONETIZABLE",
    "CREATOR_MONETIZABLE_DISABLED",
    "DISCOVERABLE",
    "DISCOVERABLE_DISABLED",
    "ENABLED_DISCOVERABLE_BEFORE",
    "EXPOSED_TO_ACTIVITIES_WTP_EXPERIMENT",
    "FEATURABLE",
    "GUILD_HOME_TEST",
    "HAD_EARLY_ACTIVITIES_ACCESS",
    "HAS_DIRECTORY_ENTRY",
    "HUB",
    "INVITES_DISABLED",
    "INVITE_SPLASH",
    "LINKED_TO_HUB",
    "MEMBER_PROFILES",
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
    GUILD_ANNOUNCEMENT   = 5,

    ANNOUNCEMENT_THREAD  = 10,
    PUBLIC_THREAD        = 11,
    PRIVATE_THREAD       = 12,
    GUILD_STAGE_VOICE    = 13,
    GUILD_DIRECTORY      = 14,
    GUILD_FORUM          = 15
}

export type NotImplementedChannelTypes = ChannelTypes.GUILD_DIRECTORY;
export type PrivateChannelTypes = ChannelTypes.DM | ChannelTypes.GROUP_DM;
export type GuildChannelTypes = Exclude<ChannelTypes, PrivateChannelTypes | NotImplementedChannelTypes>;
export type GuildChannelTypesWithoutThreads = Exclude<GuildChannelTypes, ThreadChannelTypes>;
export type TextChannelTypes = ChannelTypes.GUILD_TEXT | ChannelTypes.DM | ChannelTypes.GROUP_DM | ChannelTypes.GUILD_ANNOUNCEMENT | ChannelTypes.ANNOUNCEMENT_THREAD | ChannelTypes.PUBLIC_THREAD | ChannelTypes.PRIVATE_THREAD;
export type GuildTextChannelTypes = Exclude<TextChannelTypes, PrivateChannelTypes>;
export type ThreadChannelTypes = ChannelTypes.ANNOUNCEMENT_THREAD | ChannelTypes.PUBLIC_THREAD | ChannelTypes.PRIVATE_THREAD;
export type VoiceChannelTypes = ChannelTypes.GUILD_VOICE | ChannelTypes.GUILD_STAGE_VOICE;

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
    "ebay",
    "epicgames",
    "facebook",
    "github",
    "leagueoflegends",
    "paypal",
    "playstation",
    "reddit",
    "riotgames",
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

// values won't be statically typed if we use bit shifting, and enums can't use bigints
export const Permissions = {
    CREATE_INSTANT_INVITE:               1n,
    KICK_MEMBERS:                        2n,
    BAN_MEMBERS:                         4n,
    ADMINISTRATOR:                       8n,
    MANAGE_CHANNELS:                     16n,
    MANAGE_GUILD:                        32n,
    ADD_REACTIONS:                       64n,
    VIEW_AUDIT_LOG:                      128n,
    PRIORITY_SPEAKER:                    256n,
    STREAM:                              512n,
    VIEW_CHANNEL:                        1024n,
    SEND_MESSAGES:                       2048n,
    SEND_TTS_MESSAGES:                   4096n,
    MANAGE_MESSAGES:                     8192n,
    EMBED_LINKS:                         16384n,
    ATTACH_FILES:                        32768n,
    READ_MESSAGE_HISTORY:                65536n,
    MENTION_EVERYONE:                    131072n,
    USE_EXTERNAL_EMOJIS:                 262144n,
    VIEW_GUILD_INSIGHTS:                 524288n,
    CONNECT:                             1048576n,
    SPEAK:                               2097152n,
    MUTE_MEMBERS:                        4194304n,
    DEAFEN_MEMBERS:                      8388608n,
    MOVE_MEMBERS:                        16777216n,
    USE_VAD:                             33554432n,
    CHANGE_NICKNAME:                     67108864n,
    MANAGE_NICKNAMES:                    134217728n,
    MANAGE_ROLES:                        268435456n,
    MANAGE_WEBHOOKS:                     536870912n,
    MANAGE_EMOJIS_AND_STICKERS:          1073741824n,
    USE_APPLICATION_COMMANDS:            2147483648n,
    REQUEST_TO_SPEAK:                    4294967296n,
    MANAGE_EVENTS:                       8589934592n,
    MANAGE_THREADS:                      17179869184n,
    CREATE_PUBLIC_THREADS:               34359738368n,
    CREATE_PRIVATE_THREADS:              68719476736n,
    USE_EXTERNAL_STICKERS:               137438953472n,
    SEND_MESSAGES_IN_THREADS:            274877906944n,
    USE_EMBEDDED_ACTIVITIES:             549755813888n,
    MODERATE_MEMBERS:                    1099511627776n,
    VIEW_CREATOR_MONETIZATION_ANALYTICS: 2199023255552n
} as const;
export type PermissionName = keyof typeof Permissions;
export const AllGuildPermissions = Permissions.KICK_MEMBERS |
    Permissions.BAN_MEMBERS |
    Permissions.ADMINISTRATOR |
    Permissions.MANAGE_CHANNELS |
    Permissions.MANAGE_GUILD |
    Permissions.VIEW_AUDIT_LOG |
    Permissions.VIEW_GUILD_INSIGHTS |
    Permissions.CHANGE_NICKNAME |
    Permissions.MANAGE_NICKNAMES |
    Permissions.MANAGE_ROLES |
    Permissions.MANAGE_WEBHOOKS |
    Permissions.MANAGE_EMOJIS_AND_STICKERS |
    Permissions.MANAGE_EVENTS |
    Permissions.MODERATE_MEMBERS |
    Permissions.VIEW_CREATOR_MONETIZATION_ANALYTICS;
export const AllTextPermissions = Permissions.CREATE_INSTANT_INVITE |
    Permissions.MANAGE_CHANNELS |
    Permissions.ADD_REACTIONS |
    Permissions.VIEW_CHANNEL |
    Permissions.SEND_MESSAGES |
    Permissions.SEND_TTS_MESSAGES |
    Permissions.MANAGE_MESSAGES |
    Permissions.EMBED_LINKS |
    Permissions.ATTACH_FILES |
    Permissions.READ_MESSAGE_HISTORY |
    Permissions.MENTION_EVERYONE |
    Permissions.USE_EXTERNAL_EMOJIS |
    Permissions.MANAGE_ROLES |
    Permissions.MANAGE_WEBHOOKS |
    Permissions.USE_APPLICATION_COMMANDS |
    Permissions.MANAGE_THREADS |
    Permissions.CREATE_PUBLIC_THREADS |
    Permissions.CREATE_PRIVATE_THREADS |
    Permissions.USE_EXTERNAL_STICKERS |
    Permissions.SEND_MESSAGES_IN_THREADS;
export const AllVoicePermissions = Permissions.CREATE_INSTANT_INVITE |
    Permissions.MANAGE_CHANNELS |
    Permissions.PRIORITY_SPEAKER |
    Permissions.STREAM |
    Permissions.VIEW_CHANNEL |
    Permissions.CONNECT |
    Permissions.SPEAK |
    Permissions.MUTE_MEMBERS |
    Permissions.DEAFEN_MEMBERS |
    Permissions.MOVE_MEMBERS |
    Permissions.USE_VAD |
    Permissions.MANAGE_ROLES |
    Permissions.REQUEST_TO_SPEAK |
    Permissions.USE_EMBEDDED_ACTIVITIES;
export const AllPermissions = AllGuildPermissions | AllTextPermissions | AllVoicePermissions;

export enum ChannelFlags {
    /** For threads, if this thread is pinned in a forum channel. */
    PINNED             = 1 << 1,
    /** @deprecated This was an unofficial name from us. */
    FORUM_TAG_REQUIRED = 1 << 4,
    /** For forums, if tags are required when creating threads. */
    REQUIRE_TAG = 1 << 4
}

export enum SortOrderModes {
    /** Sort forum posts by activity. */
    RECENT_ACTIVITY = 0,
    /** Sort forum posts by creation time (from most recent to oldest). */
    CREATION_TIME = 1
}

export enum TeamMembershipState {
    INVITED  = 1,
    ACCEPTED = 2
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
    /** this generates a webhook that is returned in the oauth token response for authorization code grants */
    WEBHOOK_INCOMING = "webhook.incoming"
}

export enum ComponentTypes {
    ACTION_ROW  = 1,
    BUTTON      = 2,
    SELECT_MENU = 3,
    TEXT_INPUT  = 4
}
export type MessageComponentTypes = ComponentTypes.BUTTON | ComponentTypes.SELECT_MENU;
export type ModalComponentTypes = ComponentTypes.TEXT_INPUT;

export enum ButtonStyles {
    PRIMARY   = 1,
    SECONDARY = 2,
    SUCCESS   = 3,
    DANGER    = 4,
    LINK      = 5
}

export enum TextInputStyles {
    SHORT     = 1,
    PARAGRAPH = 2
}

export enum MessageFlags {
    CROSSPOSTED                            = 1,
    IS_CROSSPOST                           = 2,
    SUPPRESS_EMBEDS                        = 4,
    SOURCE_MESSAGE_DELETED                 = 8,
    URGENT                                 = 16,
    HAS_THREAD                             = 32,
    EPHEMERAL                              = 64,
    LOADING                                = 128,
    FAILED_TO_MENTION_SOME_ROLES_IN_THREAD = 256,
}

export enum MessageTypes {
    DEFAULT                = 0,
    RECIPIENT_ADD          = 1,
    RECIPIENT_REMOVE       = 2,
    CALL                   = 3,
    CHANNEL_NAME_CHANGE    = 4,
    CHANNEL_ICON_CHANGE    = 5,
    CHANNEL_PINNED_MESSAGE = 6,
    USER_JOIN              = 7,
    GUILD_BOOST            = 8,
    GUILD_BOOST_TIER_1     = 9,
    GUILD_BOOST_TIER_2     = 10,
    GUILD_BOOST_TIER_3     = 11,
    CHANNEL_FOLLOW_ADD     = 12,

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
}

export enum MessageActivityTypes {
    JOIN         = 1,
    SPECTATE     = 2,
    LISTEN       = 3,
    JOIN_REQUEST = 5
}

export enum InteractionTypes {
    PING                             = 1,
    APPLICATION_COMMAND              = 2,
    MESSAGE_COMPONENT                = 3,
    APPLICATION_COMMAND_AUTOCOMPLETE = 4,
    MODAL_SUBMIT                     = 5
}

export enum InviteTargetTypes {
    STREAM               = 1,
    EMBEDDED_APPLICATION = 2,
}

export enum GuildScheduledEventPrivacyLevels {
    /** @deprecated */
    PUBLIC     = 1,
    GUILD_ONLY = 2
}

export enum GuildScheduledEventStatuses {
    SCHEDULED = 1,
    ACTIVE    = 2,
    COMPLETED = 3,
    CANCELED = 4
}

export enum GuildScheduledEventEntityTypes {
    STAGE_INSTANCE = 1,
    VOICE          = 2,
    EXTERNAL       = 3
}

export enum StageInstancePrivacyLevels {
    /** @deprecated */
    PUBLIC     = 1,
    GUILD_ONLY = 2
}

export enum AutoModerationEventTypes {
    MESSAGE_SEND = 1
}

export enum AutoModerationTriggerTypes {
    KEYWORD        = 1,
    SPAM           = 3,
    KEYWORD_PRESET = 4,
    MENTION_SPAM   = 5
}

export enum AutoModerationKeywordPresetTypes {
    PROFANITY      = 1,
    SEXUAL_CONTENT = 2,
    SLURS          = 3
}

export enum AutoModerationActionTypes {
    BLOCK_MESSAGE      = 1,
    SEND_ALERT_MESSAGE = 2,
    TIMEOUT            = 3
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

    AUTO_MODERATION_RULE_CREATE                 = 140,
    AUTO_MODERATION_RULE_UPDATE                 = 141,
    AUTO_MODERATION_RULE_DELETE                 = 142,
    AUTO_MODERATION_BLOCK_MESSAGE               = 143,
    /** @deprecated This was an unofficial name from us. */
    AUTO_MODERATION_ALERT                       = 144,
    AUTO_MODERATION_FLAG_TO_CHANNEL             = 144,
    /** @deprecated This was an unofficial name from us. */
    AUTO_MODERATION_TIMEOUT                     = 145,
    AUTO_MODERATION_USER_COMMUNICATION_DISABLED = 145
}

export enum ApplicationCommandTypes {
    CHAT_INPUT = 1,
    USER       = 2,
    MESSAGE    = 3
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
    ATTACHMENT        = 11
}

export enum ApplicationCommandPermissionTypes {
    ROLE    = 1,
    USER    = 2,
    CHANNEL = 3
}

export enum InteractionResponseTypes {
    PONG                                    = 1,
    CHANNEL_MESSAGE_WITH_SOURCE             = 4,
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE    = 5,
    DEFERRED_UPDATE_MESAGE                  = 6,
    UPDATE_MESSAGE                          = 7,
    APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8,
    MODAL                                   = 9
}

export enum Intents {
    GUILDS                        = 1,
    GUILD_MEMBERS                 = 2,
    GUILD_BANS                    = 4,
    GUILD_EMOJIS_AND_STICKERS     = 8,
    GUILD_INTEGRATIONS            = 16,
    GUILD_WEBHOOKS                = 32,
    GUILD_INVITES                 = 64,
    GUILD_VOICE_STATES            = 128,
    GUILD_PRESENCES               = 256,
    GUILD_MESSAGES                = 512,
    GUILD_MESSAGE_REACTIONS       = 1024,
    GUILD_MESSAGE_TYPING          = 2048,
    DIRECT_MESSAGES               = 4096,
    DIRECT_MESSAGE_REACTIONS      = 8192,
    DIRECT_MESSAGE_TYPING         = 16384,
    MESSAGE_CONTENT               = 32768,
    GUILD_SCHEDULED_EVENTS        = 65536,
    AUTO_MODERATION_CONFIGURATION = 1048576,
    AUTO_MODERATION_EXECUTION     = 2097152
}

export type IntentNames = keyof typeof Intents;

export const AllNonPrivilegedIntents =
    Intents.GUILDS |
    Intents.GUILD_BANS |
    Intents.GUILD_EMOJIS_AND_STICKERS |
    Intents.GUILD_INTEGRATIONS |
    Intents.GUILD_WEBHOOKS |
    Intents.GUILD_INVITES |
    Intents.GUILD_VOICE_STATES |
    Intents.GUILD_MESSAGES |
    Intents.GUILD_MESSAGE_REACTIONS |
    Intents.GUILD_MESSAGE_TYPING |
    Intents.DIRECT_MESSAGES |
    Intents.DIRECT_MESSAGE_REACTIONS |
    Intents.DIRECT_MESSAGE_TYPING |
    Intents.GUILD_SCHEDULED_EVENTS |
    Intents.AUTO_MODERATION_CONFIGURATION |
    Intents.AUTO_MODERATION_EXECUTION;
export const AllPrivilegedIntents =
    Intents.GUILD_MEMBERS |
    Intents.GUILD_PRESENCES |
    Intents.MESSAGE_CONTENT;
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
    CLIENT_DISCONNECT   = 13
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

export enum ActivityTypes {
    GAME      = 0,
    STREAMING = 1,
    LISTENING = 2,
    WATCHING  = 3,
    CUSTOM    = 4,
    COMPETING = 5
}

export enum ActivityFlags {
    INSTANCE                    = 1,
    JOIN                        = 2,
    SPECTATE                    = 4,
    JOIN_REQUEST                = 8,
    SYNC                        = 16,
    PLAY                        = 32,
    PARTY_PRIVACY_FRIENDS_ONLY  = 64,
    PARTY_PRIVACY_VOICE_CHANNEL = 128,
    EMBEDDED                    = 256
}

export enum ThreadMemberFlags {
    HAS_INTERACTED = 1,
    ALL_MESSAGES   = 2,
    ONLY_MENTIONS  = 4,
    NO_MESSAGES    = 8
}
