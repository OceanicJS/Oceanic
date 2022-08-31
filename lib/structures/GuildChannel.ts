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
    declare type: GuildChannelTypes;
    constructor(data: RawGuildChannel, client: Client) {
        super(data, client);
        this.parent = null;
    }

    protected update(data: Partial<RawGuildChannel>) {
        super.update(data);
        if (data.guild_id !== undefined) {
            this.guild = this._client.guilds.get(data.guild_id)!;
            this.guildID = data.guild_id;
        }
        if (data.name !== undefined) this.name = data.name;
        if (data.parent_id !== undefined) {
            this.parent = data.parent_id === null ? null : this._client.getChannel<CategoryChannel>(data.parent_id)!;
            this.parentID = data.parent_id;
        }
    }

    /**
     * Edit this channel.
     * @param options The options for editing the channel.
     */
    async edit(options: EditGuildChannelOptions) {
        return this._client.rest.channels.edit<AnyGuildChannel>(this.id, options);
    }

    override toJSON(): JSONGuildChannel {
        return {
            ...super.toJSON(),
            guild:  this.guildID,
            name:   this.name,
            parent: this.parent ? this.parent.id : null,
            type:   this.type
        };
    }
}
