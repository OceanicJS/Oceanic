"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledEventStatuses = exports.ScheduledEventPrivacyLevels = exports.InviteTargetTypes = exports.InteractionTypes = exports.MessageActivityTypes = exports.MessageTypes = exports.MessageFlags = exports.TextInputStyles = exports.ButtonStyles = exports.ComponentTypes = exports.OAuthScopes = exports.TeamMembershipState = exports.ChannelFlags = exports.AllPermissions = exports.AllVoicePermissions = exports.AllTextPermissions = exports.AllGuildPermissions = exports.Permissions = exports.IntegrationExpireBehaviors = exports.IntegrationTypes = exports.ConnectionServices = exports.VisibilityTypes = exports.ThreadAutoArchiveDurations = exports.VideoQualityModes = exports.OverwriteTypes = exports.ChannelTypes = exports.StickerFormatTypes = exports.StickerTypes = exports.SystemChannelFlags = exports.PremiumTiers = exports.GuildNSFWLevels = exports.VerificationLevels = exports.MFALevels = exports.ExplicitContentFilterLevels = exports.DefaultMessageNotificationLevels = exports.GuildFeatures = exports.ApplicationFlags = exports.UserFlags = exports.PremiumTypes = exports.WebhookTypes = exports.ImageFormats = exports.RESTMethods = exports.MAX_IMAGE_SIZE = exports.MIN_IMAGE_SIZE = exports.USER_AGENT = exports.VERSION = exports.API_URL = exports.BASE_URL = exports.REST_VERSION = exports.GATEWAY_VERSION = void 0;
exports.ActivityFlags = exports.ActivityTypes = exports.VoiceCloseCodes = exports.VoiceOPCodes = exports.GatewayCloseCodes = exports.GatewayOPCodes = exports.AllIntents = exports.AllPrivilegedIntents = exports.AllNonPrivilegedIntents = exports.Intents = exports.InteractionResponseTypes = exports.ApplicationCommandPermissionTypes = exports.ApplicationCommandOptionTypes = exports.ApplicationCommandTypes = exports.AuditLogActionTypes = exports.AutoModerationActionTypes = exports.AutoModerationKeywordPresetTypes = exports.AutoModerationTriggerTypes = exports.AutoModerationEventTypes = exports.StageInstancePrivacyLevels = exports.ScheduledEventEntityTypes = void 0;
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
    UserFlags[UserFlags["BUG_HUNTER_LEVEL_2"] = 16384] = "BUG_HUNTER_LEVEL_2";
    UserFlags[UserFlags["VERIFIED_BOT"] = 65536] = "VERIFIED_BOT";
    UserFlags[UserFlags["VERIFIED_DEVELOPER"] = 131072] = "VERIFIED_DEVELOPER";
    UserFlags[UserFlags["CERTIFIED_MODERATOR"] = 262144] = "CERTIFIED_MODERATOR";
    UserFlags[UserFlags["BOT_HTTP_INTERACTIONS"] = 524288] = "BOT_HTTP_INTERACTIONS";
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
    ChannelFlags[ChannelFlags["PINNED"] = 2] = "PINNED";
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
    /**	allows your app to read build data for a user's applications */
    OAuthScopes["APPLICATIONS_BUILDS_READ"] = "applications.builds.read";
    /**	allows your app to upload/update builds for a user's applications - requires Discord approval */
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
    /**	allows [/users/@me/connections](https://discord.com/developers/docs/resources/user#get-user-connections) to return linked third-party accounts */
    OAuthScopes["CONNECTIONS"] = "connections";
    /** allows your app to see information about the user's DMs and group DMs - requires Discord approval */
    OAuthScopes["DM_CHANNELS_READ"] = "dm_channels.read";
    /**	enables [/users/@me](https://discord.com/developers/docs/resources/user#get-current-user) to return an `email` */
    OAuthScopes["EMAIL"] = "email";
    /** allows your app to [join users to a group dm](https://discord.com/developers/docs/resources/channel#group-dm-add-recipient) */
    OAuthScopes["GDM_JOIN"] = "gdm.join";
    /**	allows [/users/@me/guilds](https://discord.com/developers/docs/resources/user#get-current-user-guilds) to return basic information about all of a user's guilds */
    OAuthScopes["GUILDS"] = "guilds";
    /** allows [/guilds/{guild.id}/members/{user.id}](https://discord.com/developers/docs/resources/guild#add-guild-member) to be used for joining users to a guild */
    OAuthScopes["GUILDS_JOIN"] = "guilds.join";
    /** allows [/users/@me/guilds/{guild.id}/member](https://discord.com/developers/docs/resources/user#get-current-user-guild-member) to return a user's member information in a guild */
    OAuthScopes["GUILDS_MEMBERS_READ"] = "guilds.members.read";
    /** allows [/users/@me](https://discord.com/developers/docs/resources/user#get-current-user) without `email` */
    OAuthScopes["IDENTIFY"] = "identify";
    /** for local rpc server api access, this allows you to read messages from all client channels (otherwise restricted to channels/guilds your app creates) */
    OAuthScopes["MESSAGES_READ"] = "messages.read";
    /**	allows your app to know a user's friends and implicit relationships - requires Discord approval */
    OAuthScopes["RELATIONSHIPS_READ"] = "relationships.read";
    /**	for local rpc server access, this allows you to control a user's local Discord client - requires Discord approval */
    OAuthScopes["RPC"] = "rpc";
    /** for local rpc server access, this allows you to receive notifications pushed out to the user - requires Discord approval */
    OAuthScopes["RPC_ACTIVITIES_READ"] = "rpc.activities.read";
    /** for local rpc server access, this allows you to update a user's activity - requires Discord approval */
    OAuthScopes["RPC_ACTIVITIES_WRITE"] = "rpc.activities.write";
    /** for local rpc server access, this allows you to receive notifications pushed out to the user - requires Discord approval */
    OAuthScopes["RPC_NOTIFICATIONS_READ"] = "rpc.notifications.read";
    /**	for local rpc server access, this allows you to read a user's voice settings and listen for voice events - requires Discord approval */
    OAuthScopes["RPC_VOICE_READ"] = "rpc.voice.read";
    /**	for local rpc server access, this allows you to update a user's voice settings - requires Discord approval */
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
var ScheduledEventPrivacyLevels;
(function (ScheduledEventPrivacyLevels) {
    ScheduledEventPrivacyLevels[ScheduledEventPrivacyLevels["GUILD_ONLY"] = 2] = "GUILD_ONLY";
})(ScheduledEventPrivacyLevels = exports.ScheduledEventPrivacyLevels || (exports.ScheduledEventPrivacyLevels = {}));
var ScheduledEventStatuses;
(function (ScheduledEventStatuses) {
    ScheduledEventStatuses[ScheduledEventStatuses["SCHEDULED"] = 1] = "SCHEDULED";
    ScheduledEventStatuses[ScheduledEventStatuses["ACTIVE"] = 2] = "ACTIVE";
    ScheduledEventStatuses[ScheduledEventStatuses["COMPLETED"] = 3] = "COMPLETED";
    ScheduledEventStatuses[ScheduledEventStatuses["CANCELLED"] = 4] = "CANCELLED";
})(ScheduledEventStatuses = exports.ScheduledEventStatuses || (exports.ScheduledEventStatuses = {}));
var ScheduledEventEntityTypes;
(function (ScheduledEventEntityTypes) {
    ScheduledEventEntityTypes[ScheduledEventEntityTypes["STAGE_INSTANCE"] = 1] = "STAGE_INSTANCE";
    ScheduledEventEntityTypes[ScheduledEventEntityTypes["VOICE"] = 2] = "VOICE";
    ScheduledEventEntityTypes[ScheduledEventEntityTypes["EXTERNAL"] = 3] = "EXTERNAL";
})(ScheduledEventEntityTypes = exports.ScheduledEventEntityTypes || (exports.ScheduledEventEntityTypes = {}));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL0NvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsbUVBQWtDO0FBRXJCLFFBQUEsZUFBZSxHQUFHLEVBQUUsQ0FBQztBQUNyQixRQUFBLFlBQVksR0FBTSxFQUFFLENBQUM7QUFDckIsUUFBQSxRQUFRLEdBQVUscUJBQXFCLENBQUM7QUFDeEMsUUFBQSxPQUFPLEdBQVUsR0FBRyxnQkFBUSxTQUFTLG9CQUFZLEVBQUUsQ0FBQztBQUNwRCxRQUFBLE9BQU8sR0FBVyxzQkFBRyxDQUFDLE9BQU8sQ0FBQztBQUM5QixRQUFBLFVBQVUsR0FBUSxXQUFXLGVBQU8sMENBQTBDLENBQUM7QUFDL0UsUUFBQSxjQUFjLEdBQUksRUFBRSxDQUFDO0FBQ3JCLFFBQUEsY0FBYyxHQUFJLElBQUksQ0FBQztBQUV2QixRQUFBLFdBQVcsR0FBRztJQUMxQixLQUFLO0lBQ0wsTUFBTTtJQUNOLEtBQUs7SUFDTCxPQUFPO0lBQ1AsUUFBUTtDQUNDLENBQUM7QUFHRSxRQUFBLFlBQVksR0FBRztJQUMzQixLQUFLO0lBQ0wsTUFBTTtJQUNOLEtBQUs7SUFDTCxNQUFNO0lBQ04sS0FBSztDQUNJLENBQUM7QUFHWCxJQUFZLFlBSVg7QUFKRCxXQUFZLFlBQVk7SUFDdkIsdURBQW9CLENBQUE7SUFDcEIsdUVBQW9CLENBQUE7SUFDcEIsNkRBQW9CLENBQUE7QUFDckIsQ0FBQyxFQUpXLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBSXZCO0FBRUQsSUFBWSxZQUlYO0FBSkQsV0FBWSxZQUFZO0lBQ3ZCLCtDQUFpQixDQUFBO0lBQ2pCLGlFQUFpQixDQUFBO0lBQ2pCLGlEQUFpQixDQUFBO0FBQ2xCLENBQUMsRUFKVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUl2QjtBQUVELElBQVksU0FrQlg7QUFsQkQsV0FBWSxTQUFTO0lBQ3BCLDJDQUEwQixD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