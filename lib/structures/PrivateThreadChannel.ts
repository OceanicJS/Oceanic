/** @module PrivateThreadChannel */
import ThreadChannel from "./ThreadChannel";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { EditPrivateThreadChannelOptions, PrivateThreadMetadata, RawPrivateThreadChannel } from "../types/channels";
import type { JSONPrivateThreadChannel } from "../types/json";

/** Represents a private thread channel.. */
export default class PrivateThreadChannel extends ThreadChannel<PrivateThreadChannel> {
    declare threadMetadata: PrivateThreadMetadata;
    declare type: ChannelTypes.PRIVATE_THREAD;
    constructor(data: RawPrivateThreadChannel, client: Client) {
        super(data, client);
    }

    /**
     * Edit this channel.
     * @param options The options to edit the channel with.
     */
    override async edit(options: EditPrivateThreadChannelOptions): Promise<this> {
        return this.client.rest.channels.edit<this>(this.id, options);
    }

    override toJSON(): JSONPrivateThreadChannel {
        return {
            ...super.toJSON(),
            threadMetadata: this.threadMetadata,
            type:           this.type
        };
    }
}
