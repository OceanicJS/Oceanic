import GuildChannel from "./GuildChannel";
import PermissionOverwrite from "./PermissionOverwrite";
import Invite from "./Invite";
import type { ChannelTypes, InviteTargetTypes, OverwriteTypes } from "../Constants";
import type Client from "../Client";
import Collection from "../util/Collection";
import type {
	CreateInviteOptions,
	EditPermissionOptions,
	EditStageChannelOptions,
	RawOverwrite,
	RawStageChannel
} from "../types/channels";

/** Represents a guild stage channel. */
export default class StageChannel extends GuildChannel {
	/** The bitrate of the stage channel. */
	bitrate: number;
	/** The permission overwrites of this channel. */
	permissionOverwrites: Collection<string, RawOverwrite, PermissionOverwrite>;
	/** The position of this channel on the sidebar. */
	position: number;
	/** The id of the voice region of the channel, `null` is automatic. */
	rtcRegion: string | null;
	/** The topic of the channel. */
	topic: string | null;
	declare type: ChannelTypes.GUILD_STAGE_VOICE;
	constructor(data: RawStageChannel, client: Client) {
		super(data, client);
		this.permissionOverwrites = new Collection(PermissionOverwrite, client);
	}

	protected update(data: RawStageChannel): void {
		super.update(data);
		this.bitrate   = data.bitrate;
		this.position  = data.position;
		this.rtcRegion = data.rtc_region;
		this.topic     = data.topic;
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
	async createInvite(options: CreateInviteOptions) {
		return this._client.rest.channels.createInvite(this.id, options);
	}

	/**
	 * Delete a permission overwrite on this channel.
	 *
	 * @param {String} overwriteID - The id of the permission overwrite to delete.
	 * @param {String} reason - The reason for deleting the permission overwrite.
	 * @returns {Promise<void>}
	 */
	async deletePermission(overwriteID: string, reason?: string) {
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
	async edit(options: EditStageChannelOptions) {
		return this._client.rest.channels.edit<this>(this.id, options);
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
	async editPermission(overwriteID: string, options: EditPermissionOptions) {
		return this._client.rest.channels.editPermission(this.id, overwriteID, options);
	}
}
