/** @module AnnouncementChannel */
import type TextChannel from "./TextChannel.js";
import type CategoryChannel from "./CategoryChannel.js";
import type AnnouncementThreadChannel from "./AnnouncementThreadChannel.js";
import type Message from "./Message.js";
import ThreadableChannel from "./ThreadableChannel.js";
import { ChannelTypes } from "../Constants.js";
import type Client from "../Client.js";
import type { FollowedChannel, RawAnnouncementChannel } from "../types/channels.js";
import type { JSONAnnouncementChannel } from "../types/json.js";

/**
 * Represents a guild announcement channel.
 * @mergeTarget AnnouncementChannel
 */
export default class AnnouncementChannel extends ThreadableChannel<AnnouncementChannel, AnnouncementThreadChannel> {
    /** The amount of seconds between non-moderators sending messages. Always zero in announcement channels. */
    declare rateLimitPerUser: 0;
    declare type: ChannelTypes.GUILD_ANNOUNCEMENT;
    constructor(data: RawAnnouncementChannel, client: Client) {
        super(data, client);
        this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
    }

    override get parent(): CategoryChannel | null | undefined {
        return super.parent;
    }

    /**
     * Convert this announcement channel to a text channel.
     */
    async convert(): Promise<TextChannel> {
        return this.client.rest.channels.edit<TextChannel>(this.id, { type: ChannelTypes.GUILD_TEXT });
    }

    /**
     * Crosspost a message in this channel.
     * @param messageID The ID of the message to crosspost.
     */
    async crosspostMessage(messageID: string): Promise<Message<this>> {
        return this.client.rest.channels.crosspostMessage<this>(this.id, messageID);
    }

    /**
     * Follow this announcement channel.
     * @param webhookChannelID The ID of the channel crossposted messages should be sent to. The client must have the `MANAGE_WEBHOOKS` permission in this channel.
     */
    async follow(webhookChannelID: string): Promise<FollowedChannel> {
        return this.client.rest.channels.followAnnouncement(this.id, webhookChannelID);
    }

    override toJSON(): JSONAnnouncementChannel {
        return {
            ...super.toJSON(),
            rateLimitPerUser: 0,
            type:             this.type
        };
    }
}
