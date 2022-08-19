import BaseRoute from "./BaseRoute";
import type {
	CreateWebhookOptions,
	DeleteWebhookMessageOptions,
	EditWebhookMessageOptions,
	EditWebhookOptions,
	EditWebhookTokenOptions,
	ExecuteWebhookOptions,
	ExecuteWebhookWaitOptions,
	GetWebhookMessageOptions,
	RawWebhook
} from "../types/webhooks";
import type { RawMessage } from "../types/channels";
import * as Routes from "../util/Routes";
import Webhook from "../structures/Webhook";
import Message from "../structures/Message";
import { File } from "../types/request-handler";

export default class Webhooks extends BaseRoute {
	/**
	 * Creat a channel webhook.
	 *
	 * @param {String} channelID - The id of the channel to create the webhook in.
	 * @param {Object} options
	 * @param {?(String | Buffer)} [options.avatar] - The new avatar (buffer, or full data url). `null` to remove the current avatar.
	 * @param {String} options.name - The name of the webhook.
	 * @param {String} [options.reason] - The reason for creating this webhook.
	 * @returns {Promise<Webhook>}
	 */
	async create(channelID: string, options: CreateWebhookOptions) {
		if (options.avatar) {
			try {
				options.avatar = this._client._convertImage(options.avatar);
			} catch (err) {
				throw new Error("Invalid avatar provided. Ensure you are providing a valid, fully-qualified base64 url.", { cause: err as Error });
			}
		}
		return this._manager.authRequest<RawWebhook>({
			method: "POST",
			path:   Routes.CHANNEL_WEBHOOKS(channelID),
			json:   {
				avatar: options.avatar,
				name:   options.name
			},
			reason: options.reason
		}).then(data => new Webhook(data, this._client));
	}

	/**
	 * Delete a webhook.
	 *
	 * @param {String} id - The id of the webhook.
	 * @param {String} [reason] - The reason for deleting the webhook.
	 * @returns {Promise<Boolean>}
	 */
	async delete(id: string, reason?: string) {
		return this._manager.authRequest<null>({
			method: "DELETE",
			path:   Routes.WEBHOOK(id),
			reason
		}).then(res => res === null);
	}

	/**
	 * Delete a webhook message.
	 *
	 * @param {String} id - The id of the webhook.
	 * @param {String} token - The token of the webhook.
	 * @param {String} messageID - The id of the message.
	 * @param {Object} [options]
	 * @param {String} [options.threadID] - The id of the thread the message is in.
	 * @returns {Promise<Boolean>}
	 */
	async deleteMessage(id: string, token: string, messageID: string, options?: DeleteWebhookMessageOptions) {
		const query = new URLSearchParams();
		if (options?.threadID) query.set("thread_id", options.threadID);
		return this._manager.authRequest<null>({
			method: "DELETE",
			path:   Routes.WEBHOOK_MESSAGE(id, token, messageID)
		}).then(res => res === null);
	}

	/**
	 * Delete a webhook via its token.
	 *
	 * @param {String} id - The id of the webhook.
	 * @param {String} token - The token of the webhook.
	 * @returns {Promise<Boolean>}
	 */
	async deleteToken(id: string, token: string) {
		return this._manager.authRequest<null>({
			method: "DELETE",
			path:   Routes.WEBHOOK(id, token)
		}).then(res => res === null);
	}

	/**
	 * Edit a webhook.
	 *
	 * @param {String} id - The id of the webhook.
	 * @param {Object} options
	 * @param {?(String | Buffer)} [options.avatar] - The new avatar (buffer, or full data url). `null` to remove the current avatar.
	 * @param {String} [options.channelID] - The id of the channel to move this webhook to.
	 * @param {String} [options.name] - The name of the webhook.
	 * @param {String} [options.reason] - The reason for editing this webhook.
	 * @returns {Promise<Webhook>}
	 */
	async edit(id: string, options: EditWebhookOptions) {
		if (options.avatar) {
			try {
				options.avatar = this._client._convertImage(options.avatar);
			} catch (err) {
				throw new Error("Invalid avatar provided. Ensure you are providing a valid, fully-qualified base64 url.", { cause: err as Error });
			}
		}
		return this._manager.authRequest<RawWebhook>({
			method: "PATCH",
			path:   Routes.WEBHOOK(id),
			json:   {
				avatar:     options.avatar,
				channel_id: options.channelID,
				name:       options.name
			},
			reason: options.reason
		}).then(data => new Webhook(data, this._client));
	}

	/**
	 * Edit a webhook message.
	 *
	 * @param {String} id - The id of the webhook.
	 * @param {String} token - The token of the webhook.
	 * @param {String} messageID - The id of the message to edit.
	 * @param {Object} options
	 * @param {Object} [options.allowedMentions] - An object that specifies the allowed mentions in this message.
	 * @param {Boolean} [options.allowedMentions.everyone] - If `@everyone`/`@here` mentions should be allowed.
	 * @param {Boolean} [options.allowedMentions.repliedUser] - If the replied user (`messageReference`) should be mentioned.
	 * @param {(Boolean | String[])} [options.allowedMentions.roles] - An array of role ids that are allowed to be mentioned, or a boolean value to allow all or none.
	 * @param {(Boolean | String[])} [options.allowedMentions.users] - An array of user ids that are allowed to be mentioned, or a boolean value to allow all or none.
	 * @param {Object[]} [options.attachments] - An array of [attachment information](https://discord.com/developers/docs/resources/channel#attachment-object) related to the sent files.
	 * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send.
	 * @param {String} [options.content] - The content of the message.
	 * @param {Object[]} [options.embeds] - An array of [embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send.
	 * @param {File[]} [options.files] - The files to send.
	 * @param {String} [options.threadID] - The id of the thread to send the message to.
	 * @returns {Promise<Message>}
	 */
	async editMessage(id: string, token: string,messageID: string, options: EditWebhookMessageOptions) {
		const query = new URLSearchParams();
		if (options.threadID) query.set("thread_id", options.threadID);
		return this._manager.authRequest<RawMessage>({
			method: "PATCH",
			path:   Routes.WEBHOOK_MESSAGE(id, token, messageID),
			json:   {
				allowed_mentions: this._client._formatAllowedMentions(options.allowedMentions),
				attachments:      options.attachments,
				components:       options.components,
				content:          options.content,
				embeds:           options.embeds
			},
			query,
			files: options.files
		}).then(data => new Message(data, this._client));
	}

	/**
	 * Edit a webhook via its token.
	 *
	 * @param {String} id - The id of the webhook.
	 * @param {Object} options
	 * @param {?(String | Buffer)} [options.avatar] - The new avatar (buffer, or full data url). `null` to remove the current avatar.
	 * @param {String} [options.name] - The name of the webhook.
	 * @returns {Promise<Webhook>}
	 */
	async editToken(id: string, token: string, options: EditWebhookTokenOptions) {
		if (options.avatar) {
			try {
				options.avatar = this._client._convertImage(options.avatar);
			} catch (err) {
				throw new Error("Invalid avatar provided. Ensure you are providing a valid, fully-qualified base64 url.", { cause: err as Error });
			}
		}
		return this._manager.authRequest<RawWebhook>({
			method: "PATCH",
			path:   Routes.WEBHOOK(id, token),
			json:   {
				avatar: options.avatar,
				name:   options.name
			}
		}).then(data => new Webhook(data, this._client));
	}

	/**
	 * Execute a webhook.
	 *
	 * @param {String} id - The id of the webhook.
	 * @param {String} token - The token of the webhook.
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
	 * @param {Boolean} [options.tts] - If the message should be spoken aloud.
	 * @param {String} [options.username] - The username of the webhook.
	 * @param {Boolean} [options.wait] - If the created message should be returned.
	 * @returns {Promise<Message | void>}
	 */
	async execute(id: string, token: string, options: ExecuteWebhookWaitOptions): Promise<Message>;
	async execute(id: string, token: string, options: ExecuteWebhookOptions): Promise<void>;
	async execute(id: string, token: string, options: ExecuteWebhookOptions): Promise<Message | void> {
		const query = new URLSearchParams();
		if (options.wait) query.set("wait", "true");
		if (options.threadID) query.set("thread_id", options.threadID);
		return this._manager.authRequest<RawMessage | null>({
			method: "POST",
			path:   Routes.WEBHOOK(id, token),
			query,
			json:   {
				allowed_mentions: this._client._formatAllowedMentions(options.allowedMentions),
				attachments:      options.attachments,
				avatar_url:       options.avatarURL,
				components:       options.components,
				content:          options.content,
				embeds:           options.embeds,
				flags:            options.flags,
				thread_name:      options.threadName,
				tts:              options.tts,
				username:         options.username
			},
			files: options.files
		}).then(res => {
			if (options.wait && res !== null) return new Message(res, this._client);
		});
	}

	/**
	 * Execute a github compabible webhook.
	 *
	 * @param {String} id - The id of the webhook.
	 * @param {String} token - The token of the webhook.
	 * @param {Object} options - The options to send. See Github's documentation for more information.
	 * @param {Boolean} [options.wait] - If the created message should be returned.
	 * @return {Promise<Message | void>}
	 */
	async executeGithub(id: string, token: string, options: Record<string, unknown> & { wait: true; }): Promise<Message>;
	async executeGithub(id: string, token: string, options: Record<string, unknown> & { wait?: false; }): Promise<void>;
	async executeGithub(id: string, token: string, options: Record<string, unknown> & { wait?: boolean; }): Promise<Message | void> {
		const query = new URLSearchParams();
		if (options.wait) query.set("wait", "true");
		return this._manager.authRequest<RawMessage | null>({
			method: "POST",
			path:   Routes.WEBHOOK_PLATFORM(id, token, "github"),
			query,
			json:   options
		}).then(res => {
			if (options.wait && res !== null) return new Message(res, this._client);
		});
	}

	/**
	 * Execute a slack compabible webhook.
	 *
	 * @param {String} id - The id of the webhook.
	 * @param {String} token - The token of the webhook.
	 * @param {Object} options - The options to send. See [Slack's Documentation](https://api.slack.com/incoming-webhooks) for more information.
	 * @param {Boolean} [options.wait] - If the created message should be returned.
	 * @return {Promise<Message | void>}
	 */
	async executeSlack(id: string, token: string, options: Record<string, unknown> & { wait: true; }): Promise<Message>;
	async executeSlack(id: string, token: string, options: Record<string, unknown> & { wait?: false; }): Promise<void>;
	async executeSlack(id: string, token: string, options: Record<string, unknown> & { wait?: boolean; }): Promise<Message | void> {
		const query = new URLSearchParams();
		if (options.wait) query.set("wait", "true");
		return this._manager.authRequest<RawMessage | null>({
			method: "POST",
			path:   Routes.WEBHOOK_PLATFORM(id, token, "slack"),
			query,
			json:   options
		}).then(res => {
			if (options.wait && res !== null) return new Message(res, this._client);
		});
	}

	/**
	 * Get a webhook by id (and optionally token).
	 *
	 * @param {String} id - The id of the webhook.
	 * @param {String} [token] - The token of the webhook.
	 * @returns {Promise<Webhook>}
	 */
	async get(id: string, token?: string) {
		return this._manager.authRequest<RawWebhook>({
			method: "GET",
			path:   Routes.WEBHOOK(id, token)
		}).then(data => new Webhook(data, this._client));
	}

	/**
	 * Get the webhooks in the specified channel.
	 *
	 * @param {String} channelID - The id of the channel to get the webhooks of.
	 * @returns {Promise<Array<Webhook>>}
	 */
	async getChannel(channelID: string) {
		return this._manager.authRequest<Array<RawWebhook>>({
			method: "GET",
			path:   Routes.CHANNEL_WEBHOOKS(channelID)
		});
	}

	/**
	 * Get the webhooks in the specified guild.
	 *
	 * @param {String} guildID - The id of the guild to get the webhooks of.
	 * @returns {Promise<Array<Webhook>>}
	 */
	async getGuild(guildID: string) {
		return this._manager.authRequest<Array<RawWebhook>>({
			method: "GET",
			path:   Routes.GUILD_WEBHOOKS(guildID)
		});
	}

	/**
	 * Get a webhook message.
	 *
	 * @param {String} id - The id of the webhook.
	 * @param {String} token - The token of the webhook.
	 * @param {Object} options
	 * @param {String} options.messageID - The id of the message.
	 * @param {String} [options.threadID] - The id of the thread the message is in.
	 * @returns {Promise<Message>}
	 */
	async getMessage(id: string, token: string, options: GetWebhookMessageOptions) {
		const query = new URLSearchParams();
		if (options.threadID) query.set("thread_id", options.threadID);
		return this._manager.authRequest<RawMessage>({
			method: "GET",
			path:   Routes.WEBHOOK_MESSAGE(id, token, options.messageID)
		}).then(data => new Message(data, this._client));
	}
}
