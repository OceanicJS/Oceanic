/** @module PublicThreadChannel */
import ThreadChannel from "./ThreadChannel";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { EditPublicThreadChannelOptions, RawPublicThreadChannel, ThreadMetadata } from "../types/channels";
import type { JSONPublicThreadChannel } from "../types/json";

/** Represents a public thread channel. */
export default class PublicThreadChannel extends ThreadChannel<PublicThreadChannel> {
    /** the IDs of the set of tags that have been applied to this thread. Forum channel threads only.  */
    appliedTags: Array<string>;
    declare threadMetadata: ThreadMetadata;
    declare type: ChannelTypes.PUBLIC_THREAD;
    constructor(data: RawPublicThreadChannel, client: Client) {
        super(data, client);
        this.appliedTags = [];
    }

    protected override update(data: Partial<RawPublicThreadChannel>): void {
        super.update(data);
        if (data.applied_tags !== undefined) {
            this.appliedTags = data.applied_tags;
        }
    }

    /**
     * Edit this channel.
     * @param options The options to edit the channel with.
     */
    override async edit(options: EditPublicThreadChannelOptions): Promise<this> {
        return this.client.rest.channels.edit<this>(this.id, options);
    }

    override toJSON(): JSONPublicThreadChannel {
        return {
            ...super.toJSON(),
            appliedTags:    this.appliedTags,
            threadMetadata: this.threadMetadata,
            type:           this.type
        };
    }
}
