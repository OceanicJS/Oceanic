import Base from "./Base";
import type User from "./User";
import type Client from "../Client";
import type { RawWebhook } from "../routes/Webhooks";
import type { RawChannel } from "../routes/Channels";
import type { RawGuild } from "../routes/Guilds";
import type { ImageFormat, WebhookTypes } from "../Constants";
import { BASE_URL } from "../Constants";
import * as Routes from "../util/Routes";

export default class Webhook extends Base {
	/** The id of the application associatd with this webhook. */
	applicationID: string | null;
	/** The hash of this webhook's avatar. */
	avatar: string | null;
	/** The id of the channel this webhook is for, if any. */
	channelID: string | null;
	/** The id of the guild this webhook is for, if any. */
	guildID: string | null;
	/** The username of this webhook, if any. */
	name: string | null;
	/** The source channel for this webhook (channel follower only). */
	sourceChannel?: Pick<RawChannel, "id" | "name">;
	/** The source guild for this webhook (channel follower only). */
	sourceGuild?: Pick<RawGuild, "id" | "name" | "icon">;
	/** The token for this webhook (not present for webhooks created by other applications) */
	token?: string;
	/** The [type](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-types) of this webhook. */
	type: WebhookTypes;
	/** The user that created this webhook. */
	user?: User;
	constructor(data: RawWebhook, client: Client) {
		super(data.id, client);
	}

	protected update(data: RawWebhook) {
		this.applicationID = data.application_id;
		this.avatar        = data.avatar;
		this.channelID     = data.channel_id;
		this.name          = data.name;
		this.sourceChannel = data.source_channel;
		this.sourceGuild   = data.source_guild;
		this.token         = data.token;
		this.type          = data.type;
		if (data.user) this.user = this._client.users.update(data.user);
	}

	get url() { return `${BASE_URL}${Routes.WEBHOOK(this.id, this.token)}`; }

	/**
	 * The url of this webhook's avatar.
	 *
	 * @param {ImageFormat} format - The format the url should be.
	 * @param {Number} size - The dimensions of the image.
	 * @returns {(String | null)}
	 */
	avatarURL(format?: ImageFormat, size?: number) {
		return this.avatar === null ? null : this._client._formatImage(Routes.USER_AVATAR(this.id, this.avatar), format, size);
	}

	/**
	 * The url of this webhook's `sourceGuild` (only present on channel follower webhooks).
	 *
	 * @param {ImageFormat} format - The format the url should be.
	 * @param {Number} size - The dimensions of the image.
	 * @returns {(String | null)}
	 */
	sourceGuildIconURL(format?: ImageFormat, size?: number) {
		return !this.sourceGuild?.icon ? null : this._client._formatImage(Routes.GUILD_ICON(this.id, this.sourceGuild?.icon), format, size);
	}
}
