/** @module ThreadChannel */
import GuildChannel from "./GuildChannel";
import Message from "./Message";
import type User from "./User";
import type Member from "./Member";
import type Permission from "./Permission";
import { ChannelTypes, type ThreadChannelTypes } from "../Constants";
import type Client from "../Client";
import TypedCollection from "../util/TypedCollection";
import type {
    AnyThreadChannel,
    CreateMessageOptions,
    EditMessageOptions,
    EditThreadChannelOptions,
    GetChannelMessagesOptions,
    GetReactionsOptions,
    PrivateThreadMetadata,
    RawMessage,
    RawThreadChannel,
    ThreadMember,
    ThreadMetadata,
    PurgeOptions,
    ThreadParentChannel
} from "../types/channels";
import type { JSONThreadChannel } from "../types/json";

/** Represents a guild thread channel. */
export default class ThreadChannel<T extends AnyThreadChannel = AnyThreadChannel> extends GuildChannel {
    /** The [flags](https://discord.com/developers/docs/resources/channel#channel-object-channel-flags) for this thread channel. */
    flags: number;
    /** The last message sent in this channel. This will only be present if a message has been sent within the current session. */
    lastMessage?: Message<T> | null;
    /** The ID of last message sent in this channel. */
    lastMessageID: string | null;
    /** The approximate number of members in this thread. Stops counting after 50. */
    memberCount: number;
    /** The members of this thread. */
    members: Array<ThreadMember>;
    /** The number of messages (not including the initial message or deleted messages) in the thread. Stops counting after 50. */
    messageCount: number;
    /** The cached messages in this channel. */
    messages: TypedCollection<string, RawMessage, Message<T>>;
    /** The owner of this thread. */
    owner?: User;
    /** The ID of the owner of this thread. */
    ownerID: string;
    declare parentID: string;
    /** The amount of seconds between non-moderators sending messages. */
    rateLimitPerUser: number;
    /** The [thread metadata](https://discord.com/developers/docs/resources/channel#thread-metadata-object-thread-metadata-structure) associated with this thread. */
    threadMetadata: ThreadMetadata | PrivateThreadMetadata;
    /** The total number of messages ever sent in the thread. Includes deleted messages. */
    totalMessageSent: number;
    declare type: ThreadChannelTypes;
    constructor(data: RawThreadChannel, client: Client) {
        super(data, client);
        this.flags = data.flags;
        this.lastMessageID = data.last_message_id;
        this.memberCount = 0;
        this.members = [];
        this.messageCount = 0;
        this.messages = new TypedCollection(Message<T>, client, client.options.collectionLimits.messages);
        this.ownerID = data.owner_id;
        this.rateLimitPerUser = data.rate_limit_per_user;
        this.threadMetadata = {
            archiveTimestamp:    new Date(data.thread_metadata.archive_timestamp),
            archived:            !!data.thread_metadata.archived,
            autoArchiveDuration: data.thread_metadata.auto_archive_duration,
            createTimestamp:     !data.thread_metadata.create_timestamp ? null : new Date(data.thread_metadata.create_timestamp),
            locked:              !!data.thread_metadata.locked,
            invitable:           data.thread_metadata.invitable
        };
        this.totalMessageSent = 0;
        if (data.type === ChannelTypes.PRIVATE_THREAD && data.thread_metadata.invitable !== undefined) {
            (this.threadMetadata as PrivateThreadMetadata).invitable = !!data.thread_metadata.invitable;
        }
        this.update(data);
    }

    protected override update(data: Partial<RawThreadChannel>): void {
        if (data.flags !== undefined) {
            this.flags = data.flags;
        }
        if (data.last_message_id !== undefined) {
            this.lastMessage = data.last_message_id === null ? null : this.messages.get(data.last_message_id);
            this.lastMessageID = data.last_message_id;
        }
        // @TODO look over this to see if we can make it "safer" (accessing Client#user)
        if (data.member) {
            const index = this.members.findIndex(m => m.userID === this.client.user.id);
            if (index === -1) {
                this.members.push({ flags: data.member.flags, id: this.id, joinTimestamp: new Date(data.member.join_timestamp), userID: this.client.user.id });
            } else {
                this.members[index] = {
                    ...this.members[index],
                    flags:         data.member.flags,
                    joinTimestamp: new Date(data.member.join_timestamp)
                };
            }

        }
        if (data.member_count !== undefined) {
            this.memberCount = data.member_count;
        }
        if (data.message_count !== undefined) {
            this.messageCount = data.message_count;
        }
        if (data.owner_id !== undefined) {
            this.owner = this.client.users.get(data.owner_id);
            this.ownerID = data.owner_id;
        }
        if (data.rate_limit_per_user !== undefined) {
            this.rateLimitPerUser = data.rate_limit_per_user;
        }
        if (data.thread_metadata !== undefined) {
            this.threadMetadata = {
                archiveTimestamp:    new Date(data.thread_metadata.archive_timestamp),
                archived:            !!data.thread_metadata.archived,
                autoArchiveDuration: data.thread_metadata.auto_archive_duration,
                createTimestamp:     !data.thread_metadata.create_timestamp ? null : new Date(data.thread_metadata.create_timestamp),
                locked:              !!data.thread_metadata.locked,
                invitable:           data.thread_metadata.invitable
            };
            if (data.type === ChannelTypes.PRIVATE_THREAD && data.thread_metadata.invitable !== undefined) {
                (this.threadMetadata as PrivateThreadMetadata).invitable = !!data.thread_metadata.invitable;
            }

        }
        if (data.total_message_sent !== undefined) {
            this.totalMessageSent = data.total_message_sent;
        }
    }

    override get parent(): ThreadParentChannel | undefined {
        return super.parent as ThreadParentChannel | undefined;
    }

    /**
     * Add a member to this thread.
     * @param userID The ID of the user to add to the thread.
     */
    async addMember(userID: string): Promise<void> {
        return this.client.rest.channels.addThreadMember(this.id, userID);
    }

    /**
     * Create a message in this thread.
     * @param options The options for creating the message.
     */
    async createMessage(options: CreateMessageOptions): Promise<Message<T>> {
        return this.client.rest.channels.createMessage<T>(this.id, options);
    }

    /**
     * Add a reaction to a message in this thread.
     * @param messageID The ID of the message to add a reaction to.
     * @param emoji The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    async createReaction(messageID: string, emoji: string): Promise<void> {
        return this.client.rest.channels.createReaction(this.id, messageID, emoji);
    }

    /**
     * Delete a message in this thread.
     * @param messageID The ID of the message to delete.
     * @param reason The reason for deleting the message.
     */
    async deleteMessage(messageID: string, reason?: string): Promise<void> {
        return this.client.rest.channels.deleteMessage(this.id, messageID, reason);
    }

    /**
     * Bulk delete messages in this thread.
     * @param messageIDs The IDs of the messages to delete. Any duplicates or messages older than two weeks will cause an error.
     * @param reason The reason for deleting the messages.
     */
    async deleteMessages(messageIDs: Array<string>, reason?: string): Promise<number> {
        return this.client.rest.channels.deleteMessages(this.id, messageIDs, reason);
    }

    /**
     * Remove a reaction from a message in this thread.
     * @param messageID The ID of the message to remove a reaction from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param user The user to remove the reaction from, `@me` for the current user (default).
     */
    async deleteReaction(messageID: string, emoji: string, user = "@me"): Promise<void> {
        return this.client.rest.channels.deleteReaction(this.id, messageID, emoji, user);
    }

    /**
     * Remove all, or a specific emoji's reactions from a message.
     * @param messageID The ID of the message to remove reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     */
    async deleteReactions(messageID: string, emoji?: string): Promise<void> {
        return this.client.rest.channels.deleteReactions(this.id, messageID, emoji);
    }

    /**
     * Edit this thread.
     * @param options The options for editing the channel.
     */
    override async edit(options: EditThreadChannelOptions): Promise<AnyThreadChannel> {
        return this.client.rest.channels.edit<AnyThreadChannel>(this.id, options);
    }

    /**
     * Edit a message in this thread.
     * @param messageID The ID of the message to edit.
     * @param options The options for editing the message.
     */
    async editMessage(messageID: string, options: EditMessageOptions): Promise<Message<T>> {
        return this.client.rest.channels.editMessage<T>(this.id, messageID, options);
    }

    /**
     * Get a thread member in this thread.
     * @param userID The ID of the user to get the thread member of.
     */
    async getMember(userID: string): Promise<ThreadMember> {
        return this.client.rest.channels.getThreadMember(this.id, userID);
    }

    /**
     * Get the members of this thread.
     */
    async getMembers(): Promise<Array<ThreadMember>> {
        return this.client.rest.channels.getThreadMembers(this.id);
    }

    /**
     * Get a message in this thread.
     * @param messageID The ID of the message to get.
     */
    async getMessage(messageID: string): Promise<Message<T>> {
        return this.client.rest.channels.getMessage<T>(this.id, messageID);
    }

    /**
     * Get messages in this thread.
     * @param options The options for getting the messages. `before`, `after`, and `around `All are mutually exclusive.
     */
    async getMessages(options?: GetChannelMessagesOptions): Promise<Array<Message<T>>> {
        return this.client.rest.channels.getMessages<T>(this.id, options);
    }

    /**
     * Get the pinned messages in this thread.
     */
    async getPinnedMessages(): Promise<Array<Message<T>>> {
        return this.client.rest.channels.getPinnedMessages<T>(this.id);
    }

    /**
     * Get the users who reacted with a specific emoji on a message.
     * @param messageID The ID of the message to get reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options The options for getting the reactions.
     */
    async getReactions(messageID: string, emoji: string, options?: GetReactionsOptions): Promise<Array<User>> {
        return this.client.rest.channels.getReactions(this.id, messageID, emoji, options);
    }

    /**
     * Join this thread.
     */
    async join(): Promise<void> {
        return this.client.rest.channels.joinThread(this.id);
    }

    /**
     * Leave this thread.
     */
    async leave(): Promise<void> {
        return this.client.rest.channels.leaveThread(this.id);
    }

    /**
     * Get the permissions of a member. If providing an id, the member must be cached. The parent channel must be cached as threads themselves do not have permissions.
     * @param member The member to get the permissions of.
     */
    permissionsOf(member: string | Member): Permission {
        if (!this.parent) {
            throw new Error(`Cannot use ${this.constructor.name}#permissionsOf without having the parent channel cached.`);
        }
        return this.parent.permissionsOf(member);
    }

    /**
     * Pin a message in this thread.
     * @param messageID The ID of the message to pin.
     * @param reason The reason for pinning the message.
     */
    async pinMessage(messageID: string, reason?: string): Promise<void> {
        return this.client.rest.channels.pinMessage(this.id, messageID, reason);
    }

    /**
     * Purge an amount of messages from this channel.
     * @param options The options to purge. `before`, `after`, and `around `All are mutually exclusive.
     */
    async purge(options: PurgeOptions<T>): Promise<number> {
        return this.client.rest.channels.purgeMessages(this.id, options);
    }

    /**
     * Remove a member from this thread.
     * @param userID The ID of the user to remove from the thread.
     */
    async removeMember(userID: string): Promise<void> {
        return this.client.rest.channels.removeThreadMember(this.id, userID);
    }

    /**
     * Show a typing indicator in this thread.
     */
    async sendTyping(): Promise<void> {
        return this.client.rest.channels.sendTyping(this.id);
    }

    override toJSON(): JSONThreadChannel {
        return {
            ...super.toJSON(),
            flags:            this.flags,
            lastMessageID:    this.lastMessageID,
            memberCount:      this.memberCount,
            messageCount:     this.messageCount,
            messages:         this.messages.map(m => m.id),
            ownerID:          this.ownerID,
            rateLimitPerUser: this.rateLimitPerUser,
            threadMetadata:   this.threadMetadata,
            totalMessageSent: this.totalMessageSent,
            type:             this.type
        };
    }

    /**
     * Unpin a message in this thread.
     * @param messageID The ID of the message to unpin.
     * @param reason The reason for unpinning the message.
     */
    async unpinMessage(messageID: string, reason?: string): Promise<void> {
        return this.client.rest.channels.unpinMessage(this.id, messageID, reason);
    }
}
