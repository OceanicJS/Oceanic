import ThreadChannel from "./ThreadChannel";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { EditPublicThreadChannelOptions, RawPublicThreadChannel, ThreadMetadata } from "../types/channels";
import type { JSONPublicThreadChannel } from "../types/json";

/** Represents a guild thread channel. */
export default class PublicThreadChannel extends ThreadChannel<PublicThreadChannel> {
    declare threadMetadata: ThreadMetadata;
    declare type: ChannelTypes.PUBLIC_THREAD;
    constructor(data: RawPublicThreadChannel, client: Client) {
        super(data, client);
    }

    /**
     * Edit this channel.
     * @param options - The options to edit the channel with.
     */
    override async edit(options: EditPublicThreadChannelOptions) {
        return this._client.rest.channels.edit<this>(this.id, options);
    }

    toJSON(): JSONPublicThreadChannel {
        return {
            ...super.toJSON(),
            threadMetadata: this.threadMetadata,
            type:           this.type
        };
    }
}
