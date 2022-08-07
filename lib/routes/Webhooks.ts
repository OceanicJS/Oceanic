import BaseRoute from "./BaseRoute";
import type { WebhookTypes } from "../Constants";

export interface Webhook {
	channel_id: string | null;
	guild_id?: string | null;
	id: string;
	type: WebhookTypes;

}

export default class Webhooks extends BaseRoute {
	// async get(id: string, token?: string);
}
