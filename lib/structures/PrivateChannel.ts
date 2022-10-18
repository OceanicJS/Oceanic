/** @module PrivateChannel */
import Channel from "./Channel";
import type User from "./User";
import Message from "./Message";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type {
    CreateMessageOptions,
    EditMessageOptions,
    GetChannelMessagesOptions,
    GetReactionsOptions,
    RawMessage,
    RawPrivateChannel
} from "../types/channels";
import TypedCollection from "../util/TypedCollection";
import type { JSONPrivateChannel } from "../types/json";

/** Represents a direct message with a user. */
export default class PrivateChannel extends Channel {
    /** The last message sent in this channel. This will only be present if a message has been sent within the current session. */
    lastMessage?: Message<this> | null;
    /** The ID of last message sent in this channel. */
    lastMessageID: string | null;
    /** The cached messages in this channel. */
    messages: TypedCollection<string, RawMessage, Message<this>>;
    /** The other user in this direct message. */
    recipient: User;
    declare type: ChannelTypes.DM;
    constructor(data: RawPrivateChannel, client: Client) {
        super(data, client);
        this.messages = new TypedCollection(Message<this>, client, client.options.collectionLimits.messages);
        this.lastMessageID = data.last_message_id;
        this.recipient = client.users.update(data.recipients[0]);
    }

    protected override update(data: Partial<RawPrivateChannel>): void {
        if (data.last_message_id !== undefined) {
            this.lastMessage = data.last_message_id === null ? null : this.messages.get(data.last_message_id);
            this.lastMessageID = data.last_message_id;
        }
    }

    /**
     * Create a message in this channel.
     * @param options The options for creating the message.
     */
    async createMessage(options: CreateMessageOptions): Promise<Message<this>> {
        return this.client.rest.channels.createMessage<this>(this.id, options);
    }

    /**
     * Add a reaction to a message in this channel.
     * @param messageID The ID of the message to add a reaction to.
     * @param emoji The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    async createReaction(messageID: string, emoji: string): Promise<void> {
        return this.client.rest.channels.createReaction(this.id, messageID, emoji);
    }

    /**
     * Delete a message in this channel.
     * @param messageID The ID of the message to delete.
     * @param reason The reason for deleting the message.
     */
    async deleteMessage(messageID: string, reason?: string): Promise<void> {
        return this.client.rest.channels.deleteMessage(this.id, messageID, reason);
    }

    /**
     * Remove a reaction from a message in this channel.
     * @param messageID The ID of the message to remove a reaction from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    async deleteReaction(messageID: string, emoji: string): Promise<void> {
        return this.client.rest.channels.deleteReaction(this.id, messageID, emoji);
    }

    /**
     * Edit a message in this channel.
     * @param messageID The ID of the message to edit.
     * @param options The options for editing the message.
     */
    async editMessage(messageID: string, options: EditMessageOptions): Promise<Message<this>> {
        return this.client.rest.channels.editMessage<this>(this.id, messageID, options);
    }

    /**
     * Get a message in this channel.
     * @param messageID The ID of the message to get.
     */
    async getMessage(messageID: string): Promise<Message<this>> {
        return this.client.rest.channels.getMessage<this>(this.id, messageID);
    }

    /**
     * Get messages in this channel.
     * @param options The options for getting the messages. `before`, `after`, and `around `All are mutually exclusive.
     */
    async getMessages(options?: GetChannelMessagesOptions): Promise<Array<Message<this>>> {
        return this.client.rest.channels.getMessages<this>(this.id, options);
    }

    /**
     * Get the pinned messages in this channel.
     */
    async getPinnedMessages(): Promise<Array<Message<this>>> {
        return this.client.rest.channels.getPinnedMessages<this>(this.id);
    }

    /**
     * Get the users who reacted with a specific emoji on a message.
     * @param messageID The iIDd of the message to get reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options The options for getting the reactions.
     */
    async getReactions(messageID: string, emoji: string, options?: GetReactionsOptions): Promise<Array<User>> {
        return this.client.rest.channels.getReactions(this.id, messageID, emoji, options);
    }

    /**
     * Pin a message in this channel.
     * @param messageID The ID of the message to pin.
     * @param reason The reason for pinning the message.
     */
    async pinMessage(messageID: string, reason?: string): Promise<void> {
        return this.client.rest.channels.pinMessage(this.id, messageID, reason);
    }

    /**
     * Show a typing indicator in this channel.
     */
    async sendTyping(): Promise<void> {
        return this.client.rest.channels.sendTyping(this.id);
    }

    override toJSON(): JSONPrivateChannel {
        return {
            ...super.toJSON(),
            lastMessageID: this.lastMessageID,
            messages:      this.messages.map(message => message.id),
            recipient:     this.recipient?.toJSON(),
            type:          this.type
        };
    }

    /**
     * Unpin a message in this channel.
     * @param messageID The ID of the message to unpin.
     * @param reason The ID for unpinning the message.
     */
    async unpinMessage(messageID: string, reason?: string): Promise<void> {
        return this.client.rest.channels.unpinMessage(this.id, messageID, reason);
    }
}
