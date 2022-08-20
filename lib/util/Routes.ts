export const CDN_URL = "https://cdn.discordapp.com";

// Webhooks
export const CHANNEL_WEBHOOKS = (channelID: string) => `/channels/${channelID}/webhooks` as const;
export const GUILD_WEBHOOKS   = (guildID: string) => `/guilds/${guildID}/webhooks` as const;
export const WEBHOOK          = (webhookID: string, webhookToken?: string) => (!webhookToken ? `/webhooks/${webhookID}` : `/webhooks/${webhookID}/${webhookToken}`) as `/webhooks/${string}` | `/webhooks/${string}/${string}`;
export const WEBHOOK_MESSAGE  = (webhookID: string, webhookToken: string, messageID: string) => `/webhooks/${webhookID}/${webhookToken}/messages/${messageID}` as const;
export const WEBHOOK_PLATFORM = (webhookID: string, webhookToken: string, platform: "github" | "slack") => `/webhooks/${webhookID}/${webhookToken}/${platform}` as const;

// Users
export const USER = (userID: string) => `/users/${userID}` as const;

// Guilds
export const GUILD               = (userID: string, withCounts = false) => `/guilds/${userID}?with_counts=${String(withCounts)}` as const;
export const GUILD_AUTOMOD_RULE  = (guildID: string, autoModerationRuleID: string) => `/guilds/${guildID}/auto-moderation/rules/${autoModerationRuleID}` as const;
export const GUILD_AUTOMOD_RULES = (guildID: string) => `/guilds/${guildID}/auto-moderation/rules` as const;
export const GUILD_EMOJI         = (guildID: string, emojiID: string) => `/guilds/${guildID}/emojis/${emojiID}` as const;
export const GUILD_EMOJIS        = (guildID: string) => `/guilds/${guildID}/emojis` as const;
export const GUILD_AUDIT_LOG    = (guildID: string) => `/guilds/${guildID}/audit-logs` as const;
// Channels
export const CHANNEL                                 = (channelID: string) => `/channels/${channelID}` as const;
export const CHANNEL_BULK_DELETE_MESSAGES            = (channelID: string) => `/channels/${channelID}/messages/bulk-delete` as const;
export const CHANNEL_FOLLOWERS                       = (channelID: string) => `/channels/${channelID}/followers` as const;
export const CHANNEL_INVITES                         = (channelID: string) => `/channels/${channelID}/invites` as const;
export const CHANNEL_JOINED_PRIVATE_ARCHIVED_THREADS = (channelID: string) => `/channels/${channelID}/users/@me/threads/archived/private` as const;
export const CHANNEL_MESSAGE                         = (channelID: string, messageID: string) => `/channels/${channelID}/messages/${messageID}` as const;
export const CHANNEL_MESSAGES                        = (channelID: string) => `/channels/${channelID}/messages` as const;
export const CHANNEL_MESSAGES_CROSSPOST              = (channelID: string, messageID: string) => `/channels/${channelID}/messages/${messageID}/crosspost` as const;
export const CHANNEL_MESSAGE_THREADS                 = (channelID: string, messageID: string) => `/channels/${channelID}/messages/${messageID}/threads` as const;
export const CHANNEL_PERMISSION                      = (channelID: string, overwriteID: string) => `/channels/${channelID}/permissions/${overwriteID}` as const;
export const CHANNEL_PERMISSIONS                     = (channelID: string) => `/channels/${channelID}/permissions` as const;
export const CHANNEL_PINNED_MESSAGE                  = (channelID: string, messageID: string) => `/channels/${channelID}/pins/${messageID}` as const;
export const CHANNEL_PINS                            = (channelID: string) => `/channels/${channelID}/pins` as const;
export const CHANNEL_PRIVATE_ARCHIVED_THREADS        = (channelID: string) => `/channels/${channelID}/threads/archived/private` as const;
export const CHANNEL_PUBLIC_ARCHIVED_THREADS         = (channelID: string) => `/channels/${channelID}/threads/archived/public` as const;
export const CHANNEL_REACTION                        = (channelID: string, messageID: string, reaction: string) => `/channels/${channelID}/messages/${messageID}/reactions/${reaction}` as const;
export const CHANNEL_REACTIONS                       = (channelID: string, messageID: string) => `/channels/${channelID}/messages/${messageID}/reactions` as const;
export const CHANNEL_REACTION_USER                   = (channelID: string, messageID: string, reaction: string, user: string) => `/channels/${channelID}/messages/${messageID}/reactions/${reaction}/${user}` as const;
export const CHANNEL_THREADS                         = (channelID: string) => `/channels/${channelID}/threads` as const;
export const CHANNEL_THREAD_MEMBER                   = (channelID: string, userID: string) => `/channels/${channelID}/thread-members/${userID}` as const;
export const CHANNEL_THREAD_MEMBERS                  = (channelID: string) => `/channels/${channelID}/thread-members` as const;
export const CHANNEL_TYPING                          = (channelID: string) => `/channels/${channelID}/typing` as const;
export const GROUP_RECIPIENT                         = (channelID: string, userID: string) => `/channels/${channelID}/recipients/${userID}` as const;

// OAuth
export const OAUTH_APPLICATION  = "/oauth2/applications/@me" as const;
export const OAUTH_AUTHORIZE    = "/oauth2/authorize" as const;
export const OAUTH_INFO         = "/oauth2/@me" as const;
export const OAUTH_CURRENT_USER = USER("@me") as "/user/@me";
export const OAUTH_CHANNELS     = `${OAUTH_CURRENT_USER}/channels` as const;
export const OAUTH_CONNECTIONS  = `${OAUTH_CURRENT_USER}/connections` as const;
export const OAUTH_GUILD        = (guildID: string) => `${OAUTH_CURRENT_USER}/guilds/${guildID}` as const;
export const OAUTH_GUILD_MEMBER = (guildID: string) => `${OAUTH_GUILD(guildID)}/member` as const;
export const OAUTH_GUILDS       = `${OAUTH_CURRENT_USER}/guilds` as const;
export const OAUTH_TOKEN        = "/oauth2/token" as const;
export const OAUTH_TOKEN_REVOKE = "/oauth2/token/revoke" as const;

// Images
export const ACHIEVEMENT_ICON	         = (applicationID: string, achievementID: string, hash: string) => `/app-assets/${applicationID}/achievements/${achievementID}/icons/${hash}` as const;
export const APPLICATION_ASSET           = (applicationID: string, assetID: string) => `/applications/${applicationID}/assets/${assetID}` as const;
export const APPLICATION_COVER           = (applicationID: string, hash: string) => `/app-icons/${applicationID}/${hash}` as const;
export const APPLICATION_ICON            = APPLICATION_COVER;
export const BANNER                      = (guildOrUserID: string, hash: string) => `/banners/${guildOrUserID}/${hash}` as const;
export const CUSTOM_EMOJI                = (emojiID: string) => `/emojis/${emojiID}` as const;
export const EMBED_AVATAR                = (mod: number) => `/embed/avatars/${mod}` as const;
export const GUILD_AVATAR                = (guildID: string, userID: string, hash: string) => `/guilds/${guildID}/users/${userID}/avatars/${hash}` as const;
export const GUILD_DISCOVERY_SPLASH      = (guildID: string, hash: string) => `/guilds/${guildID}/splashes/${hash}` as const;
export const GUILD_ICON                  = (guildID: string, hash: string) => `/icons/${guildID}/${hash}` as const;
export const GUILD_SCHEDULED_EVENT_COVER = (eventID: string, hash: string) => `/guild-events/${eventID}/${hash}` as const;
export const GUILD_SPLASH                = (guildID: string, hash: string) => `/splashes/${guildID}/${hash}` as const;
export const MEMBER_BANNER               = (guildID: string, userID: string, hash: string) => `/guilds/${guildID}/users/${userID}/banners/${hash}` as const;
export const ROLE_ICON                   = (roleID: string, hash: string) => `/role-icons/${roleID}/${hash}` as const;
export const STICKER                     = (stickerID: string) => `/stickers/${stickerID}` as const;
export const STICKER_PACK_BANNER         = (assetID: string) => APPLICATION_ASSET("710982414301790216", assetID);
export const TEAM_ICON                   = (teamID: string, hash: string) => `/team-icons/${teamID}/${hash}` as const;
export const USER_AVATAR                 = (userID: string, hash: string) => `/avatars/${userID}/${hash}` as const;
