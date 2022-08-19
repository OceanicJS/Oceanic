import Base from "./Base";
import type User from "./User";
import type Message from "./Message";
import type Client from "../Client";
import type { ImageFormat, WebhookTypes } from "../Constants";
import { BASE_URL } from "../Constants";
import * as Routes from "../util/Routes";
import type { RawChannel } from "../types/channels";
import type { RawGuild } from "../types/guilds";
import type {
	DeleteWebhookMessageOptions,
	EditWebhookOptions,
	ExecuteWebhookOptions,
	ExecuteWebhookWaitOptions,
	GetWebhookMessageOptions,
	RawWebhook
} from "../types/webhooks";
import { File } from "../types/request-handler";

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
		this.update(data);
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
	 * Delete this webhook (requires a bot user, see `deleteToken`).
	 *
	 * @param {String} [reason] - The reason for deleting this webhook.
	 * @returns {Promise<Boolean>}
	 */
	async delete(reason?: string) {
		return this._client.rest.webhooks.delete(this.id, reason);
	}

	/**
	 * Delete a message from this webhook.
	 *
	 * @param {String} messageID - The id of the message.
	 * @param {Object} [options]
	 * @param {String} [options.threadID] - The id of the thread the message is in.
	 * @param {String} [options.token] - The token for the webhook, if not already present.
	 * @returns {Promise<Boolean>}
	 */
	async deleteMessage(messageID: string, options?: DeleteWebhookMessageOptions & { token?: string; }) {
		const token = this.token || options?.token;
		if (!token) throw new Error("Token is not present on webhook, and was not provided in options.");
		if (options?.token) delete options.token;
		return this._client.rest.webhooks.deleteMessage(this.id, token, messageID, options);
	}

	/**
	 * Delete this webhook via its token.
	 *
	 * @param {String} [token] - The token for the webhook, if not already present.
	 * @returns {Promise<Boolean>}
	 */
	async deleteToken(token?: string) {
		const t = this.token || token;
		if (!t) throw new Error("Token is not present on webhook, and was not provided in options.");
		return this._client.rest.webhooks.deleteToken(this.id, t);
	}

	/**
	 * Edit this webhook (requires a bot user, see `editToken`).
	 *
	 * @param {Object} options
	 * @param {?(String | Buffer)} [options.avatar] - The new avatar (buffer, or full data url). `null` to remove the current avatar.
	 * @param {String} [options.channelID] - The id of the channel to move this webhook to.
	 * @param {String} [options.name] - The name of the webhook.
	 * @param {String} [options.reason] - The reason for editing this webhook.
	 * @returns {Promise<Webhook>}
	 */
	async edit(options: EditWebhookOptions) {
		return this._client.rest.webhooks.edit(this.id, options);
	}

	/**
	 * Edit a webhook via its token.
	 *
	 * @param {Object} options
	 * @param {?(String | Buffer)} [options.avatar] - The new avatar (buffer, or full data url). `null` to remove the current avatar.
	 * @param {String} [options.name] - The name of the webhook.
	 * @param {String} [options.token] - The token for the webhook, if not already present.
	 * @returns {Promise<Webhook>}
	 */
	async editToken(options: EditWebhookOptions & { token?: string; }) {
		const token = this.token || options.token;
		if (!token) throw new Error("Token is not present on webhook, and was not provided in options.");
		return this._client.rest.webhooks.editToken(this.id, token, options);
	}

	/**
	 * Execute the webhook.
	 *
	 * @param {Object} options
	 * @param {Object} [options.allowedMentions] - An object that specifies the allowed mentions in this message.
	 * @param {Boolean} [options.allowedMentions.everyone] - If `@everyone`/`@here` mentions should be allowed.
	 * @param {Boolean} [options.allowedMentions.repliedUser] - If the replied user (`messageReference`) should be mentioned.
	 * @param {(Boolean | String[])} [options.allowedMentions.roles] - An array of role ids that are allowed to be mentioned, or a boolean value to allow all or none.
	 * @param {(Boolean | String[])} [options.allowedMentions.users] - An array of user ids that are allowed to be mentioned, or a boolean value to allow all or none.
	 * @param {Object[]} [options.attachments] - An array of [attachment information](https://discord.com/developers/docs/resources/channel#attachment-object) related to the sent files.
	 * @param {String} [options.avatarURL] - The avatar of the webhook.
	 * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send.
	 * @param {String} [options.content] - The content of the message.
	 * @param {Object[]} [options.embeds] - An array of [embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send.
	 * @param {File[]} [options.files] - The files to send.
	 * @param {Number} [options.flags] - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to send with the message.
	 * @param {String} [options.threadID] - The id of the thread to send the message to.
	 * @param {String} [options.threadName] - The name of the thread to create (forum channels).
	 * @param {String} [options.token] - The token for the webhook, if not already present.
	 * @param {Boolean} [options.tts] - If the message should be spoken aloud.
	 * @param {String} [options.username] - The username of the webhook.
	 * @param {Boolean} [options.wait] - If the created message should be returned.
	 * @returns {Promise<Message | void>}
	 */
	async execute(options: ExecuteWebhookWaitOptions & { token?: string; }): Promise<Message>;
	async execute(options: ExecuteWebhookOptions & { token?: string; }): Promise<void>;
	async execute(options: ExecuteWebhookOptions & { token?: string; }): Promise<Message | void> {
		const token = this.token || options?.token;
		if (!token) throw new Error("Token is not present on webhook, and was not provided in options.");
		if (options?.token) delete options.token;
		return this._client.rest.webhooks.execute(this.id, token, options);
	}

	/**
	 * Execute this webhook as github compatible.
	 *
	 * @param {Object} options - The options to send. See Github's documentation for more information.
	 * @param {String} [options.token] - The token for the webhook, if not already present.
	 * @param {Boolean} [options.wait] - If the created message should be returned.
	 * @return {Promise<Message | void>}
	 */
	async executeGithub(options: Record<string, unknown> & { token?: string; wait: true; }): Promise<Message>;
	async executeGithub(options: Record<string, unknown> & { token?: string; wait?: false; }): Promise<void>;
	async executeGithub(options: Record<string, unknown> & { token?: string; wait?: boolean; }): Promise<Message | void> {
		const token = this.token || options?.token;
		if (!token) throw new Error("Token is not present on webhook, and was not provided in options.");
		if (options.token) delete options.token;
		return this._client.rest.webhooks.executeGithub(this.id, token, options as Record<string, unknown>);
	}

	/**
	 * Execute this webhook as slack compatible.
	 *
	 * @param {Object} options - The options to send. See [Slack's Documentation](https://api.slack.com/incoming-webhooks) for more information.
	 * @param {String} [options.token] - The token for the webhook, if not already present.
	 * @param {Boolean} [options.wait] - If the created message should be returned.
	 * @return {Promise<Message | void>}
	 */
	async executeSlack(options: Record<string, unknown> & { token?: string; wait: true; }): Promise<Message>;
	async executeSlack(options: Record<string, unknown> & { token?: string; wait?: false; }): Promise<void>;
	async executeSlack(options: Record<string, unknown> & { token?: string; wait?: boolean; }): Promise<Message | void> {
		const token = this.token || options?.token;
		if (!token) throw new Error("Token is not present on webhook, and was not provided in options.");
		if (options.token) delete options.token;
		return this._client.rest.webhooks.executeSlack(this.id, token, options as Record<string, unknown>);
	}

	/**
	 * Get a webhook message.
	 *
	 * @param {Object} options
	 * @param {String} options.messageID - The id of the message.
	 * @param {String} [options.threadID] - The id of the thread the message is in.
	 * @param {String} [options.token] - The token for the webhook, if not already present.
	 * @returns {Promise<Message>}
	 */
	async getMessage(options: GetWebhookMessageOptions & { token?: string; }) {
		const token = this.token || options.token;
		if (!token) throw new Error("Token is not present on webhook, and was not provided in options.");
		return this._client.rest.webhooks.getMessage(this.id, token, options);
	}

	/**
	 * The url of this webhook's `sourceGuild` icon (only present on channel follower webhooks).
	 *
	 * @param {ImageFormat} format - The format the url should be.
	 * @param {Number} size - The dimensions of the image.
	 * @returns {(String | null)}
	 */
	sourceGuildIconURL(format?: ImageFormat, size?: number) {
		return !this.sourceGuild?.icon ? null : this._client._formatImage(Routes.GUILD_ICON(this.id, this.sourceGuild?.icon), format, size);
	}
}
