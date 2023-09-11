/** @module MediaChannel */
import ThreadOnlyChannel from "./ThreadOnlyChannel.js";
import type Client from "../Client.js";
import type { ChannelTypes } from "../Constants.js";
import type { JSONMediaChannel, RawMediaChannel } from "../types/index.js";

/** Represents a media channel. */
export default class MediaChannel extends ThreadOnlyChannel {
    declare type: ChannelTypes.GUILD_MEDIA;
    constructor(data: RawMediaChannel, client: Client) {
        super(data, client);
    }

    override toJSON(): JSONMediaChannel {
        return {
            ...super.toJSON(),
            type: this.type
        };
    }
}
