/** @module GuildChannel */
import Channel from "./Channel";
import type Guild from "./Guild";
import type CategoryChannel from "./CategoryChannel";
import type TextChannel from "./TextChannel";
import type AnnouncementChannel from "./AnnouncementChannel";
import type ForumChannel from "./ForumChannel";
import type { ChannelTypeMap } from "../Constants";
import type Client from "../Client";
import type { EditChannelOptionsMap, GuildChannels, RawGuildChannel } from "../types/channels";
import type { JSONGuildChannel } from "../types/json";
import { UncachedError } from "../util/Errors";

/** Represents a guild channel. */
export default class GuildChannel extends Channel {
    private _cachedGuild?: Guild;
    private _cachedParent?: TextChannel | AnnouncementChannel | CategoryChannel | ForumChannel | null;
    /** The id of the guild this channel is in. */
    guildID: string;
    /** The name of this channel. */
    name: string;
    /** The ID of the parent of this channel, if applicable. */
    parentID: string | null;
    declare type: GuildChannels;
    constructor(data: RawGuildChannel, client: Client) {
        super(data, client);
        this.guildID = data.guild_id;
        this.name = data.name;
        this.parentID = data.parent_id;
    }

    protected override update(data: Partial<RawGuildChannel>): void {
        super.update(data);
        if (data.guild_id !== undefined) {
            this.guildID = data.guild_id;
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.parent_id !== undefined) {
            this.parentID = data.parent_id;
        }
    }

    /** The guild associated with this channel. This will throw an error if the guild is not cached. */
    get guild(): Guild {
        this._cachedGuild ??= this.client.guilds.get(this.guildID);
        if (!this._cachedGuild) {
            if (this.client.options.restMode) {
                throw new UncachedError(`${this.constructor.name}#guild is not present when rest mode is enabled.`);
            }

            if (!this.client.shards.connected) {
                throw new UncachedError(`${this.constructor.name}#guild is not present without a gateway connection.`);
            }

            throw new UncachedError(`${this.constructor.name}#guild is not present.`);
        }

        return this._cachedGuild;
    }

    /** The parent of this channel, if applicable. This will be a text/announcement/forum channel if we're in a thread, category otherwise. */
    get parent(): TextChannel | AnnouncementChannel | CategoryChannel | ForumChannel | null | undefined {
        if (this.parentID !== null && this._cachedParent !== null) {
            return this._cachedParent ?? (this._cachedParent = this.client.getChannel<TextChannel | AnnouncementChannel | CategoryChannel | ForumChannel>(this.parentID));
        }

        return this._cachedParent === null ? this._cachedParent : (this._cachedParent = null);
    }

    /**
     * Edit this channel.
     * @param options The options for editing the channel.
     */
    async edit(options: EditChannelOptionsMap[this["type"]]): Promise<this> {
        // edit is called down the chain
        return this.client.rest.channels.edit<ChannelTypeMap[this["type"]]>(this.id, options) as unknown as Promise<this>;
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
