import TextableChannel from "./TextableChannel";
import type AnnouncementChannel from "./AnnouncementChannel";
import { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { EditTextChannelOptions, RawTextChannel } from "../types/channels";
import type { JSONTextChannel } from "../types/json";

/** Represents a guild text channel. */
export default class TextChannel extends TextableChannel<TextChannel> {
    declare type: ChannelTypes.GUILD_TEXT;
    constructor(data: RawTextChannel, client: Client) {
        super(data, client);
    }

    /**
     * Convert this text channel to a announcement channel.
     */
    async convert() {
        return this.edit({ type: ChannelTypes.GUILD_ANNOUNCEMENT })  as unknown as AnnouncementChannel;
    }

    /**
     * Edit this channel.
     * @param options - The options for editing the channel
     */
    override async edit(options: EditTextChannelOptions) {
        return this._client.rest.channels.edit<this>(this.id, options);
    }

    /**
     * Follow an announcement channel to this channel.
     * @param webhookChannelID - The ID of the channel to follow the announcement channel to.
     */
    async followAnnouncement(webhookChannelID: string) {
        return this._client.rest.channels.followAnnouncement(this.id, webhookChannelID);
    }

    toJSON(): JSONTextChannel {
        return {
            ...super.toJSON(),
            type: this.type
        };
    }
}
