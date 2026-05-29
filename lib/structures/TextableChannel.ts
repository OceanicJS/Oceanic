/** @module TextableChannel */
import GuildChannel from "./GuildChannel";
import PermissionOverwrite from "./PermissionOverwrite";
import Message from "./Message";
import type { InviteWithMetadata } from "./Invite";
import type CategoryChannel from "./CategoryChannel";
import type Member from "./Member";
import Permission from "./Permission";
import type User from "./User";
import type Webhook from "./Webhook";
import type * as Types from "../types/namespaced";
import { AllPermissions, Permissions } from "../Constants";
import type Client from "../Client";
import TypedCollection from "../util/TypedCollection";
import { UncachedError } from "../util/Errors";

/** Represents a guild textable channel. */
export default class TextableChannel<CH extends Types.Channels.AnyTextableGuildChannel = Types.Channels.AnyTextableGuildChannel> extends GuildChannel {
    /** The last message sent in this channel. This will only be present if a message has been sent within the current session. */
    lastMessage?: Message<CH> | null;
    /** The ID of last message sent in this channel. */
    lastMessageID: string | null;
    /** The cached messages in this channel. */
    messages: TypedCollection<Types.Channels.RawMessage, Message<CH>>;
    /** If this channel is age gated. */
    nsfw: boolean;
    /** The permission overwrites of this channel. */
    permissionOverwrites: TypedCollection<Types.Channels.RawOverwrite, PermissionOverwrite>;
    /** The position of this channel on the sidebar. */
    position: number;
    /** The amount of seconds between non-moderators sending messages. */
    rateLimitPerUser: number;
    /** The topic of the channel. */
    topic: string | null;
    declare type: CH["type"];
    constructor(data: Types.Channels.RawTextChannel | Types.Channels.RawAnnouncementChannel | Types.Channels.RawVoiceChannel | Types.Channels.RawStageChannel, client: Client) {
        super(data, client);
        this.lastMessageID = data.last_message_id;
        this.messages = new TypedCollection(Message<CH>, client, this.client.util._getLimit("messages", this.id));
        this.nsfw = data.nsfw;
        this.permissionOverwrites = new TypedCollection(PermissionOverwrite, client);
        this.position = data.position;
        this.rateLimitPerUser = data.rate_limit_per_user;
        this.topic = data.topic;
        this.update(data);
    }

    protected override update(data: Partial<Types.Channels.RawTextChannel | Types.Channels.RawAnnouncementChannel | Types.Channels.RawVoiceChannel | Types.Channels.RawStageChannel>): void {
        super.update(data);
        if (data.last_message_id !== undefined) {
            this.lastMessage = data.last_message_id === null ? null : this.messages.get(data.last_message_id);
            this.lastMessageID = data.last_message_id;
        }
        if (data.nsfw !== undefined) {
            this.nsfw = data.nsfw;
        }
        if (data.position !== undefined) {
            this.position = data.position;
        }
        if (data.rate_limit_per_user !== undefined) {
            this.rateLimitPerUser = data.rate_limit_per_user;
        }
        if (data.topic !== undefined) {
            this.topic = data.topic;
        }
        if (data.permission_overwrites !== undefined) {
            for (const id of this.permissionOverwrites.keys()) {
                if (!data.permission_overwrites.some(overwrite => overwrite.id === id)) {
                    this.permissionOverwrites.delete(id);
                }
            }

            data.permission_overwrites.map(overwrite => this.permissionOverwrites.update(overwrite));
        }
    }

    override get parent(): CategoryChannel | undefined | null {
        return super.parent as CategoryChannel | undefined | null;
    }

    /**
     * Create an invite for this channel. If the guild is not a `COMMUNITY` server, invites can only be made to last 30 days.
     * @param options The options for the invite.
     */
    async createInvite(options: Types.Invites.CreateInviteOptions): Promise<InviteWithMetadata<CH>> {
        return this.client.rest.channels.createInvite<CH>(this.id, options);
    }

    /**
         * Create a message in this channel.
         * @param options The options for creating the message.
         */
        async createMessage(options: Types.Channels.CreateMessageOptions): Promise<Message<CH>>;
        /**
         * Create a message in this channel.
         * @param content The content for creating the message
         * @param options The options for creating the message.
         */
        async createMessage(content: string, options?: Types.Channels.CreateMessageOptions): Promise<Message<CH>>;
        async createMessage(content: Types.Channels.CreateMessageOptions | string, options?: Types.Channels.CreateMessageOptions): Promise<Message<CH>> {
        if (typeof content === "string") {
            options = {
                ...options,
                content
            };
        } else options = content;
        return this.client.rest.channels.createMessage<CH>(this.id, options);
    }

    /**
     * Add a reaction to a message in this channel.
     * @param messageID The ID of the message to add a reaction to.
     * @param emoji The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    async createReaction(messageID: string, emoji: string): Promise<void> {
        return this.client.rest.channels.createReaction(this.id, messageID, emoji);
    }

    /**
     * Create a webhook in this channel.
     * @param options The options to create the webhook with.
     */
    async createWebhook(options: Types.Webhooks.CreateWebhookOptions): Promise<Webhook> {
        return this.client.rest.webhooks.create(this.id, options);
    }

    /**
     * Delete a message in this channel.
     * @param messageID The ID of the message to delete.
     * @param reason The reason for deleting the message.
     */
    async deleteMessage(messageID: string, reason?: string): Promise<void> {
        return this.client.rest.channels.deleteMessage(this.id, messageID, reason);
    }

    /**
     * Bulk delete messages in this channel.
     * @param messageIDs The IDs of the messages to delete. Any duplicates or messages older than two weeks will cause an error.
     * @param reason The reason for deleting the messages.
     */
    async deleteMessages(messageIDs: Array<string>, reason?: string): Promise<number> {
        return this.client.rest.channels.deleteMessages(this.id, messageIDs, reason);
    }

    /**
     * Delete a permission overwrite on this channel.
     * @param overwriteID The ID of the permission overwrite to delete.
     * @param reason The reason for deleting the permission overwrite.
     */
    async deletePermission(overwriteID: string, reason?: string): Promise<void> {
        return this.client.rest.channels.deletePermission(this.id, overwriteID, reason);
    }

    /**
     * Remove a reaction from a message in this channel.
     * @param messageID The ID of the message to remove a reaction from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param user The user to remove the reaction from, `@me` for the current user (default).
     */
    async deleteReaction(messageID: string, emoji: string, user = "@me"): Promise<void> {
        return this.client.rest.channels.deleteReaction(this.id, messageID, emoji, user);
    }

    /**
     * Remove all, or a specific emoji's reactions from a message in this channel.
     * @param messageID The ID of the message to remove reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     */
    async deleteReactions(messageID: string, emoji?: string): Promise<void> {
        return this.client.rest.channels.deleteReactions(this.id, messageID, emoji);
    }

    /**
         * Edit a message in this channel.
         * @param messageID The ID of the message to edit.
         * @param options The options for editing the message.
         */
        async editMessage(messageID: string, options: Types.Channels.EditMessageOptions): Promise<Message<CH>>;
        /**
         * Edit a message in this channel.
         * @param messageID The ID of the message to edit.
         * @param content The content for editing the message.
         * @param options The options for editing the message.
         */
        async editMessage(messageID: string, content: string, options?: Types.Channels.EditMessageOptions): Promise<Message<CH>>;
        async editMessage(messageID: string, content: Types.Channels.EditMessageOptions | string, options?: Types.Channels.EditMessageOptions): Promise<Message<CH>> {
            if (typeof content === "string") {
                options = {
                    ...options,
                    content
                };
            } else options = content;
        return this.client.rest.channels.editMessage<CH>(this.id, messageID, options);
    }

    /**
     * Edit a permission overwrite on this channel.
     * @param overwriteID The ID of the permission overwrite to edit.
     * @param options The options for editing the permission overwrite.
     */
    async editPermission(overwriteID: string, options: Types.Channels.EditPermissionOptions): Promise<void> {
        return this.client.rest.channels.editPermission(this.id, overwriteID, options);
    }

    /**
     * Get the invites of this channel.
     */
    async getInvites(): Promise<Array<InviteWithMetadata<CH>>> {
        return this.client.rest.channels.getInvites<CH>(this.id);
    }

    /**
     * Get a message in this channel.
     * @param messageID The ID of the message to get.
     */
    async getMessage(messageID: string): Promise<Message<CH>> {
        return this.client.rest.channels.getMessage<CH>(this.id, messageID);
    }

    /**
     * Get messages in this channel.
     * @param options The options for getting the messages. `before`, `after`, and `around `All are mutually exclusive.
     */
    async getMessages(options?: Types.Channels.GetChannelMessagesOptions): Promise<Array<Message<CH>>> {
        return this.client.rest.channels.getMessages<CH>(this.id, options);
    }

    /**
     * Get the pinned messages in this channel.
     */
    async getPinnedMessages(): Promise<Array<Message<CH>>> {
        return this.client.rest.channels.getPinnedMessages<CH>(this.id);
    }

    /**
     * Get the users who reacted with a specific emoji on a message in this channel.
     * @param messageID The ID of the message to get reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options The options for getting the reactions.
     */
    async getReactions(messageID: string, emoji: string, options?: Types.Channels.GetReactionsOptions): Promise<Array<User>> {
        return this.client.rest.channels.getReactions(this.id, messageID, emoji, options);
    }

    /**
     * Get the webhooks in this channel.
     */
    async getWebhooks(): Promise<Array<Webhook>> {
        return this.client.rest.webhooks.getForChannel(this.id);
    }

    /**
     * Get the permissions of a member. If providing an id, the member must be cached.
     * @param member The member to get the permissions of.
     */
    permissionsOf(member: string | Member): Permission {
        if (typeof member === "string") {
            member = this.guild.members.get(member)!;
        }
        if (!member) {
            throw new UncachedError(`Cannot use ${this.constructor.name}#permissionsOf with an ID when the member is not cached.`);
        }
        let permission = this.guild.permissionsOf(member).allow;
        if (permission & Permissions.ADMINISTRATOR) {
            return new Permission(AllPermissions);
        }
        let overwrite = this.permissionOverwrites.get(this.guildID);
        if (overwrite) {
            permission = (permission & ~overwrite.deny) | overwrite.allow;
        }
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
        if (overwrite) {
            permission = (permission & ~overwrite.deny) | overwrite.allow;
        }
        return new Permission(permission);
    }

    /**
     * Pin a message in this channel.
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
    async purge(options: Types.Channels.PurgeOptions<CH>): Promise<number> {
        return this.client.rest.channels.purgeMessages(this.id, options);
    }

    /**
     * Show a typing indicator in this channel. How long users see this varies from client to client.
     */
    async sendTyping(): Promise<void> {
        return this.client.rest.channels.sendTyping(this.id);
    }

    override toJSON(): Types.JSON.JSONTextableChannel {
        return {
            ...super.toJSON(),
            lastMessageID:        this.lastMessageID,
            messages:             this.messages.map(message => message.id),
            nsfw:                 this.nsfw,
            permissionOverwrites: this.permissionOverwrites.map(overwrite => overwrite.toJSON()),
            position:             this.position,
            rateLimitPerUser:     this.rateLimitPerUser,
            topic:                this.topic,
            type:                 this.type
        };
    }

    /**
     * Unpin a message in this channel.
     * @param messageID The ID of the message to unpin.
     * @param reason The reason for unpinning the message.
     */
    async unpinMessage(messageID: string, reason?: string): Promise<void> {
        return this.client.rest.channels.unpinMessage(this.id, messageID, reason);
    }
}
