import TextableChannel from "./TextableChannel";
import type AnnouncementChannel from "./AnnouncementChannel";
import type PublicThreadChannel from "./PublicThreadChannel";
import type PrivateThreadChannel from "./PrivateThreadChannel";
import ThreadChannel from "./ThreadChannel";
import { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { EditTextChannelOptions, RawPrivateThreadChannel, RawPublicThreadChannel, RawTextChannel } from "../types/channels";
import type { JSONTextChannel } from "../types/json";
import TypedCollection from "../util/TypedCollection";

/** Represents a guild text channel. */
export default class TextChannel extends TextableChannel<TextChannel> {
    /** The threads in this channel. */
    threads: TypedCollection<string, RawPublicThreadChannel | RawPrivateThreadChannel, PublicThreadChannel | PrivateThreadChannel>;
    declare type: ChannelTypes.GUILD_TEXT;
    constructor(data: RawTextChannel, client: Client) {
        super(data, client);
        this.threads = new TypedCollection(ThreadChannel, client) as TypedCollection<string, RawPublicThreadChannel | RawPrivateThreadChannel, PublicThreadChannel | PrivateThreadChannel>;
    }

    /**
     * Convert this text channel to a announcement channel.
     */
    async convert() {
        return this.edit({ type: ChannelTypes.GUILD_ANNOUNCEMENT })  as unknown as AnnouncementChannel;
    }

    /**
     * Edit this channel.
     * @param options The options for editing the channel
     */
    override async edit(options: EditTextChannelOptions) {
        return this.client.rest.channels.edit<this>(this.id, options);
    }

    /**
     * Follow an announcement channel to this channel.
     * @param webhookChannelID The ID of the channel to follow the announcement channel to.
     */
    async followAnnouncement(webhookChannelID: string) {
        return this.client.rest.channels.followAnnouncement(this.id, webhookChannelID);
    }

    toJSON(): JSONTextChannel {
        return {
            ...super.toJSON(),
            threads: this.threads.map(thread => thread.id),
            type:    this.type
        };
    }
}
