/** @module TextChannel */
import type AnnouncementChannel from "./AnnouncementChannel";
import type PublicThreadChannel from "./PublicThreadChannel";
import type PrivateThreadChannel from "./PrivateThreadChannel";
import ThreadChannel from "./ThreadChannel";
import ThreadableChannel from "./ThreadableChannel";
import { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { ArchivedThreads, FollowedChannel, GetArchivedThreadsOptions, RawTextChannel } from "../types/channels";
import type { JSONTextChannel } from "../types/json";

/** Represents a guild text channel. */
export default class TextChannel extends ThreadableChannel<TextChannel, PublicThreadChannel | PrivateThreadChannel>  {
    declare type: ChannelTypes.GUILD_TEXT;
    constructor(data: RawTextChannel, client: Client) {
        super(data, client, ThreadChannel);
    }

    /**
     * Convert this text channel to a announcement channel.
     */
    async convert(): Promise<AnnouncementChannel> {
        return this.client.rest.channels.edit<AnnouncementChannel>(this.id, { type: ChannelTypes.GUILD_ANNOUNCEMENT });
    }

    /**
     * Follow an announcement channel to this channel.
     * @param webhookChannelID The ID of the channel to follow the announcement channel to.
     */
    async followAnnouncement(webhookChannelID: string): Promise<FollowedChannel> {
        return this.client.rest.channels.followAnnouncement(this.id, webhookChannelID);
    }

    /**
     * Get the private archived threads the current user has joined in this channel.
     * @param options The options for getting the joined private archived threads.
     */
    async getJoinedPrivateArchivedThreads(options?: GetArchivedThreadsOptions): Promise<ArchivedThreads<PrivateThreadChannel>> {
        return this.client.rest.channels.getJoinedPrivateArchivedThreads(this.id, options);
    }

    /**
     * Get the private archived threads in this channel.
     * @param options The options for getting the private archived threads.
     */
    async getPrivateArchivedThreads(options?: GetArchivedThreadsOptions): Promise<ArchivedThreads<PrivateThreadChannel>> {
        return this.client.rest.channels.getPrivateArchivedThreads(this.id, options);
    }

    override toJSON(): JSONTextChannel {
        return {
            ...super.toJSON(),
            type: this.type
        };
    }
}
