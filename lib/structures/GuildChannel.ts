/** @module GuildChannel */
import Channel from "./Channel";
import type Guild from "./Guild";
import type CategoryChannel from "./CategoryChannel";
import type TextChannel from "./TextChannel";
import type AnnouncementChannel from "./AnnouncementChannel";
import type ForumChannel from "./ForumChannel";
import type * as Types from "../types/namespaced";
import type { ChannelTypeMap } from "../Constants";
import type Client from "../Client";
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
    declare type: Types.Channels.GuildChannels;
    constructor(data: Types.Channels.RawGuildChannel, client: Client) {
        super(data, client);
        this.guildID = data.guild_id;
        this.name = data.name;
        this.parentID = data.parent_id;
    }

    protected override update(data: Partial<Types.Channels.RawGuildChannel>): void {
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

    /** 
     * The parent of this channel, if applicable.
     * 
     * If the channel is an {@link AnnouncementThread}, {@link PublicThread}, or {@link PrivateThread}, this will be a {@link TextChannel}, {@link AnnouncementChannel}, {@link ForumChannel}, or {@link MediaChannel}.
     * 
     * If the channel is a {@link TextChannel}, {@link VoiceChannel}, {@link AnnouncementChannel}, {@link ForumChannel}, or {@link MediaChannel}, this will be a {@link CategoryChannel}.
     * 
     * @returns If undefined, no attempt was made to resolve the parent channel. If null, the parent channel was attempted to be resolved but was not found in the client's cache.
     */
    get parent(): Types.Channels.ParentChannelType<this> | null | undefined {
        if (this.parentID !== null) {
            if (this._cachedParent !== null) {
                if (this._cachedParent) return this._cachedParent as Types.Channels.ParentChannelType<this>;
                this._cachedParent = this.client.getChannel<TextChannel | AnnouncementChannel | CategoryChannel | ForumChannel>(this.parentID);
                this._cachedParent ??= null;
                return this._cachedParent as Types.Channels.ParentChannelType<this> | null;
            } 

            return null;
        }

        return undefined;
    }

    /**
     * Edit this channel.
     * @param options The options for editing the channel.
     */
    async edit(options: Types.Channels.EditChannelOptionsMap[this["type"]]): Promise<this> {
        // edit is called down the chain
        return this.client.rest.channels.edit<ChannelTypeMap[this["type"]]>(this.id, options) as unknown as Promise<this>;
    }

    override toJSON(): Types.JSON.JSONGuildChannel {
        return {
            ...super.toJSON(),
            guildID:  this.guildID,
            name:     this.name,
            parentID: this.parentID,
            type:     this.type
        };
    }
}
