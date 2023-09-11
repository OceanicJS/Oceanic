/** @module TextChannel */
import type AnnouncementChannel from "./AnnouncementChannel.js";
import type PublicThreadChannel from "./PublicThreadChannel.js";
import type PrivateThreadChannel from "./PrivateThreadChannel.js";
import ThreadableChannel from "./ThreadableChannel.js";
import { ChannelTypes } from "../Constants.js";
import type Client from "../Client.js";
import type { ArchivedThreads, FollowedChannel, GetArchivedThreadsOptions, RawTextChannel } from "../types/channels.js";
import type { JSONTextChannel } from "../types/json.js";

/** Represents a guild text channel. */
export default class TextChannel extends ThreadableChannel<TextChannel, PublicThreadChannel | PrivateThreadChannel>  {
    declare type: ChannelTypes.GUILD_TEXT;
    constructor(data: RawTextChannel, client: Client) {
        super(data, client);
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
