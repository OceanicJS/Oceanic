import ThreadChannel from "./ThreadChannel";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { EditPrivateThreadChannelOptions, PrivateThreadmetadata, RawPrivateThreadChannel } from "../types/channels";
import type { JSONPrivateThreadChannel } from "../types/json";

/** Represents a guild thread channel. */
export default class PrivateThreadChannel extends ThreadChannel<PrivateThreadChannel> {
    declare threadMetadata: PrivateThreadmetadata;
    declare type: ChannelTypes.PRIVATE_THREAD;
    constructor(data: RawPrivateThreadChannel, client: Client) {
        super(data, client);
    }

    /**
     * Edit this channel.
     * @param options The options to edit the channel with.
     */
    override async edit(options: EditPrivateThreadChannelOptions) {
        return this.client.rest.channels.edit<this>(this.id, options);
    }

    toJSON(): JSONPrivateThreadChannel {
        return {
            ...super.toJSON(),
            threadMetadata: this.threadMetadata,
            type:           this.type
        };
    }
}
