"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GuildChannel_1 = __importDefault(require("./GuildChannel"));
const PermissionOverwrite_1 = __importDefault(require("./PermissionOverwrite"));
const Message_1 = __importDefault(require("./Message"));
const Member_1 = __importDefault(require("./Member"));
const Collection_1 = __importDefault(require("../util/Collection"));
/** Represents a guild voice channel. */
class VoiceChannel extends GuildChannel_1.default {
    /** The bitrate of the voice channel. */
    bitrate;
    /** The last message sent in this channel. This can be a partial object with only an `id` property. This will only be present if a message has been sent within the current session. */
    lastMessage;
    /** The cached messages in this channel. */
    messages;
    /** If this channel is age gated. */
    nsfw;
    /** The permission overwrites of this channel. */
    permissionOverwrites;
    /** The position of this channel on the sidebar. */
    position;
    /** The id of the voice region of the channel, `null` is automatic. */
    rtcRegion;
    /** The topic of the channel. */
    topic;
    /** The [video quality mode](https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes) of this channel. */
    videoQualityMode;
    voiceMembers;
    constructor(data, client) {
        super(data, client);
        this.lastMessage = null;
        this.messages = new Collection_1.default(Message_1.default, client);
        this.permissionOverwrites = new Collection_1.default(PermissionOverwrite_1.default, client);
        this.voiceMembers = new Collection_1.default(Member_1.default, client);
        this.update(data);
    }
    update(data) {
        super.update(data);
        if (data.bitrate !== undefined)
            this.bitrate = data.bitrate;
        if (data.nsfw !== undefined)
            this.nsfw = data.nsfw;
        if (data.position !== undefined)
            this.position = data.position;
        if (data.rtc_region !== undefined)
            this.rtcRegion = data.rtc_region;
        if (data.topic !== undefined)
            this.topic = data.topic;
        if (data.video_quality_mode !== undefined)
            this.videoQualityMode = data.video_quality_mode;
        if (data.permission_overwrites !== undefined)
            data.permission_overwrites.map(overwrite => this.permissionOverwrites.update(overwrite));
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
     * @returns {Promise<Invite<VoiceChannel>>}
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
     * @returns {Promise<Message<VoiceChannel>>}
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
     * @param {String} [options.name] - The name of the channel.
     * @param {?Boolean} [options.nsfw] - If the channel is age gated.
     * @param {?String} [options.parentID] - The id of the parent category channel.
     * @param {?RawOverwrite[]} [options.permissionOverwrites] - [All Guild] Channel or category specific permissions
     * @param {?Number} [options.position] - The position of the channel in the channel list.
     * @param {String} [options.reason] - The reason to be displayed in the audit log.
     * @param {?String} [options.rtcRegion] - The voice region id of the channel, null for automatic.
     * @param {?Number} [options.userLimit] - The maximum amount of users in the channel. `0` is unlimited, values range 1-99.
     * @param {?VideoQualityModes} [options.videoQualityMode] - The [video quality mode](https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes) of the channel.
     * @returns {Promise<VoiceChannel>}
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
     * @returns {Promise<Message<VoiceChannel>>}
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
     * Get a message in this channel.
     *
     * @param {String} messageID - The id of the message to get.
     * @returns {Promise<Message<VoiceChannel>>}
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
     * @returns {Promise<Message<VoiceChannel>[]>}
     */
    async getMessages(options) {
        return this._client.rest.channels.getMessages(this.id, options);
    }
    /**
     * Get the pinned messages in this channel.
     *
     * @returns {Promise<Message<VoiceChannel>[]>}
     */
    async getPinnedMessages() {
        return this._client.rest.channels.getPinnedMessages(this.id);
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
     * Join this voice channel.
     *
     * @param {Object} [options]
     * @param {Boolean} [options.selfDeaf] - If the client should join deafened.
     * @param {Boolean} [options.selfMute] - If the client should join muted.
     * @returns {Promise<void>}
     */
    async join(options) {
        return this._client.joinVoiceChannel(this.id, options);
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
    toJSON() {
        return {
            ...super.toJSON(),
            bitrate: this.bitrate,
            messages: this.messages.map(message => message.id),
            nsfw: this.nsfw,
            permissionOverwrites: this.permissionOverwrites.map(overwrite => overwrite.toJSON()),
            position: this.position,
            rtcRegion: this.rtcRegion,
            topic: this.topic,
            type: this.type,
            videoQualityMode: this.videoQualityMode,
            voiceMembers: this.voiceMembers.map(member => member.id)
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
exports.default = VoiceChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVm9pY2VDaGFubmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvVm9pY2VDaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0VBQTBDO0FBQzFDLGdGQUF3RDtBQUN4RCx3REFBZ0M7QUFHaEMsc0RBQThCO0FBSTlCLG9FQUE0QztBQW1CNUMsd0NBQXdDO0FBQ3hDLE1BQXFCLFlBQWEsU0FBUSxzQkFBWTtJQUNyRCx3Q0FBd0M7SUFDeEMsT0FBTyxDQUFTO0lBQ2hCLHVMQUF1TDtJQUN2TCxXQUFXLENBQTRCO0lBQ3ZDLDJDQUEyQztJQUMzQyxRQUFRLENBQTBDO0lBQ2xELG9DQUFvQztJQUNwQyxJQUFJLENBQVU7SUFFZCxpREFBaUQ7SUFDakQsb0JBQW9CLENBQXdEO0lBQzVFLG1EQUFtRDtJQUNuRCxRQUFRLENBQVM7SUFDakIsc0VBQXNFO0lBQ3RFLFNBQVMsQ0FBZ0I7SUFDekIsZ0NBQWdDO0lBQ2hDLEtBQUssQ0FBZ0I7SUFFckIsMElBQTBJO0lBQzFJLGdCQUFnQixDQUFvQjtJQUNwQyxZQUFZLENBQTJEO0lBQ3ZFLFlBQVksSUFBcUIsRUFBRSxNQUFjO1FBQ2hELEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLG9CQUFVLENBQUMsaUJBQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxvQkFBVSxDQUFDLDZCQUFtQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxvQkFBVSxDQUFDLGdCQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBRVMsTUFB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