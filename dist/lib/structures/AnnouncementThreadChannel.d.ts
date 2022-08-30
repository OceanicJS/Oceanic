import ThreadChannel from "./ThreadChannel";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { EditPublicThreadChannelOptions, RawAnnouncementThreadChannel, ThreadMetadata } from "../types/channels";
import type { JSONAnnouncementThreadChannel } from "../types/json";
/** Represents a guild thread channel. */
export default class AnnouncementThreadChannel extends ThreadChannel<AnnouncementThreadChannel> {
    threadMetadata: ThreadMetadata;
    type: ChannelTypes.ANNOUNCEMENT_THREAD;
    constructor(data: RawAnnouncementThreadChannel, client: Client);
    /**
     * Edit this channel.
     * @param options The options for editing the channel.
     */
    edit(options: EditPublicThreadChannelOptions): Promise<this>;
    toJSON(): JSONAnnouncementThreadChannel;
}
