import BaseRoute from "./BaseRoute";
import type {
    CreateWebhookOptions,
    DeleteWebhookMessageOptions,
    EditWebhookMessageOptions,
    EditWebhookOptions,
    EditWebhookTokenOptions,
    ExecuteWebhookOptions,
    ExecuteWebhookWaitOptions,
    RawWebhook
} from "../types/webhooks";
import type { AnyGuildTextChannel, RawMessage } from "../types/channels";
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
        const reason = options.reason;
        if (options.reason) delete options.reason;
        if (options.avatar) options.avatar = this._manager._convertImage(options.avatar, "avatar");
        return this._manager.authRequest<RawWebhook>({
            method: "POST",
            path:   Routes.CHANNEL_WEBHOOKS(channelID),
            json:   {
                avatar: options.avatar,
                name:   options.name
            },
            reason
        }).then(data => new Webhook(data, this._client));
    }

    /**
     * Delete a webhook.
     *
     * @param {String} id - The id of the webhook.
     * @param {String} [reason] - The reason for deleting the webhook.
     * @returns {Promise<void>}
     */
    async delete(id: string, reason?: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.WEBHOOK(id),
            reason
        });
    }

    /**
     * Delete a webhook message.
     *
     * @param {String} id - The id of the webhook.
     * @param {String} token - The token of the webhook.
     * @param {String} messageID - The id of the message.
     * @param {Object} [options]
     * @param {String} [options.threadID] - The id of the thread the message is in.
     * @returns {Promise<void>}
     */
    async deleteMessage(id: string, token: string, messageID: string, options?: DeleteWebhookMessageOptions) {
        const query = new URLSearchParams();
        if (options?.threadID) query.set("thread_id", options.threadID);
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.WEBHOOK_MESSAGE(id, token, messageID)
        });
    }

    /**
     * Delete a webhook via its token.
     *
     * @param {String} id - The id of the webhook.
     * @param {String} token - The token of the webhook.
     * @returns {Promise<void>}
     */
    async deleteToken(id: string, token: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.WEBHOOK(id, token)
        });
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
        const reason = options.reason;
        if (options.reason) delete options.reason;
        if (options.avatar) options.avatar = this._manager._convertImage(options.avatar, "avatar");
        return this._manager.authRequest<RawWebhook>({
            method: "PATCH",
            path:   Routes.WEBHOOK(id),
            json:   {
                avatar:     options.avatar,
                channel_id: options.channelID,
                name:       options.name
            },
            reason
        }).then(data => new Webhook(data, this._client));
    }

    /**
     * Edit a webhook message.
     *
     * @template {AnyGuildTextChannel} T
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
     * @returns {Promise<Message<T>>}
     */
    async editMessage<T extends AnyGuildTextChannel>(id: string, token: string,messageID: string, options: EditWebhookMessageOptions): Promise<Message<T>> {
        const files = options.files;
        if (options.files) delete options.files;
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
            files
        }).then(data => new Message<T>(data, this._client));
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
        if (options.avatar) options.avatar = this._manager._convertImage(options.avatar, "avatar");
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
     * @template {AnyGuildTextChannel} T
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
     * @returns {Promise<Message<T> | void>}
     */
    async execute<T extends AnyGuildTextChannel>(id: string, token: string, options: ExecuteWebhookWaitOptions): Promise<Message<T>>;
    async execute(id: string, token: string, options: ExecuteWebhookOptions): Promise<void>;
    async execute<T extends AnyGuildTextChannel>(id: string, token: string, options: ExecuteWebhookOptions): Promise<Message<T> | void> {
        const files = options.files;
        if (options.files) delete options.files;
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
            files
        }).then(res => {
            if (options.wait && res !== null) return new Message(res, this._client);
        });
    }

    /**
     * Execute a github compabible webhook.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} id - The id of the webhook.
     * @param {String} token - The token of the webhook.
     * @param {Object} options - The options to send. See Github's documentation for more information.
     * @param {Boolean} [options.wait] - If the created message should be returned.
     * @return {Promise<Message<T> | void>}
     */
    async executeGithub(id: string, token: string, options: Record<string, unknown> & { wait: false; }): Promise<void>;
    async executeGithub<T extends AnyGuildTextChannel>(id: string, token: string, options: Record<string, unknown> & { wait?: true; }): Promise<Message<T>>;
    async executeGithub<T extends AnyGuildTextChannel>(id: string, token: string, options: Record<string, unknown> & { wait?: boolean; }): Promise<Message<T> | void> {
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
     * @template {AnyGuildTextChannel} T
     * @param {String} id - The id of the webhook.
     * @param {String} token - The token of the webhook.
     * @param {Object} options - The options to send. See [Slack's Documentation](https://api.slack.com/incoming-webhooks) for more information.
     * @param {Boolean} [options.wait] - If the created message should be returned.
     * @return {Promise<Message<T> | void>}
     */
    async executeSlack(id: string, token: string, options: Record<string, unknown> & { wait: false; }): Promise<void>;
    async executeSlack<T extends AnyGuildTextChannel>(id: string, token: string, options: Record<string, unknown> & { wait?: true; }): Promise<Message<T>>;
    async executeSlack<T extends AnyGuildTextChannel>(id: string, token: string, options: Record<string, unknown> & { wait?: boolean; }): Promise<Message<T> | void> {
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
     * @template {AnyGuildTextChannel} T
     * @param {String} id - The ID of the webhook.
     * @param {String} token - The token of the webhook.
     * @param {String} messageID - The ID of the message.
     * @param {String} [threadID] - The ID of the thread the message is in.
     * @returns {Promise<Message<T>>}
     */
    async getMessage<T extends AnyGuildTextChannel>(id: string, token: string, messageID: string, threadID?: string) {
        const query = new URLSearchParams();
        if (threadID) query.set("thread_id", threadID);
        return this._manager.authRequest<RawMessage>({
            method: "GET",
            path:   Routes.WEBHOOK_MESSAGE(id, token, messageID)
        }).then(data => new Message<T>(data, this._client));
    }
}
