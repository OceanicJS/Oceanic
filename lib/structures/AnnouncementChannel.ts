/** @module AnnouncementChannel */
import TextableChannel from "./TextableChannel";
import type TextChannel from "./TextChannel";
import type CategoryChannel from "./CategoryChannel";
import AnnouncementThreadChannel from "./AnnouncementThreadChannel";
import type Message from "./Message";
import { ChannelTypes, type ThreadAutoArchiveDuration } from "../Constants";
import type Client from "../Client";
import type { EditGuildChannelOptions, FollowedChannel, RawAnnouncementChannel, RawAnnouncementThreadChannel } from "../types/channels";
import type { JSONAnnouncementChannel } from "../types/json";
import TypedCollection from "../util/TypedCollection";

/** Represents a guild announcement channel. */
export default class AnnouncementChannel extends TextableChannel<AnnouncementChannel> {
    /** The default auto archive duration for threads created in this channel. */
    defaultAutoArchiveDuration: ThreadAutoArchiveDuration;
    /** The amount of seconds between non-moderators sending messages. Always zero in announcement channels. */
    declare rateLimitPerUser: 0;
    /** The threads in this channel. */
    threads: TypedCollection<string, RawAnnouncementThreadChannel, AnnouncementThreadChannel>;
    declare type: ChannelTypes.GUILD_ANNOUNCEMENT;
    constructor(data: RawAnnouncementChannel, client: Client) {
        super(data, client);
        this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        this.threads = new TypedCollection(AnnouncementThreadChannel, client);
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
     * Edit this channel.
     * @param options The options for editing the channel.
     */
    override async edit(options: EditGuildChannelOptions): Promise<this> {
        return this.client.rest.channels.edit<this>(this.id, options);
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
            defaultAutoArchiveDuration: this.defaultAutoArchiveDuration,
            rateLimitPerUser:           0,
            threads:                    this.threads.map(thread => thread.id),
            type:                       this.type
        };
    }
}
