/** @module PublicThreadChannel */
import ThreadChannel from "./ThreadChannel";
import type * as Types from "../types/namespaced";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";

/** Represents a public thread channel. */
export default class PublicThreadChannel extends ThreadChannel<PublicThreadChannel> {
    /** the IDs of the set of tags that have been applied to this thread. Forum channel threads only.  */
    appliedTags: Array<string>;
    declare threadMetadata: Types.Channels.ThreadMetadata;
    declare type: ChannelTypes.PUBLIC_THREAD;
    constructor(data: Types.Channels.RawPublicThreadChannel, client: Client) {
        super(data, client);
        this.appliedTags = [];
    }

    protected override update(data: Partial<Types.Channels.RawPublicThreadChannel>): void {
        super.update(data);
        if (data.applied_tags !== undefined) {
            this.appliedTags = data.applied_tags;
        }
    }

    /**
     * Get the members of this thread.
     * @param options The options for getting the thread members.
     */
    async getThreadMembers(options?: Types.Channels.GetThreadMembersOptions): Promise<Array<Types.Channels.ThreadMember>> {
        return this.client.rest.channels.getThreadMembers(this.id, options);
    }

    override toJSON(): Types.JSON.JSONPublicThreadChannel {
        return {
            ...super.toJSON(),
            appliedTags:    this.appliedTags,
            threadMetadata: this.threadMetadata,
            type:           this.type
        };
    }
}
