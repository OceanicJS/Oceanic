import Base from "./Base";
import { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { AnyChannel, RawChannel } from "../types/channels";
import type { JSONChannel } from "../types/json";
/** Represents a channel. */
export default class Channel extends Base {
    /** The [type](https://discord.com/developers/docs/resources/channel#channel-object-channel-types) of this channel. */
    type: ChannelTypes;
    constructor(data: RawChannel, client: Client);
    static from<T extends AnyChannel = AnyChannel>(data: RawChannel, client: Client): T;
    /** A string that will mention this channel. */
    get mention(): string;
    /**
     * Close a direct message, leave a group channel, or delete a guild channel.
     *
     * @returns {Promise<void>}
     */
    delete(): Promise<void>;
    toJSON(): JSONChannel;
}
