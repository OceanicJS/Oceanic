import GuildChannel from "./GuildChannel";
import PermissionOverwrite from "./PermissionOverwrite";
import Message from "./Message";
import Invite from "./Invite";
import User from "./User";
import Member from "./Member";
import type CategoryChannel from "./CategoryChannel";
import Permission from "./Permission";
import type { ChannelTypes, VideoQualityModes } from "../Constants";
import { AllPermissions, InviteTargetTypes, OverwriteTypes, Permissions } from "../Constants";
import type Client from "../Client";
import Collection from "../util/Collection";
import type {
    CreateInviteOptions,
    CreateMessageOptions,
    EditMessageOptions,
    EditPermissionOptions,
    EditVoiceChannelOptions,
    GetChannelMessagesOptions,
    GetReactionsOptions,
    RawMessage,
    RawOverwrite,
    RawVoiceChannel
} from "../types/channels";
import { File } from "../types/request-handler";
import type { RawMember } from "../types/guilds";
import type { JSONVoiceChannel } from "../types/json";
import type { UpdateVoiceStateOptions } from "../types/gateway";
import type { Uncached } from "../types/shared";

/** Represents a guild voice channel. */
export default class VoiceChannel extends GuildChannel {
    /** The bitrate of the voice channel. */
    bitrate: number;
    /** The last message sent in this channel. This can be a partial object with only an `id` property. This will only be present if a message has been sent within the current session. */
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
    /** The id of the voice region of the channel, `null` is automatic. */
    rtcRegion: string | null;
    /** The topic of the channel. */
    topic: string | null;
    declare type: ChannelTypes.GUILD_VOICE;
    /** The [video quality mode](https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes) of this channel. */
    videoQualityMode: VideoQualityModes;
    voiceMembers: Collection<string, RawMember, Member, [guildID: string]>;
    constructor(data: RawVoiceChannel, client: Client) {
        super(data, client);
        this.lastMessage = null;
        this.messages = new Collection(Message, client);
        this.permissionOverwrites = new Collection(PermissionOverwrite, client);
        this.voiceMembers = new Collection(Member, client);
        this.update(data);
    }

    protected update(data: Partial<RawVoiceChannel>) {
        super.update(data);
        if (data.bitrate !== undefined) this.bitrate = data.bitrate;
        if (data.nsfw !== undefined) this.nsfw = data.nsfw;
        if (data.position !== undefined) this.position = data.position;
        if (data.rtc_region !== undefined) this.rtcRegion = data.rtc_region;
        if (data.topic !== undefined) this.topic = data.topic;
        if (data.video_quality_mode !== undefined) this.videoQualityMode = data.video_quality_mode;
        if (data.permission_overwrites !== undefined) data.permission_overwrites.map(overwrite => this.permissionOverwrites.update(overwrite));
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
    async createInvite(options: CreateInviteOptions) {
        return this._client.rest.channels.createInvite<"withMetadata", this>(this.id, options);
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
    async createMessage(options: CreateMessageOptions) {
        return this._client.rest.channels.createMessage<this>(this.id, options);
    }

    /**
     * Add a reaction to a message in this channel.
     *
     * @param {String} messageID - The id of the message to add a reaction to.
     * @param {String} emoji - The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @returns {Promise<void>}
     */
    async createReaction(messageID: string, emoji: string) {
        return this._client.rest.channels.createReaction(this.id, messageID, emoji);
    }

    /**
     * Delete a message in this channel.
     *
     * @param {String} messageID - The id of the message to delete.
     * @param {String} [reason] - The reason for deleting the message.
     * @returns {Promise<void>}
     */
    async deleteMessage(messageID: string, reason?: string) {
        return this._client.rest.channels.deleteMessage(this.id, messageID, reason);
    }

    /**
     * Bulk delete messages in this channel.
     *
     * @param {String[]} messageIDs - The ids of the messages to delete. Between 2 and 100 messages, any dupliates or messages older than two weeks will cause an error.
     * @param {String} [reason] - The reason for deleting the messages.
     * @returns {Promise<void>}
     */
    async deleteMessages(messageIDs: Array<string>, reason?: string) {
        return this._client.rest.channels.deleteMessages(this.id, messageIDs, reason);
    }

    /**
     * Delete a permission overwrite on this channel.
     *
     * @param {String} overwriteID - The id of the permission overwrite to delete.
     * @param {String} reason - The reason for deleting the permission overwrite.
     * @returns {Promise<void>}
     */
    async deletePermission(overwriteID: string, reason?: string) {
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
    async deleteReaction(messageID: string, emoji: string, user = "@me") {
        return this._client.rest.channels.deleteReaction(this.id, messageID, emoji, user);
    }

    /**
     * Remove all, or a specific emoji's reactions from a message in this channel.
     *
     * @param {String} messageID - The id of the message to remove reactions from.
     * @param {String} [emoji] - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     * @returns {Promise<void>}
     */
    async deleteReactions(messageID: string, emoji?: string) {
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
    async edit(options: EditVoiceChannelOptions) {
        return this._client.rest.channels.edit<this>(this.id, options);
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
    async editMessage(messageID: string, options: EditMessageOptions) {
        return this._client.rest.channels.editMessage<this>(this.id, messageID, options);
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
    async editPermission(overwriteID: string, options: EditPermissionOptions) {
        return this._client.rest.channels.editPermission(this.id, overwriteID, options);
    }

    /**
     * Get the invites of this channel.
     *
     * @returns {Promise<Invite[]>} - An array of invites with metadata.
     */
    async getInvites() {
        return this._client.rest.channels.getInvites<this>(this.id);
    }

    /**
     * Get a message in this channel.
     *
     * @param {String} messageID - The id of the message to get.
     * @returns {Promise<Message<VoiceChannel>>}
     */
    async getMessage(messageID: string) {
        return this._client.rest.channels.getMessage<this>(this.id, messageID);
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
    async getMessages(options?: GetChannelMessagesOptions) {
        return this._client.rest.channels.getMessages<this>(this.id, options);
    }

    /**
     * Get the pinned messages in this channel.
     *
     * @returns {Promise<Message<VoiceChannel>[]>}
     */
    async getPinnedMessages() {
        return this._client.rest.channels.getPinnedMessages<this>(this.id);
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
    async getReactions(messageID: string, emoji: string, options?: GetReactionsOptions) {
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
    async join(options?: UpdateVoiceStateOptions) {
        return this._client.joinVoiceChannel(this.id, options);
    }

    /**
     * Get the permissions of a member.
     *
     * @param {(String | Member)} member - The member to get the permissions of.  If providing an id, the member must be cached.
     * @returns {Permission}
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
     *
     * @param {String} messageID - The id of the message to pin.
     * @param {String} [reason] - The reason for pinning the message.
     * @returns {Promise<void>}
     */
    async pinMessage(messageID: string, reason?: string) {
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

    override toJSON(): JSONVoiceChannel {
        return {
            ...super.toJSON(),
            bitrate:              this.bitrate,
            messages:             this.messages.map(message => message.id),
            nsfw:                 this.nsfw,
            permissionOverwrites: this.permissionOverwrites.map(overwrite => overwrite.toJSON()),
            position:             this.position,
            rtcRegion:            this.rtcRegion,
            topic:                this.topic,
            type:                 this.type,
            videoQualityMode:     this.videoQualityMode,
            voiceMembers:         this.voiceMembers.map(member => member.id)
        };
    }

    /**
     * Unpin a message in this channel.
     *
     * @param {String} messageID - The id of the message to unpin.
     * @param {String} [reason] - The reason for unpinning the message.
     * @returns {Promise<void>}
     */
    async unpinMessage(messageID: string, reason?: string) {
        return this._client.rest.channels.unpinMessage(this.id, messageID, reason);
    }
}
