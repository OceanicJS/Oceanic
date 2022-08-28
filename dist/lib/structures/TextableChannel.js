"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GuildChannel_1 = __importDefault(require("./GuildChannel"));
const PermissionOverwrite_1 = __importDefault(require("./PermissionOverwrite"));
const Message_1 = __importDefault(require("./Message"));
const ThreadChannel_1 = __importDefault(require("./ThreadChannel"));
const Constants_1 = require("../Constants");
const Collection_1 = __importDefault(require("../util/Collection"));
/** Represents a guild text channel. */
class TextableChannel extends GuildChannel_1.default {
    /** The default auto archive duration for threads created in this channel. */
    defaultAutoArchiveDuration;
    /** The last message sent in this channel. This can be a partial object with only an `id` property. */
    lastMessage;
    /** The cached messages in this channel. */
    messages;
    /** If this channel is age gated. */
    nsfw;
    /** The permission overwrites of this channel. */
    permissionOverwrites;
    /** The position of this channel on the sidebar. */
    position;
    /** The amount of seconds between non-moderators sending messages. */
    rateLimitPerUser;
    /** The threads in this channel. */
    threads;
    /** The topic of the channel. */
    topic;
    constructor(data, client) {
        super(data, client);
        this.messages = new Collection_1.default(Message_1.default, client);
        this.threads = new Collection_1.default(ThreadChannel_1.default, client);
        this.permissionOverwrites = new Collection_1.default(PermissionOverwrite_1.default, client);
        this.update(data);
    }
    update(data) {
        super.update(data);
        if (data.default_auto_archive_duration !== undefined)
            this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        if (data.last_message_id !== undefined)
            this.lastMessage = data.last_message_id === null ? null : this.messages.get(data.last_message_id) || { id: data.last_message_id };
        if (data.nsfw !== undefined)
            this.nsfw = data.nsfw;
        if (data.position !== undefined)
            this.position = data.position;
        if (data.rate_limit_per_user !== undefined)
            this.rateLimitPerUser = data.rate_limit_per_user;
        if (data.topic !== undefined)
            this.topic = data.topic;
        if (data.permission_overwrites !== undefined)
            data.permission_overwrites.map(overwrite => this.permissionOverwrites.update(overwrite));
    }
    /**
     * [Text] Convert this text channel to a announcement channel.
     *
     * [Announcement] Convert this announcement channel to a text channel.
     *
     * @returns {Promise<TextChannel | AnnouncementChannel>}
     */
    async convert() {
        return this.edit({ type: this.type === Constants_1.ChannelTypes.GUILD_TEXT ? Constants_1.ChannelTypes.GUILD_ANNOUNCEMENT : Constants_1.ChannelTypes.GUILD_TEXT });
    }
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
    async createInvite(options) {
        return this._client.rest.channels.createInvite(this.id, options);
    }
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
     * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send. Convert `snake_case` keys to `camelCase`
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
    async createMessage(options) {
        return this._client.rest.channels.createMessage(this.id, options);
    }
    /**
     * Add a reaction to a message in this channel.
     *
     * @param {String} messageID - The id of the message to add a reaction to.
     * @param {String} emoji - The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @returns {Promise<void>}
     */
    async createReaction(messageID, emoji) {
        return this._client.rest.channels.createReaction(this.id, messageID, emoji);
    }
    /**
     * Delete a message in this channel.
     *
     * @param {String} messageID - The id of the message to delete.
     * @param {String} [reason] - The reason for deleting the message.
     * @returns {Promise<void>}
     */
    async deleteMessage(messageID, reason) {
        return this._client.rest.channels.deleteMessage(this.id, messageID, reason);
    }
    /**
     * Bulk delete messages in this channel.
     *
     * @param {String[]} messageIDs - The ids of the messages to delete. Between 2 and 100 messages, any dupliates or messages older than two weeks will cause an error.
     * @param {String} [reason] - The reason for deleting the messages.
     * @returns {Promise<void>}
     */
    async deleteMessages(messageIDs, reason) {
        return this._client.rest.channels.deleteMessages(this.id, messageIDs, reason);
    }
    /**
     * Delete a permission overwrite on this channel.
     *
     * @param {String} overwriteID - The id of the permission overwrite to delete.
     * @param {String} reason - The reason for deleting the permission overwrite.
     * @returns {Promise<void>}
     */
    async deletePermission(overwriteID, reason) {
        return this._client.rest.channels.deletePermission(this.id, overwriteID, reason);
    }
    /**
     * Remove a reaction from a message in this channel.
     *
     * @param {String} messageID - The id of the message to remove a reaction from.
     * @param {String} emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param {String} [user="@me"] - The user to remove the reaction from, `@me` for the current user (default).
     * @returns {Promise<void>}
     */
    async deleteReaction(messageID, emoji, user = "@me") {
        return this._client.rest.channels.deleteReaction(this.id, messageID, emoji, user);
    }
    /**
     * Remove all, or a specific emoji's reactions from a message in this channel.
     *
     * @param {String} messageID - The id of the message to remove reactions from.
     * @param {String} [emoji] - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     * @returns {Promise<void>}
     */
    async deleteReactions(messageID, emoji) {
        return this._client.rest.channels.deleteReactions(this.id, messageID, emoji);
    }
    /**
     * Edit this channel.
     *
     * @param {Object} options
     * @param {?ThreadAutoArchiveDuration} [options.defaultAutoArchiveDuration] - The default auto archive duration for threads made in this channel.
     * @param {String} [options.name] - The name of the channel.
     * @param {?Boolean} [options.nsfw] - If the channel is age gated.
     * @param {?String} [options.parentID] - The id of the parent category channel.
     * @param {?RawOverwrite[]} [options.permissionOverwrites] - Channel or category specific permissions
     * @param {?Number} [options.position] - The position of the channel in the channel list.
     * @param {?Number} [options.rateLimitPerUser] - The seconds between sending messages for users. Between 0 and 21600.
     * @param {String} [options.reason] - The reason to be displayed in the audit log.
     * @param {?String} [options.topic] - The topic of the channel.
     * @param {ChannelTypes.GUILD_ANNOUNCEMENT} [options.type] - Provide the opposite type to convert the channel.
     * @returns {Promise<GuildChannel>}
     */
    async edit(options) {
        return this._client.rest.channels.edit(this.id, options);
    }
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
     * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send. Convert `snake_case` keys to `camelCase`
     * @param {String} [options.content] - The content of the message.
     * @param {Object[]} [options.embeds] - An array of [embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send.
     * @param {File[]} [options.files] - The files to send.
     * @returns {Promise<Message>}
     */
    async editMessage(messageID, options) {
        return this._client.rest.channels.editMessage(this.id, messageID, options);
    }
    /**
     * Edit a permission overwrite on this channel.
     *
     * @param {String} overwriteID - The id of the permission overwrite to edit.
     * @param {Object} options
     * @param {(BigInt | String)} [options.allow] - The permissions to allow.
     * @param {(BigInt | String)} [options.deny] - The permissions to deny.
     * @param {String} [options.reason] - The reason for editing the permission.
     * @param {OverwriteTypes} [options.type] - The type of the permission overwrite.
     * @returns {Promise<void>}
     */
    async editPermission(overwriteID, options) {
        return this._client.rest.channels.editPermission(this.id, overwriteID, options);
    }
    /**
     * Get the invites of this channel.
     *
     * @returns {Promise<Invite[]>} - An array of invites with metadata.
     */
    async getInvites() {
        return this._client.rest.channels.getInvites(this.id);
    }
    /**
     * Get the private archived threads the current user has joined in this channel.
     *
     * @param {Object} [options]
     * @param {String} [options.before] - A **timestamp** to get threads before.
     * @param {Number} [options.limit] - The maximum amount of threads to get.
     * @returns {Promise<ArchivedThreads<PrivateThreadChannel>>}
     */
    async getJoinedPrivateArchivedThreads(options) {
        return this._client.rest.channels.getJoinedPrivateArchivedThreads(this.id, options);
    }
    /**
     * Get a message in this channel.
     *
     * @param {String} messageID - The id of the message to get.
     * @returns {Promise<Message>}
     */
    async getMessage(messageID) {
        return this._client.rest.channels.getMessage(this.id, messageID);
    }
    /**
     * Get messages in this channel.
     *
     * @param {Object} options - All options are mutually exclusive.
     * @param {String} [options.after] - Get messages after this message id.
     * @param {String} [options.around] - Get messages around this message id.
     * @param {String} [options.before] - Get messages before this message id.
     * @param {Number} [options.limit] - The maximum amount of messages to get.
     * @returns {Promise<Message[]>}
     */
    async getMessages(options) {
        return this._client.rest.channels.getMessages(this.id, options);
    }
    /**
     * Get the pinned messages in this channel.
     *
     * @returns {Promise<Message[]>}
     */
    async getPinnedMessages() {
        return this._client.rest.channels.getPinnedMessages(this.id);
    }
    /**
     * Get the private archived threads in this channel.
     *
     * @param {Object} [options]
     * @param {String} [options.before] - A **timestamp** to get threads before.
     * @param {Number} [options.limit] - The maximum amount of threads to get.
     * @returns {Promise<ArchivedThreads<PrivateThreadChannel>>}
     */
    async getPrivateArchivedThreads(options) {
        return this._client.rest.channels.getPrivateArchivedThreads(this.id, options);
    }
    /**
     * Get the public archived threads in this channel.
     *
     * @param {Object} [options]
     * @param {String} [options.before] - A **timestamp** to get threads before.
     * @param {Number} [options.limit] - The maximum amount of threads to get.
     * @returns {Promise<ArchivedThreads>}
     */
    async getPublicArchivedThreads(options) {
        return this._client.rest.channels.getPublicArchivedThreads(this.id, options);
    }
    /**
     * Get the users who reacted with a specific emoji on a message in this channel.
     *
     * @param {String} messageID - The id of the message to get reactions from.
     * @param {String} emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param {Object} [options] - Options for the request.
     * @param {String} [options.after] - Get users after this user id.
     * @param {Number} [options.limit] - The maximum amount of users to get.
     * @returns {Promise<User[]>}
     */
    async getReactions(messageID, emoji, options) {
        return this._client.rest.channels.getReactions(this.id, messageID, emoji, options);
    }
    /**
     * Pin a message in this channel.
     *
     * @param {String} messageID - The id of the message to pin.
     * @param {String} [reason] - The reason for pinning the message.
     * @returns {Promise<void>}
     */
    async pinMessage(messageID, reason) {
        return this._client.rest.channels.pinMessage(this.id, messageID, reason);
    }
    /**
     * Show a typing indicator in this channel. How long users see this varies from client to client.
     *
     * @returns {Promise<void>}
     */
    async sendTyping() {
        return this._client.rest.channels.sendTyping(this.id);
    }
    /**
     * Create a thread from an existing message in this channel.
     *
     * @template {(AnnouncementThreadChannel | PublicThreadChannel)} T
     * @param {String} messageID
     * @param {Object} options
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration of no activity after which this thread will be automatically archived.
     * @param {String} options.name - The name of the thread.
     * @param {Number?} [options.rateLimitPerUser] - The amount of seconds a user has to wait before sending another message.
     * @param {String} [options.reason] - The reason for creating the thread.
     * @returns {Promise<T>}
     */
    async startThreadFromMessage(messageID, options) {
        return this._client.rest.channels.startThreadFromMessage(this.id, messageID, options);
    }
    /**
     * Create a thread without an existing message in this channel.
     *
     * @template {(AnnouncementThreadChannel | PublicThreadChannel)} T
     * @param {Object} options
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration of no activity after which this thread will be automatically archived.
     * @param {Boolean} [options.invitable] - [Private] If non-moderators can add other non-moderators to the thread.
     * @param {String} options.name - The name of the thread.
     * @param {Number?} [options.rateLimitPerUser] - The amount of seconds a user has to wait before sending another message.
     * @param {String} [options.reason] - The reason for creating the thread.
     * @param {ThreadChannelTypes} [options.type] - The type of thread to create.
     * @returns {Promise<T>}
     */
    async startThreadWithoutMessage(options) {
        return this._client.rest.channels.startThreadWithoutMessage(this.id, options);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            defaultAutoArchiveDuration: this.defaultAutoArchiveDuration,
            lastMessage: this.lastMessage?.id || null,
            messages: this.messages.map(message => message.id),
            nsfw: this.nsfw,
            permissionOverwrites: this.permissionOverwrites.map(overwrite => overwrite.toJSON()),
            position: this.position,
            rateLimitPerUser: this.rateLimitPerUser,
            threads: this.threads.map(thread => thread.id),
            topic: this.topic,
            type: this.type
        };
    }
    /**
     * Unpin a message in this channel.
     *
     * @param {String} messageID - The id of the message to unpin.
     * @param {String} [reason] - The reason for unpinning the message.
     * @returns {Promise<void>}
     */
    async unpinMessage(messageID, reason) {
        return this._client.rest.channels.unpinMessage(this.id, messageID, reason);
    }
}
exports.default = TextableChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGV4dGFibGVDaGFubmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvVGV4dGFibGVDaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0VBQTBDO0FBRzFDLGdGQUF3RDtBQUN4RCx3REFBZ0M7QUFDaEMsb0VBQTRDO0FBZTVDLDRDQUE0QztBQUU1QyxvRUFBNEM7QUF3QjVDLHVDQUF1QztBQUN2QyxNQUFxQixlQUFpRyxTQUFRLHNCQUFZO0lBQ3RJLDZFQUE2RTtJQUM3RSwwQkFBMEIsQ0FBNEI7SUFDdEQsc0dBQXNHO0lBQ3RHLFdBQVcsQ0FBNEI7SUFDdkMsMkNBQTJDO0lBQzNDLFFBQVEsQ0FBMEM7SUFDbEQsb0NBQW9DO0lBQ3BDLElBQUksQ0FBVTtJQUVkLGlEQUFpRDtJQUNqRCxvQkFBb0IsQ0FBd0Q7SUFDNUUsbURBQW1EO0lBQ25ELFFBQVEsQ0FBUztJQUNqQixxRUFBcUU7SUFDckUsZ0JBQWdCLENBQVM7SUFDekIsbUNBQW1DO0lBQ25DLE9BQU8sQ0FBeUQ7SUFDaEUsZ0NBQWdDO0lBQ2hDLEtBQUssQ0FBZ0I7SUFFckIsWUFBWSxJQUE2QyxFQUFFLE1BQWM7UUFDckUsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksb0JBQVUsQ0FBQyxpQkFBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxvQkFBVSxDQUFDLHVCQUFhLEVBQUUsTUFBTSxDQUEyRCxDQUFDO1FBQy9HLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLG9CQUFVLENBQUMsNkJBQW1CLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRVMsTUFBTSxDQUFDLElBQStEO1FBQzVFLEtBQUssQ0FBQyxN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