import type { AddGroupRecipientOptions, AnyChannel, AnyTextChannel, ArchivedThreads, CreateInviteOptions, CreateMessageOptions, EditChannelOptions, EditMessageOptions, EditPermissionOptions, FollowedChannel, GetChannelMessagesOptions, GetArchivedThreadsOptions, GetReactionsOptions, InviteChannel, ThreadMember, StartThreadFromMessageOptions, StartThreadInForumOptions, StartThreadWithoutMessageOptions, GetInviteWithCountsAndExpirationOptions, GetInviteWithCountsOptions, GetInviteWithExpirationOptions, GetInviteWithNoneOptions, InviteInfoTypes } from "../types/channels";
import Message from "../structures/Message";
import type { CreateGroupChannelOptions } from "../types/users";
import Invite from "../structures/Invite";
import type AnnouncementThreadChannel from "../structures/AnnouncementThreadChannel";
import type PublicThreadChannel from "../structures/PublicThreadChannel";
import type PrivateThreadChannel from "../structures/PrivateThreadChannel";
import type AnnouncementChannel from "../structures/AnnouncementChannel";
import type { VoiceRegion } from "../types/voice";
import type RESTManager from "../rest/RESTManager";
export default class Channels {
    #private;
    constructor(manager: RESTManager);
    /**
     * Add a user to a group channel.
     * @param groupID The ID of the group to add the user to.
     * @param options The options for adding the recipient.
     */
    addGroupRecipient(groupID: string, options: AddGroupRecipientOptions): Promise<void>;
    /**
     * Add a member to a thread.
     * @param id The ID of the thread to add them to.
     * @param userID The ID of the user to add to the thread.
     */
    addThreadMember(id: string, userID: string): Promise<void>;
    /**
     * Create a direct message.
     * @param recipient The ID of the recipient of the direct message.
     */
    createDM(recipient: string): Promise<import("..").PrivateChannel>;
    /**
     * Create a group dm.
     * @param options The options for creating the group dm.
     */
    createGroupDM(options: CreateGroupChannelOptions): Promise<import("..").GroupChannel>;
    /**
     * Create an invite for a channel.
     * @param id The ID of the channel to create an invite for.
     * @param options The options for creating the invite.
     */
    createInvite<T extends InviteInfoTypes, CH extends InviteChannel = InviteChannel>(id: string, options: CreateInviteOptions): Promise<Invite<T, CH>>;
    /**
     * Create a message in a channel.
     * @param id The ID of the channel to create the message in.
     * @param options The options for creating the message.
     */
    createMessage<T extends AnyTextChannel = AnyTextChannel>(id: string, options: CreateMessageOptions): Promise<Message<T>>;
    /**
     * Add a reaction to a message.
     * @param id The ID of the channel the message is in.
     * @param messageID The ID of the message to add a reaction to.
     * @param emoji The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    createReaction(id: string, messageID: string, emoji: string): Promise<void>;
    /**
     * Crosspost a message in an announcement channel.
     * @param id The ID of the channel to crosspost the message in.
     * @param messageID The ID of the message to crosspost.
     */
    crosspostMessage(id: string, messageID: string): Promise<Message<AnnouncementChannel>>;
    /**
     * Delete or close a channel.
     * @param id The ID of the channel to delete or close.
     * @param reason The reason to be displayed in the audit log.
     */
    delete(id: string, reason?: string): Promise<void>;
    /**
     * Delete an invite.
     * @param code The code of the invite to delete.
     * @param reason The reason for deleting the invite.
     */
    deleteInvite<T extends InviteChannel = InviteChannel>(code: string, reason?: string): Promise<Invite<"withMetadata", T>>;
    /**
     * Delete a message.
     * @param id The ID of the channel to delete the message in.
     * @param messageID The ID of the message to delete.
     * @param reason The reason for deleting the message.
     */
    deleteMessage(id: string, messageID: string, reason?: string): Promise<void>;
    /**
     * Bulk delete messages.
     * @param id The ID of the channel to delete the messages in.
     * @param messageIDs The IDs of the messages to delete. Between 2 and 100 messages, any dupliates or messages older than two weeks will cause an error.
     * @param reason The reason for deleting the messages.
     */
    deleteMessages(id: string, messageIDs: Array<string>, reason?: string): Promise<void>;
    /**
     * Delete a permission overwrite.
     * @param id The ID of the channel to delete the permission overwrite in.
     * @param overwriteID The ID of the permission overwrite to delete.
     * @param reason The reason for deleting the permission overwrite.
     */
    deletePermission(id: string, overwriteID: string, reason?: string): Promise<void>;
    /**
     * Remove a reaction from a message.
     * @param id The ID of the channel the message is in.
     * @param messageID The ID of the message to remove a reaction from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param user The user to remove the reaction from, `@me` for the current user (default).
     */
    deleteReaction(id: string, messageID: string, emoji: string, user?: string): Promise<void>;
    /**
     * Remove all, or a specific emoji's reactions from a message.
     * @param id The ID of the channel the message is in.
     * @param messageID The ID of the message to remove reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     */
    deleteReactions(id: string, messageID: string, emoji?: string): Promise<void>;
    /**
     * Edit a channel.
     * @param id The ID of the channel to edit.
     * @param options The options for editing the channel.
     */
    edit<T extends AnyChannel = AnyChannel>(id: string, options: EditChannelOptions): Promise<T>;
    /**
     * Edit a message.
     * @param id The ID of the channel the message is in.
     * @param messageID The ID of the message to edit.
     * @param options The options for editing the message.
     */
    editMessage<T extends AnyTextChannel = AnyTextChannel>(id: string, messageID: string, options: EditMessageOptions): Promise<Message<T>>;
    /**
     * Edit a permission overwrite.
     * @param id The ID of the channel to edit the permission overwrite for.
     * @param overwriteID The ID of the permission overwrite to edit.
     * @param options The options for editing the permission overwrite.
     */
    editPermission(id: string, overwriteID: string, options: EditPermissionOptions): Promise<void>;
    /**
     * Follow an announcement channel.
     * @param id The ID of the channel to follow the announcement channel to.
     * @param webhookChannelID The ID of the channel to follow the announcement channel to.
     */
    followAnnouncement(id: string, webhookChannelID: string): Promise<FollowedChannel>;
    /**
     * Get a channel.
     * @param id The ID of the channel to get.
     */
    get<T extends AnyChannel = AnyChannel>(id: string): Promise<T>;
    /**
     * Get an invite.
     * @param code The code of the invite to get.
     * @param options The options for getting the invite.
     */
    getInvite<T extends InviteChannel = InviteChannel>(code: string, options: GetInviteWithNoneOptions): Promise<Invite<"withMetadata", T>>;
    getInvite<T extends InviteChannel = InviteChannel>(code: string, options: GetInviteWithCountsAndExpirationOptions): Promise<Invite<"withMetadata" | "withCounts" | "withExpiration", T>>;
    getInvite<T extends InviteChannel = InviteChannel>(code: string, options: GetInviteWithCountsOptions): Promise<Invite<"withMetadata" | "withCounts", T>>;
    getInvite<T extends InviteChannel = InviteChannel>(code: string, options: GetInviteWithExpirationOptions): Promise<Invite<"withMetadata" | "withExpiration", T>>;
    /**
     * Get the invites of a channel.
     * @param id The ID of the channel to get the invites of.
     */
    getInvites<T extends InviteChannel = InviteChannel>(id: string): Promise<Invite<"withMetadata", T>[]>;
    /**
     * Get the private archived threads the current user has joined in a channel.
     * @param id The ID of the channel to get the archived threads from.
     * @param options The options for getting the archived threads.
     */
    getJoinedPrivateArchivedThreads(id: string, options?: GetArchivedThreadsOptions): Promise<ArchivedThreads<PrivateThreadChannel>>;
    /**
     * Get a message in a channel.
     * @param id The ID of the channel the message is in
     * @param messageID The ID of the message to get.
     */
    getMessage<T extends AnyTextChannel = AnyTextChannel>(id: string, messageID: string): Promise<Message<T>>;
    /**
     * Get messages in a channel.
     * @param id The ID of the channel to get messages from.
     * @param options The options for getting messages. All are mutually exclusive.
     */
    getMessages<T extends AnyTextChannel = AnyTextChannel>(id: string, options?: GetChannelMessagesOptions): Promise<Message<T>[]>;
    /**
     * Get the pinned messages in a channel.
     * @param id The ID of the channel to get the pinned messages from.
     */
    getPinnedMessages<T extends AnyTextChannel = AnyTextChannel>(id: string): Promise<Message<T>[]>;
    /**
     * Get the private archived threads in a channel.
     * @param id The ID of the channel to get the archived threads from.
     * @param options The options for getting the archived threads.
     */
    getPrivateArchivedThreads(id: string, options?: GetArchivedThreadsOptions): Promise<ArchivedThreads<PrivateThreadChannel>>;
    /**
     * Get the public archived threads in a channel.
     * @param id The ID of the channel to get the archived threads from.
     * @param options The options for getting the archived threads.
     */
    getPublicArchivedThreads<T extends AnnouncementThreadChannel | PublicThreadChannel = AnnouncementThreadChannel | PublicThreadChannel>(id: string, options?: GetArchivedThreadsOptions): Promise<ArchivedThreads<T>>;
    /**
     * Get the users who reacted with a specific emoji on a message.
     * @param id The ID of the channel the message is in.
     * @param messageID The ID of the message to get reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options The options for getting the reactions.
     */
    getReactions(id: string, messageID: string, emoji: string, options?: GetReactionsOptions): Promise<import("..").User[]>;
    /**
     * Get a thread member.
     * @param id The ID of the thread.
     * @param userID The ID of the user to get the thread member of.
     */
    getThreadMember(id: string, userID: string): Promise<ThreadMember>;
    /**
     * Get the members of a thread.
     * @param id The ID of the thread.
     */
    getThreadMembers(id: string): Promise<ThreadMember[]>;
    /**
     * Get the list of usable voice regions.
     */
    getVoiceRegions(): Promise<VoiceRegion[]>;
    /**
     * Join a thread.
     * @param id The ID of the thread to join.
     */
    joinThread(id: string): Promise<void>;
    /**
     * Leave a thread.
     * @param id The ID of the thread to leave.
     */
    leaveThread(id: string): Promise<void>;
    /**
     * Pin a message in a channel.
     * @param id The ID of the channel to pin the message in.
     * @param messageID The ID of the message to pin.
     * @param reason The reason for pinning the message.
     */
    pinMessage(id: string, messageID: string, reason?: string): Promise<void>;
    /**
     * Remove a user from the group channel.
     * @param groupID The ID of the group to remove the user from.
     * @param userID The ID of the user to remove.
     */
    removeGroupRecipient(groupID: string, userID: string): Promise<void>;
    /**
     * Remove a member from a thread.
     * @param id The ID of the thread to remove them from.
     * @param userID The ID of the user to remove from the thread.
     */
    removeThreadMember(id: string, userID: string): Promise<void>;
    /**
     * Show a typing indicator in a channel. How long users see this varies from client to client.
     * @param id The ID of the channel to show the typing indicator in.
     */
    sendTyping(id: string): Promise<void>;
    /**
     * Create a thread from an existing message.
     * @param id The ID of the channel to create the thread in.
     * @param messageID The ID of the message to create the thread from.
     * @param {options The options for starting the thread.
     */
    startThreadFromMessage<T extends AnnouncementThreadChannel | PublicThreadChannel = AnnouncementThreadChannel | PublicThreadChannel>(id: string, messageID: string, options: StartThreadFromMessageOptions): Promise<T>;
    /**
     * Create a thread in a forum channel.
     * @param id The ID of the channel to start the thread in.
     * @param options The options for starting the thread.
     */
    startThreadInForum(id: string, options: StartThreadInForumOptions): Promise<PublicThreadChannel>;
    /**
     * Create a thread without an existing message.
     * @param id The ID of the channel to start the thread in.
     * @param options The options for starting the thread.
     */
    startThreadWithoutMessage<T extends AnnouncementThreadChannel | PublicThreadChannel | PrivateThreadChannel = AnnouncementThreadChannel | PublicThreadChannel | PrivateThreadChannel>(id: string, options: StartThreadWithoutMessageOptions): Promise<T>;
    /**
     * Unpin a message in a channel.
     * @param id The ID of the channel to unpin the message in.
     * @param messageID The ID of the message to unpin.
     * @param reason The reason for unpinning the message.
     */
    unpinMessage(id: string, messageID: string, reason?: string): Promise<void>;
}
