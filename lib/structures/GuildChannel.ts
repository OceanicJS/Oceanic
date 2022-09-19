/** @module GuildChannel */
import Channel from "./Channel";
import type Guild from "./Guild";
import type CategoryChannel from "./CategoryChannel";
import type TextChannel from "./TextChannel";
import type AnnouncementChannel from "./AnnouncementChannel";
import type ForumChannel from "./ForumChannel";
import type { GuildChannelTypes } from "../Constants";
import type Client from "../Client";
import type { AnyGuildChannel, EditGuildChannelOptions, JSONGuildChannel, RawGuildChannel } from "../types";

/** Represents a guild channel. */
export default class GuildChannel extends Channel {
    private _guild?: Guild;
    /** The id of the guild this channel is in. */
    guildID: string;
    /** The name of this channel. */
    name: string;
    /** The parent of this channel, if applicable. This will be a text/announcement/forum channel if we're in a thread, category otherwise. */
    parent?: TextChannel | AnnouncementChannel | CategoryChannel | ForumChannel | null;
    /** The ID of the parent of this channel, if applicable. */
    parentID: string | null;
    declare type: GuildChannelTypes;
    constructor(data: RawGuildChannel, client: Client) {
        super(data, client);
        this._guild = client.guilds.get(data.guild_id);
        this.guildID = data.guild_id;
        this.name = data.name;
        this.parent = data.parent_id === null ? null : client.getChannel<TextChannel | AnnouncementChannel | CategoryChannel | ForumChannel>(data.parent_id);
        this.parentID = data.parent_id;
    }

    protected update(data: Partial<RawGuildChannel>): void {
        super.update(data);
        if (data.guild_id !== undefined) {
            this._guild = this.client.guilds.get(data.guild_id);
            this.guildID = data.guild_id;
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.parent_id !== undefined) {
            this.parent = data.parent_id === null ? null : this.client.getChannel<TextChannel | AnnouncementChannel | CategoryChannel | ForumChannel>(data.parent_id);
            this.parentID = data.parent_id;
        }
    }

    /** The guild associated with this channel. This will throw an error if the guild is not cached. */
    get guild(): Guild {
        if (!this._guild) {
            throw new Error(`${this.constructor.name}#guild is not present if you don't have the GUILDS intent.`);
        } else {
            return this._guild;
        }
    }

    /**
     * Edit this channel.
     * @param options The options for editing the channel.
     */
    async edit(options: EditGuildChannelOptions): Promise<AnyGuildChannel> {
        return this.client.rest.channels.edit(this.id, options);
    }

    override toJSON(): JSONGuildChannel {
        return {
            ...super.toJSON(),
            guildID:  this.guildID,
            name:     this.name,
            parentID: this.parentID,
            type:     this.type
        };
    }
}
