import ThreadChannel from "./ThreadChannel";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { EditPublicThreadChannelOptions, RawPublicThreadChannel, ThreadMetadata } from "../types/channels";
import type { JSONPublicThreadChannel } from "../types/json";
/** Represents a guild thread channel. */
export default class PublicThreadChannel extends ThreadChannel<PublicThreadChannel> {
    threadMetadata: ThreadMetadata;
    type: ChannelTypes.PUBLIC_THREAD;
    constructor(data: RawPublicThreadChannel, client: Client);
    /**
     * Edit this channel.
     * @param options The options to edit the channel with.
     */
    edit(options: EditPublicThreadChannelOptions): Promise<this>;
    toJSON(): JSONPublicThreadChannel;
}
