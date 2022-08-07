export const CDN_URL = "https://cdn.discordapp.com";

export const CHANNEL_WEBHOOKS = (channelID: string) => `/channels/${channelID}/webhooks` as const;
export const GUILD_WEBHOOKS   = (guildID: string) => `/guilds/${guildID}/webhooks` as const;
export const WEBHOOK          = (webhookID: string, webhookToken?: string) => (!webhookToken ? `/webhooks/${webhookID}` : `/webhooks/${webhookID}/${webhookToken}`) as `/webhooks/${string}` | `/webhooks/${string}/${string}`;
export const WEBHOOK_MESSAGE  = (webhookID: string, webhookToken: string, messageID: string) => `/webhooks/${webhookID}/${webhookToken}/messages/${messageID}` as const;
export const WEBHOOK_PLATFORM = (webhookID: string, webhookToken: string, platform: "github" | "slack") => `/webhooks/${webhookID}/${webhookToken}/${platform}` as const;

export const USER = (userID: string) => `/users/${userID}` as const;

export const GUILD = (userID: string, withCounts = false) => `/guilds/${userID}?with_counts=${String(withCounts)}` as const;

export const CHANNEL = (channelID: string) => `/channels/${channelID}` as const;

// OAuth
export const OAUTH_CURRENT_USER = USER("@me");
export const OAUTH_CHANNELS     = `${OAUTH_CURRENT_USER}/channels` as const;
export const OAUTH_CONNECTIONS  = `${OAUTH_CURRENT_USER}/connections` as const;
export const OAUTH_GUILD        = (guildID: string) => `${OAUTH_CURRENT_USER}/guilds/${guildID}` as const;
export const OAUTH_GUILD_MEMBER = (guildID: string) => `${OAUTH_GUILD(guildID)}/member` as const;
export const OAUTH_GUILDS       = `${OAUTH_CURRENT_USER}/guilds` as const;

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
