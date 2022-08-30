import Base from "./Base";
import Attachment from "./Attachment";
import User from "./User";
import type Member from "./Member";
import PartialApplication from "./PartialApplication";
import type ClientApplication from "./ClientApplication";
import type AnnouncementChannel from "./AnnouncementChannel";
import type AnnouncementThreadChannel from "./AnnouncementThreadChannel";
import type PublicThreadChannel from "./PublicThreadChannel";
import type TextChannel from "./TextChannel";
import type Client from "../Client";
import Collection from "../util/Collection";
import type { MessageTypes } from "../Constants";
import type { Uncached } from "../types/shared";
import type { AnyGuildTextChannel, AnyTextChannel, ChannelMention, EditMessageOptions, Embed, GetReactionsOptions, MessageActivity, MessageInteraction, MessageReference, RawAttachment, RawMessage, StartThreadFromMessageOptions, StickerItem, MessageReaction, MessageActionRow } from "../types/channels";
import type { DeleteWebhookMessageOptions, EditWebhookMessageOptions } from "../types/webhooks";
import type { JSONMessage } from "../types/json";
export default class Message<T extends AnyTextChannel | Uncached = AnyTextChannel | Uncached> extends Base {
    /** The [activity](https://discord.com/developers/docs/resources/channel#message-object-message-activity-structure) associated with this message. */
    activity?: MessageActivity;
    /**
     * This can be present in two scenarios:
     * * If the message was from an interaction or application owned webhook (`ClientApplication` if client, only `id` otherwise).
     * * If the message has a rich presence embed (`PartialApplication`)
     */
    application?: PartialApplication | ClientApplication | Uncached;
    /** The attachments on this message. */
    attachments: Collection<string, RawAttachment, Attachment>;
    /** The author of this message. */
    author: User;
    /** The channel this message was created in. This can be a partial object with only an `id` property. */
    channel: T;
    /** The components on this message. */
    components?: Array<MessageActionRow>;
    /** The content of this message. */
    content: string;
    /** The timestamp at which this message was last edited. */
    editedTimestamp: Date | null;
    /** The embeds on this message. */
    embeds: Array<Embed>;
    /** The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) on this message. */
    flags?: number;
    /** The ID of the guild this message is in. */
    guildID?: string;
    /** The interaction info, if this message was the result of an interaction. */
    interaction?: MessageInteraction;
    member?: Member;
    /** Channels mentioned in a `CROSSPOSTED` channel follower message. See [Discord's docs](https://discord.com/developers/docs/resources/channel#channel-mention-object) for more information. */
    mentionChannels?: Array<ChannelMention>;
    /** The mentions in this message. */
    mentions: {
        /** The ids of the channels mentioned in this message. */
        channels: Array<string>;
        /** If @everyone/@here is mentioned in this message. */
        everyone: boolean;
        /** The members mentioned in this message. */
        members: Array<Member>;
        /** The ids of the roles mentioned in this message. */
        roles: Array<string>;
        /** The users mentioned in this message. */
        users: Array<User>;
    };
    /** If this message is a `REPLY` or `THREAD_STARTER_MESSAGE`, some info about the referenced message. */
    messageReference?: MessageReference;
    /** A nonce for ensuring a message was sent. */
    nonce?: number | string;
    /** If this message is pinned. */
    pinned: boolean;
    /** This message's relative position, if in a thread. */
    position?: number;
    /** The reactions on this message. */
    reactions: Record<string, MessageReaction>;
    /** If this message is a `REPLY` or `THREAD_STARTER_MESSAGE`, */
    referencedMessage?: Message | null;
    /** The sticker items on this message. */
    stickerItems?: Array<StickerItem>;
    /** The thread associated with this message, if any. */
    thread?: AnnouncementThreadChannel | PublicThreadChannel;
    /** The timestamp at which this message was sent. */
    timestamp: Date;
    /** If this message was read aloud. */
    tts: boolean;
    /** The [type](https://discord.com/developers/docs/resources/channel#message-object-message-types) of this message. */
    type: MessageTypes;
    /** The webhook associated with this message, if sent via a webhook. This only has an `id` property. */
    webhook?: Uncached;
    constructor(data: RawMessage, client: Client);
    protected update(data: Partial<RawMessage>): void;
    /**
     * Add a reaction to this message.
     * @param emoji The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    createReaction(emoji: string): Promise<void>;
    /**
     * Crosspost this message in a announcement channel.
     */
    crosspost(): Promise<Message<AnnouncementChannel>>;
    /**
     * Delete this message.
     * @param reason The reason for deleting the message.
     */
    deleteMessage(reason?: string): Promise<void>;
    /**
     * Remove a reaction from this message.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param user The user to remove the reaction from, `@me` for the current user (default).
     */
    deleteReaction(emoji: string, user?: string): Promise<void>;
    /**
     * Remove all, or a specific emoji's reactions from this message.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     */
    deleteReactions(emoji?: string): Promise<void>;
    /**
     * Delete this message as a webhook.
     * @param token The token of the webhook.
     * @param options Options for deleting the message.
     */
    deleteWebhook(token: string, options: DeleteWebhookMessageOptions): Promise<void>;
    /**
     * Edit this message.
     * @param options The options for editing the message.
     */
    edit(options: EditMessageOptions): Promise<Message<T>>;
    /**
     * Edit this message as a webhook.
     * @param token The token of the webhook.
     * @param options The options for editing the message.
     */
    editWebhook(token: string, options: EditWebhookMessageOptions): Promise<Message<AnyGuildTextChannel>>;
    /**
     * Get the users who reacted with a specific emoji on this message.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options The options for getting the reactions.
     */
    getReactions(emoji: string, options?: GetReactionsOptions): Promise<User[]>;
    /**
     * Pin this message.
     * @param reason The reason for pinning the message.
     */
    pin(reason?: string): Promise<void>;
    /**
     * Create a thread from this message.
     * @param options The options for creating the thread.
     */
    startThread(options: StartThreadFromMessageOptions): Promise<T extends AnnouncementChannel ? AnnouncementThreadChannel : T extends TextChannel ? PublicThreadChannel : never>;
    toJSON(): JSONMessage;
    /**
     * Unpin this message.
     * @param reason The reason for unpinning the message.
     */
    unpin(reason?: string): Promise<void>;
}
