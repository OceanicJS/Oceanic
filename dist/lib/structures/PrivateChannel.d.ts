import Channel from "./Channel";
import type User from "./User";
import Message from "./Message";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { CreateMessageOptions, EditMessageOptions, GetChannelMessagesOptions, GetReactionsOptions, RawMessage, RawPrivateChannel } from "../types/channels";
import type { Uncached } from "../types/shared";
import Collection from "../util/Collection";
import type { JSONPrivateChannel } from "../types/json";
/** Represents a direct message with a user. */
export default class PrivateChannel extends Channel {
    /** The last message sent in this channel, if any. This can be a partial object with only an `id` property. */
    lastMessage: Message | Uncached | null;
    /** The cached messages in this channel. */
    messages: Collection<string, RawMessage, Message>;
    /** The other user in this direct message. */
    recipient: User;
    type: ChannelTypes.DM;
    constructor(data: RawPrivateChannel, client: Client);
    protected update(data: Partial<RawPrivateChannel>): void;
    /**
     * Create a message in this channel.
     *
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
     * @param {Number} [options.flags] - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to send with the message.
     * @param {String[]} [options.stickerIDs] - The IDs of up to 3 stickers from the current guild to send.
     * @param {Object} [options.messageReference] - Reply to a message.
     * @param {String} [options.messageReference.channelID] - The id of the channel the replied message is in.
     * @param {Boolean} [options.messageReference.failIfNotExists] - If creating the message should fail if the message to reply to does not exist.
     * @param {String} [options.messageReference.guildID] - The id of the guild the replied message is in.
     * @param {String} [options.messageReference.messageID] - The id of the message to reply to.
     * @param {Boolean} [options.tts] - If the message should be spoken aloud.
     * @returns {Promise<Message<PrivateChannel>>}
     */
    createMessage(options: CreateMessageOptions): Promise<Message<this>>;
    /**
     * Add a reaction to a message in this channel.
     *
     * @param {String} messageID - The id of the message to add a reaction to.
     * @param {String} emoji - The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @returns {Promise<void>}
     */
    createReaction(messageID: string, emoji: string): Promise<void>;
    /**
     * Delete a message in this channel.
     *
     * @param {String} messageID - The id of the message to delete.
     * @param {String} [reason] - The reason for deleting the message.
     * @returns {Promise<void>}
     */
    deleteMessage(messageID: string, reason?: string): Promise<void>;
    /**
     * Remove a reaction from a message in this channel.
     *
     * @param {String} messageID - The id of the message to remove a reaction from.
     * @param {String} emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @returns {Promise<void>}
     */
    deleteReaction(messageID: string, emoji: string): Promise<void>;
    /**
     * Edit a message in this channel.
     *
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
     * @returns {Promise<Message<PrivateChannel>>}
     */
    editMessage(messageID: string, options: EditMessageOptions): Promise<Message<this>>;
    /**
     * Get a message in this channel.
     *
     * @param {String} messageID - The id of the message to get.
     * @returns {Promise<Message<PrivateChannel>>}
     */
    getMessage(messageID: string): Promise<Message<this>>;
    /**
     * Get messages in this channel.
     *
     * @param {Object} options - All options are mutually exclusive.
     * @param {String} [options.after] - Get messages after this message id.
     * @param {String} [options.around] - Get messages around this message id.
     * @param {String} [options.before] - Get messages before this message id.
     * @param {Number} [options.limit] - The maximum amount of messages to get.
     * @returns {Promise<Message<PrivateChannel>[]>}
     */
    getMessages(options?: GetChannelMessagesOptions): Promise<Message<this>[]>;
    /**
     * Get the pinned messages in this channel.
     *
     * @returns {Promise<Message<PrivateChannel>[]>}
     */
    getPinnedMessages(): Promise<Message<this>[]>;
    /**
     * Get the users who reacted with a specific emoji on a message.
     *
     * @param {String} messageID - The id of the message to get reactions from.
     * @param {String} emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param {Object} [options] - Options for the request.
     * @param {String} [options.after] - Get users after this user id.
     * @param {Number} [options.limit] - The maximum amount of users to get.
     * @returns {Promise<User[]>}
     */
    getReactions(messageID: string, emoji: string, options?: GetReactionsOptions): Promise<User[]>;
    /**
     * Pin a message in this channel.
     *
     * @param {String} messageID - The id of the message to pin.
     * @param {String} [reason] - The reason for pinning the message.
     * @returns {Promise<void>}
     */
    pinMessage(messageID: string, reason?: string): Promise<void>;
    /**
     * Show a typing indicator in this channel.
     *
     * @returns {Promise<void>}
     */
    sendTyping(): Promise<void>;
    toJSON(): JSONPrivateChannel;
    /**
     * Unpin a message in this channel.
     *
     * @param {String} messageID - The id of the message to unpin.
     * @param {String} [reason] - The reason for unpinning the message.
     * @returns {Promise<void>}
     */
    unpinMessage(messageID: string, reason?: string): Promise<void>;
}
