"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GuildChannel_1 = __importDefault(require("./GuildChannel"));
const PermissionOverwrite_1 = __importDefault(require("./PermissionOverwrite"));
const Member_1 = __importDefault(require("./Member"));
const Permission_1 = __importDefault(require("./Permission"));
const Constants_1 = require("../Constants");
const Collection_1 = __importDefault(require("../util/Collection"));
/** Represents a guild stage channel. */
class StageChannel extends GuildChannel_1.default {
    /** The bitrate of the stage channel. */
    bitrate;
    /** The permission overwrites of this channel. */
    permissionOverwrites;
    /** The position of this channel on the sidebar. */
    position;
    /** The id of the voice region of the channel, `null` is automatic. */
    rtcRegion;
    /** The topic of the channel. */
    topic;
    voiceMembers;
    constructor(data, client) {
        super(data, client);
        this.permissionOverwrites = new Collection_1.default(PermissionOverwrite_1.default, client);
        this.voiceMembers = new Collection_1.default(Member_1.default, client);
        this.update(data);
    }
    update(data) {
        super.update(data);
        if (data.bitrate !== undefined)
            this.bitrate = data.bitrate;
        if (data.position !== undefined)
            this.position = data.position;
        if (data.rtc_region !== undefined)
            this.rtcRegion = data.rtc_region;
        if (data.topic !== undefined)
            this.topic = data.topic;
        if (data.permission_overwrites !== undefined)
            data.permission_overwrites.map(overwrite => this.permissionOverwrites.update(overwrite));
    }
    /**
     * Create an invite for this channel.
     *
     * @param {Object} options
     * @param {Number} [options.maxAge] - How long the invite should last.
     * @param {Number} [options.maxUses] - How many times the invite can be used.
     * @param {String} [options.reason] - The reason for creating the invite.
     * @param {String} [options.targetApplicationID] - The id of the embedded application to open for this invite.
     * @param {InviteTargetTypes} [options.targetType] - The [type of target](https://discord.com/developers/docs/resources/channel#invite-target-types) for the invite.
     * @param {String} [options.targetUserID] - The id of the user whose stream to display for this invite.
     * @param {Boolean} [options.temporary] - If the invite should be temporary.
     * @param {Boolean} [options.unique] - If the invite should be unique.
     * @returns {Promise<Invite<StageChannel>>}
     */
    async createInvite(options) {
        return this._client.rest.channels.createInvite(this.id, options);
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
     * @param {String} [options.reason] - The reason to be displayed in the audit log.
     * @param {?String} [options.rtcRegion] - [Voice, Stage] The voice region id of the channel, null for automatic.
     * @returns {Promise<StageChannel>}
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
    /**
     * Join this stage channel.
     *
     * @param {Object} [options]
     * @param {Boolean} [options.selfDeaf] - If the client should join deafened.
     * @param {Boolean} [options.selfMute] - If the client should join muted.
     * @returns {Promise<void>}
     */
    async join(options) {
        return this._client.joinVoiceChannel(this.id, options);
    }
    /**
     * Get the permissions of a member.
     *
     * @param {(String | Member)} member - The member to get the permissions of.
     * @returns {Permission}
     */
    permissionsOf(member) {
        if (typeof member === "string")
            member = this.guild.members.get(member);
        if (!member)
            throw new Error("Member not found");
        let permission = this.guild.permissionsOf(member).allow;
        if (permission & Constants_1.Permissions.ADMINISTRATOR)
            return new Permission_1.default(Constants_1.AllPermissions);
        let overwrite = this.permissionOverwrites.get(this.guild.id);
        if (overwrite)
            permission = (permission & ~overwrite.deny) | overwrite.allow;
        let deny = 0n;
        let allow = 0n;
        for (const id of member.roles) {
            if ((overwrite = this.permissionOverwrites.get(id))) {
                deny |= overwrite.deny;
                allow |= overwrite.allow;
            }
        }
        permission = (permission & ~deny) | allow;
        overwrite = this.permissionOverwrites.get(member.id);
        if (overwrite)
            permission = (permission & ~overwrite.deny) | overwrite.allow;
        return new Permission_1.default(permission);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            bitrate: this.bitrate,
            permissionOverwrites: this.permissionOverwrites.map(overwrite => overwrite.toJSON()),
            position: this.position,
            rtcRegion: this.rtcRegion,
            topic: this.topic,
            type: this.type
        };
    }
}
exports.default = StageChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhZ2VDaGFubmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvU3RhZ2VDaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0VBQTBDO0FBQzFDLGdGQUF3RDtBQUV4RCxzREFBOEI7QUFFOUIsOERBQXNDO0FBRXRDLDRDQUE4RjtBQUU5RixvRUFBNEM7QUFZNUMsd0NBQXdDO0FBQ3hDLE1BQXFCLFlBQWEsU0FBUSxzQkFBWTtJQUNsRCx3Q0FBd0M7SUFDeEMsT0FBTyxDQUFTO0lBRWhCLGlEQUFpRDtJQUNqRCxvQkFBb0IsQ0FBd0Q7SUFDNUUsbURBQW1EO0lBQ25ELFFBQVEsQ0FBUztJQUNqQixzRUFBc0U7SUFDdEUsU0FBUyxDQUFnQjtJQUN6QixnQ0FBZ0M7SUFDaEMsS0FBSyxDQUFnQjtJQUVyQixZQUFZLENBQTJEO0lBQ3ZFLFlBQVksSUFBcUIsRUFBRSxNQUFjO1FBQzdDLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksb0JBQVUsQ0FBQyw2QkFBbUIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN4RSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksb0JBQVUsQ0FBQyxnQkFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVTLE1BQU0sQ0FBQyxJQUE4QjtRQUMzQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25CLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzVELElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxD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