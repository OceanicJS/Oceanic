import BaseRoute from "./BaseRoute";
import type { AddGroupRecipientOptions, AnyChannel, AnyTextChannel, ArchivedThreads, CreateInviteOptions, CreateMessageOptions, EditChannelOptions, EditMessageOptions, EditPermissionOptions, FollowedChannel, FollowAnnouncementChannelOptions, GetChannelMessagesOptions, GetArchivedThreadsOptions, GetReactionsOptions, InviteChannel, ThreadMember, StartThreadFromMessageOptions, StartThreadInForumOptions, StartThreadWithoutMessageOptions, GetInviteWithCountsAndExpirationOptions, GetInviteWithCountsOptions, GetInviteWithExpirationOptions, GetInviteWithNoneOptions } from "../types/channels";
import Message from "../structures/Message";
import User from "../structures/User";
import type { InviteInfoTypes } from "../structures/Invite";
import Invite from "../structures/Invite";
import type AnnouncementThreadChannel from "../structures/AnnouncementThreadChannel";
import type PublicThreadChannel from "../structures/PublicThreadChannel";
import type PrivateThreadChannel from "../structures/PrivateThreadChannel";
import type AnnouncementChannel from "../structures/AnnouncementChannel";
import type { VoiceRegion } from "../types/voice";
export default class Channels extends BaseRoute {
    /**
     * Add a user to a group channel.
     *
     * @param {String} groupID - The id of the group to add the user to.
     * @param {Object} options
     * @param {String} options.accessToken - The access token of the user to add.
     * @param {String} [options.nick] - The nickname of the user to add.
     * @param {String} options.userID - The id of the user to add.
     * @returns {Promise<void>}
     */
    addGroupRecipient(groupID: string, options: AddGroupRecipientOptions): Promise<void>;
    /**
     * Add a member to a thread.
     *
     * @param {String} id - The id of the thread to add them to.
     * @param {String} userID - The id of the user to add to the thread.
     * @returns {Promise<void>}
     */
    addThreadMember(id: string, userID: string): Promise<void>;
    /**
     * Create an invite for a channel.
     *
     * @param {String} id - The id of the channel to create an invite for.
     * @param {Object} options
     * @param {Number} [options.maxAge] - How long the invite should last.
     * @param {Number} [options.maxUses] - How many times the invite can be used.
     * @param {String} [options.reason] - The reason for creating the invite.
     * @param {String} [options.targetApplicationID] - The id of the embedded application to open for this invite.
     * @param {InviteTargetTypes} [options.targetType] - The [type of target](https://discord.com/developers/docs/resources/channel#invite-target-types) for the invite.
     * @param {String} [options.targetUserID] - The id of the user whose stream to display for this invite.
     * @param {Boolean} [options.temporary] - If the invite should be temporary.
     * @param {Boolean} [options.unique] - If the invite should be unique.
     * @returns {Promise<Invite>}
     */
    createInvite<T extends InviteInfoTypes, CH extends InviteChannel = InviteChannel>(id: string, options: CreateInviteOptions): Promise<Invite<T, CH>>;
    /**
     * Create a message in a channel.
     *
     * @template {AnyTextChannel} T
     * @param {String} id - The id of the channel to create the message in.
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
     * @returns {Promise<Message<T>>}
     */
    createMessage<T extends AnyTextChannel = AnyTextChannel>(id: string, options: CreateMessageOptions): Promise<Message<T>>;
    /**
     * Add a reaction to a message.
     *
     * @param {String} id - The id of the channel the message is in.
     * @param {String} messageID - The id of the message to add a reaction to.
     * @param {String} emoji - The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @returns {Promise<void>}
     */
    createReaction(id: string, messageID: string, emoji: string): Promise<void>;
    /**
     * Crosspost a message in an announcement channel.
     *
     * @param {String} id - The id of the channel to crosspost the message in.
     * @param {String} messageID - The id of the message to crosspost.
     * @returns {Promise<Message<AnnouncementChannel>>}
     */
    crosspostMessage(id: string, messageID: string): Promise<Message<AnnouncementChannel>>;
    /**
     * Delete or close a channel.
     *
     * @param {String} id - The ID of the channel to delete or close.
     * @param {String} [reason] - The reason to be displayed in the audit log.
     * @returns {Promise<void>}
     */
    delete(id: string, reason?: string): Promise<void>;
    /**
     * Delete an invite.
     *
     * @param {String} code - The code of the invite to delete.
     * @param {String} [reason] - The reason for deleting the invite.
     * @returns {Promise<Invite>}
     */
    deleteInvite<T extends InviteChannel = InviteChannel>(code: string, reason?: string): Promise<Invite<"withMetadata", T>>;
    /**
     * Delete a message.
     *
     * @param {String} id - The id of the channel to delete the message in.
     * @param {String} messageID - The id of the message to delete.
     * @param {String} [reason] - The reason for deleting the message.
     * @returns {Promise<void>}
     */
    deleteMessage(id: string, messageID: string, reason?: string): Promise<void>;
    /**
     * Bulk delete messages.
     *
     * @param {String} id - The id of the channel to delete the messages in.
     * @param {String[]} messageIDs - The ids of the messages to delete. Between 2 and 100 messages, any dupliates or messages older than two weeks will cause an error.
     * @param {String} [reason] - The reason for deleting the messages.
     * @returns {Promise<void>}
     */
    deleteMessages(id: string, messageIDs: Array<string>, reason?: string): Promise<void>;
    /**
     * Delete a permission overwrite.
     *
     * @param {String} id - The id of the channel to delete the permission overwrite in.
     * @param {String} overwriteID - The id of the permission overwrite to delete.
     * @param {String} reason - The reason for deleting the permission overwrite.
     * @returns {Promise<void>}
     */
    deletePermission(id: string, overwriteID: string, reason?: string): Promise<void>;
    /**
     * Remove a reaction from a message.
     *
     * @param {String} id - The id of the channel the message is in.
     * @param {String} messageID - The id of the message to remove a reaction from.
     * @param {String} emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param {String} [user="@me"] - The user to remove the reaction from, `@me` for the current user (default).
     * @returns {Promise<void>}
     */
    deleteReaction(id: string, messageID: string, emoji: string, user?: string): Promise<void>;
    /**
     * Remove all, or a specific emoji's reactions from a message.
     *
     * @param {String} id - The id of the channel the message is in.
     * @param {String} messageID - The id of the message to remove reactions from.
     * @param {String} [emoji] - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     * @returns {Promise<void>}
     */
    deleteReactions(id: string, messageID: string, emoji?: string): Promise<void>;
    /**
     * Edit a channel.
     *
     * @param {String} id - The id of the channel to edit.
     * @param {Object} options
     * @param {Boolean} [options.archived] - [Thread] If the thread is archived.
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - [Thread] The duration after which the thread will be archived.
     * @param {?Number} [options.bitrate] - [Voice, Stage] The bitrate of the channel. Minimum 8000.
     * @param {?ThreadAutoArchiveDuration} [options.defaultAutoArchiveDuration] - [Text, Announcement] The default auto archive duration for threads made in this channel.
     * @param {Number} [options.flags] - [Thread] The [channel flags](https://discord.com/developers/docs/resources/channel#channel-object-channel-flags) to set on the channel.
     * @param {?String} [options.icon] - [Group DM] The icon of the channel.
     * @param {Boolean} [options.invitable] - [Private Thread] If non-moderators can add other non-moderators to the thread. Private threads only.
     * @param {Boolean} [options.locked] - [Thread] If the thread should be locked.
     * @param {String} [options.name] - [All] The name of the channel.
     * @param {?Boolean} [options.nsfw] -[Text, Voice, Announcement] - If the channel is age gated.
     * @param {?String} [options.parentID] - [Text, Voice, Announcement] The id of the parent category channel.
     * @param {?RawOverwrite[]} [options.permissionOverwrites] - [All Guild] Channel or category specific permissions
     * @param {?Number} [options.position] - [All Guild] The position of the channel in the channel list.
     * @param {?Number} [options.rateLimitPerUser] - [Thread, Text] The seconds between sending messages for users. Between 0 and 21600.
     * @param {String} [options.reason] - The reason to be displayed in the audit log.
     * @param {?String} [options.rtcRegion] - [Voice, Stage] The voice region id of the channel, null for automatic.
     * @param {?String} [options.topic] - [Text, Announcement] The topic of the channel.
     * @param {ChannelTypes.GUILD_TEXT | ChannelTypes.GUILD_ANNOUNCEMENT} [options.type] - [Text, Announcement] Provide the opposite type to convert the channel.
     * @param {?Number} [options.userLimit] - [Voice] The maximum amount of users in the channel. `0` is unlimited, values range 1-99.
     * @param {?VideoQualityModes} [options.videoQualityMode] - [Voice] The [video quality mode](https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes) of the channel.
     * @returns {Promise<AnyChannel>}
     */
    edit<T extends AnyChannel = AnyChannel>(id: string, options: EditChannelOptions): Promise<T>;
    /**
     * Edit a message.
     *
     * @template {AnyTextChannel} T
     * @param {String} id - The id of the channel the message is in.
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
     * @returns {Promise<Message<T>>}
     */
    editMessage<T extends AnyTextChannel = AnyTextChannel>(id: string, messageID: string, options: EditMessageOptions): Promise<Message<T>>;
    /**
     * Edit a permission overwrite.
     *
     * @param {String} id - The id of the channel to edit the permission overwrite for.
     * @param {String} overwriteID - The id of the permission overwrite to edit.
     * @param {Object} options
     * @param {(BigInt | String)} [options.allow] - The permissions to allow.
     * @param {(BigInt | String)} [options.deny] - The permissions to deny.
     * @param {String} [options.reason] - The reason for editing the permission.
     * @param {OverwriteTypes} [options.type] - The type of the permission overwrite.
     * @returns {Promise<void>}
     */
    editPermission(id: string, overwriteID: string, options: EditPermissionOptions): Promise<void>;
    /**
     * Follow an announcement channel.
     *
     * @param {String} id - The id of the channel to follow the announcement channel to.
     * @param {Object} options
     * @param {String} [options.webhookChannelID] - The id of the channel to follow.
     * @returns {Promise<FollowedChannel>}
     */
    followAnnouncement(id: string, options?: FollowAnnouncementChannelOptions): Promise<FollowedChannel>;
    /**
     * Get a channel.
     *
     * @param {String} id - The id of the channel to get.
     * @returns {Promise<AnyChannel>}
     */
    get<T extends AnyChannel = AnyChannel>(id: string): Promise<T>;
    /**
     * Get an invite.
     *
     * @param {String} code - The code of the invite to get.
     * @param {Object} [options]
     * @param {String} [options.guildScheduledEventID] - The id of the guild scheduled event to include with the invite.
     * @param {Boolean} [options.withCounts] - If the invite should contain approximate member counts.
     * @param {Boolean} [options.withExpiration] - If the invite should contain expiration data.
     * @returns {Promise<Invite>}
     */
    getInvite<T extends InviteChannel = InviteChannel>(code: string, options: GetInviteWithNoneOptions): Promise<Invite<"withMetadata", T>>;
    getInvite<T extends InviteChannel = InviteChannel>(code: string, options: GetInviteWithCountsAndExpirationOptions): Promise<Invite<"withMetadata" | "withCounts" | "withExpiration", T>>;
    getInvite<T extends InviteChannel = InviteChannel>(code: string, options: GetInviteWithCountsOptions): Promise<Invite<"withMetadata" | "withCounts", T>>;
    getInvite<T extends InviteChannel = InviteChannel>(code: string, options: GetInviteWithExpirationOptions): Promise<Invite<"withMetadata" | "withExpiration", T>>;
    /**
     * Get the invites of a channel.
     *
     * @param {String} id - The id of the channel to get the invites of.
     * @returns {Promise<Invite[]>} - An array of invites with metadata.
     */
    getInvites<T extends InviteChannel = InviteChannel>(id: string): Promise<Invite<"withMetadata", T>[]>;
    /**
     * Get the private archived threads the current user has joined in a channel.
     *
     * @param {String} id - The id of the channel to get the archived threads from.
     * @param {Object} [options]
     * @param {String} [options.before] - A **timestamp** to get threads before.
     * @param {Number} [options.limit] - The maximum amount of threads to get.
     * @returns {Promise<ArchivedThreads<PrivateThreadChannel>>}
     */
    getJoinedPrivateArchivedThreads(id: string, options?: GetArchivedThreadsOptions): Promise<ArchivedThreads<PrivateThreadChannel>>;
    /**
     * Get a message in a channel.
     *
     * @template {AnyTextChannel} T
     * @param {String} id - The id of the channel the message is in
     * @param {String} messageID - The id of the message to get.
     * @returns {Promise<Message<T>>}
     */
    getMessage<T extends AnyTextChannel = AnyTextChannel>(id: string, messageID: string): Promise<Message<T>>;
    /**
     * Get messages in a channel.
     *
     * @template {AnyTextChannel} T
     * @param {String} id - The id of the channel to get messages from.
     * @param {Object} options - All options are mutually exclusive.
     * @param {String} [options.after] - Get messages after this message id.
     * @param {String} [options.around] - Get messages around this message id.
     * @param {String} [options.before] - Get messages before this message id.
     * @param {Number} [options.limit] - The maximum amount of messages to get.
     * @returns {Promise<Message<T>[]>}
     */
    getMessages<T extends AnyTextChannel = AnyTextChannel>(id: string, options?: GetChannelMessagesOptions): Promise<Message<T>[]>;
    /**
     * Get the pinned messages in a channel.
     *
     * @template {AnyTextChannel} T
     * @param {String} id - The id of the channel to get the pinned messages from.
     * @returns {Promise<Message<T>[]>}
     */
    getPinnedMessages<T extends AnyTextChannel = AnyTextChannel>(id: string): Promise<Message<T>[]>;
    /**
     * Get the private archived threads in a channel.
     *
     * @param {String} id - The id of the channel to get the archived threads from.
     * @param {Object} [options]
     * @param {String} [options.before] - A **timestamp** to get threads before.
     * @param {Number} [options.limit] - The maximum amount of threads to get.
     * @returns {Promise<ArchivedThreads<PrivateThreadChannel>>}
     */
    getPrivateArchivedThreads(id: string, options?: GetArchivedThreadsOptions): Promise<ArchivedThreads<PrivateThreadChannel>>;
    /**
     * Get the public archived threads in a channel.
     *
     * @template {(AnnouncementThreadChannel | PublicThreadChannel)} T
     * @param {String} id - The id of the channel to get the archived threads from.
     * @param {Object} [options]
     * @param {String} [options.before] - A **timestamp** to get threads before.
     * @param {Number} [options.limit] - The maximum amount of threads to get.
     * @returns {Promise<ArchivedThreads<T>>}
     */
    getPublicArchivedThreads<T extends AnnouncementThreadChannel | PublicThreadChannel = AnnouncementThreadChannel | PublicThreadChannel>(id: string, options?: GetArchivedThreadsOptions): Promise<ArchivedThreads<T>>;
    /**
     * Get the users who reacted with a specific emoji on a message.
     *
     * @param {String} id - The id of the channel the message is in.
     * @param {String} messageID - The id of the message to get reactions from.
     * @param {String} emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param {Object} [options] - Options for the request.
     * @param {String} [options.after] - Get users after this user id.
     * @param {Number} [options.limit] - The maximum amount of users to get.
     * @returns {Promise<User[]>}
     */
    getReactions(id: string, messageID: string, emoji: string, options?: GetReactionsOptions): Promise<User[]>;
    /**
     * Get a thread member.
     *
     * @param {String} id - The id of the thread.
     * @param {String} userID - The id of the user to get the thread member of.
     * @returns {Promise<ThreadMember>}
     */
    getThreadMember(id: string, userID: string): Promise<ThreadMember>;
    /**
     * Get the members of a thread.
     *
     * @param {String} id - The id of the thread.
     * @returns {Promise<ThreadMember[]>}
     */
    getThreadMembers(id: string): Promise<ThreadMember[]>;
    /**
     * Get the list of usable voice regions.
     *
     * @returns {Promise<VoiceRegion[]>}
     */
    getVoiceRegions(): Promise<VoiceRegion[]>;
    /**
     * Join a thread.
     *
     * @param {String} id - The id of the thread to join.
     * @returns {Promise<void>}
     */
    joinThread(id: string): Promise<void>;
    /**
     * Leave a thread.
     *
     * @param {String} id - The id of the thread to leave.
     * @returns {Promise<void>}
     */
    leaveThread(id: string): Promise<void>;
    /**
     * Pin a message in a channel.
     *
     * @param {String} id - The id of the channel to pin the message in.
     * @param {String} messageID - The id of the message to pin.
     * @param {String} [reason] - The reason for pinning the message.
     * @returns {Promise<void>}
     */
    pinMessage(id: string, messageID: string, reason?: string): Promise<void>;
    /**
     * Remove a user from the group channel.
     *
     * @param {String} groupID - The id of the group to remove the user from.
     * @param {String} userID - The id of the user to remove.
     * @returns {Promise<void>}
     */
    removeGroupRecipient(groupID: string, userID: string): Promise<void>;
    /**
     * Remove a member from a thread.
     *
     * @param {String} id - The id of the thread to remove them from.
     * @param {String} userID - The id of the user to remove from the thread.
     * @returns {Promise<void>}
     */
    removeThreadMember(id: string, userID: string): Promise<void>;
    /**
     * Show a typing indicator in a channel. How long users see this varies from client to client.
     *
     * @param {String} id - The id of the channel to show the typing indicator in.
     * @returns {Promise<void>}
     */
    sendTyping(id: string): Promise<void>;
    /**
     * Create a thread from an existing message.
     *
     * @template {(AnnouncementThreadChannel | PublicThreadChannel)} T
     * @param {String} id - The id of the channel to create the thread in.
     * @param {String} messageID - The id of the message to create the thread from.
     * @param {Object} options
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration of no activity after which this thread will be automatically archived.
     * @param {String} options.name - The name of the thread.
     * @param {Number?} [options.rateLimitPerUser] - The amount of seconds a user has to wait before sending another message.
     * @param {String} [options.reason] - The reason for creating the thread.
     * @returns {Promise<T>}
     */
    startThreadFromMessage<T extends AnnouncementThreadChannel | PublicThreadChannel = AnnouncementThreadChannel | PublicThreadChannel>(id: string, messageID: string, options: StartThreadFromMessageOptions): Promise<T>;
    /**
     * Create a thread in a forum channel.
     *
     * @param {String} id
     * @param {Object} options
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration of no activity after which this thread will be automatically archived.
     * @param {String} options.name - The name of the thread.
     * @param {Number?} [options.rateLimitPerUser] - The amount of seconds a user has to wait before sending another message.
     * @param {String} [options.reason] - The reason for creating the thread.
     * @param {Object} options.message - The message to start the thread with.
     * @param {Object} [options.message.allowedMentions] - An object that specifies the allowed mentions in this message.
     * @param {Boolean} [options.message.allowedMentions.everyone] - If `@everyone`/`@here` mentions should be allowed.
     * @param {Boolean} [options.message.allowedMentions.repliedUser] - If the replied user (`messageReference`) should be mentioned.
     * @param {(Boolean | String[])} [options.message.allowedMentions.roles] - An array of role ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {(Boolean | String[])} [options.message.allowedMentions.users] - An array of user ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {Object[]} [options.message.attachments] - An array of [attachment information](https://discord.com/developers/docs/resources/channel#attachment-object) related to the sent files.
     * @param {Object[]} [options.message.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send.
     * @param {String} [options.message.content] - The content of the message.
     * @param {Object[]} [options.message.embeds] - An array of [embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send.
     * @param {File[]} [options.message.files] - The files to send.
     * @param {Number} [options.message.flags] - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to send with the message.
     * @param {String[]} [options.message.stickerIDs] - The IDs of up to 3 stickers from the current guild to send.
     * @returns {Promise<PublicThreadChannel>}
     */
    startThreadInForum(id: string, options: StartThreadInForumOptions): Promise<PublicThreadChannel>;
    /**
     * Create a thread without an existing message.
     *
     * @template {(AnnouncementThreadChannel | PublicThreadChannel | PrivateThreadChannel)} T
     * @param {String} id
     * @param {Object} options
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration of no activity after which this thread will be automatically archived.
     * @param {Boolean} [options.invitable] - [Private] If non-moderators can add other non-moderators to the thread.
     * @param {String} options.name - The name of the thread.
     * @param {Number?} [options.rateLimitPerUser] - The amount of seconds a user has to wait before sending another message.
     * @param {String} [options.reason] - The reason for creating the thread.
     * @param {ThreadChannelTypes} [options.type] - The type of thread to create.
     * @returns {Promise<T>}
     */
    startThreadWithoutMessage<T extends AnnouncementThreadChannel | PublicThreadChannel | PrivateThreadChannel = AnnouncementThreadChannel | PublicThreadChannel | PrivateThreadChannel>(id: string, options: StartThreadWithoutMessageOptions): Promise<T>;
    /**
     * Unpin a message in a channel.
     *
     * @param {String} id - The id of the channel to unpin the message in.
     * @param {String} messageID - The id of the message to unpin.
     * @param {String} [reason] - The reason for unpinning the message.
     * @returns {Promise<void>}
     */
    unpinMessage(id: string, messageID: string, reason?: string): Promise<void>;
}
