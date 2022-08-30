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
     * @param userID The ID of the user to add to the thread.
     */
    addMember(userID: string): Promise<void>;
    /**
     * Create a message in this thread.
     * @param options The options for creating the message.
     */
    createMessage(options: CreateMessageOptions): Promise<Message<T>>;
    /**
     * Add a reaction to a message in this thread.
     * @param messageID The ID of the message to add a reaction to.
     * @param emoji The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    createReaction(messageID: string, emoji: string): Promise<void>;
    /**
     * Delete a message in this thread.
     * @param messageID The ID of the message to delete.
     * @param reason The reason for deleting the message.
     */
    deleteMessage(messageID: string, reason?: string): Promise<void>;
    /**
     * Bulk delete messages in this thread.
     * @param messageIDs The ids of the messages to delete. Between 2 and 100 messages, any dupliates or messages older than two weeks will cause an error.
     * @param reason The reason for deleting the messages.
     */
    deleteMessages(messageIDs: Array<string>, reason?: string): Promise<void>;
    /**
     * Remove a reaction from a message in this thread.
     * @param messageID The ID of the message to remove a reaction from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param user The user to remove the reaction from, `@me` for the current user (default).
     */
    deleteReaction(messageID: string, emoji: string, user?: string): Promise<void>;
    /**
     * Remove all, or a specific emoji's reactions from a message.
     * @param messageID The ID of the message to remove reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     */
    deleteReactions(messageID: string, emoji?: string): Promise<void>;
    /**
     * Edit this thread.
     * @param options The options for editing the channel.
     */
    edit(options: EditThreadChannelOptions): Promise<AnyThreadChannel>;
    /**
     * Edit a message in this thread.
     * @param messageID The ID of the message to edit.
     * @param options The options for editing the message.
     */
    editMessage(messageID: string, options: EditMessageOptions): Promise<Message<import("../types/channels").AnyTextChannel>>;
    /**
     * Get a thread member in this thread.
     * @param userID The ID of the user to get the thread member of.
     */
    getMember(userID: string): Promise<ThreadMember>;
    /**
     * Get the members of this thread.
     */
    getMembers(): Promise<ThreadMember[]>;
    /**
     * Get a message in this thread.
     * @param messageID The ID of the message to get.
     */
    getMessage(messageID: string): Promise<Message<T>>;
    /**
     * Get messages in this thread.
     * @param options The options for getting the messages. All options are mutually exclusive.
     */
    getMessages(options?: GetChannelMessagesOptions): Promise<Array<Message<T>>>;
    /**
     * Get the pinned messages in this thread.
     */
    getPinnedMessages(): Promise<Array<Message<T>>>;
    /**
     * Get the users who reacted with a specific emoji on a message.
     * @param messageID The ID of the message to get reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options The options for getting the reactions.
     */
    getReactions(messageID: string, emoji: string, options?: GetReactionsOptions): Promise<User[]>;
    /**
     * Join this thread.
     */
    join(): Promise<void>;
    /**
     * Leave this thread.
     */
    leave(): Promise<void>;
    /**
     * Pin a message in this thread.
     * @param messageID The ID of the message to pin.
     * @param reason The reason for pinning the message.
     */
    pinMessage(messageID: string, reason?: string): Promise<void>;
    /**
     * Remove a member from this thread.
     * @param userID The ID of the user to remove from the thread.
     */
    removeMember(userID: string): Promise<void>;
    /**
     * Show a typing indicator in this thread.
     */
    sendTyping(): Promise<void>;
    toJSON(): JSONThreadChannel;
    /**
     * Unpin a message in this thread.
     * @param messageID The ID of the message to unpin.
     * @param reason The reason for unpinning the message.
     */
    unpinMessage(messageID: string, reason?: string): Promise<void>;
}
