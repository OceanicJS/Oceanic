import ThreadChannel from "./ThreadChannel";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { EditPrivateThreadChannelOptions, PrivateThreadmetadata, RawPrivateThreadChannel } from "../types/channels";
import type { JSONPrivateThreadChannel } from "../types/json";
/** Represents a guild thread channel. */
export default class PrivateThreadChannel extends ThreadChannel<PrivateThreadChannel> {
    threadMetadata: PrivateThreadmetadata;
    type: ChannelTypes.PRIVATE_THREAD;
    constructor(data: RawPrivateThreadChannel, client: Client);
    /**
     * Edit this channel.
     * @param options - The options to edit the channel with.
     */
    edit(options: EditPrivateThreadChannelOptions): Promise<this>;
    toJSON(): JSONPrivateThreadChannel;
}
