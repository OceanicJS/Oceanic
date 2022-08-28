import type { PrivateThreadmetadata } from "./ThreadChannel";
import ThreadChannel from "./ThreadChannel";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { EditPrivateThreadChannelOptions, RawPrivateThreadChannel } from "../types/channels";
import type { JSONPrivateThreadChannel } from "../types/json";
/** Represents a guild thread channel. */
export default class PrivateThreadChannel extends ThreadChannel<PrivateThreadChannel> {
    threadMetadata: PrivateThreadmetadata;
    type: ChannelTypes.PRIVATE_THREAD;
    constructor(data: RawPrivateThreadChannel, client: Client);
    /**
     * Edit a channel.
     *
     * @param {String} id - The id of the channel to edit.
     * @param {Object} options
     * @param {Boolean} [options.archived] - If the thread is archived.
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration after which the thread will be archived.
     * @param {Number} [options.flags] - The [channel flags](https://discord.com/developers/docs/resources/channel#channel-object-channel-flags) to set on the channel.
     * @param {Boolean} [options.invitable] - If non-moderators can add other non-moderators to the thread.
     * @param {Boolean} [options.locked] - If the thread should be locked.
     * @param {String} [options.name] - The name of the channel.
     * @param {?Number} [options.rateLimitPerUser] - The seconds between sending messages for users. Between 0 and 21600.
     * @param {String} [options.reason] - The reason to be displayed in the audit log.
     * @returns {Promise<PrivateThreadChannel>}
     */
    edit(options: EditPrivateThreadChannelOptions): Promise<this>;
    toJSON(): JSONPrivateThreadChannel;
}
