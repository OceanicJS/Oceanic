import GuildChannel from "./GuildChannel";
import PermissionOverwrite from "./PermissionOverwrite";
import Message from "./Message";
import Member from "./Member";
import type CategoryChannel from "./CategoryChannel";
import Permission from "./Permission";
import type { ChannelTypes, VideoQualityModes } from "../Constants";
import { AllPermissions, Permissions } from "../Constants";
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
        this.bitrate = data.bitrate;
        this.lastMessage = data.last_message_id === null ? null : { id: data.last_message_id };
        this.messages = new Collection(Message, client);
        this.nsfw = false;
        this.permissionOverwrites = new Collection(PermissionOverwrite, client);
        this.position = data.position;
        this.rtcRegion = data.rtc_region;
        this.topic = data.topic;
        this.videoQualityMode = data.video_quality_mode;
        this.voiceMembers = new Collection(Member, client);
        this.update(data);
    }

    protected update(data: Partial<RawVoiceChannel>) {
        super.update(data);
        if (data.bitrate !== undefined) this.bitrate = data.bitrate;
        if (data.last_message_id !== undefined) this.lastMessage = data.last_message_id === null ? null : this.messages.get(data.last_message_id) || { id: data.last_message_id };
        if (data.nsfw !== undefined) this.nsfw = data.nsfw;
        if (data.position !== undefined) this.position = data.position;
        if (data.rtc_region !== undefined) this.rtcRegion = data.rtc_region;
        if (data.topic !== undefined) this.topic = data.topic;
        if (data.video_quality_mode !== undefined) this.videoQualityMode = data.video_quality_mode;
        if (data.permission_overwrites !== undefined) data.permission_overwrites.map(overwrite => this.permissionOverwrites.update(overwrite));
    }

    /**
     * Create an invite for this channel.
     * @param options The options for creating the invite.
     */
    async createInvite(options: CreateInviteOptions) {
        return this.client.rest.channels.createInvite<"withMetadata", this>(this.id, options);
    }

    /**
     * Create a message in this channel.
     * @param options The options for creating the message.
     */
    async createMessage(options: CreateMessageOptions) {
        return this.client.rest.channels.createMessage<this>(this.id, options);
    }

    /**
     * Add a reaction to a message in this channel.
     * @param messageID The ID of the message to add a reaction to.
     * @param emoji The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    async createReaction(messageID: string, emoji: string) {
        return this.client.rest.channels.createReaction(this.id, messageID, emoji);
    }

    /**
     * Delete a message in this channel.
     * @param messageID The ID of the message to delete.
     * @param reason The reason for deleting the message.
     */
    async deleteMessage(messageID: string, reason?: string) {
        return this.client.rest.channels.deleteMessage(this.id, messageID, reason);
    }

    /**
     * Bulk delete messages in this channel.
     * @param messageIDs The ids of the messages to delete. Between 2 and 100 messages, any dupliates or messages older than two weeks will cause an error.
     * @param reason The reason for deleting the messages.
     */
    async deleteMessages(messageIDs: Array<string>, reason?: string) {
        return this.client.rest.channels.deleteMessages(this.id, messageIDs, reason);
    }

    /**
     * Delete a permission overwrite on this channel.
     * @param overwriteID The ID of the permission overwrite to delete.
     * @param reason The reason for deleting the permission overwrite.
     */
    async deletePermission(overwriteID: string, reason?: string) {
        return this.client.rest.channels.deletePermission(this.id, overwriteID, reason);
    }

    /**
     * Remove a reaction from a message in this channel.
     * @param messageID The ID of the message to remove a reaction from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param user The user to remove the reaction from, `@me` for the current user (default).
     */
    async deleteReaction(messageID: string, emoji: string, user = "@me") {
        return this.client.rest.channels.deleteReaction(this.id, messageID, emoji, user);
    }

    /**
     * Remove all, or a specific emoji's reactions from a message in this channel.
     * @param messageID The ID of the message to remove reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     */
    async deleteReactions(messageID: string, emoji?: string) {
        return this.client.rest.channels.deleteReactions(this.id, messageID, emoji);
    }

    /**
     * Edit this channel.
     * @param options The options for editing the channel.
     */
    async edit(options: EditVoiceChannelOptions) {
        return this.client.rest.channels.edit<this>(this.id, options);
    }

    /**
     * Edit a message in this channel.
     * @param messageID The ID of the message to edit.
     * @param options The options for editing the message.
     */
    async editMessage(messageID: string, options: EditMessageOptions) {
        return this.client.rest.channels.editMessage<this>(this.id, messageID, options);
    }

    /**
     * Edit a permission overwrite on this channel.
     * @param overwriteID The ID of the permission overwrite to edit.
     * @param options The options for editing the permission overwrite.
     */
    async editPermission(overwriteID: string, options: EditPermissionOptions) {
        return this.client.rest.channels.editPermission(this.id, overwriteID, options);
    }

    /**
     * Get the invites of this channel.
     */
    async getInvites() {
        return this.client.rest.channels.getInvites<this>(this.id);
    }

    /**
     * Get a message in this channel.
     * @param messageID The ID of the message to get.
     */
    async getMessage(messageID: string) {
        return this.client.rest.channels.getMessage<this>(this.id, messageID);
    }

    /**
     * Get messages in this channel.
     * @param options The options for getting the messages. All options are mutually exclusive.
     */
    async getMessages(options?: GetChannelMessagesOptions) {
        return this.client.rest.channels.getMessages<this>(this.id, options);
    }

    /**
     * Get the pinned messages in this channel.
     */
    async getPinnedMessages() {
        return this.client.rest.channels.getPinnedMessages<this>(this.id);
    }

    /**
     * Get the users who reacted with a specific emoji on a message in this channel.
     * @param messageID The ID of the message to get reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options The options for getting the reactions.
     */
    async getReactions(messageID: string, emoji: string, options?: GetReactionsOptions) {
        return this.client.rest.channels.getReactions(this.id, messageID, emoji, options);
    }

    /**
     * Join this voice channel.
     * @param options The options for joining the voice channel.
     */
    async join(options?: UpdateVoiceStateOptions) {
        return this.client.joinVoiceChannel(this.id, options);
    }

    /**
     * Get the permissions of a member.
     * @param member The member to get the permissions of.  If providing an ID, the member must be cached.
     */
    permissionsOf(member: string | Member) {
        if (typeof member === "string") member = this.guild.members.get(member)!;
        if (!member) throw new Error("Member not found");
        let permission = this.guild.permissionsOf(member).allow;
        if (permission & Permissions.ADMINISTRATOR) return new Permission(AllPermissions);
        let overwrite = this.permissionOverwrites.get(this.guildID);
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
     * @param messageID The ID of the message to pin.
     * @param reason The reason for pinning the message.
     */
    async pinMessage(messageID: string, reason?: string) {
        return this.client.rest.channels.pinMessage(this.id, messageID, reason);
    }

    /**
     * Show a typing indicator in this channel. How long users see this varies from client to client.
     */
    async sendTyping() {
        return this.client.rest.channels.sendTyping(this.id);
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
     * @param messageID The ID of the message to unpin.
     * @param reason The reason for unpinning the message.
     */
    async unpinMessage(messageID: string, reason?: string) {
        return this.client.rest.channels.unpinMessage(this.id, messageID, reason);
    }
}
