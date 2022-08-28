import Channel from "./Channel";
import User from "./User";
import Invite from "./Invite";
import Message from "./Message";
import type ClientApplication from "./ClientApplication";
import type { ChannelTypes, ImageFormat } from "../Constants";
import type Client from "../Client";
import type { AddGroupRecipientOptions, CreateInviteOptions, CreateMessageOptions, EditGroupDMOptions, EditMessageOptions, GetChannelMessagesOptions, GetReactionsOptions, RawGroupChannel, RawMessage } from "../types/channels";
import type { RawUser } from "../types/users";
import Collection from "../util/Collection";
import type { Uncached } from "../types/shared";
import type { JSONGroupChannel } from "../types/json";
/** Represents a group direct message. */
export default class GroupChannel extends Channel {
    /** The application that made this group channel. This can be a partial object with just an `id` property. */
    application: ClientApplication | Uncached;
    /** The icon hash of this group, if any. */
    icon: string | null;
    /** The last message sent in this channel. This can be a partial object with only an `id` property. */
    lastMessage: Message | Uncached | null;
    /** If this group channel is managed by an application. */
    managed: boolean;
    /** The cached messages in this channel. */
    messages: Collection<string, RawMessage, Message>;
    /** The name of this group channel. */
    name: string | null;
    /** The nicknames used when creating this group channel. */
    nicks?: Record<"id" | "nick", string>;
    /** The owner of this group channel. This can be a partial object with just an `id`. */
    owner: User | Uncached;
    /** The other recipients in this group channel. */
    recipients: Collection<string, RawUser, User>;
    type: ChannelTypes.GROUP_DM;
    constructor(data: RawGroupChannel, client: Client);
    protected update(data: Partial<RawGroupChannel>): void;
    /**
     * Add a user to this channel.
     *
     * @param {Object} options
     * @param {String} options.accessToken - The access token of the user to add.
     * @param {String} [options.nick] - The nickname of the user to add.
     * @param {String} options.userID - The id of the user to add.
     * @returns {Promise<void>}
     */
    addRecipient(options: AddGroupRecipientOptions): Promise<void>;
    /**
     * Create an invite for this channel.
     *
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
    createInvite(options: CreateInviteOptions): Promise<Invite<import("../types/channels").InviteInfoTypes, import("../types/channels").InviteChannel>>;
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
     * @returns {Promise<Message<GroupChannel>>}
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
     * Edit this channel.
     *
     * @param {?String} [options.icon] - The icon of the channel.
     * @param {String} [options.name] - The name of the channel.
     * @returns {Promise<GroupChannel>}
     */
    edit(options: EditGroupDMOptions): Promise<GroupChannel>;
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
     * @returns {Promise<Message<GroupChannel>>}
     */
    editMessage(messageID: string, options: EditMessageOptions): Promise<Message<this>>;
    /**
     * Get a message in this channel.
     *
     * @param {String} messageID - The id of the message to get.
     * @returns {Promise<Message<GroupChannel>>}
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
     * @returns {Promise<Message<GroupChannel>[]>}
     */
    getMessages(options?: GetChannelMessagesOptions): Promise<Message<this>[]>;
    /**
     * Get the pinned messages in this channel.
     *
     * @returns {Promise<Message<GroupChannel>[]>}
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
    iconURL(format?: ImageFormat, size?: number): string | null;
    /**
     * Pin a message in this channel.
     *
     * @param {String} messageID - The id of the message to pin.
     * @param {String} [reason] - The reason for pinning the message.
     * @returns {Promise<void>}
     */
    pinMessage(messageID: string, reason?: string): Promise<void>;
    /**
     * Remove a user from this channel.
     *
     * @param {String} userID - The id of the user to remove.
     * @returns {Promise<void>}
     */
    removeRecipient(userID: string): Promise<void>;
    /**
     * Show a typing indicator in this channel.
     *
     * @returns {Promise<void>}
     */
    sendTyping(): Promise<void>;
    toJSON(): JSONGroupChannel;
    /**
     * Unpin a message in this channel.
     *
     * @param {String} messageID - The id of the message to unpin.
     * @param {String} [reason] - The reason for unpinning the message.
     * @returns {Promise<void>}
     */
    unpinMessage(messageID: string, reason?: string): Promise<void>;
}
