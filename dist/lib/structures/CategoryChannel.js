"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PermissionOverwrite_1 = __importDefault(require("./PermissionOverwrite"));
const GuildChannel_1 = __importDefault(require("./GuildChannel"));
const Collection_1 = __importDefault(require("../util/Collection"));
/** Represents a guild category channel. */
class CategoryChannel extends GuildChannel_1.default {
    /** The channels in this category. */
    channels;
    /** The permission overwrites of this channel. */
    permissionOverwrites;
    /** The position of this channel on the sidebar. */
    position;
    constructor(data, client) {
        super(data, client);
        this.channels = new Collection_1.default(GuildChannel_1.default, client);
        this.permissionOverwrites = new Collection_1.default(PermissionOverwrite_1.default, client);
        this.update(data);
    }
    update(data) {
        super.update(data);
        if (data.position !== undefined)
            this.position = data.position;
        if (data.permission_overwrites !== undefined)
            data.permission_overwrites.map(overwrite => this.permissionOverwrites.update(overwrite));
    }
    /**
     * Delete a permission overwrite on this channel.
     *
     * @param {String} overwriteID - The id of the permission overwrite to delete.
     * @param {String} reason - The reason for deleting the permission overwrite.
     * @returns {Promise<void>}
     */
    async deletePermission(overwriteID, reason) {
        return this._client.rest.channels.deletePermission(this.id, overwriteID, reason);
    }
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
    async edit(options) {
        return this._client.rest.channels.edit(this.id, options);
    }
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
    async editPermission(overwriteID, options) {
        return this._client.rest.channels.editPermission(this.id, overwriteID, options);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            channels: this.channels.map(channel => channel.id),
            permissionOverwrites: this.permissionOverwrites.map(overwrite => overwrite.toJSON()),
            position: this.position,
            type: this.type
        };
    }
}
exports.default = CategoryChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2F0ZWdvcnlDaGFubmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvQ2F0ZWdvcnlDaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0ZBQXdEO0FBQ3hELGtFQUEwQztBQUcxQyxvRUFBNEM7QUFVNUMsMkNBQTJDO0FBQzNDLE1BQXFCLGVBQWdCLFNBQVEsc0JBQVk7SUFDeEQscUNBQXFDO0lBQ3JDLFFBQVEsQ0FBb0Q7SUFDNUQsaURBQWlEO0lBQ2pELG9CQUFvQixDQUF3RDtJQUM1RSxtREFBbUQ7SUFDbkQsUUFBUSxDQUFTO0lBRWpCLFlBQVksSUFBd0IsRUFBRSxNQUFjO1FBQ25ELEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLG9CQUFVLENBQUMsc0JBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxvQkFBVSxDQUFDLDZCQUFtQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVTLE1BQU0sQ0FBQyxJQUFpQztRQUNqRCxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25CLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQy9ELElBQUksSUFBSSxDQUFDLHFCQUFxQixLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ3hJLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsV0FBbUIsRUFBRSxNQUFlO1FBQzFELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQW1DO1FBQzdDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBTyxJQUFJLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0gsS0FBSyxDQUFDLGNBQWMsQ0FBQyxXQUFtQixFQUFFLE9BQThCO1FBQ3ZFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRVEsTUFBTTtRQUNkLE9BQU87WUFDTixHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDakIsUUFBUSxFQUFjLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUM5RCxvQkFBb0IsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3BGLFFBQVEsRUFBYyxJQUFJLENBQUMsUUFBUTtZQUNuQyxJQUFJLEVBQWtCLElBQUksQ0FBQyxJQUFJO1NBQy9CLENBQUM7SUFDSCxDQUFDO0NBQ0Q7QUF0RUQsa0NBc0VDIn0=