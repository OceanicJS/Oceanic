/** @module AnnouncementThreadChannel */
import ThreadChannel from "./ThreadChannel";
import type * as Types from "../types/namespaced";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";

/** Represents a public thread channel in an announcement channel. */
export default class AnnouncementThreadChannel extends ThreadChannel<AnnouncementThreadChannel> {
    declare threadMetadata: Types.Channels.ThreadMetadata;
    declare type: ChannelTypes.ANNOUNCEMENT_THREAD;
    constructor(data: Types.Channels.RawAnnouncementThreadChannel, client: Client) {
        super(data, client);
    }

    /**
     * Get the members of this thread.
     * @param options The options for getting the thread members.
     */
    async getThreadMembers(options?: Types.Channels.GetThreadMembersOptions): Promise<Array<Types.Channels.ThreadMember>> {
        return this.client.rest.channels.getThreadMembers(this.id, options);
    }

    override toJSON(): Types.JSON.JSONAnnouncementThreadChannel {
        return {
            ...super.toJSON(),
            threadMetadata: this.threadMetadata,
            type:           this.type
        };
    }
}
