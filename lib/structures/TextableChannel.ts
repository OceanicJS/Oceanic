import GuildChannel from "./GuildChannel";
import type AnnouncementChannel from "./AnnouncementChannel";
import type TextChannel from "./TextChannel";
import PermissionOverwrite from "./PermissionOverwrite";
import Message from "./Message";
import ThreadChannel from "./ThreadChannel";
import type Invite from "./Invite";
import type PublicThreadChannel from "./PublicThreadChannel";
import type AnnouncementThreadChannel from "./AnnouncementThreadChannel";
import type CategoryChannel from "./CategoryChannel";
import type Member from "./Member";
import Permission from "./Permission";
import type { PrivateChannelTypes, TextChannelTypes, ThreadAutoArchiveDuration } from "../Constants";
import { AllPermissions, Permissions, ChannelTypes } from "../Constants";
import type Client from "../Client";
import Collection from "../util/Collection";
import type {
    AnyThreadChannel,
    CreateInviteOptions,
    CreateMessageOptions,
    EditGuildChannelOptions,
    EditMessageOptions,
    EditPermissionOptions,
    GetArchivedThreadsOptions,
    GetChannelMessagesOptions,
    GetReactionsOptions,
    RawMessage,
    RawAnnouncementChannel,
    RawOverwrite,
    RawTextChannel,
    RawThreadChannel,
    StartThreadFromMessageOptions,
    StartThreadWithoutMessageOptions
} from "../types/channels";
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
    declare parent: CategoryChannel | null;
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
    declare type: Exclude<TextChannelTypes, PrivateChannelTypes>;
    constructor(data: RawTextChannel | RawAnnouncementChannel, client: Client) {
        super(data, client);
        this.messages = new Collection(Message, client);
        this.threads = new Collection(ThreadChannel, client) as Collection<string, RawThreadChannel, AnyThreadChannel>;
        this.permissionOverwrites = new Collection(PermissionOverwrite, client);
        this.update(data);
    }

    protected update(data: Partial<RawTextChannel> | Partial<RawAnnouncementChannel>) {
        super.update(data);
        if (data.default_auto_archive_duration !== undefined) this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        if (data.last_message_id !== undefined) this.lastMessage = data.last_message_id === null ? null : this.messages.get(data.last_message_id) || { id: data.last_message_id };
        if (data.nsfw !== undefined) this.nsfw = data.nsfw;
        if (data.position !== undefined) this.position = data.position;
        if (data.rate_limit_per_user !== undefined) this.rateLimitPerUser = data.rate_limit_per_user;
        if (data.topic !== undefined) this.topic = data.topic;
        if (data.permission_overwrites !== undefined) data.permission_overwrites.map(overwrite => this.permissionOverwrites.update(overwrite));
    }

    /**
     * [Text] Convert this text channel to a announcement channel.
     *
     * [Announcement] Convert this announcement channel to a text channel.
     */
    async convert() {
        return this.edit({ type: this.type === ChannelTypes.GUILD_TEXT ? ChannelTypes.GUILD_ANNOUNCEMENT : ChannelTypes.GUILD_TEXT });
    }

    /**
     * Create an invite for this channel.
     * @param options - The options for the invite.
     */
    async createInvite(options: CreateInviteOptions): Promise<Invite<"withMetadata", T>> {
        return this._client.rest.channels.createInvite<"withMetadata", T>(this.id, options);
    }

    /**
     * Create a message in this channel.
     * @param options - The options for the message.
     */
    async createMessage(options: CreateMessageOptions): Promise<Message<T>> {
        return this._client.rest.channels.createMessage<T>(this.id, options);
    }

    /**
     * Add a reaction to a message in this channel.
     * @param messageID - The ID of the message to add a reaction to.
     * @param emoji - The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    async createReaction(messageID: string, emoji: string) {
        return this._client.rest.channels.createReaction(this.id, messageID, emoji);
    }

    /**
     * Delete a message in this channel.
     * @param messageID - The ID of the message to delete.
     * @param reason - The reason for deleting the message.
     */
    async deleteMessage(messageID: string, reason?: string) {
        return this._client.rest.channels.deleteMessage(this.id, messageID, reason);
    }

    /**
     * Bulk delete messages in this channel.
     * @param messageIDs - The ids of the messages to delete. Between 2 and 100 messages, any dupliates or messages older than two weeks will cause an error.
     * @param reason - The reason for deleting the messages.
     */
    async deleteMessages(messageIDs: Array<string>, reason?: string) {
        return this._client.rest.channels.deleteMessages(this.id, messageIDs, reason);
    }

    /**
     * Delete a permission overwrite on this channel.
     * @param overwriteID - The ID of the permission overwrite to delete.
     * @param reason - The reason for deleting the permission overwrite.
     */
    async deletePermission(overwriteID: string, reason?: string) {
        return this._client.rest.channels.deletePermission(this.id, overwriteID, reason);
    }

    /**
     * Remove a reaction from a message in this channel.
     * @param messageID - The ID of the message to remove a reaction from.
     * @param emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param user - The user to remove the reaction from, `@me` for the current user (default).
     */
    async deleteReaction(messageID: string, emoji: string, user = "@me") {
        return this._client.rest.channels.deleteReaction(this.id, messageID, emoji, user);
    }

    /**
     * Remove all, or a specific emoji's reactions from a message in this channel.
     * @param messageID - The ID of the message to remove reactions from.
     * @param emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     */
    async deleteReactions(messageID: string, emoji?: string) {
        return this._client.rest.channels.deleteReactions(this.id, messageID, emoji);
    }

    /**
     * Edit this channel.
     * @param options - The options for editing the channel.
     */
    async edit(options: EditGuildChannelOptions) {
        return this._client.rest.channels.edit<TextChannel | AnnouncementChannel>(this.id, options);
    }

    /**
     * Edit a message in this channel.
     * @param messageID - The ID of the message to edit.
     * @param options - The options for editing the message.
     */
    async editMessage(messageID: string, options: EditMessageOptions) {
        return this._client.rest.channels.editMessage(this.id, messageID, options);
    }

    /**
     * Edit a permission overwrite on this channel.
     * @param overwriteID - The ID of the permission overwrite to edit.
     * @param options - The options for editing the permission overwrite.
     */
    async editPermission(overwriteID: string, options: EditPermissionOptions) {
        return this._client.rest.channels.editPermission(this.id, overwriteID, options);
    }

    /**
     * Get the invites of this channel.
     */
    async getInvites(): Promise<Array<Invite<"withMetadata", T>>> {
        return this._client.rest.channels.getInvites<T>(this.id);
    }

    /**
     * Get the private archived threads the current user has joined in this channel.
     * @param options - The options for getting the joined private archived threads.
     */
    async getJoinedPrivateArchivedThreads(options?: GetArchivedThreadsOptions) {
        return this._client.rest.channels.getJoinedPrivateArchivedThreads(this.id, options);
    }

    /**
     * Get a message in this channel.
     * @param messageID - The ID of the message to get.
     */
    async getMessage(messageID: string): Promise<Message<T>> {
        return this._client.rest.channels.getMessage<T>(this.id, messageID);
    }

    /**
     * Get messages in this channel.
     * @param options - The options for getting the messages. All options are mutually exclusive.
     */
    async getMessages(options?: GetChannelMessagesOptions): Promise<Array<Message<T>>> {
        return this._client.rest.channels.getMessages<T>(this.id, options);
    }

    /**
     * Get the pinned messages in this channel.
     */
    async getPinnedMessages(): Promise<Array<Message<T>>> {
        return this._client.rest.channels.getPinnedMessages<T>(this.id);
    }

    /**
     * Get the private archived threads in this channel.
     * @param options - The options for getting the private archived threads.
     */
    async getPrivateArchivedThreads(options?: GetArchivedThreadsOptions) {
        return this._client.rest.channels.getPrivateArchivedThreads(this.id, options);
    }

    /**
     * Get the public archived threads in this channel.
     * @param options - The options for getting the public archived threads.
     */
    async getPublicArchivedThreads(options?: GetArchivedThreadsOptions) {
        return this._client.rest.channels.getPublicArchivedThreads<T extends TextChannel ? PublicThreadChannel : AnnouncementThreadChannel>(this.id, options);
    }

    /**
     * Get the users who reacted with a specific emoji on a message in this channel.
     * @param messageID - The ID of the message to get reactions from.
     * @param emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options - The options for getting the reactions.
     */
    async getReactions(messageID: string, emoji: string, options?: GetReactionsOptions) {
        return this._client.rest.channels.getReactions(this.id, messageID, emoji, options);
    }

    /**
     * Get the permissions of a member.  If providing an id, the member must be cached.
     * @param member - The member to get the permissions of.
     */
    permissionsOf(member: string | Member) {
        if (typeof member === "string") member = this.guild.members.get(member)!;
        if (!member) throw new Error("Member not found");
        let permission = this.guild.permissionsOf(member).allow;
        if (permission & Permissions.ADMINISTRATOR) return new Permission(AllPermissions);
        let overwrite = this.permissionOverwrites.get(this.guild.id);
        if (overwrite) permission = (permission & ~overwrite.deny) | overwrite.allow;
        let deny = 0n;
        let allow = 0n;
        for (const id of member.roles) {
            if ((overwrite = this.permissionOverwrites.get(id))) {
                deny |= overwrite.deny;
                allow |= overwrite.allow;
            }
        }
        permission = (permission & ~deny) | allow;
        overwrite = this.permissionOverwrites.get(member.id);
        if (overwrite) permission = (permission & ~overwrite.deny) | overwrite.allow;
        return new Permission(permission);
    }

    /**
     * Pin a message in this channel.
     * @param messageID - The ID of the message to pin.
     * @param reason - The reason for pinning the message.
     */
    async pinMessage(messageID: string, reason?: string) {
        return this._client.rest.channels.pinMessage(this.id, messageID, reason);
    }

    /**
     * Show a typing indicator in this channel. How long users see this varies from client to client.
     */
    async sendTyping() {
        return this._client.rest.channels.sendTyping(this.id);
    }

    /**
     * Create a thread from an existing message in this channel.
     * @param messageID - The ID of the message to create a thread from.
     * @param options - The options for creating the thread.
     */
    async startThreadFromMessage(messageID: string, options: StartThreadFromMessageOptions) {
        return this._client.rest.channels.startThreadFromMessage<T extends TextChannel ? AnnouncementThreadChannel : PublicThreadChannel>(this.id, messageID, options);
    }

    /**
     * Create a thread without an existing message in this channel.
     * @param options - The options for creating the thread.
     */
    async startThreadWithoutMessage(options: StartThreadWithoutMessageOptions) {
        return this._client.rest.channels.startThreadWithoutMessage<T extends TextChannel ? AnnouncementThreadChannel : PublicThreadChannel>(this.id, options);
    }

    override toJSON(): JSONTextableChannel {
        return {
            ...super.toJSON(),
            defaultAutoArchiveDuration: this.defaultAutoArchiveDuration,
            lastMessage:                this.lastMessage?.id || null,
            messages:                   this.messages.map(message => message.id),
            nsfw:                       this.nsfw,
            permissionOverwrites:       this.permissionOverwrites.map(overwrite => overwrite.toJSON()),
            position:                   this.position,
            rateLimitPerUser:           this.rateLimitPerUser,
            threads:                    this.threads.map(thread => thread.id),
            topic:                      this.topic,
            type:                       this.type
        };
    }

    /**
     * Unpin a message in this channel.
     * @param messageID - The ID of the message to unpin.
     * @param reason - The reason for unpinning the message.
     */
    async unpinMessage(messageID: string, reason?: string) {
        return this._client.rest.channels.unpinMessage(this.id, messageID, reason);
    }
}
