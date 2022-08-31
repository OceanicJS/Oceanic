import Channel from "./Channel";
import type Guild from "./Guild";
import type CategoryChannel from "./CategoryChannel";
import type TextChannel from "./TextChannel";
import type AnnouncementChannel from "./AnnouncementChannel";
import type ForumChannel from "./ForumChannel";
import type { GuildChannelTypes } from "../Constants";
import type Client from "../Client";
import type { AnyGuildChannel, EditGuildChannelOptions, RawGuildChannel } from "../types/channels";
import type { JSONGuildChannel } from "../types/json";
/** Represents a guild channel. */
export default class GuildChannel extends Channel {
    /** The guild associated with this channel. */
    guild: Guild;
    /** The id of the guild this channel is in. */
    guildID: string;
    /** The name of this channel. */
    name: string;
    /** The parent of this channel, if applicable. This will be a text/announcement/forum channel if we're in a thread, category otherwise. */
    parent: TextChannel | AnnouncementChannel | CategoryChannel | ForumChannel | null;
    /** The ID of the parent of this channel, if applicable. */
    parentID: string | null;
    type: GuildChannelTypes;
    constructor(data: RawGuildChannel, client: Client);
    protected update(data: Partial<RawGuildChannel>): void;
    /**
     * Edit this channel.
     * @param options The options for editing the channel.
     */
    edit(options: EditGuildChannelOptions): Promise<AnyGuildChannel>;
    toJSON(): JSONGuildChannel;
}
