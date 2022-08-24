import pkg from "../package.json";

export const GATEWAY_VERSION = 10;
export const REST_VERSION    = 10;
export const BASE_URL        = "https://discord.com";
export const API_URL        = `${BASE_URL}/api/v${REST_VERSION}`;
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
	GUILD_ANNOUNCEMENT   = 5,

	ANNOUNCEMENT_THREAD  = 10,
	PUBLIC_THREAD        = 11,
	PRIVATE_THREAD       = 12,
	GUILD_STAGE_VOICE    = 13,
	GUILD_DIRECTORY      = 14,
	GUILD_FORUM          = 15
}

export type NotImplementedChannelTypes = ChannelTypes.GUILD_DIRECTORY | ChannelTypes.GUILD_FORUM;
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

// values won't be statically typed if we use bit shifting
export const Permissions = {
	CREATE_INSTANT_INVITE:      1n,
	KICK_MEMBERS:               2n,
	BAN_MEMBERS:                4n,
	ADMINISTRATOR:              8n,
	MANAGE_CHANNELS:            16n,
	MANAGE_GUILD:               32n,
	ADD_REACTIONS:              64n,
	VIEW_AUDIT_LOG:             128n,
	PRIORITY_SPEAKER:           256n,
	STREAM:                     512n,
	VIEW_CHANNEL:               1024n,
	SEND_MESSAGES:              2048n,
	SEND_TTS_MESSAGES:          4096n,
	MANAGE_MESSAGES:            8192n,
	EMBED_LINKS:                16384n,
	ATTACH_FILES:               32768n,
	READ_MESSAGE_HISTORY:       65536n,
	MENTION_EVERYONE:           131072n,
	USE_EXTERNAL_EMOJIS:        262144n,
	VIEW_GUILD_INSIGHTS:        524288n,
	CONNECT:                    1048576n,
	SPEAK:                      2097152n,
	MUTE_MEMBERS:               4194304n,
	DEAFEN_MEMBERS:             8388608n,
	MOVE_MEMBERS:               16777216n,
	USE_VAD:                    33554432n,
	CHANGE_NICKNAME:            67108864n,
	MANAGE_NICKNAMES:           134217728n,
	MANAGE_ROLES:               268435456n,
	MANAGE_WEBHOOKS:            536870912n,
	MANAGE_EMOJIS_AND_STICKERS: 1073741824n,
	USE_APPLICATION_COMMANDS:   2147483648n,
	REQUEST_TO_SPEAK:           4294967296n,
	MANAGE_EVENTS:              8589934592n,
	MANAGE_THREADS:             17179869184n,
	CREATE_PUBLIC_THREADS:      34359738368n,
	CREATE_PRIVATE_THREADS:     68719476736n,
	USE_EXTERNAL_STICKERS:      137438953472n,
	SEND_MESSAGES_IN_THREADS:   274877906944n,
	USE_EMBEDDED_ACTIVITIES:    549755813888n,
	MODERATE_MEMBERS:           1099511627776n
} as const;
export type Permission = keyof typeof Permissions;
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
	Permissions.MODERATE_MEMBERS;
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
	PINNED = 1 << 1
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
	/**	allows your app to read build data for a user's applications */
	APPLICATIONS_BUILDS_READ = "applications.builds.read",
	/**	allows your app to upload/update builds for a user's applications - requires Discord approval */
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
	/**	allows [/users/@me/connections](https://discord.com/developers/docs/resources/user#get-user-connections) to return linked third-party accounts */
	CONNECTIONS = "connections",
	/** allows your app to see information about the user's DMs and group DMs - requires Discord approval */
	DM_CHANNELS_READ = "dm_channels.read",
	/**	enables [/users/@me](https://discord.com/developers/docs/resources/user#get-current-user) to return an `email` */
	EMAIL = "email",
	/** allows your app to [join users to a group dm](https://discord.com/developers/docs/resources/channel#group-dm-add-recipient) */
	GDM_JOIN = "gdm.join",
	/**	allows [/users/@me/guilds](https://discord.com/developers/docs/resources/user#get-current-user-guilds) to return basic information about all of a user's guilds */
	GUILDS = "guilds",
	/** allows [/guilds/{guild.id}/members/{user.id}](https://discord.com/developers/docs/resources/guild#add-guild-member) to be used for joining users to a guild */
	GUILDS_JOIN = "guilds.join",
	/** allows [/users/@me/guilds/{guild.id}/member](https://discord.com/developers/docs/resources/user#get-current-user-guild-member) to return a user's member information in a guild */
	GUILDS_MEMBERS_READ = "guilds.members.read",
	/** allows [/users/@me](https://discord.com/developers/docs/resources/user#get-current-user) without `email` */
	IDENTIFY = "identify",
	/** for local rpc server api access, this allows you to read messages from all client channels (otherwise restricted to channels/guilds your app creates) */
	MESSAGES_READ = "messages.read",
	/**	allows your app to know a user's friends and implicit relationships - requires Discord approval */
	RELATIONSHIPS_READ = "relationships.read",
	/**	for local rpc server access, this allows you to control a user's local Discord client - requires Discord approval */
	RPC = "rpc",
	/** for local rpc server access, this allows you to receive notifications pushed out to the user - requires Discord approval */
	RPC_ACTIVITIES_READ = "rpc.activities.read",
	/** for local rpc server access, this allows you to update a user's activity - requires Discord approval */
	RPC_ACTIVITIES_WRITE = "rpc.activities.write",
	/** for local rpc server access, this allows you to receive notifications pushed out to the user - requires Discord approval */
	RPC_NOTIFICATIONS_READ = "rpc.notifications.read",
	/**	for local rpc server access, this allows you to read a user's voice settings and listen for voice events - requires Discord approval */
	RPC_VOICE_READ = "rpc.voice.read",
	/**	for local rpc server access, this allows you to update a user's voice settings - requires Discord approval */
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
	DEFAULT                                      = 0,
	RECIPIENT_ADD                                = 1,
	RECIPIENT_REMOVE                             = 2,
	CALL                                         = 3,
	CHANNEL_NAME_CHANGE                          = 4,
	CHANNEL_ICON_CHANGE                          = 5,
	CHANNEL_PINNED_MESSAGE                       = 6,
	USER_JOIN                                    = 7,
	GUILD_BOOST                                  = 8,
	GUILD_BOOST_TIER_1	                         = 9,
	GUILD_BOOST_TIER_2	                         = 10,
	GUILD_BOOST_TIER_3	                         = 11,
	CHANNEL_FOLLOW_ADD	                         = 12,

	GUILD_DISCOVERY_DISQUALIFIED                 = 14,
	GUILD_DISCOVERY_REQUALIFIED	                 = 15,
	GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
	GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING   = 17,
	THREAD_CREATED                               = 18,
	REPLY                                        = 19,
	CHAT_INPUT_COMMAND                           = 20,
	THREAD_STARTER_MESSAGE                       = 21,
	GUILD_INVITE_REMINDER                        = 22,
	CONTEXT_MENU_COMMAND                         = 23,
	AUTO_MODERATION_ACTION                       = 24
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

export enum ScheduledEventPrivacyLevels {
	GUILD_ONLY = 2
}

export enum ScheduledEventStatuses {
	SCHEDULED = 1,
	ACTIVE    = 2,
	COMPLETED = 3,
	CANCELLED = 4
}

export enum ScheduledEventEntityTypes {
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
	HARMFUL_LINK   = 2,
	SPAM           = 3,
	KEYWORD_PRESET = 4,
	MENTION_SPAM   = 5
}

export enum AutoModerationKeywordPresetTypes {
	PROFANITY = 1,
	SEXUAL_CONTENT = 2,
	SLURS = 3
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

	AUTO_MODERATION_RULE_CREATE   = 140,
	AUTO_MODERATION_RULE_UPDATE   = 141,
	AUTO_MODERATION_RULE_DELETE   = 142,
	AUTO_MODERATION_BLOCK_MESSAGE = 143
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
	INTEGER		      = 4,
	BOOLEAN           = 5,
	USER			  = 6,
	CHANNEL			  = 7,
	ROLE			  = 8,
	MENTIONABLE		  = 9,
	NUMBER			  = 10,
	ATTACHMENT		  = 11
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
