import PermissionOverwrite from "./PermissionOverwrite";
import GuildChannel from "./GuildChannel";
import type Client from "../Client";
import type { ChannelTypes } from "../Constants";
import Collection from "../util/Collection";
import type { EditAnyGuildChannelOptions, EditPermissionOptions, RawCategoryChannel, RawGuildChannel, RawOverwrite } from "../types/channels";
import type { JSONCategoryChannel } from "../types/json";
/** Represents a guild category channel. */
export default class CategoryChannel extends GuildChannel {
    /** The channels in this category. */
    channels: Collection<string, RawGuildChannel, GuildChannel>;
    /** The permission overwrites of this channel. */
    permissionOverwrites: Collection<string, RawOverwrite, PermissionOverwrite>;
    /** The position of this channel on the sidebar. */
    position: number;
    type: ChannelTypes.GUILD_CATEGORY;
    constructor(data: RawCategoryChannel, client: Client);
    protected update(data: Partial<RawCategoryChannel>): void;
    /**
     * Delete a permission overwrite on this channel.
     *
     * @param {String} overwriteID - The id of the permission overwrite to delete.
     * @param {String} reason - The reason for deleting the permission overwrite.
     * @returns {Promise<void>}
     */
    deletePermission(overwriteID: string, reason?: string): Promise<void>;
    /**
     * Edit this channel.
     *
     * @param {Object} options
     * @param {String} [options.name] - [All] The name of the channel.
     * @param {?RawOverwrite[]} [options.permissionOverwrites] - [All Guild] Channel or category specific permissions
     * @param {?Number} [options.position] - [All Guild] The position of the channel in the channel list.
     * @param {String} [roptions.eason] - The reason to be displayed in the audit log.
     * @returns {Promise<CategoryChannel>}
     */
    edit(options: EditAnyGuildChannelOptions): Promise<this>;
    /**
     * Edit a permission overwrite on this channel.
     *
     * @param {String} overwriteID - The id of the permission overwrite to edit.
     * @param {Object} options
     * @param {(BigInt | String)} [options.allow] - The permissions to allow.
     * @param {(BigInt | String)} [options.deny] - The permissions to deny.
     * @param {String} [options.reason] - The reason for editing the permission.
     * @param {OverwriteTypes} [options.type] - The type of the permission overwrite.
     * @returns {Promise<void>}
     */
    editPermission(overwriteID: string, options: EditPermissionOptions): Promise<void>;
    toJSON(): JSONCategoryChannel;
}
