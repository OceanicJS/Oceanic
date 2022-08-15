import BaseRoute from "./BaseRoute";
import type { RawUser } from "./Users";
import type { RawGuild } from "./Guilds";
import type { RawChannel } from "./Channels";
import type { WebhookTypes } from "../Constants";
import * as Routes from "../util/Routes";
import Webhook from "../structures/Webhook";

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

export default class Webhooks extends BaseRoute {
	async get(id: string, token?: string) {
		return this._manager.authRequest<RawWebhook>({
			method: "GET",
			path:   Routes.WEBHOOK(id, token)
		}).then(data => new Webhook(data, this._client));
	}
}
