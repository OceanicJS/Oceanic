import Channel from "./Channel";
import User from "./User";
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
     * @param options - The options for adding the user.
     */
    addRecipient(options: AddGroupRecipientOptions): Promise<void>;
    /**
     * Create an invite for this channel.
     * @param options - The options for creating the invite.
     */
    createInvite(options: CreateInviteOptions): Promise<import("./Invite").default<import("../types/channels").InviteInfoTypes, import("../types/channels").InviteChannel>>;
    /**
     * Create a message in this channel.
     * @param options - The options for creating the message.
     */
    createMessage(options: CreateMessageOptions): Promise<Message<this>>;
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
     * Remove a reaction from a message in this channel.
     * @param messageID - The ID of the message to remove a reaction from.
     * @param emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    deleteReaction(messageID: string, emoji: string): Promise<void>;
    /**
     * Edit this channel.
     * @param options - The options for editing the channel.
     */
    edit(options: EditGroupDMOptions): Promise<GroupChannel>;
    /**
     * Edit a message in this channel.
     * @param messageID - The ID of the message to edit.
     * @param options - The options for editing the message.
     */
    editMessage(messageID: string, options: EditMessageOptions): Promise<Message<this>>;
    /**
     * Get a message in this channel.
     * @param messageID - The ID of the message to get.
     */
    getMessage(messageID: string): Promise<Message<this>>;
    /**
     * Get messages in this channel.
     * @param options - The options for getting the messages. All options are mutually exclusive.
     */
    getMessages(options?: GetChannelMessagesOptions): Promise<Message<this>[]>;
    /**
     * Get the pinned messages in this channel.
     */
    getPinnedMessages(): Promise<Message<this>[]>;
    /**
     * Get the users who reacted with a specific emoji on a message.
     * @param messageID - The ID of the message to get reactions from.
     * @param emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options - The options for getting the reactions.
     */
    getReactions(messageID: string, emoji: string, options?: GetReactionsOptions): Promise<User[]>;
    /**
     * The url of this application's icon.
     * @param format - The format the url should be.
     * @param size - The dimensions of the image.
     */
    iconURL(format?: ImageFormat, size?: number): string | null;
    /**
     * Pin a message in this channel.
     * @param messageID - The ID of the message to pin.
     * @param reason - The reason for pinning the message.
     */
    pinMessage(messageID: string, reason?: string): Promise<void>;
    /**
     * Remove a user from this channel.
     * @param userID - The ID of the user to remove.
     */
    removeRecipient(userID: string): Promise<void>;
    /**
     * Show a typing indicator in this channel.
     */
    sendTyping(): Promise<void>;
    toJSON(): JSONGroupChannel;
    /**
     * Unpin a message in this channel.
     * @param messageID - The ID of the message to unpin.
     * @param reason - The reason for unpinning the message.
     */
    unpinMessage(messageID: string, reason?: string): Promise<void>;
}
