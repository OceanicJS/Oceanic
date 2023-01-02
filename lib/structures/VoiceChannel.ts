/** @module VoiceChannel */
import GuildChannel from "./GuildChannel";
import PermissionOverwrite from "./PermissionOverwrite";
import Message from "./Message";
import Member from "./Member";
import type CategoryChannel from "./CategoryChannel";
import Permission from "./Permission";
import type Invite from "./Invite";
import type User from "./User";
import type Webhook from "./Webhook";
import type { JoinVoiceChannelOptions } from "../types/voice";
import { AllPermissions, Permissions, type ChannelTypes, type VideoQualityModes } from "../Constants";
import type Client from "../Client";
import TypedCollection from "../util/TypedCollection";
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
    RawVoiceChannel,
    PurgeOptions
} from "../types/channels";
import type { RawMember } from "../types/guilds";
import type { JSONVoiceChannel } from "../types/json";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { VoiceConnection } from "@discordjs/voice";

/** Represents a guild voice channel. */
export default class VoiceChannel extends GuildChannel {
    /** The bitrate of the voice channel. */
    bitrate: number;
    /** The last message sent in this channel. This will only be present if a message has been sent within the current session. */
    lastMessage?: Message<this> | null;
    /** The ID of last message sent in this channel. */
    lastMessageID: string | null;
    /** The cached messages in this channel. */
    messages: TypedCollection<string, RawMessage, Message<this>>;
    /** If this channel is age gated. */
    nsfw: boolean;
    /** The permission overwrites of this channel. */
    permissionOverwrites: TypedCollection<string, RawOverwrite, PermissionOverwrite>;
    /** The position of this channel on the sidebar. */
    position: number;
    /** The id of the voice region of the channel, `null` is automatic. */
    rtcRegion: string | null;
    /** The topic of the channel. */
    topic: string | null;
    declare type: ChannelTypes.GUILD_VOICE;
    /** The maximum number of members in this voice channel. `0` is unlimited. */
    userLimit: number;
    /** The [video quality mode](https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes) of this channel. */
    videoQualityMode: VideoQualityModes;
    voiceMembers: TypedCollection<string, RawMember, Member, [guildID: string]>;
    constructor(data: RawVoiceChannel, client: Client) {
        super(data, client);
        this.bitrate = data.bitrate;
        this.lastMessageID = data.last_message_id;
        this.messages = new TypedCollection(Message<this>, client, client.options.collectionLimits.messages);
        this.nsfw = false;
        this.permissionOverwrites = new TypedCollection(PermissionOverwrite, client);
        this.position = data.position;
        this.rtcRegion = data.rtc_region;
        this.topic = data.topic;
        this.videoQualityMode = data.video_quality_mode;
        this.voiceMembers = new TypedCollection(Member, client);
        this.userLimit = data.user_limit;
        this.update(data);
    }

    protected override update(data: Partial<RawVoiceChannel>): void {
        super.update(data);
        if (data.bitrate !== undefined) {
            this.bitrate = data.bitrate;
        }
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
        if (data.rtc_region !== undefined) {
            this.rtcRegion = data.rtc_region;
        }
        if (data.topic !== undefined) {
            this.topic = data.topic;
        }
        if (data.video_quality_mode !== undefined) {
            this.videoQualityMode = data.video_quality_mode;
        }
        if (data.permission_overwrites !== undefined) {
            data.permission_overwrites.map(overwrite => this.permissionOverwrites.update(overwrite));
        }
    }

    override get parent(): CategoryChannel | null | undefined {
        return super.parent as CategoryChannel | null | undefined;
    }

    /**
     * Create an invite for this channel.
     * @param options The options for creating the invite.
     */
    async createInvite(options: CreateInviteOptions): Promise<Invite<"withMetadata", this>> {
        return this.client.rest.channels.createInvite<"withMetadata", this>(this.id, options);
    }

    /**
     * Create a message in this channel.
     * @param options The options for creating the message.
     */
    async createMessage(options: CreateMessageOptions): Promise<Message<this>> {
        return this.client.rest.channels.createMessage<this>(this.id, options);
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
     * Edit this channel.
     * @param options The options for editing the channel.
     */
    override async edit(options: EditVoiceChannelOptions): Promise<this> {
        return this.client.rest.channels.edit<this>(this.id, options);
    }

    /**
     * Edit a message in this channel.
     * @param messageID The ID of the message to edit.
     * @param options The options for editing the message.
     */
    async editMessage(messageID: string, options: EditMessageOptions): Promise<Message<this>> {
        return this.client.rest.channels.editMessage<this>(this.id, messageID, options);
    }

    /**
     * Edit a permission overwrite on this channel.
     * @param overwriteID The ID of the permission overwrite to edit.
     * @param options The options for editing the permission overwrite.
     */
    async editPermission(overwriteID: string, options: EditPermissionOptions): Promise<void> {
        return this.client.rest.channels.editPermission(this.id, overwriteID, options);
    }

    /**
     * Get the invites of this channel.
     */
    async getInvites(): Promise<Array<Invite<"withMetadata", this>>> {
        return this.client.rest.channels.getInvites<this>(this.id);
    }

    /**
     * Get a message in this channel.
     * @param messageID The ID of the message to get.
     */
    async getMessage(messageID: string): Promise<Message<this>> {
        return this.client.rest.channels.getMessage<this>(this.id, messageID);
    }

    /**
     * Get messages in this channel.
     * @param options The options for getting the messages. `before`, `after`, and `around `All are mutually exclusive.
     */
    async getMessages(options?: GetChannelMessagesOptions): Promise<Array<Message<this>>> {
        return this.client.rest.channels.getMessages<this>(this.id, options);
    }

    /**
     * Get the pinned messages in this channel.
     */
    async getPinnedMessages(): Promise<Array<Message<this>>> {
        return this.client.rest.channels.getPinnedMessages<this>(this.id);
    }

    /**
     * Get the users who reacted with a specific emoji on a message in this channel.
     * @param messageID The ID of the message to get reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options The options for getting the reactions.
     */
    async getReactions(messageID: string, emoji: string, options?: GetReactionsOptions): Promise<Array<User>>{
        return this.client.rest.channels.getReactions(this.id, messageID, emoji, options);
    }

    /**
     * Get the webhooks in this channel.
     */
    async getWebhooks(): Promise<Array<Webhook>> {
        return this.client.rest.webhooks.getForChannel(this.id);
    }

    /**
     * Join this voice channel.
     * @param options The options to join the channel with.
     */
    join(options: Omit<JoinVoiceChannelOptions, "guildID" | "channelID" | "voiceAdapterCreator">): VoiceConnection {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
        return this.client.joinVoiceChannel({
            ...options,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            voiceAdapterCreator: this.guild.voiceAdapterCreator,
            guildID:             this.guildID,
            channelID:           this.id
        });
    }

    /** Leave this voice channel. */
    leave(): void {
        return this.client.leaveVoiceChannel(this.guildID);
    }

    /**
     * Get the permissions of a member.
     * @param member The member to get the permissions of.  If providing an ID, the member must be cached.
     */
    permissionsOf(member: string | Member): Permission {
        if (typeof member === "string") {
            member = this.guild.members.get(member)!;
        }
        if (!member) {
            throw new Error(`Cannot use ${this.constructor.name}#permissionsOf with an ID without having the member cached.`);
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
    async purge(options: PurgeOptions<this>): Promise<number> {
        return this.client.rest.channels.purgeMessages(this.id, options);
    }

    /**
     * Show a typing indicator in this channel. How long users see this varies from client to client.
     */
    async sendTyping(): Promise<void> {
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
            userLimit:            this.userLimit,
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
    async unpinMessage(messageID: string, reason?: string): Promise<void> {
        return this.client.rest.channels.unpinMessage(this.id, messageID, reason);
    }
}
