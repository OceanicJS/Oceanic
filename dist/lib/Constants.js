"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildScheduledEventStatuses = exports.GuildScheduledEventPrivacyLevels = exports.InviteTargetTypes = exports.InteractionTypes = exports.MessageActivityTypes = exports.MessageTypes = exports.MessageFlags = exports.TextInputStyles = exports.ButtonStyles = exports.ComponentTypes = exports.OAuthScopes = exports.TeamMembershipState = exports.ChannelFlags = exports.AllPermissions = exports.AllVoicePermissions = exports.AllTextPermissions = exports.AllGuildPermissions = exports.Permissions = exports.IntegrationExpireBehaviors = exports.IntegrationTypes = exports.ConnectionServices = exports.VisibilityTypes = exports.ThreadAutoArchiveDurations = exports.VideoQualityModes = exports.OverwriteTypes = exports.ChannelTypes = exports.StickerFormatTypes = exports.StickerTypes = exports.SystemChannelFlags = exports.PremiumTiers = exports.GuildNSFWLevels = exports.VerificationLevels = exports.MFALevels = exports.ExplicitContentFilterLevels = exports.DefaultMessageNotificationLevels = exports.GuildFeatures = exports.ApplicationFlags = exports.UserFlags = exports.PremiumTypes = exports.WebhookTypes = exports.ImageFormats = exports.RESTMethods = exports.MAX_IMAGE_SIZE = exports.MIN_IMAGE_SIZE = exports.USER_AGENT = exports.VERSION = exports.API_URL = exports.BASE_URL = exports.REST_VERSION = exports.GATEWAY_VERSION = void 0;
exports.ThreadMemberFlags = exports.ActivityFlags = exports.ActivityTypes = exports.VoiceCloseCodes = exports.VoiceOPCodes = exports.GatewayCloseCodes = exports.GatewayOPCodes = exports.AllIntents = exports.AllPrivilegedIntents = exports.AllNonPrivilegedIntents = exports.Intents = exports.InteractionResponseTypes = exports.ApplicationCommandPermissionTypes = exports.ApplicationCommandOptionTypes = exports.ApplicationCommandTypes = exports.AuditLogActionTypes = exports.AutoModerationActionTypes = exports.AutoModerationKeywordPresetTypes = exports.AutoModerationTriggerTypes = exports.AutoModerationEventTypes = exports.StageInstancePrivacyLevels = exports.GuildScheduledEventEntityTypes = void 0;
const package_json_1 = __importDefault(require("../package.json"));
exports.GATEWAY_VERSION = 10;
exports.REST_VERSION = 10;
exports.BASE_URL = "https://discord.com";
exports.API_URL = `${exports.BASE_URL}/api/v${exports.REST_VERSION}`;
exports.VERSION = package_json_1.default.version;
exports.USER_AGENT = `Oceanic/${exports.VERSION} (https://github.com/DonovanDMC/Oceanic)`;
exports.MIN_IMAGE_SIZE = 64;
exports.MAX_IMAGE_SIZE = 4096;
exports.RESTMethods = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
];
exports.ImageFormats = [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "gif"
];
var WebhookTypes;
(function (WebhookTypes) {
    WebhookTypes[WebhookTypes["INCOMING"] = 1] = "INCOMING";
    WebhookTypes[WebhookTypes["CHANNEL_FOLLOWER"] = 2] = "CHANNEL_FOLLOWER";
    WebhookTypes[WebhookTypes["APPLICATION"] = 3] = "APPLICATION";
})(WebhookTypes = exports.WebhookTypes || (exports.WebhookTypes = {}));
var PremiumTypes;
(function (PremiumTypes) {
    PremiumTypes[PremiumTypes["NONE"] = 0] = "NONE";
    PremiumTypes[PremiumTypes["NITRO_CLASSIC"] = 1] = "NITRO_CLASSIC";
    PremiumTypes[PremiumTypes["NITRO"] = 2] = "NITRO";
})(PremiumTypes = exports.PremiumTypes || (exports.PremiumTypes = {}));
var UserFlags;
(function (UserFlags) {
    UserFlags[UserFlags["STAFF"] = 1] = "STAFF";
    UserFlags[UserFlags["PARTNER"] = 2] = "PARTNER";
    UserFlags[UserFlags["HYPESQUAD"] = 4] = "HYPESQUAD";
    UserFlags[UserFlags["BUGHUNTER_LEVEL_1"] = 8] = "BUGHUNTER_LEVEL_1";
    UserFlags[UserFlags["HYPESQUAD_BRAVERY"] = 64] = "HYPESQUAD_BRAVERY";
    UserFlags[UserFlags["HYPESQUAD_BRILLIANCE"] = 128] = "HYPESQUAD_BRILLIANCE";
    UserFlags[UserFlags["HYPESQUAD_BALANCE"] = 256] = "HYPESQUAD_BALANCE";
    UserFlags[UserFlags["EARLY_SUPPORTER"] = 512] = "EARLY_SUPPORTER";
    UserFlags[UserFlags["PSUEDO_TEAM_USER"] = 1024] = "PSUEDO_TEAM_USER";
    UserFlags[UserFlags["SYSTEM"] = 4096] = "SYSTEM";
    UserFlags[UserFlags["BUG_HUNTER_LEVEL_2"] = 16384] = "BUG_HUNTER_LEVEL_2";
    UserFlags[UserFlags["VERIFIED_BOT"] = 65536] = "VERIFIED_BOT";
    UserFlags[UserFlags["VERIFIED_DEVELOPER"] = 131072] = "VERIFIED_DEVELOPER";
    UserFlags[UserFlags["CERTIFIED_MODERATOR"] = 262144] = "CERTIFIED_MODERATOR";
    UserFlags[UserFlags["BOT_HTTP_INTERACTIONS"] = 524288] = "BOT_HTTP_INTERACTIONS";
    UserFlags[UserFlags["SPAMMER"] = 1048576] = "SPAMMER";
})(UserFlags = exports.UserFlags || (exports.UserFlags = {}));
var ApplicationFlags;
(function (ApplicationFlags) {
    ApplicationFlags[ApplicationFlags["EMBEDDED_RELEASED"] = 2] = "EMBEDDED_RELEASED";
    ApplicationFlags[ApplicationFlags["MANAGED_EMOJI"] = 4] = "MANAGED_EMOJI";
    ApplicationFlags[ApplicationFlags["GROUP_DM_CREATE"] = 16] = "GROUP_DM_CREATE";
    ApplicationFlags[ApplicationFlags["GATEWAY_PRESENCE"] = 4096] = "GATEWAY_PRESENCE";
    ApplicationFlags[ApplicationFlags["GATEWAY_PRESENCE_LIMITED"] = 8192] = "GATEWAY_PRESENCE_LIMITED";
    ApplicationFlags[ApplicationFlags["GATEWAY_GUILD_MEMBERS"] = 16384] = "GATEWAY_GUILD_MEMBERS";
    ApplicationFlags[ApplicationFlags["GATEWAY_GUILD_MEMBERS_LIMITED"] = 32768] = "GATEWAY_GUILD_MEMBERS_LIMITED";
    ApplicationFlags[ApplicationFlags["VERIFICATION_PENDING_GUILD_LIMIT"] = 65536] = "VERIFICATION_PENDING_GUILD_LIMIT";
    ApplicationFlags[ApplicationFlags["EMBEDDED"] = 131072] = "EMBEDDED";
    ApplicationFlags[ApplicationFlags["GATEWAY_MESSAGE_CONTENT"] = 262144] = "GATEWAY_MESSAGE_CONTENT";
    ApplicationFlags[ApplicationFlags["GATEWAY_MESSAGE_CONTENT_LIMITED"] = 524288] = "GATEWAY_MESSAGE_CONTENT_LIMITED";
    ApplicationFlags[ApplicationFlags["EMBEDDED_FIRST_PARTY"] = 1048576] = "EMBEDDED_FIRST_PARTY";
    ApplicationFlags[ApplicationFlags["APPLICATION_COMMAND_BADGE"] = 2097152] = "APPLICATION_COMMAND_BADGE";
})(ApplicationFlags = exports.ApplicationFlags || (exports.ApplicationFlags = {}));
exports.GuildFeatures = [
    "AUTO_MODERATION",
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
];
var DefaultMessageNotificationLevels;
(function (DefaultMessageNotificationLevels) {
    DefaultMessageNotificationLevels[DefaultMessageNotificationLevels["ALL_MESSAGES"] = 0] = "ALL_MESSAGES";
    DefaultMessageNotificationLevels[DefaultMessageNotificationLevels["ONLY_MENTIONS"] = 1] = "ONLY_MENTIONS";
})(DefaultMessageNotificationLevels = exports.DefaultMessageNotificationLevels || (exports.DefaultMessageNotificationLevels = {}));
var ExplicitContentFilterLevels;
(function (ExplicitContentFilterLevels) {
    ExplicitContentFilterLevels[ExplicitContentFilterLevels["DISABLED"] = 0] = "DISABLED";
    ExplicitContentFilterLevels[ExplicitContentFilterLevels["MEMBERS_WITHOUT_ROLES"] = 1] = "MEMBERS_WITHOUT_ROLES";
    ExplicitContentFilterLevels[ExplicitContentFilterLevels["ALL_MEMBERS"] = 2] = "ALL_MEMBERS";
})(ExplicitContentFilterLevels = exports.ExplicitContentFilterLevels || (exports.ExplicitContentFilterLevels = {}));
var MFALevels;
(function (MFALevels) {
    MFALevels[MFALevels["NONE"] = 0] = "NONE";
    MFALevels[MFALevels["ELEVATED"] = 1] = "ELEVATED";
})(MFALevels = exports.MFALevels || (exports.MFALevels = {}));
var VerificationLevels;
(function (VerificationLevels) {
    VerificationLevels[VerificationLevels["NONE"] = 0] = "NONE";
    VerificationLevels[VerificationLevels["LOW"] = 1] = "LOW";
    VerificationLevels[VerificationLevels["MEDIUM"] = 2] = "MEDIUM";
    VerificationLevels[VerificationLevels["HIGH"] = 3] = "HIGH";
    VerificationLevels[VerificationLevels["VERY_HIGH"] = 4] = "VERY_HIGH";
})(VerificationLevels = exports.VerificationLevels || (exports.VerificationLevels = {}));
var GuildNSFWLevels;
(function (GuildNSFWLevels) {
    GuildNSFWLevels[GuildNSFWLevels["DEFAULT"] = 0] = "DEFAULT";
    GuildNSFWLevels[GuildNSFWLevels["EXPLICIT"] = 1] = "EXPLICIT";
    GuildNSFWLevels[GuildNSFWLevels["SAFE"] = 2] = "SAFE";
    GuildNSFWLevels[GuildNSFWLevels["AGE_RESTRICTED"] = 3] = "AGE_RESTRICTED";
})(GuildNSFWLevels = exports.GuildNSFWLevels || (exports.GuildNSFWLevels = {}));
var PremiumTiers;
(function (PremiumTiers) {
    PremiumTiers[PremiumTiers["NONE"] = 0] = "NONE";
    PremiumTiers[PremiumTiers["TIER_1"] = 1] = "TIER_1";
    PremiumTiers[PremiumTiers["TIER_2"] = 2] = "TIER_2";
    PremiumTiers[PremiumTiers["TIER_3"] = 3] = "TIER_3";
})(PremiumTiers = exports.PremiumTiers || (exports.PremiumTiers = {}));
var SystemChannelFlags;
(function (SystemChannelFlags) {
    SystemChannelFlags[SystemChannelFlags["SUPPRESS_JOIN_NOTIFICATIONS"] = 1] = "SUPPRESS_JOIN_NOTIFICATIONS";
    SystemChannelFlags[SystemChannelFlags["SUPPRESS_PREMIUM_SUBSCRIPTIONS"] = 2] = "SUPPRESS_PREMIUM_SUBSCRIPTIONS";
    SystemChannelFlags[SystemChannelFlags["SUPPRESS_GUILD_REMINDER_NOTIFICATIONS"] = 4] = "SUPPRESS_GUILD_REMINDER_NOTIFICATIONS";
    SystemChannelFlags[SystemChannelFlags["SUPPRESS_JOIN_NOTIFICATION_REPLIES"] = 8] = "SUPPRESS_JOIN_NOTIFICATION_REPLIES";
})(SystemChannelFlags = exports.SystemChannelFlags || (exports.SystemChannelFlags = {}));
var StickerTypes;
(function (StickerTypes) {
    StickerTypes[StickerTypes["STANDARD"] = 1] = "STANDARD";
    StickerTypes[StickerTypes["GUILD"] = 2] = "GUILD";
})(StickerTypes = exports.StickerTypes || (exports.StickerTypes = {}));
var StickerFormatTypes;
(function (StickerFormatTypes) {
    StickerFormatTypes[StickerFormatTypes["PNG"] = 1] = "PNG";
    StickerFormatTypes[StickerFormatTypes["APNG"] = 2] = "APNG";
    StickerFormatTypes[StickerFormatTypes["LOTTIE"] = 3] = "LOTTIE";
})(StickerFormatTypes = exports.StickerFormatTypes || (exports.StickerFormatTypes = {}));
var ChannelTypes;
(function (ChannelTypes) {
    ChannelTypes[ChannelTypes["GUILD_TEXT"] = 0] = "GUILD_TEXT";
    ChannelTypes[ChannelTypes["DM"] = 1] = "DM";
    ChannelTypes[ChannelTypes["GUILD_VOICE"] = 2] = "GUILD_VOICE";
    ChannelTypes[ChannelTypes["GROUP_DM"] = 3] = "GROUP_DM";
    ChannelTypes[ChannelTypes["GUILD_CATEGORY"] = 4] = "GUILD_CATEGORY";
    ChannelTypes[ChannelTypes["GUILD_ANNOUNCEMENT"] = 5] = "GUILD_ANNOUNCEMENT";
    ChannelTypes[ChannelTypes["ANNOUNCEMENT_THREAD"] = 10] = "ANNOUNCEMENT_THREAD";
    ChannelTypes[ChannelTypes["PUBLIC_THREAD"] = 11] = "PUBLIC_THREAD";
    ChannelTypes[ChannelTypes["PRIVATE_THREAD"] = 12] = "PRIVATE_THREAD";
    ChannelTypes[ChannelTypes["GUILD_STAGE_VOICE"] = 13] = "GUILD_STAGE_VOICE";
    ChannelTypes[ChannelTypes["GUILD_DIRECTORY"] = 14] = "GUILD_DIRECTORY";
    ChannelTypes[ChannelTypes["GUILD_FORUM"] = 15] = "GUILD_FORUM";
})(ChannelTypes = exports.ChannelTypes || (exports.ChannelTypes = {}));
var OverwriteTypes;
(function (OverwriteTypes) {
    OverwriteTypes[OverwriteTypes["ROLE"] = 0] = "ROLE";
    OverwriteTypes[OverwriteTypes["MEMBER"] = 1] = "MEMBER";
})(OverwriteTypes = exports.OverwriteTypes || (exports.OverwriteTypes = {}));
var VideoQualityModes;
(function (VideoQualityModes) {
    VideoQualityModes[VideoQualityModes["AUTO"] = 1] = "AUTO";
    VideoQualityModes[VideoQualityModes["FULL"] = 2] = "FULL";
})(VideoQualityModes = exports.VideoQualityModes || (exports.VideoQualityModes = {}));
exports.ThreadAutoArchiveDurations = [
    60,
    1440,
    4320,
    10080
];
var VisibilityTypes;
(function (VisibilityTypes) {
    VisibilityTypes[VisibilityTypes["NONE"] = 0] = "NONE";
    VisibilityTypes[VisibilityTypes["EVERYONE"] = 1] = "EVERYONE";
})(VisibilityTypes = exports.VisibilityTypes || (exports.VisibilityTypes = {}));
exports.ConnectionServices = [
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
];
exports.IntegrationTypes = [
    "twitch",
    "youtube",
    "discord"
];
var IntegrationExpireBehaviors;
(function (IntegrationExpireBehaviors) {
    IntegrationExpireBehaviors[IntegrationExpireBehaviors["REMOVE_ROLE"] = 0] = "REMOVE_ROLE";
    IntegrationExpireBehaviors[IntegrationExpireBehaviors["KICK"] = 1] = "KICK";
})(IntegrationExpireBehaviors = exports.IntegrationExpireBehaviors || (exports.IntegrationExpireBehaviors = {}));
// values won't be statically typed if we use bit shifting, and enums can't use bigints
exports.Permissions = {
    CREATE_INSTANT_INVITE: 1n,
    KICK_MEMBERS: 2n,
    BAN_MEMBERS: 4n,
    ADMINISTRATOR: 8n,
    MANAGE_CHANNELS: 16n,
    MANAGE_GUILD: 32n,
    ADD_REACTIONS: 64n,
    VIEW_AUDIT_LOG: 128n,
    PRIORITY_SPEAKER: 256n,
    STREAM: 512n,
    VIEW_CHANNEL: 1024n,
    SEND_MESSAGES: 2048n,
    SEND_TTS_MESSAGES: 4096n,
    MANAGE_MESSAGES: 8192n,
    EMBED_LINKS: 16384n,
    ATTACH_FILES: 32768n,
    READ_MESSAGE_HISTORY: 65536n,
    MENTION_EVERYONE: 131072n,
    USE_EXTERNAL_EMOJIS: 262144n,
    VIEW_GUILD_INSIGHTS: 524288n,
    CONNECT: 1048576n,
    SPEAK: 2097152n,
    MUTE_MEMBERS: 4194304n,
    DEAFEN_MEMBERS: 8388608n,
    MOVE_MEMBERS: 16777216n,
    USE_VAD: 33554432n,
    CHANGE_NICKNAME: 67108864n,
    MANAGE_NICKNAMES: 134217728n,
    MANAGE_ROLES: 268435456n,
    MANAGE_WEBHOOKS: 536870912n,
    MANAGE_EMOJIS_AND_STICKERS: 1073741824n,
    USE_APPLICATION_COMMANDS: 2147483648n,
    REQUEST_TO_SPEAK: 4294967296n,
    MANAGE_EVENTS: 8589934592n,
    MANAGE_THREADS: 17179869184n,
    CREATE_PUBLIC_THREADS: 34359738368n,
    CREATE_PRIVATE_THREADS: 68719476736n,
    USE_EXTERNAL_STICKERS: 137438953472n,
    SEND_MESSAGES_IN_THREADS: 274877906944n,
    USE_EMBEDDED_ACTIVITIES: 549755813888n,
    MODERATE_MEMBERS: 1099511627776n,
    VIEW_CREATOR_MONETIZATION_ANALYTICS: 2199023255552n
};
exports.AllGuildPermissions = exports.Permissions.KICK_MEMBERS |
    exports.Permissions.BAN_MEMBERS |
    exports.Permissions.ADMINISTRATOR |
    exports.Permissions.MANAGE_CHANNELS |
    exports.Permissions.MANAGE_GUILD |
    exports.Permissions.VIEW_AUDIT_LOG |
    exports.Permissions.VIEW_GUILD_INSIGHTS |
    exports.Permissions.CHANGE_NICKNAME |
    exports.Permissions.MANAGE_NICKNAMES |
    exports.Permissions.MANAGE_ROLES |
    exports.Permissions.MANAGE_WEBHOOKS |
    exports.Permissions.MANAGE_EMOJIS_AND_STICKERS |
    exports.Permissions.MANAGE_EVENTS |
    exports.Permissions.MODERATE_MEMBERS |
    exports.Permissions.VIEW_CREATOR_MONETIZATION_ANALYTICS;
exports.AllTextPermissions = exports.Permissions.CREATE_INSTANT_INVITE |
    exports.Permissions.MANAGE_CHANNELS |
    exports.Permissions.ADD_REACTIONS |
    exports.Permissions.VIEW_CHANNEL |
    exports.Permissions.SEND_MESSAGES |
    exports.Permissions.SEND_TTS_MESSAGES |
    exports.Permissions.MANAGE_MESSAGES |
    exports.Permissions.EMBED_LINKS |
    exports.Permissions.ATTACH_FILES |
    exports.Permissions.READ_MESSAGE_HISTORY |
    exports.Permissions.MENTION_EVERYONE |
    exports.Permissions.USE_EXTERNAL_EMOJIS |
    exports.Permissions.MANAGE_ROLES |
    exports.Permissions.MANAGE_WEBHOOKS |
    exports.Permissions.USE_APPLICATION_COMMANDS |
    exports.Permissions.MANAGE_THREADS |
    exports.Permissions.CREATE_PUBLIC_THREADS |
    exports.Permissions.CREATE_PRIVATE_THREADS |
    exports.Permissions.USE_EXTERNAL_STICKERS |
    exports.Permissions.SEND_MESSAGES_IN_THREADS;
exports.AllVoicePermissions = exports.Permissions.CREATE_INSTANT_INVITE |
    exports.Permissions.MANAGE_CHANNELS |
    exports.Permissions.PRIORITY_SPEAKER |
    exports.Permissions.STREAM |
    exports.Permissions.VIEW_CHANNEL |
    exports.Permissions.CONNECT |
    exports.Permissions.SPEAK |
    exports.Permissions.MUTE_MEMBERS |
    exports.Permissions.DEAFEN_MEMBERS |
    exports.Permissions.MOVE_MEMBERS |
    exports.Permissions.USE_VAD |
    exports.Permissions.MANAGE_ROLES |
    exports.Permissions.REQUEST_TO_SPEAK |
    exports.Permissions.USE_EMBEDDED_ACTIVITIES;
exports.AllPermissions = exports.AllGuildPermissions | exports.AllTextPermissions | exports.AllVoicePermissions;
var ChannelFlags;
(function (ChannelFlags) {
    /** For threads, if this thread is pinned in a forum channel. */
    ChannelFlags[ChannelFlags["PINNED"] = 2] = "PINNED";
    /** For forums, if tags are required when creating threads. */
    ChannelFlags[ChannelFlags["FORUM_TAG_REQUIRED"] = 16] = "FORUM_TAG_REQUIRED"; // undocumented
})(ChannelFlags = exports.ChannelFlags || (exports.ChannelFlags = {}));
var TeamMembershipState;
(function (TeamMembershipState) {
    TeamMembershipState[TeamMembershipState["INVITED"] = 1] = "INVITED";
    TeamMembershipState[TeamMembershipState["ACCEPTED"] = 2] = "ACCEPTED";
})(TeamMembershipState = exports.TeamMembershipState || (exports.TeamMembershipState = {}));
var OAuthScopes;
(function (OAuthScopes) {
    /** allows your app to fetch data from a user's "Now Playing/Recently Played" list - requires Discord approval */
    OAuthScopes["ACTIVITIES_READ"] = "activities.read";
    /** allows your app to update a user's activity - requires Discord approval (NOT REQUIRED FOR [GAMESDK ACTIVITY MANAGER](https://discord.com/developers/docs/game-sdk/activities)) */
    OAuthScopes["ACTIVITIES_WRITE"] = "activities.write";
    /** allows your app to read build data for a user's applications */
    OAuthScopes["APPLICATIONS_BUILDS_READ"] = "applications.builds.read";
    /** allows your app to upload/update builds for a user's applications - requires Discord approval */
    OAuthScopes["APPLICATIONS_BUILDS_UPLOAD"] = "applications.builds.upload";
    /** allows your app to use [commands](https://discord.com/developers/docs/interactions/application-commands) in a guild */
    OAuthScopes["APPLICATIONS_COMMANDS"] = "applications.commands";
    OAuthScopes["APPLICATIONS_COMMANDS_PERMISSIONS_UPDATE"] = "applications.commands.permissions.update";
    /** allows your app to update its [commands](https://discord.com/developers/docs/interactions/application-commands) using a Bearer token - [client credentials grant](https://discord.com/developers/docs/topics/oauth2#client-credentials-grant) only */
    OAuthScopes["APPLICATIONS_COMMANDS_UPDATE"] = "applications.commands.update";
    /** allows your app to read entitlements for a user's applications */
    OAuthScopes["APPLICATIONS_ENTITLEMENTS"] = "applications.entitlements";
    /** allows your app to read and update store data (SKUs, store listings, achievements, etc.) for a user's applications */
    OAuthScopes["APPLICATIONS_STORE_UPDATE"] = "applications.store.update";
    /** for oauth2 bots, this puts the bot in the user's selected guild by default */
    OAuthScopes["BOT"] = "bot";
    /** allows [/users/@me/connections](https://discord.com/developers/docs/resources/user#get-user-connections) to return linked third-party accounts */
    OAuthScopes["CONNECTIONS"] = "connections";
    /** allows your app to see information about the user's DMs and group DMs - requires Discord approval */
    OAuthScopes["DM_CHANNELS_READ"] = "dm_channels.read";
    /** enables [/users/@me](https://discord.com/developers/docs/resources/user#get-current-user) to return an `email` */
    OAuthScopes["EMAIL"] = "email";
    /** allows your app to [join users to a group dm](https://discord.com/developers/docs/resources/channel#group-dm-add-recipient) */
    OAuthScopes["GDM_JOIN"] = "gdm.join";
    /** allows [/users/@me/guilds](https://discord.com/developers/docs/resources/user#get-current-user-guilds) to return basic information about all of a user's guilds */
    OAuthScopes["GUILDS"] = "guilds";
    /** allows [/guilds/\{guild.id\}/members/\{user.id\}](https://discord.com/developers/docs/resources/guild#add-guild-member) to be used for joining users to a guild */
    OAuthScopes["GUILDS_JOIN"] = "guilds.join";
    /** allows [/users/@me/guilds/\{guild.id\}/member](https://discord.com/developers/docs/resources/user#get-current-user-guild-member) to return a user's member information in a guild */
    OAuthScopes["GUILDS_MEMBERS_READ"] = "guilds.members.read";
    /** allows [/users/@me](https://discord.com/developers/docs/resources/user#get-current-user) without `email` */
    OAuthScopes["IDENTIFY"] = "identify";
    /** for local rpc server api access, this allows you to read messages from all client channels (otherwise restricted to channels/guilds your app creates) */
    OAuthScopes["MESSAGES_READ"] = "messages.read";
    /** allows your app to know a user's friends and implicit relationships - requires Discord approval */
    OAuthScopes["RELATIONSHIPS_READ"] = "relationships.read";
    /** for local rpc server access, this allows you to control a user's local Discord client - requires Discord approval */
    OAuthScopes["RPC"] = "rpc";
    /** for local rpc server access, this allows you to receive notifications pushed out to the user - requires Discord approval */
    OAuthScopes["RPC_ACTIVITIES_READ"] = "rpc.activities.read";
    /** for local rpc server access, this allows you to update a user's activity - requires Discord approval */
    OAuthScopes["RPC_ACTIVITIES_WRITE"] = "rpc.activities.write";
    /** for local rpc server access, this allows you to receive notifications pushed out to the user - requires Discord approval */
    OAuthScopes["RPC_NOTIFICATIONS_READ"] = "rpc.notifications.read";
    /** for local rpc server access, this allows you to read a user's voice settings and listen for voice events - requires Discord approval */
    OAuthScopes["RPC_VOICE_READ"] = "rpc.voice.read";
    /** for local rpc server access, this allows you to update a user's voice settings - requires Discord approval */
    OAuthScopes["RPC_VOICE_WRITE"] = "rpc.voice.write";
    /** allows your app to connect to voice on user's behalf and see all the voice members - requires Discord approval */
    OAuthScopes["VOICE"] = "voice";
    /** this generates a webhook that is returned in the oauth token response for authorization code grants */
    OAuthScopes["WEBHOOK_INCOMING"] = "webhook.incoming";
})(OAuthScopes = exports.OAuthScopes || (exports.OAuthScopes = {}));
var ComponentTypes;
(function (ComponentTypes) {
    ComponentTypes[ComponentTypes["ACTION_ROW"] = 1] = "ACTION_ROW";
    ComponentTypes[ComponentTypes["BUTTON"] = 2] = "BUTTON";
    ComponentTypes[ComponentTypes["SELECT_MENU"] = 3] = "SELECT_MENU";
    ComponentTypes[ComponentTypes["TEXT_INPUT"] = 4] = "TEXT_INPUT";
})(ComponentTypes = exports.ComponentTypes || (exports.ComponentTypes = {}));
var ButtonStyles;
(function (ButtonStyles) {
    ButtonStyles[ButtonStyles["PRIMARY"] = 1] = "PRIMARY";
    ButtonStyles[ButtonStyles["SECONDARY"] = 2] = "SECONDARY";
    ButtonStyles[ButtonStyles["SUCCESS"] = 3] = "SUCCESS";
    ButtonStyles[ButtonStyles["DANGER"] = 4] = "DANGER";
    ButtonStyles[ButtonStyles["LINK"] = 5] = "LINK";
})(ButtonStyles = exports.ButtonStyles || (exports.ButtonStyles = {}));
var TextInputStyles;
(function (TextInputStyles) {
    TextInputStyles[TextInputStyles["SHORT"] = 1] = "SHORT";
    TextInputStyles[TextInputStyles["PARAGRAPH"] = 2] = "PARAGRAPH";
})(TextInputStyles = exports.TextInputStyles || (exports.TextInputStyles = {}));
var MessageFlags;
(function (MessageFlags) {
    MessageFlags[MessageFlags["CROSSPOSTED"] = 1] = "CROSSPOSTED";
    MessageFlags[MessageFlags["IS_CROSSPOST"] = 2] = "IS_CROSSPOST";
    MessageFlags[MessageFlags["SUPPRESS_EMBEDS"] = 4] = "SUPPRESS_EMBEDS";
    MessageFlags[MessageFlags["SOURCE_MESSAGE_DELETED"] = 8] = "SOURCE_MESSAGE_DELETED";
    MessageFlags[MessageFlags["URGENT"] = 16] = "URGENT";
    MessageFlags[MessageFlags["HAS_THREAD"] = 32] = "HAS_THREAD";
    MessageFlags[MessageFlags["EPHEMERAL"] = 64] = "EPHEMERAL";
    MessageFlags[MessageFlags["LOADING"] = 128] = "LOADING";
    MessageFlags[MessageFlags["FAILED_TO_MENTION_SOME_ROLES_IN_THREAD"] = 256] = "FAILED_TO_MENTION_SOME_ROLES_IN_THREAD";
})(MessageFlags = exports.MessageFlags || (exports.MessageFlags = {}));
var MessageTypes;
(function (MessageTypes) {
    MessageTypes[MessageTypes["DEFAULT"] = 0] = "DEFAULT";
    MessageTypes[MessageTypes["RECIPIENT_ADD"] = 1] = "RECIPIENT_ADD";
    MessageTypes[MessageTypes["RECIPIENT_REMOVE"] = 2] = "RECIPIENT_REMOVE";
    MessageTypes[MessageTypes["CALL"] = 3] = "CALL";
    MessageTypes[MessageTypes["CHANNEL_NAME_CHANGE"] = 4] = "CHANNEL_NAME_CHANGE";
    MessageTypes[MessageTypes["CHANNEL_ICON_CHANGE"] = 5] = "CHANNEL_ICON_CHANGE";
    MessageTypes[MessageTypes["CHANNEL_PINNED_MESSAGE"] = 6] = "CHANNEL_PINNED_MESSAGE";
    MessageTypes[MessageTypes["USER_JOIN"] = 7] = "USER_JOIN";
    MessageTypes[MessageTypes["GUILD_BOOST"] = 8] = "GUILD_BOOST";
    MessageTypes[MessageTypes["GUILD_BOOST_TIER_1"] = 9] = "GUILD_BOOST_TIER_1";
    MessageTypes[MessageTypes["GUILD_BOOST_TIER_2"] = 10] = "GUILD_BOOST_TIER_2";
    MessageTypes[MessageTypes["GUILD_BOOST_TIER_3"] = 11] = "GUILD_BOOST_TIER_3";
    MessageTypes[MessageTypes["CHANNEL_FOLLOW_ADD"] = 12] = "CHANNEL_FOLLOW_ADD";
    MessageTypes[MessageTypes["GUILD_DISCOVERY_DISQUALIFIED"] = 14] = "GUILD_DISCOVERY_DISQUALIFIED";
    MessageTypes[MessageTypes["GUILD_DISCOVERY_REQUALIFIED"] = 15] = "GUILD_DISCOVERY_REQUALIFIED";
    MessageTypes[MessageTypes["GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING"] = 16] = "GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING";
    MessageTypes[MessageTypes["GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING"] = 17] = "GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING";
    MessageTypes[MessageTypes["THREAD_CREATED"] = 18] = "THREAD_CREATED";
    MessageTypes[MessageTypes["REPLY"] = 19] = "REPLY";
    MessageTypes[MessageTypes["CHAT_INPUT_COMMAND"] = 20] = "CHAT_INPUT_COMMAND";
    MessageTypes[MessageTypes["THREAD_STARTER_MESSAGE"] = 21] = "THREAD_STARTER_MESSAGE";
    MessageTypes[MessageTypes["GUILD_INVITE_REMINDER"] = 22] = "GUILD_INVITE_REMINDER";
    MessageTypes[MessageTypes["CONTEXT_MENU_COMMAND"] = 23] = "CONTEXT_MENU_COMMAND";
    MessageTypes[MessageTypes["AUTO_MODERATION_ACTION"] = 24] = "AUTO_MODERATION_ACTION";
    MessageTypes[MessageTypes["ROLE_SUBSCRIPTION_PURCHASE"] = 25] = "ROLE_SUBSCRIPTION_PURCHASE";
})(MessageTypes = exports.MessageTypes || (exports.MessageTypes = {}));
var MessageActivityTypes;
(function (MessageActivityTypes) {
    MessageActivityTypes[MessageActivityTypes["JOIN"] = 1] = "JOIN";
    MessageActivityTypes[MessageActivityTypes["SPECTATE"] = 2] = "SPECTATE";
    MessageActivityTypes[MessageActivityTypes["LISTEN"] = 3] = "LISTEN";
    MessageActivityTypes[MessageActivityTypes["JOIN_REQUEST"] = 5] = "JOIN_REQUEST";
})(MessageActivityTypes = exports.MessageActivityTypes || (exports.MessageActivityTypes = {}));
var InteractionTypes;
(function (InteractionTypes) {
    InteractionTypes[InteractionTypes["PING"] = 1] = "PING";
    InteractionTypes[InteractionTypes["APPLICATION_COMMAND"] = 2] = "APPLICATION_COMMAND";
    InteractionTypes[InteractionTypes["MESSAGE_COMPONENT"] = 3] = "MESSAGE_COMPONENT";
    InteractionTypes[InteractionTypes["APPLICATION_COMMAND_AUTOCOMPLETE"] = 4] = "APPLICATION_COMMAND_AUTOCOMPLETE";
    InteractionTypes[InteractionTypes["MODAL_SUBMIT"] = 5] = "MODAL_SUBMIT";
})(InteractionTypes = exports.InteractionTypes || (exports.InteractionTypes = {}));
var InviteTargetTypes;
(function (InviteTargetTypes) {
    InviteTargetTypes[InviteTargetTypes["STREAM"] = 1] = "STREAM";
    InviteTargetTypes[InviteTargetTypes["EMBEDDED_APPLICATION"] = 2] = "EMBEDDED_APPLICATION";
})(InviteTargetTypes = exports.InviteTargetTypes || (exports.InviteTargetTypes = {}));
var GuildScheduledEventPrivacyLevels;
(function (GuildScheduledEventPrivacyLevels) {
    /** @deprecated */
    GuildScheduledEventPrivacyLevels[GuildScheduledEventPrivacyLevels["PUBLIC"] = 1] = "PUBLIC";
    GuildScheduledEventPrivacyLevels[GuildScheduledEventPrivacyLevels["GUILD_ONLY"] = 2] = "GUILD_ONLY";
})(GuildScheduledEventPrivacyLevels = exports.GuildScheduledEventPrivacyLevels || (exports.GuildScheduledEventPrivacyLevels = {}));
var GuildScheduledEventStatuses;
(function (GuildScheduledEventStatuses) {
    GuildScheduledEventStatuses[GuildScheduledEventStatuses["SCHEDULED"] = 1] = "SCHEDULED";
    GuildScheduledEventStatuses[GuildScheduledEventStatuses["ACTIVE"] = 2] = "ACTIVE";
    GuildScheduledEventStatuses[GuildScheduledEventStatuses["COMPLETED"] = 3] = "COMPLETED";
    GuildScheduledEventStatuses[GuildScheduledEventStatuses["CANCELED"] = 4] = "CANCELED";
})(GuildScheduledEventStatuses = exports.GuildScheduledEventStatuses || (exports.GuildScheduledEventStatuses = {}));
var GuildScheduledEventEntityTypes;
(function (GuildScheduledEventEntityTypes) {
    GuildScheduledEventEntityTypes[GuildScheduledEventEntityTypes["STAGE_INSTANCE"] = 1] = "STAGE_INSTANCE";
    GuildScheduledEventEntityTypes[GuildScheduledEventEntityTypes["VOICE"] = 2] = "VOICE";
    GuildScheduledEventEntityTypes[GuildScheduledEventEntityTypes["EXTERNAL"] = 3] = "EXTERNAL";
})(GuildScheduledEventEntityTypes = exports.GuildScheduledEventEntityTypes || (exports.GuildScheduledEventEntityTypes = {}));
var StageInstancePrivacyLevels;
(function (StageInstancePrivacyLevels) {
    /** @deprecated */
    StageInstancePrivacyLevels[StageInstancePrivacyLevels["PUBLIC"] = 1] = "PUBLIC";
    StageInstancePrivacyLevels[StageInstancePrivacyLevels["GUILD_ONLY"] = 2] = "GUILD_ONLY";
})(StageInstancePrivacyLevels = exports.StageInstancePrivacyLevels || (exports.StageInstancePrivacyLevels = {}));
var AutoModerationEventTypes;
(function (AutoModerationEventTypes) {
    AutoModerationEventTypes[AutoModerationEventTypes["MESSAGE_SEND"] = 1] = "MESSAGE_SEND";
})(AutoModerationEventTypes = exports.AutoModerationEventTypes || (exports.AutoModerationEventTypes = {}));
var AutoModerationTriggerTypes;
(function (AutoModerationTriggerTypes) {
    AutoModerationTriggerTypes[AutoModerationTriggerTypes["KEYWORD"] = 1] = "KEYWORD";
    AutoModerationTriggerTypes[AutoModerationTriggerTypes["HARMFUL_LINK"] = 2] = "HARMFUL_LINK";
    AutoModerationTriggerTypes[AutoModerationTriggerTypes["SPAM"] = 3] = "SPAM";
    AutoModerationTriggerTypes[AutoModerationTriggerTypes["KEYWORD_PRESET"] = 4] = "KEYWORD_PRESET";
    AutoModerationTriggerTypes[AutoModerationTriggerTypes["MENTION_SPAM"] = 5] = "MENTION_SPAM";
})(AutoModerationTriggerTypes = exports.AutoModerationTriggerTypes || (exports.AutoModerationTriggerTypes = {}));
var AutoModerationKeywordPresetTypes;
(function (AutoModerationKeywordPresetTypes) {
    AutoModerationKeywordPresetTypes[AutoModerationKeywordPresetTypes["PROFANITY"] = 1] = "PROFANITY";
    AutoModerationKeywordPresetTypes[AutoModerationKeywordPresetTypes["SEXUAL_CONTENT"] = 2] = "SEXUAL_CONTENT";
    AutoModerationKeywordPresetTypes[AutoModerationKeywordPresetTypes["SLURS"] = 3] = "SLURS";
})(AutoModerationKeywordPresetTypes = exports.AutoModerationKeywordPresetTypes || (exports.AutoModerationKeywordPresetTypes = {}));
var AutoModerationActionTypes;
(function (AutoModerationActionTypes) {
    AutoModerationActionTypes[AutoModerationActionTypes["BLOCK_MESSAGE"] = 1] = "BLOCK_MESSAGE";
    AutoModerationActionTypes[AutoModerationActionTypes["SEND_ALERT_MESSAGE"] = 2] = "SEND_ALERT_MESSAGE";
    AutoModerationActionTypes[AutoModerationActionTypes["TIMEOUT"] = 3] = "TIMEOUT";
})(AutoModerationActionTypes = exports.AutoModerationActionTypes || (exports.AutoModerationActionTypes = {}));
var AuditLogActionTypes;
(function (AuditLogActionTypes) {
    AuditLogActionTypes[AuditLogActionTypes["GUILD_UPDATE"] = 1] = "GUILD_UPDATE";
    AuditLogActionTypes[AuditLogActionTypes["CHANNEL_CREATE"] = 10] = "CHANNEL_CREATE";
    AuditLogActionTypes[AuditLogActionTypes["CHANNEL_UPDATE"] = 11] = "CHANNEL_UPDATE";
    AuditLogActionTypes[AuditLogActionTypes["CHANNEL_DELETE"] = 12] = "CHANNEL_DELETE";
    AuditLogActionTypes[AuditLogActionTypes["CHANNEL_OVERWRITE_CREATE"] = 13] = "CHANNEL_OVERWRITE_CREATE";
    AuditLogActionTypes[AuditLogActionTypes["CHANNEL_OVERWRITE_UPDATE"] = 14] = "CHANNEL_OVERWRITE_UPDATE";
    AuditLogActionTypes[AuditLogActionTypes["CHANNEL_OVERWRITE_DELETE"] = 15] = "CHANNEL_OVERWRITE_DELETE";
    AuditLogActionTypes[AuditLogActionTypes["MEMBER_KICK"] = 20] = "MEMBER_KICK";
    AuditLogActionTypes[AuditLogActionTypes["MEMBER_PRUNE"] = 21] = "MEMBER_PRUNE";
    AuditLogActionTypes[AuditLogActionTypes["MEMBER_BAN_ADD"] = 22] = "MEMBER_BAN_ADD";
    AuditLogActionTypes[AuditLogActionTypes["MEMBER_BAN_REMOVE"] = 23] = "MEMBER_BAN_REMOVE";
    AuditLogActionTypes[AuditLogActionTypes["MEMBER_UPDATE"] = 24] = "MEMBER_UPDATE";
    AuditLogActionTypes[AuditLogActionTypes["MEMBER_ROLE_UPDATE"] = 25] = "MEMBER_ROLE_UPDATE";
    AuditLogActionTypes[AuditLogActionTypes["MEMBER_MOVE"] = 26] = "MEMBER_MOVE";
    AuditLogActionTypes[AuditLogActionTypes["MEMBER_DISCONNECT"] = 27] = "MEMBER_DISCONNECT";
    AuditLogActionTypes[AuditLogActionTypes["BOT_ADD"] = 28] = "BOT_ADD";
    AuditLogActionTypes[AuditLogActionTypes["ROLE_CREATE"] = 30] = "ROLE_CREATE";
    AuditLogActionTypes[AuditLogActionTypes["ROLE_UPDATE"] = 31] = "ROLE_UPDATE";
    AuditLogActionTypes[AuditLogActionTypes["ROLE_DELETE"] = 32] = "ROLE_DELETE";
    AuditLogActionTypes[AuditLogActionTypes["INVITE_CREATE"] = 40] = "INVITE_CREATE";
    AuditLogActionTypes[AuditLogActionTypes["INVITE_UPDATE"] = 41] = "INVITE_UPDATE";
    AuditLogActionTypes[AuditLogActionTypes["INVITE_DELETE"] = 42] = "INVITE_DELETE";
    AuditLogActionTypes[AuditLogActionTypes["WEBHOOK_CREATE"] = 50] = "WEBHOOK_CREATE";
    AuditLogActionTypes[AuditLogActionTypes["WEBHOOK_UPDATE"] = 51] = "WEBHOOK_UPDATE";
    AuditLogActionTypes[AuditLogActionTypes["WEBHOOK_DELETE"] = 52] = "WEBHOOK_DELETE";
    AuditLogActionTypes[AuditLogActionTypes["EMOJI_CREATE"] = 60] = "EMOJI_CREATE";
    AuditLogActionTypes[AuditLogActionTypes["EMOJI_UPDATE"] = 61] = "EMOJI_UPDATE";
    AuditLogActionTypes[AuditLogActionTypes["EMOJI_DELETE"] = 62] = "EMOJI_DELETE";
    AuditLogActionTypes[AuditLogActionTypes["MESSAGE_DELETE"] = 72] = "MESSAGE_DELETE";
    AuditLogActionTypes[AuditLogActionTypes["MESSAGE_BULK_DELETE"] = 73] = "MESSAGE_BULK_DELETE";
    AuditLogActionTypes[AuditLogActionTypes["MESSAGE_PIN"] = 74] = "MESSAGE_PIN";
    AuditLogActionTypes[AuditLogActionTypes["MESSAGE_UNPIN"] = 75] = "MESSAGE_UNPIN";
    AuditLogActionTypes[AuditLogActionTypes["INTEGRATION_CREATE"] = 80] = "INTEGRATION_CREATE";
    AuditLogActionTypes[AuditLogActionTypes["INTEGRATION_UPDATE"] = 81] = "INTEGRATION_UPDATE";
    AuditLogActionTypes[AuditLogActionTypes["INTEGRATION_DELETE"] = 82] = "INTEGRATION_DELETE";
    AuditLogActionTypes[AuditLogActionTypes["STAGE_INSTANCE_CREATE"] = 83] = "STAGE_INSTANCE_CREATE";
    AuditLogActionTypes[AuditLogActionTypes["STAGE_INSTANCE_UPDATE"] = 84] = "STAGE_INSTANCE_UPDATE";
    AuditLogActionTypes[AuditLogActionTypes["STAGE_INSTANCE_DELETE"] = 85] = "STAGE_INSTANCE_DELETE";
    AuditLogActionTypes[AuditLogActionTypes["STICKER_CREATE"] = 90] = "STICKER_CREATE";
    AuditLogActionTypes[AuditLogActionTypes["STICKER_UPDATE"] = 91] = "STICKER_UPDATE";
    AuditLogActionTypes[AuditLogActionTypes["STICKER_DELETE"] = 92] = "STICKER_DELETE";
    AuditLogActionTypes[AuditLogActionTypes["GUILD_SCHEDULED_EVENT_CREATE"] = 100] = "GUILD_SCHEDULED_EVENT_CREATE";
    AuditLogActionTypes[AuditLogActionTypes["GUILD_SCHEDULED_EVENT_UPDATE"] = 101] = "GUILD_SCHEDULED_EVENT_UPDATE";
    AuditLogActionTypes[AuditLogActionTypes["GUILD_SCHEDULED_EVENT_DELETE"] = 102] = "GUILD_SCHEDULED_EVENT_DELETE";
    AuditLogActionTypes[AuditLogActionTypes["THREAD_CREATE"] = 110] = "THREAD_CREATE";
    AuditLogActionTypes[AuditLogActionTypes["THREAD_UPDATE"] = 111] = "THREAD_UPDATE";
    AuditLogActionTypes[AuditLogActionTypes["THREAD_DELETE"] = 112] = "THREAD_DELETE";
    AuditLogActionTypes[AuditLogActionTypes["APPLICATION_COMMAND_PERMISSION_UPDATE"] = 121] = "APPLICATION_COMMAND_PERMISSION_UPDATE";
    AuditLogActionTypes[AuditLogActionTypes["AUTO_MODERATION_RULE_CREATE"] = 140] = "AUTO_MODERATION_RULE_CREATE";
    AuditLogActionTypes[AuditLogActionTypes["AUTO_MODERATION_RULE_UPDATE"] = 141] = "AUTO_MODERATION_RULE_UPDATE";
    AuditLogActionTypes[AuditLogActionTypes["AUTO_MODERATION_RULE_DELETE"] = 142] = "AUTO_MODERATION_RULE_DELETE";
    AuditLogActionTypes[AuditLogActionTypes["AUTO_MODERATION_BLOCK_MESSAGE"] = 143] = "AUTO_MODERATION_BLOCK_MESSAGE";
})(AuditLogActionTypes = exports.AuditLogActionTypes || (exports.AuditLogActionTypes = {}));
var ApplicationCommandTypes;
(function (ApplicationCommandTypes) {
    ApplicationCommandTypes[ApplicationCommandTypes["CHAT_INPUT"] = 1] = "CHAT_INPUT";
    ApplicationCommandTypes[ApplicationCommandTypes["USER"] = 2] = "USER";
    ApplicationCommandTypes[ApplicationCommandTypes["MESSAGE"] = 3] = "MESSAGE";
})(ApplicationCommandTypes = exports.ApplicationCommandTypes || (exports.ApplicationCommandTypes = {}));
var ApplicationCommandOptionTypes;
(function (ApplicationCommandOptionTypes) {
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["SUB_COMMAND"] = 1] = "SUB_COMMAND";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["SUB_COMMAND_GROUP"] = 2] = "SUB_COMMAND_GROUP";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["STRING"] = 3] = "STRING";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["INTEGER"] = 4] = "INTEGER";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["BOOLEAN"] = 5] = "BOOLEAN";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["USER"] = 6] = "USER";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["CHANNEL"] = 7] = "CHANNEL";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["ROLE"] = 8] = "ROLE";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["MENTIONABLE"] = 9] = "MENTIONABLE";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["NUMBER"] = 10] = "NUMBER";
    ApplicationCommandOptionTypes[ApplicationCommandOptionTypes["ATTACHMENT"] = 11] = "ATTACHMENT";
})(ApplicationCommandOptionTypes = exports.ApplicationCommandOptionTypes || (exports.ApplicationCommandOptionTypes = {}));
var ApplicationCommandPermissionTypes;
(function (ApplicationCommandPermissionTypes) {
    ApplicationCommandPermissionTypes[ApplicationCommandPermissionTypes["ROLE"] = 1] = "ROLE";
    ApplicationCommandPermissionTypes[ApplicationCommandPermissionTypes["USER"] = 2] = "USER";
    ApplicationCommandPermissionTypes[ApplicationCommandPermissionTypes["CHANNEL"] = 3] = "CHANNEL";
})(ApplicationCommandPermissionTypes = exports.ApplicationCommandPermissionTypes || (exports.ApplicationCommandPermissionTypes = {}));
var InteractionResponseTypes;
(function (InteractionResponseTypes) {
    InteractionResponseTypes[InteractionResponseTypes["PONG"] = 1] = "PONG";
    InteractionResponseTypes[InteractionResponseTypes["CHANNEL_MESSAGE_WITH_SOURCE"] = 4] = "CHANNEL_MESSAGE_WITH_SOURCE";
    InteractionResponseTypes[InteractionResponseTypes["DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE"] = 5] = "DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE";
    InteractionResponseTypes[InteractionResponseTypes["DEFERRED_UPDATE_MESAGE"] = 6] = "DEFERRED_UPDATE_MESAGE";
    InteractionResponseTypes[InteractionResponseTypes["UPDATE_MESSAGE"] = 7] = "UPDATE_MESSAGE";
    InteractionResponseTypes[InteractionResponseTypes["APPLICATION_COMMAND_AUTOCOMPLETE_RESULT"] = 8] = "APPLICATION_COMMAND_AUTOCOMPLETE_RESULT";
    InteractionResponseTypes[InteractionResponseTypes["MODAL"] = 9] = "MODAL";
})(InteractionResponseTypes = exports.InteractionResponseTypes || (exports.InteractionResponseTypes = {}));
var Intents;
(function (Intents) {
    Intents[Intents["GUILDS"] = 1] = "GUILDS";
    Intents[Intents["GUILD_MEMBERS"] = 2] = "GUILD_MEMBERS";
    Intents[Intents["GUILD_BANS"] = 4] = "GUILD_BANS";
    Intents[Intents["GUILD_EMOJIS_AND_STICKERS"] = 8] = "GUILD_EMOJIS_AND_STICKERS";
    Intents[Intents["GUILD_INTEGRATIONS"] = 16] = "GUILD_INTEGRATIONS";
    Intents[Intents["GUILD_WEBHOOKS"] = 32] = "GUILD_WEBHOOKS";
    Intents[Intents["GUILD_INVITES"] = 64] = "GUILD_INVITES";
    Intents[Intents["GUILD_VOICE_STATES"] = 128] = "GUILD_VOICE_STATES";
    Intents[Intents["GUILD_PRESENCES"] = 256] = "GUILD_PRESENCES";
    Intents[Intents["GUILD_MESSAGES"] = 512] = "GUILD_MESSAGES";
    Intents[Intents["GUILD_MESSAGE_REACTIONS"] = 1024] = "GUILD_MESSAGE_REACTIONS";
    Intents[Intents["GUILD_MESSAGE_TYPING"] = 2048] = "GUILD_MESSAGE_TYPING";
    Intents[Intents["DIRECT_MESSAGES"] = 4096] = "DIRECT_MESSAGES";
    Intents[Intents["DIRECT_MESSAGE_REACTIONS"] = 8192] = "DIRECT_MESSAGE_REACTIONS";
    Intents[Intents["DIRECT_MESSAGE_TYPING"] = 16384] = "DIRECT_MESSAGE_TYPING";
    Intents[Intents["MESSAGE_CONTENT"] = 32768] = "MESSAGE_CONTENT";
    Intents[Intents["GUILD_SCHEDULED_EVENTS"] = 65536] = "GUILD_SCHEDULED_EVENTS";
    Intents[Intents["AUTO_MODERATION_CONFIGURATION"] = 1048576] = "AUTO_MODERATION_CONFIGURATION";
    Intents[Intents["AUTO_MODERATION_EXECUTION"] = 2097152] = "AUTO_MODERATION_EXECUTION";
})(Intents = exports.Intents || (exports.Intents = {}));
exports.AllNonPrivilegedIntents = Intents.GUILDS |
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
exports.AllPrivilegedIntents = Intents.GUILD_MEMBERS |
    Intents.GUILD_PRESENCES |
    Intents.MESSAGE_CONTENT;
exports.AllIntents = exports.AllNonPrivilegedIntents | exports.AllPrivilegedIntents;
var GatewayOPCodes;
(function (GatewayOPCodes) {
    GatewayOPCodes[GatewayOPCodes["DISPATCH"] = 0] = "DISPATCH";
    GatewayOPCodes[GatewayOPCodes["HEARTBEAT"] = 1] = "HEARTBEAT";
    GatewayOPCodes[GatewayOPCodes["IDENTIFY"] = 2] = "IDENTIFY";
    GatewayOPCodes[GatewayOPCodes["PRESENCE_UPDATE"] = 3] = "PRESENCE_UPDATE";
    GatewayOPCodes[GatewayOPCodes["VOICE_STATE_UPDATE"] = 4] = "VOICE_STATE_UPDATE";
    GatewayOPCodes[GatewayOPCodes["RESUME"] = 6] = "RESUME";
    GatewayOPCodes[GatewayOPCodes["RECONNECT"] = 7] = "RECONNECT";
    GatewayOPCodes[GatewayOPCodes["REQUEST_GUILD_MEMBERS"] = 8] = "REQUEST_GUILD_MEMBERS";
    GatewayOPCodes[GatewayOPCodes["INVALID_SESSION"] = 9] = "INVALID_SESSION";
    GatewayOPCodes[GatewayOPCodes["HELLO"] = 10] = "HELLO";
    GatewayOPCodes[GatewayOPCodes["HEARTBEAT_ACK"] = 11] = "HEARTBEAT_ACK";
})(GatewayOPCodes = exports.GatewayOPCodes || (exports.GatewayOPCodes = {}));
var GatewayCloseCodes;
(function (GatewayCloseCodes) {
    GatewayCloseCodes[GatewayCloseCodes["UNKNOWN_ERROR"] = 4000] = "UNKNOWN_ERROR";
    GatewayCloseCodes[GatewayCloseCodes["UNKNOWN_OPCODE"] = 4001] = "UNKNOWN_OPCODE";
    GatewayCloseCodes[GatewayCloseCodes["DECODE_ERROR"] = 4002] = "DECODE_ERROR";
    GatewayCloseCodes[GatewayCloseCodes["NOT_AUTHENTICATED"] = 4003] = "NOT_AUTHENTICATED";
    GatewayCloseCodes[GatewayCloseCodes["AUTHENTICATION_FAILED"] = 4004] = "AUTHENTICATION_FAILED";
    GatewayCloseCodes[GatewayCloseCodes["ALREADY_AUTHENTICATED"] = 4005] = "ALREADY_AUTHENTICATED";
    GatewayCloseCodes[GatewayCloseCodes["INVALID_SEQUENCE"] = 4007] = "INVALID_SEQUENCE";
    GatewayCloseCodes[GatewayCloseCodes["RATE_LIMITED"] = 4008] = "RATE_LIMITED";
    GatewayCloseCodes[GatewayCloseCodes["SESSION_TIMEOUT"] = 4009] = "SESSION_TIMEOUT";
    GatewayCloseCodes[GatewayCloseCodes["INVALID_SHARD"] = 4010] = "INVALID_SHARD";
    GatewayCloseCodes[GatewayCloseCodes["SHARDING_REQUIRED"] = 4011] = "SHARDING_REQUIRED";
    GatewayCloseCodes[GatewayCloseCodes["INVALID_API_VERSION"] = 4012] = "INVALID_API_VERSION";
    GatewayCloseCodes[GatewayCloseCodes["INVALID_INTENTS"] = 4013] = "INVALID_INTENTS";
    GatewayCloseCodes[GatewayCloseCodes["DISALLOWED_INTENTS"] = 4014] = "DISALLOWED_INTENTS";
})(GatewayCloseCodes = exports.GatewayCloseCodes || (exports.GatewayCloseCodes = {}));
var VoiceOPCodes;
(function (VoiceOPCodes) {
    VoiceOPCodes[VoiceOPCodes["IDENTIFY"] = 0] = "IDENTIFY";
    VoiceOPCodes[VoiceOPCodes["SELECT_PROTOCOL"] = 1] = "SELECT_PROTOCOL";
    VoiceOPCodes[VoiceOPCodes["READY"] = 2] = "READY";
    VoiceOPCodes[VoiceOPCodes["HEARTBEAT"] = 3] = "HEARTBEAT";
    VoiceOPCodes[VoiceOPCodes["SESSION_DESCRIPTION"] = 4] = "SESSION_DESCRIPTION";
    VoiceOPCodes[VoiceOPCodes["SPEAKING"] = 5] = "SPEAKING";
    VoiceOPCodes[VoiceOPCodes["HEARTBEAT_ACK"] = 6] = "HEARTBEAT_ACK";
    VoiceOPCodes[VoiceOPCodes["RESUME"] = 7] = "RESUME";
    VoiceOPCodes[VoiceOPCodes["HELLO"] = 8] = "HELLO";
    VoiceOPCodes[VoiceOPCodes["RESUMED"] = 9] = "RESUMED";
    VoiceOPCodes[VoiceOPCodes["CLIENT_DISCONNECT"] = 13] = "CLIENT_DISCONNECT";
})(VoiceOPCodes = exports.VoiceOPCodes || (exports.VoiceOPCodes = {}));
var VoiceCloseCodes;
(function (VoiceCloseCodes) {
    VoiceCloseCodes[VoiceCloseCodes["UNKNOWN_OPCODE"] = 4001] = "UNKNOWN_OPCODE";
    VoiceCloseCodes[VoiceCloseCodes["DECODE_ERROR"] = 4002] = "DECODE_ERROR";
    VoiceCloseCodes[VoiceCloseCodes["NOT_AUTHENTICATED"] = 4003] = "NOT_AUTHENTICATED";
    VoiceCloseCodes[VoiceCloseCodes["AUTHENTICATION_FAILED"] = 4004] = "AUTHENTICATION_FAILED";
    VoiceCloseCodes[VoiceCloseCodes["ALREADY_AUTHENTICATED"] = 4005] = "ALREADY_AUTHENTICATED";
    VoiceCloseCodes[VoiceCloseCodes["INVALID_SESSION"] = 4006] = "INVALID_SESSION";
    VoiceCloseCodes[VoiceCloseCodes["SESSION_TIMEOUT"] = 4009] = "SESSION_TIMEOUT";
    VoiceCloseCodes[VoiceCloseCodes["SERVER_NOT_FOUND"] = 4011] = "SERVER_NOT_FOUND";
    VoiceCloseCodes[VoiceCloseCodes["UNKNOWN_PROTOCOL"] = 4012] = "UNKNOWN_PROTOCOL";
    VoiceCloseCodes[VoiceCloseCodes["DISCONNECTED"] = 4013] = "DISCONNECTED";
    VoiceCloseCodes[VoiceCloseCodes["VOICE_SERVER_CRASHED"] = 4014] = "VOICE_SERVER_CRASHED";
    VoiceCloseCodes[VoiceCloseCodes["UNKNOWN_ENCRYPTION_MODE"] = 4015] = "UNKNOWN_ENCRYPTION_MODE";
})(VoiceCloseCodes = exports.VoiceCloseCodes || (exports.VoiceCloseCodes = {}));
var ActivityTypes;
(function (ActivityTypes) {
    ActivityTypes[ActivityTypes["GAME"] = 0] = "GAME";
    ActivityTypes[ActivityTypes["STREAMING"] = 1] = "STREAMING";
    ActivityTypes[ActivityTypes["LISTENING"] = 2] = "LISTENING";
    ActivityTypes[ActivityTypes["WATCHING"] = 3] = "WATCHING";
    ActivityTypes[ActivityTypes["CUSTOM"] = 4] = "CUSTOM";
    ActivityTypes[ActivityTypes["COMPETING"] = 5] = "COMPETING";
})(ActivityTypes = exports.ActivityTypes || (exports.ActivityTypes = {}));
var ActivityFlags;
(function (ActivityFlags) {
    ActivityFlags[ActivityFlags["INSTANCE"] = 1] = "INSTANCE";
    ActivityFlags[ActivityFlags["JOIn"] = 2] = "JOIn";
    ActivityFlags[ActivityFlags["SPECTATE"] = 4] = "SPECTATE";
    ActivityFlags[ActivityFlags["JOIN_REQUEST"] = 8] = "JOIN_REQUEST";
    ActivityFlags[ActivityFlags["SYNC"] = 16] = "SYNC";
    ActivityFlags[ActivityFlags["PLAY"] = 32] = "PLAY";
    ActivityFlags[ActivityFlags["PARTY_PRIVACY_FRIENDS_ONLY"] = 64] = "PARTY_PRIVACY_FRIENDS_ONLY";
    ActivityFlags[ActivityFlags["PARTY_PRIVACY_VOICE_CHANNEL"] = 128] = "PARTY_PRIVACY_VOICE_CHANNEL";
    ActivityFlags[ActivityFlags["EMBEDDED"] = 256] = "EMBEDDED";
})(ActivityFlags = exports.ActivityFlags || (exports.ActivityFlags = {}));
var ThreadMemberFlags;
(function (ThreadMemberFlags) {
    ThreadMemberFlags[ThreadMemberFlags["HAS_INTERACTED"] = 1] = "HAS_INTERACTED";
    ThreadMemberFlags[ThreadMemberFlags["ALL_MESSAGES"] = 2] = "ALL_MESSAGES";
    ThreadMemberFlags[ThreadMemberFlags["ONLY_MENTIONS"] = 4] = "ONLY_MENTIONS";
    ThreadMemberFlags[ThreadMemberFlags["NO_MESSAGES"] = 8] = "NO_MESSAGES";
})(ThreadMemberFlags = exports.ThreadMemberFlags || (exports.ThreadMemberFlags = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL0NvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsbUVBQWtDO0FBRXJCLFFBQUEsZUFBZSxHQUFHLEVBQUUsQ0FBQztBQUNyQixRQUFBLFlBQVksR0FBTSxFQUFFLENBQUM7QUFDckIsUUFBQSxRQUFRLEdBQVUscUJBQXFCLENBQUM7QUFDeEMsUUFBQSxPQUFPLEdBQVUsR0FBRyxnQkFBUSxTQUFTLG9CQUFZLEVBQUUsQ0FBQztBQUNwRCxRQUFBLE9BQU8sR0FBVyxzQkFBRyxDQUFDLE9BQU8sQ0FBQztBQUM5QixRQUFBLFVBQVUsR0FBUSxXQUFXLGVBQU8sMENBQTBDLENBQUM7QUFDL0UsUUFBQSxjQUFjLEdBQUksRUFBRSxDQUFDO0FBQ3JCLFFBQUEsY0FBYyxHQUFJLElBQUksQ0FBQztBQUV2QixRQUFBLFdBQVcsR0FBRztJQUN2QixLQUFLO0lBQ0wsTUFBTTtJQUNOLEtBQUs7SUFDTCxPQUFPO0lBQ1AsUUFBUTtDQUNGLENBQUM7QUFHRSxRQUFBLFlBQVksR0FBRztJQUN4QixLQUFLO0lBQ0wsTUFBTTtJQUNOLEtBQUs7SUFDTCxNQUFNO0lBQ04sS0FBSztDQUNDLENBQUM7QUFHWCxJQUFZLFlBSVg7QUFKRCxXQUFZLFlBQVk7SUFDcEIsdURBQW9CLENBQUE7SUFDcEIsdUVBQW9CLENBQUE7SUFDcEIsNkRBQW9CLENBQUE7QUFDeEIsQ0FBQyxFQUpXLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBSXZCO0FBRUQsSUFBWSxZQUlYO0FBSkQsV0FBWSxZQUFZO0lBQ3BCLCtDQUFpQixDQUFBO0lBQ2pCLGlFQUFpQixDQUFBO0lBQ2pCLGlEQUFpQixDQUFBO0FBQ3JCLENBQUMsRUFKVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUl2QjtBQUVELElBQVksU0FxQlg7QUFyQkQsV0FBWSxTQUFTO0lBQ2pCLDJDQUEwQixD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dkIsOEVBQXVCLENBQUE7SUFDdkIsa0ZBQXVCLENBQUE7SUFDdkIsd0ZBQXVCLENBQUE7SUFDdkIsZ0ZBQXVCLENBQUE7SUFDdkIsMEZBQXVCLENBQUE7SUFDdkIsNEVBQXVCLENBQUE7SUFDdkIsd0ZBQXVCLENBQUE7SUFDdkIsb0VBQXVCLENBQUE7SUFFdkIsNEVBQWdCLENBQUE7SUFDaEIsNEVBQWdCLENBQUE7SUFDaEIsNEVBQWdCLENBQUE7SUFFaEIsZ0ZBQWtCLENBQUE7SUFDbEIsZ0ZBQWtCLENBQUE7SUFDbEIsZ0ZBQWtCLENBQUE7SUFFbEIsa0ZBQW1CLENBQUE7SUFDbkIsa0ZBQW1CLENBQUE7SUFDbkIsa0ZBQW1CLENBQUE7SUFFbkIsOEVBQWlCLENBQUE7SUFDakIsOEVBQWlCLENBQUE7SUFDakIsOEVBQWlCLENBQUE7SUFFakIsa0ZBQXdCLENBQUE7SUFDeEIsNEZBQXdCLENBQUE7SUFDeEIsNEVBQXdCLENBQUE7SUFDeEIsZ0ZBQXdCLENBQUE7SUFFeEIsMEZBQTBCLENBQUE7SUFDMUIsMEZBQTBCLENBQUE7SUFDMUIsMEZBQTBCLENBQUE7SUFDMUIsZ0dBQTBCLENBQUE7SUFDMUIsZ0dBQTBCLENBQUE7SUFDMUIsZ0dBQTBCLENBQUE7SUFFMUIsa0ZBQW1CLENBQUE7SUFDbkIsa0ZBQW1CLENBQUE7SUFDbkIsa0ZBQW1CLENBQUE7SUFFbkIsK0dBQWtDLENBQUE7SUFDbEMsK0dBQWtDLENBQUE7SUFDbEMsK0dBQWtDLENBQUE7SUFFbEMsaUZBQW1CLENBQUE7SUFDbkIsaUZBQW1CLENBQUE7SUFDbkIsaUZBQW1CLENBQUE7SUFFbkIsaUlBQTJDLENBQUE7SUFFM0MsNkdBQW1DLENBQUE7SUFDbkMsNkdBQW1DLENBQUE7SUFDbkMsNkdBQW1DLENBQUE7SUFDbkMsaUhBQW1DLENBQUE7QUFDdkMsQ0FBQyxFQWxFVyxtQkFBbUIsR0FBbkIsMkJBQW1CLEtBQW5CLDJCQUFtQixRQWtFOUI7QUFFRCxJQUFZLHVCQUlYO0FBSkQsV0FBWSx1QkFBdUI7SUFDL0IsaUZBQWMsQ0FBQTtJQUNk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