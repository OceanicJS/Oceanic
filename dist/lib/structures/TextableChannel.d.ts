import GuildChannel from "./GuildChannel";
import type AnnouncementChannel from "./AnnouncementChannel";
import type TextChannel from "./TextChannel";
import PermissionOverwrite from "./PermissionOverwrite";
import Message from "./Message";
import type Invite from "./Invite";
import type PublicThreadChannel from "./PublicThreadChannel";
import type AnnouncementThreadChannel from "./AnnouncementThreadChannel";
import type CategoryChannel from "./CategoryChannel";
import type Member from "./Member";
import Permission from "./Permission";
import type { PrivateChannelTypes, TextChannelTypes, ThreadAutoArchiveDuration } from "../Constants";
import type Client from "../Client";
import Collection from "../util/Collection";
import type { AnyThreadChannel, CreateInviteOptions, CreateMessageOptions, EditGuildChannelOptions, EditMessageOptions, EditPermissionOptions, GetArchivedThreadsOptions, GetChannelMessagesOptions, GetReactionsOptions, RawMessage, RawAnnouncementChannel, RawOverwrite, RawTextChannel, RawThreadChannel, StartThreadFromMessageOptions, StartThreadWithoutMessageOptions } from "../types/channels";
import type { Uncached } from "../types/shared";
import type { JSONTextableChannel } from "../types/json";
/** Represents a guild text channel. */
export default class TextableChannel<T extends TextChannel | AnnouncementChannel = TextChannel | AnnouncementChannel> extends GuildChannel {
    /** The default auto archive duration for threads created in this channel. */
    defaultAutoArchiveDuration: ThreadAutoArchiveDuration;
    /** The last message sent in this channel. This can be a partial object with only an `id` property. */
    lastMessage: Message | Uncached | null;
    /** The cached messages in this channel. */
    messages: Collection<string, RawMessage, Message>;
    /** If this channel is age gated. */
    nsfw: boolean;
    parent: CategoryChannel | null;
    /** The permission overwrites of this channel. */
    permissionOverwrites: Collection<string, RawOverwrite, PermissionOverwrite>;
    /** The position of this channel on the sidebar. */
    position: number;
    /** The amount of seconds between non-moderators sending messages. */
    rateLimitPerUser: number;
    /** The threads in this channel. */
    threads: Collection<string, RawThreadChannel, AnyThreadChannel>;
    /** The topic of the channel. */
    topic: string | null;
    type: Exclude<TextChannelTypes, PrivateChannelTypes>;
    constructor(data: RawTextChannel | RawAnnouncementChannel, client: Client);
    protected update(data: Partial<RawTextChannel> | Partial<RawAnnouncementChannel>): void;
    /**
     * [Text] Convert this text channel to a announcement channel.
     *
     * [Announcement] Convert this announcement channel to a text channel.
     */
    convert(): Promise<TextChannel | AnnouncementChannel>;
    /**
     * Create an invite for this channel.
     * @param options - The options for the invite.
     */
    createInvite(options: CreateInviteOptions): Promise<Invite<"withMetadata", T>>;
    /**
     * Create a message in this channel.
     * @param options - The options for the message.
     */
    createMessage(options: CreateMessageOptions): Promise<Message<T>>;
    /**
     * Add a reaction to a message in this channel.
     * @param messageID - The ID of the message to add a reaction to.
     * @param emoji - The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    createReaction(messageID: string, emoji: string): Promise<void>;
    /**
     * Delete a message in this channel.
     * @param messageID - The ID of the message to delete.
     * @param reason - The reason for deleting the message.
     */
    deleteMessage(messageID: string, reason?: string): Promise<void>;
    /**
     * Bulk delete messages in this channel.
     * @param messageIDs - The ids of the messages to delete. Between 2 and 100 messages, any dupliates or messages older than two weeks will cause an error.
     * @param reason - The reason for deleting the messages.
     */
    deleteMessages(messageIDs: Array<string>, reason?: string): Promise<void>;
    /**
     * Delete a permission overwrite on this channel.
     * @param overwriteID - The ID of the permission overwrite to delete.
     * @param reason - The reason for deleting the permission overwrite.
     */
    deletePermission(overwriteID: string, reason?: string): Promise<void>;
    /**
     * Remove a reaction from a message in this channel.
     * @param messageID - The ID of the message to remove a reaction from.
     * @param emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param user - The user to remove the reaction from, `@me` for the current user (default).
     */
    deleteReaction(messageID: string, emoji: string, user?: string): Promise<void>;
    /**
     * Remove all, or a specific emoji's reactions from a message in this channel.
     * @param messageID - The ID of the message to remove reactions from.
     * @param emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     */
    deleteReactions(messageID: string, emoji?: string): Promise<void>;
    /**
     * Edit this channel.
     * @param options - The options for editing the channel.
     */
    edit(options: EditGuildChannelOptions): Promise<TextChannel | AnnouncementChannel>;
    /**
     * Edit a message in this channel.
     * @param messageID - The ID of the message to edit.
     * @param options - The options for editing the message.
     */
    editMessage(messageID: string, options: EditMessageOptions): Promise<Message<import("../types/channels").AnyTextChannel>>;
    /**
     * Edit a permission overwrite on this channel.
     * @param overwriteID - The ID of the permission overwrite to edit.
     * @param options - The options for editing the permission overwrite.
     */
    editPermission(overwriteID: string, options: EditPermissionOptions): Promise<void>;
    /**
     * Get the invites of this channel.
     */
    getInvites(): Promise<Array<Invite<"withMetadata", T>>>;
    /**
     * Get the private archived threads the current user has joined in this channel.
     * @param options - The options for getting the joined private archived threads.
     */
    getJoinedPrivateArchivedThreads(options?: GetArchivedThreadsOptions): Promise<import("../types/channels").ArchivedThreads<import("./PrivateThreadChannel").default>>;
    /**
     * Get a message in this channel.
     * @param messageID - The ID of the message to get.
     */
    getMessage(messageID: string): Promise<Message<T>>;
    /**
     * Get messages in this channel.
     * @param options - The options for getting the messages. All options are mutually exclusive.
     */
    getMessages(options?: GetChannelMessagesOptions): Promise<Array<Message<T>>>;
    /**
     * Get the pinned messages in this channel.
     */
    getPinnedMessages(): Promise<Array<Message<T>>>;
    /**
     * Get the private archived threads in this channel.
     * @param options - The options for getting the private archived threads.
     */
    getPrivateArchivedThreads(options?: GetArchivedThreadsOptions): Promise<import("../types/channels").ArchivedThreads<import("./PrivateThreadChannel").default>>;
    /**
     * Get the public archived threads in this channel.
     * @param options - The options for getting the public archived threads.
     */
    getPublicArchivedThreads(options?: GetArchivedThreadsOptions): Promise<import("../types/channels").ArchivedThreads<T extends TextChannel ? PublicThreadChannel : AnnouncementThreadChannel>>;
    /**
     * Get the users who reacted with a specific emoji on a message in this channel.
     * @param messageID - The ID of the message to get reactions from.
     * @param emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options - The options for getting the reactions.
     */
    getReactions(messageID: string, emoji: string, options?: GetReactionsOptions): Promise<import("./User").default[]>;
    /**
     * Get the permissions of a member.  If providing an id, the member must be cached.
     * @param member - The member to get the permissions of.
     */
    permissionsOf(member: string | Member): Permission;
    /**
     * Pin a message in this channel.
     * @param messageID - The ID of the message to pin.
     * @param reason - The reason for pinning the message.
     */
    pinMessage(messageID: string, reason?: string): Promise<void>;
    /**
     * Show a typing indicator in this channel. How long users see this varies from client to client.
     */
    sendTyping(): Promise<void>;
    /**
     * Create a thread from an existing message in this channel.
     * @param messageID - The ID of the message to create a thread from.
     * @param options - The options for creating the thread.
     */
    startThreadFromMessage(messageID: string, options: StartThreadFromMessageOptions): Promise<T extends TextChannel ? AnnouncementThreadChannel : PublicThreadChannel>;
    /**
     * Create a thread without an existing message in this channel.
     * @param options - The options for creating the thread.
     */
    startThreadWithoutMessage(options: StartThreadWithoutMessageOptions): Promise<T extends TextChannel ? AnnouncementThreadChannel : PublicThreadChannel>;
    toJSON(): JSONTextableChannel;
    /**
     * Unpin a message in this channel.
     * @param messageID - The ID of the message to unpin.
     * @param reason - The reason for unpinning the message.
     */
    unpinMessage(messageID: string, reason?: string): Promise<void>;
}
