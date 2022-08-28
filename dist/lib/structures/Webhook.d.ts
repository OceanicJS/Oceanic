import Base from "./Base";
import type User from "./User";
import type Message from "./Message";
import type Guild from "./Guild";
import type ClientApplication from "./ClientApplication";
import type Client from "../Client";
import type { ImageFormat, WebhookTypes } from "../Constants";
import type { AnyGuildTextChannel, RawChannel } from "../types/channels";
import type { RawGuild } from "../types/guilds";
import type { DeleteWebhookMessageOptions, EditWebhookMessageOptions, EditWebhookOptions, ExecuteWebhookOptions, ExecuteWebhookWaitOptions, RawWebhook } from "../types/webhooks";
import type { Uncached } from "../types/shared";
import type { JSONWebhook } from "../types/json";
export default class Webhook extends Base {
    /** The application associatd with this webhook. This can be a partial object with only an `id` property. */
    application: ClientApplication | Uncached | null;
    /** The hash of this webhook's avatar. */
    avatar: string | null;
    /** The channel this webhook is for, if any. This can be a partial object with only an `id` property. */
    channel: AnyGuildTextChannel | Uncached | null;
    /** The guild this webhook is for, if any. This can be a partial object with only an `id` property. */
    guild: Guild | Uncached | null;
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
    constructor(data: RawWebhook, client: Client);
    protected update(data: Partial<RawWebhook>): void;
    get url(): string;
    /**
     * The url of this webhook's avatar.
     *
     * @param {ImageFormat} format - The format the url should be.
     * @param {Number} size - The dimensions of the image.
     * @returns {(String | null)}
     */
    avatarURL(format?: ImageFormat, size?: number): string | null;
    /**
     * Delete this webhook (requires a bot user, see `deleteToken`).
     *
     * @param {String} [reason] - The reason for deleting this webhook.
     * @returns {Promise<void>}
     */
    delete(reason?: string): Promise<void>;
    /**
     * Delete a message from this webhook.
     *
     * @param {String} messageID - The id of the message.
     * @param {Object} [options]
     * @param {String} [options.threadID] - The id of the thread the message is in.
     * @param {String} [token] - The token for the webhook, if not already present.
     * @returns {Promise<void>}
     */
    deleteMessage(messageID: string, options?: DeleteWebhookMessageOptions, token?: string): Promise<void>;
    /**
     * Delete this webhook via its token.
     *
     * @param {String} [token] - The token for the webhook, if not already present.
     * @returns {Promise<void>}
     */
    deleteToken(token?: string): Promise<void>;
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
    edit(options: EditWebhookOptions): Promise<Webhook>;
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
    editMessage<T extends AnyGuildTextChannel = AnyGuildTextChannel>(messageID: string, options: EditWebhookMessageOptions, token?: string): Promise<Message<T>>;
    /**
     * Edit a webhook via its token.
     *
     * @param {Object} options
     * @param {?(String | Buffer)} [options.avatar] - The new avatar (buffer, or full data url). `null` to remove the current avatar.
     * @param {String} [options.name] - The name of the webhook.
     * @param {String} [token] - The token for the webhook, if not already present.
     * @returns {Promise<Webhook>}
     */
    editToken(options: EditWebhookOptions, token?: string): Promise<Webhook>;
    /**
     * Execute the webhook.
     *
     * @template {AnyGuildTextChannel} T
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
     * @param {String} [token] - The token for the webhook, if not already present.
     * @returns {Promise<Message<T> | void>}
     */
    execute<T extends AnyGuildTextChannel>(options: ExecuteWebhookWaitOptions, token?: string): Promise<Message<T>>;
    execute(options: ExecuteWebhookOptions, token?: string): Promise<void>;
    /**
     * Execute this webhook as github compatible.
     *
     * @template {AnyGuildTextChannel} T
     * @param {Object} options - The options to send. See Github's documentation for more information.
     * @param {Boolean} [options.wait] - If the created message should be returned.
     * @param {String} [token] - The token for the webhook, if not already present.
     * @return {Promise<Message<T> | void>}
     */
    executeGithub(options: Record<string, unknown> & {
        wait: false;
    }, token?: string): Promise<void>;
    executeGithub<T extends AnyGuildTextChannel>(options: Record<string, unknown> & {
        wait?: true;
    }, token?: string): Promise<Message<T>>;
    /**
     * Execute this webhook as slack compatible.
     *
     * @template {AnyGuildTextChannel} T
     * @param {Object} options - The options to send. See [Slack's Documentation](https://api.slack.com/incoming-webhooks) for more information.
     * @param {Boolean} [options.wait] - If the created message should be returned.
     * @param {String} options.token - The token for the webhook, if not already present.
     * @return {Promise<Message<T> | void>}
     */
    executeSlack(options: Record<string, unknown> & {
        wait: false;
    }, token?: string): Promise<void>;
    executeSlack<T extends AnyGuildTextChannel>(options: Record<string, unknown> & {
        wait?: true;
    }, token?: string): Promise<Message<T>>;
    /**
     * Get a webhook message.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} messageID - The id of the message.
     * @param {String} [threadID] - The id of the thread the message is in.
     * @param {String} [token] - The token for the webhook, if not already present.
     * @returns {Promise<Message<T>>}
     */
    getMessage<T extends AnyGuildTextChannel>(messageID: string, threadID?: string, token?: string): Promise<Message<T>>;
    /**
     * The url of this webhook's `sourceGuild` icon (only present on channel follower webhooks).
     *
     * @param {ImageFormat} format - The format the url should be.
     * @param {Number} size - The dimensions of the image.
     * @returns {(String | null)}
     */
    sourceGuildIconURL(format?: ImageFormat, size?: number): string | null;
    toJSON(): JSONWebhook;
}
