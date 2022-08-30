import PermissionOverwrite from "./PermissionOverwrite";
import GuildChannel from "./GuildChannel";
import type Client from "../Client";
import type { ChannelTypes } from "../Constants";
import Collection from "../util/Collection";
import type {
    EditAnyGuildChannelOptions,
    EditPermissionOptions,
    RawCategoryChannel,
    RawGuildChannel,
    RawOverwrite
} from "../types/channels";
import type { JSONCategoryChannel } from "../types/json";

/** Represents a guild category channel. */
export default class CategoryChannel extends GuildChannel {
    /** The channels in this category. */
    channels: Collection<string, RawGuildChannel, GuildChannel>;
    /** The permission overwrites of this channel. */
    permissionOverwrites: Collection<string, RawOverwrite, PermissionOverwrite>;
    /** The position of this channel on the sidebar. */
    position: number;
    declare type: ChannelTypes.GUILD_CATEGORY;
    constructor(data: RawCategoryChannel, client: Client) {
        super(data, client);
        this.channels = new Collection(GuildChannel, client);
        this.permissionOverwrites = new Collection(PermissionOverwrite, client);
        this.update(data);
    }

    protected update(data: Partial<RawCategoryChannel>) {
        super.update(data);
        if (data.position !== undefined) this.position = data.position;
        if (data.permission_overwrites !== undefined) data.permission_overwrites.map(overwrite => this.permissionOverwrites.update(overwrite));
    }

    /**
     * Delete a permission overwrite on this channel.
     * @param overwriteID The ID of the permission overwrite to delete.
     * @param reason The reason for deleting the permission overwrite.
     */
    async deletePermission(overwriteID: string, reason?: string) {
        return this._client.rest.channels.deletePermission(this.id, overwriteID, reason);
    }

    /**
     * Edit this channel.
     * @param options The options for editing the channel.
     */
    async edit(options: EditAnyGuildChannelOptions) {
        return this._client.rest.channels.edit<this>(this.id, options);
    }

    /**
     * Edit a permission overwrite on this channel.
     * @param overwriteID The ID of the permission overwrite to edit.
     * @param options The options for editing the permission overwrite.
     */
    async editPermission(overwriteID: string, options: EditPermissionOptions) {
        return this._client.rest.channels.editPermission(this.id, overwriteID, options);
    }

    override toJSON(): JSONCategoryChannel {
        return {
            ...super.toJSON(),
            channels:             this.channels.map(channel => channel.id),
            permissionOverwrites: this.permissionOverwrites.map(overwrite => overwrite.toJSON()),
            position:             this.position,
            type:                 this.type
        };
    }
}
