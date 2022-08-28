import GuildChannel from "./GuildChannel";
import Message from "./Message";
import User from "./User";
import type TextChannel from "./TextChannel";
import type AnnouncementChannel from "./AnnouncementChannel";
import type { ThreadChannelTypes } from "../Constants";
import type Client from "../Client";
import Collection from "../util/Collection";
import type { AnyThreadChannel, CreateMessageOptions, EditMessageOptions, EditThreadChannelOptions, GetChannelMessagesOptions, GetReactionsOptions, PrivateThreadmetadata, RawMessage, RawThreadChannel, ThreadMember, ThreadMetadata } from "../types/channels";
import type { Uncached } from "../types/shared";
import type { JSONThreadChannel } from "../types/json";
/** Represents a guild thread channel. */
export default class ThreadChannel<T extends AnyThreadChannel = AnyThreadChannel> extends GuildChannel {
    /** The [flags](https://discord.com/developers/docs/resources/channel#channel-object-channel-flags) for this thread channel. */
    flags: number;
    /** The last message sent in this channel. This can be a partial object with only an `id` property. */
    lastMessage: Message | Uncached | null;
    /** The approximate number of members in this thread. Stops counting after 50. */
    memberCount: number;
    /** The members of this thread. */
    members: Array<ThreadMember>;
    /** The number of messages (not including the initial message or deleted messages) in the thread. Stops counting after 50. */
    messageCount: number;
    /** The cached messages in this channel. */
    messages: Collection<string, RawMessage, Message>;
    /** The creator of this thread. */
    owner: User | Uncached;
    parent: TextChannel | AnnouncementChannel;
    parentID: string;
    /** The amount of seconds between non-moderators sending messages. */
    rateLimitPerUser: number;
    /** The [thread metadata](https://discord.com/developers/docs/resources/channel#thread-metadata-object-thread-metadata-structure) associated with this thread. */
    threadMetadata: ThreadMetadata | PrivateThreadmetadata;
    /** The total number of messages ever sent in the thread. Includes deleted messages. */
    totalMessageSent: number;
    type: ThreadChannelTypes;
    constructor(data: RawThreadChannel, client: Client);
    protected update(data: Partial<RawThreadChannel>): void;
    /**
     * Add a member to this thread.
     *
     * @param {String} userID - The id of the user to add to the thread.
     * @returns {Promise<void>}
     */
    addMember(userID: string): Promise<void>;
    /**
     * Create a message in this thread.
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
     * @returns {Promise<Message>}
     */
    createMessage(options: CreateMessageOptions): Promise<Message<T>>;
    /**
     * Add a reaction to a message in this thread.
     *
     * @param {String} messageID - The id of the message to add a reaction to.
     * @param {String} emoji - The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @returns {Promise<void>}
     */
    createReaction(messageID: string, emoji: string): Promise<void>;
    /**
     * Delete a message in this thread.
     *
     * @param {String} messageID - The id of the message to delete.
     * @param {String} [reason] - The reason for deleting the message.
     * @returns {Promise<void>}
     */
    deleteMessage(messageID: string, reason?: string): Promise<void>;
    /**
     * Bulk delete messages in this thread.
     *
     * @param {String[]} messageIDs - The ids of the messages to delete. Between 2 and 100 messages, any dupliates or messages older than two weeks will cause an error.
     * @param {String} [reason] - The reason for deleting the messages.
     * @returns {Promise<void>}
     */
    deleteMessages(messageIDs: Array<string>, reason?: string): Promise<void>;
    /**
     * Remove a reaction from a message in this thread.
     *
     * @param {String} messageID - The id of the message to remove a reaction from.
     * @param {String} emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param {String} [user="@me"] - The user to remove the reaction from, `@me` for the current user (default).
     * @returns {Promise<void>}
     */
    deleteReaction(messageID: string, emoji: string, user?: string): Promise<void>;
    /**
     * Remove all, or a specific emoji's reactions from a message.
     *
     * @param {String} messageID - The id of the message to remove reactions from.
     * @param {String} [emoji] - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     * @returns {Promise<void>}
     */
    deleteReactions(messageID: string, emoji?: string): Promise<void>;
    /**
     * Edit this thread.
     *
     * @param {String} id - The id of the channel to edit.
     * @param {Object} options
     * @param {Boolean} [options.archived] - If the thread is archived.
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration after which the thread will be archived.
     * @param {Number} [options.flags] - The [channel flags](https://discord.com/developers/docs/resources/channel#channel-object-channel-flags) to set on the channel.
     * @param {Boolean} [options.invitable] - [Private] If non-moderators can add other non-moderators to the thread.
     * @param {Boolean} [options.locked] - If the thread should be locked.
     * @param {String} [options.name] - The name of the channel.
     * @param {?Number} [options.rateLimitPerUser] - The seconds between sending messages for users. Between 0 and 21600.
     * @param {String} [options.reason] - The reason to be displayed in the audit log.
     * @returns {Promise<AnyThreadChannel>}
     */
    edit(options: EditThreadChannelOptions): Promise<AnyThreadChannel>;
    /**
     * Edit a message in this thread.
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
     * @returns {Promise<Message>}
     */
    editMessage(messageID: string, options: EditMessageOptions): Promise<Message<import("../types/channels").AnyTextChannel>>;
    /**
     * Get a thread member in this thread.
     *
     * @param {String} userID - The id of the user to get the thread member of.
     * @returns {Promise<ThreadMember>}
     */
    getMember(userID: string): Promise<ThreadMember>;
    /**
     * Get the members of this thread.
     *
     * @returns {Promise<ThreadMember[]>}
     */
    getMembers(): Promise<ThreadMember[]>;
    /**
     * Get a message in this thread.
     *
     * @param {String} messageID - The id of the message to get.
     * @returns {Promise<Message>}
     */
    getMessage(messageID: string): Promise<Message<T>>;
    /**
     * Get messages in this thread.
     *
     * @param {Object} options - All options are mutually exclusive.
     * @param {String} [options.after] - Get messages after this message id.
     * @param {String} [options.around] - Get messages around this message id.
     * @param {String} [options.before] - Get messages before this message id.
     * @param {Number} [options.limit] - The maximum amount of messages to get.
     * @returns {Promise<Message[]>}
     */
    getMessages(options?: GetChannelMessagesOptions): Promise<Array<Message<T>>>;
    /**
     * Get the pinned messages in this thread.
     *
     * @returns {Promise<Message[]>}
     */
    getPinnedMessages(): Promise<Array<Message<T>>>;
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
     * Join this thread.
     *
     * @returns {Promise<void>}
     */
    join(): Promise<void>;
    /**
     * Leave this thread.
     *
     * @returns {Promise<void>}
     */
    leave(): Promise<void>;
    /**
     * Pin a message in this thread.
     *
     * @param {String} messageID - The id of the message to pin.
     * @param {String} [reason] - The reason for pinning the message.
     * @returns {Promise<void>}
     */
    pinMessage(messageID: string, reason?: string): Promise<void>;
    /**
     * Remove a member from this thread.
     *
     * @param {String} userID - The id of the user to remove from the thread.
     * @returns {Promise<void>}
     */
    removeMember(userID: string): Promise<void>;
    /**
     * Show a typing indicator in this thread.
     *
     * @returns {Promise<void>}
     */
    sendTyping(): Promise<void>;
    toJSON(): JSONThreadChannel;
    /**
     * Unpin a message in this thread.
     *
     * @param {String} messageID - The id of the message to unpin.
     * @param {String} [reason] - The reason for unpinning the message.
     * @returns {Promise<void>}
     */
    unpinMessage(messageID: string, reason?: string): Promise<void>;
}
