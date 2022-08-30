import BaseRoute from "./BaseRoute";
import type { CreateWebhookOptions, DeleteWebhookMessageOptions, EditWebhookMessageOptions, EditWebhookOptions, EditWebhookTokenOptions, ExecuteWebhookOptions, ExecuteWebhookWaitOptions, RawWebhook } from "../types/webhooks";
import type { AnyGuildTextChannel } from "../types/channels";
import Webhook from "../structures/Webhook";
import Message from "../structures/Message";
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
    create(channelID: string, options: CreateWebhookOptions): Promise<Webhook>;
    /**
     * Delete a webhook.
     *
     * @param {String} id - The id of the webhook.
     * @param {String} [reason] - The reason for deleting the webhook.
     * @returns {Promise<void>}
     */
    delete(id: string, reason?: string): Promise<void>;
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
    deleteMessage(id: string, token: string, messageID: string, options?: DeleteWebhookMessageOptions): Promise<void>;
    /**
     * Delete a webhook via its token.
     *
     * @param {String} id - The id of the webhook.
     * @param {String} token - The token of the webhook.
     * @returns {Promise<void>}
     */
    deleteToken(id: string, token: string): Promise<void>;
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
    edit(id: string, options: EditWebhookOptions): Promise<Webhook>;
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
    editMessage<T extends AnyGuildTextChannel>(id: string, token: string, messageID: string, options: EditWebhookMessageOptions): Promise<Message<T>>;
    /**
     * Edit a webhook via its token.
     *
     * @param {String} id - The id of the webhook.
     * @param {Object} options
     * @param {?(String | Buffer)} [options.avatar] - The new avatar (buffer, or full data url). `null` to remove the current avatar.
     * @param {String} [options.name] - The name of the webhook.
     * @returns {Promise<Webhook>}
     */
    editToken(id: string, token: string, options: EditWebhookTokenOptions): Promise<Webhook>;
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
    execute<T extends AnyGuildTextChannel>(id: string, token: string, options: ExecuteWebhookWaitOptions): Promise<Message<T>>;
    execute(id: string, token: string, options: ExecuteWebhookOptions): Promise<void>;
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
    executeGithub(id: string, token: string, options: Record<string, unknown> & {
        wait: false;
    }): Promise<void>;
    executeGithub<T extends AnyGuildTextChannel>(id: string, token: string, options: Record<string, unknown> & {
        wait?: true;
    }): Promise<Message<T>>;
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
    executeSlack(id: string, token: string, options: Record<string, unknown> & {
        wait: false;
    }): Promise<void>;
    executeSlack<T extends AnyGuildTextChannel>(id: string, token: string, options: Record<string, unknown> & {
        wait?: true;
    }): Promise<Message<T>>;
    /**
     * Get a webhook by id (and optionally token).
     *
     * @param {String} id - The id of the webhook.
     * @param {String} [token] - The token of the webhook.
     * @returns {Promise<Webhook>}
     */
    get(id: string, token?: string): Promise<Webhook>;
    /**
     * Get the webhooks in the specified channel.
     *
     * @param {String} channelID - The id of the channel to get the webhooks of.
     * @returns {Promise<Array<Webhook>>}
     */
    getChannel(channelID: string): Promise<RawWebhook[]>;
    /**
     * Get the webhooks in the specified guild.
     *
     * @param {String} guildID - The id of the guild to get the webhooks of.
     * @returns {Promise<Array<Webhook>>}
     */
    getGuild(guildID: string): Promise<RawWebhook[]>;
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
    getMessage<T extends AnyGuildTextChannel>(id: string, token: string, messageID: string, threadID?: string): Promise<Message<T>>;
}
