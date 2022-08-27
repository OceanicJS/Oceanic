import type { CreateMessageOptions, RawChannel } from "./channels";
import type { RawGuild } from "./guilds";
import type { RawUser } from "./users";
import type { WebhookTypes } from "../Constants";

export interface RawWebhook {
    application_id: string | null;
    avatar: string | null;
    channel_id: string | null;
    guild_id?: string | null;
    id: string;
    name: string | null;
    source_channel?: Pick<RawChannel, "id" | "name">;
    source_guild?: Pick<RawGuild, "id" | "name" | "icon">;
    token?: string;
    type: WebhookTypes;
    url?: string;
    user?: RawUser;
}
export type BasicWebhook = Pick<RawWebhook, "type" | "id" | "name" | "avatar" | "channel_id" | "guild_id" | "application_id">;
export type OAuthWebhook = Required<BasicWebhook & Pick<RawWebhook, "url" | "token">>;
export type GuildWebhook = BasicWebhook & Pick<RawWebhook, "user" | "token">;
export type ApplicationWebhook = Pick<RawWebhook, "type" | "id" | "name" | "avatar" | "channel_id" | "guild_id" | "application_id"> & Required<Pick<RawWebhook, "token">>;
export type ChannelFollowerWebhook = BasicWebhook & Required<Pick<RawWebhook, "source_guild" | "source_channel">> & Pick<RawWebhook, "user">;

export interface CreateWebhookOptions {
    avatar?: Buffer | string | null;
    name?: string;
    reason?: string;
}

export interface EditWebhookTokenOptions  {
    avatar?: Buffer | string | null;
    name?: string;
}
export interface EditWebhookOptions extends EditWebhookTokenOptions {
    channelID?: string;
    reason?: string;
}

export type ExecuteWebhookOptions = Pick<CreateMessageOptions, "content" | "tts" | "embeds" | "allowedMentions" | "components" | "attachments" | "flags" | "files"> & {
    avatarURL?: string;
    threadID?: string;
    threadName?: string;
    username?: string;
    wait?: boolean;
};
export type ExecuteWebhookWaitOptions = Omit<ExecuteWebhookOptions, "wait">  & { wait: true; };

export interface GetWebhookMessageOptions {
    messageID: string;
    threadID?: string;
}

export type EditWebhookMessageOptions = Pick<ExecuteWebhookOptions, "content" | "embeds" | "allowedMentions" | "components" | "attachments" | "threadID" | "files">;

export interface DeleteWebhookMessageOptions {
    threadID?: string;
}
