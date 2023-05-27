/** @module AnnouncementChannel */
import type TextChannel from "./TextChannel";
import type CategoryChannel from "./CategoryChannel";
import AnnouncementThreadChannel from "./AnnouncementThreadChannel";
import type Message from "./Message";
import ThreadableChannel from "./ThreadableChannel";
import { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { FollowedChannel, RawAnnouncementChannel } from "../types/channels";
import type { JSONAnnouncementChannel } from "../types/json";
import TypedCollection from "../util/TypedCollection";

/** Represents a guild announcement channel. */
export default class AnnouncementChannel extends ThreadableChannel<AnnouncementChannel, AnnouncementThreadChannel> {
    /** The amount of seconds between non-moderators sending messages. Always zero in announcement channels. */
    declare rateLimitPerUser: 0;
    declare type: ChannelTypes.GUILD_ANNOUNCEMENT;
    constructor(data: RawAnnouncementChannel, client: Client) {
        super(data, client, AnnouncementThreadChannel);
        this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        this.threads = new TypedCollection(AnnouncementThreadChannel, client, this.client.util._getLimit("channelThreads", this.id));
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
