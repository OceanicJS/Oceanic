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
    /** The application associatd with this webhook. */
    application: ClientApplication | Uncached | null;
    /** The hash of this webhook's avatar. */
    avatar: string | null;
    /** The channel this webhook is for, if applicable. */
    channel: AnyGuildTextChannel | Uncached | null;
    /** The guild this webhook is for, if applicable. */
    guild: Guild | null;
    /** The id of the guild this webhook is in, if applicable. */
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
    user: User | null;
    constructor(data: RawWebhook, client: Client);
    get url(): string;
    /**
     * The url of this webhook's avatar.
     * @param format - The format the url should be.
     * @param size - The dimensions of the image.
     */
    avatarURL(format?: ImageFormat, size?: number): string | null;
    /**
     * Delete this webhook (requires a bot user, see `deleteToken`).
     * @param reason - The reason for deleting this webhook.
     */
    delete(reason?: string): Promise<void>;
    /**
     * Delete a message from this webhook.
     * @param messageID - The ID of the message.
     * @param options - The options for deleting the message.
     * @param token - The token for the webhook, if not already present.
     */
    deleteMessage(messageID: string, options?: DeleteWebhookMessageOptions, token?: string): Promise<void>;
    /**
     * Delete this webhook via its token.
     * @param token - The token for the webhook, if not already present.
     */
    deleteToken(token?: string): Promise<void>;
    /**
     * Edit this webhook (requires a bot user, see `editToken`).
     * @param options - The options for editing the webhook.
     */
    edit(options: EditWebhookOptions): Promise<Webhook>;
    /**
     * Edit a webhook message.
     * @param id - The ID of the webhook.
     * @param token - The token of the webhook.
     * @param messageID - The ID of the message to edit.
     * @param options - The options for editing the message.
     */
    editMessage<T extends AnyGuildTextChannel = AnyGuildTextChannel>(messageID: string, options: EditWebhookMessageOptions, token?: string): Promise<Message<T>>;
    /**
     * Edit a webhook via its token.
     * @param options - The options for editing the webhook.
     * @param token - The token for the webhook, if not already present.
     */
    editToken(options: EditWebhookOptions, token?: string): Promise<Webhook>;
    /**
     * Execute the webhook.
     * @param options - The options for executing the webhook.
     * @param token - The token for the webhook, if not already present.
     */
    execute<T extends AnyGuildTextChannel>(options: ExecuteWebhookWaitOptions, token?: string): Promise<Message<T>>;
    execute(options: ExecuteWebhookOptions, token?: string): Promise<void>;
    /**
     * Execute this webhook as github compatible.
     * @param options - The options to send. See Github's documentation for more information.
     * @param token - The token for the webhook, if not already present.
     */
    executeGithub(options: Record<string, unknown> & {
        wait: false;
    }, token?: string): Promise<void>;
    executeGithub<T extends AnyGuildTextChannel>(options: Record<string, unknown> & {
        wait?: true;
    }, token?: string): Promise<Message<T>>;
    /**
     * Execute this webhook as slack compatible.
     * @param options - The options to send. See [Slack's Documentation](https://api.slack.com/incoming-webhooks) for more information.
     * @param token - The token for the webhook, if not already present.
     */
    executeSlack(options: Record<string, unknown> & {
        wait: false;
    }, token?: string): Promise<void>;
    executeSlack<T extends AnyGuildTextChannel>(options: Record<string, unknown> & {
        wait?: true;
    }, token?: string): Promise<Message<T>>;
    /**
     * Get a webhook message.
     * @param messageID - The ID of the message.
     * @param threadID - The ID of the thread the message is in.
     * @param token - The token for the webhook, if not already present.
     */
    getMessage<T extends AnyGuildTextChannel>(messageID: string, threadID?: string, token?: string): Promise<Message<T>>;
    /**
     * The url of this webhook's `sourceGuild` icon (only present on channel follower webhooks).
     * @param format - The format the url should be.
     * @param size - The dimensions of the image.
     */
    sourceGuildIconURL(format?: ImageFormat, size?: number): string | null;
    toJSON(): JSONWebhook;
}
