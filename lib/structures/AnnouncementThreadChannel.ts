/** @module AnnouncementThreadChannel */
import ThreadChannel from "./ThreadChannel";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { GetThreadMembersOptions, RawAnnouncementThreadChannel, ThreadMember, ThreadMetadata } from "../types/channels";
import type { JSONAnnouncementThreadChannel } from "../types/json";

/** Represents a public thread channel in an announcement channel. */
export default class AnnouncementThreadChannel extends ThreadChannel<AnnouncementThreadChannel> {
    declare threadMetadata: ThreadMetadata;
    declare type: ChannelTypes.ANNOUNCEMENT_THREAD;
    constructor(data: RawAnnouncementThreadChannel, client: Client) {
        super(data, client);
    }

    /**
     * Get the members of this thread.
     * @param options The options for getting the thread members.
     */
    async getThreadMembers(options?: GetThreadMembersOptions): Promise<Array<ThreadMember>> {
        return this.client.rest.channels.getThreadMembers(this.id, options);
    }

    override toJSON(): JSONAnnouncementThreadChannel {
        return {
            ...super.toJSON(),
            threadMetadata: this.threadMetadata,
            type:           this.type
        };
    }
}
