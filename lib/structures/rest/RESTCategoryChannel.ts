import RESTChannel from "./RESTChannel";
import type RESTClient from "../../RESTClient";
import type { EditAnyGuildChannelOptions, RawOverwrite, RawRESTCategoryChannel } from "../../routes/Channels";
import type { ChannelTypes } from "../../Constants";
import PermissionOverwrite from "../PermissionOverwrite";

/** Represents a guild category channel. */
export default class RESTCategoryChannel extends RESTChannel {
	/** The permission overwrites of this channel. */
	permissionOverwrites: Array<PermissionOverwrite>;
	/** The position of this channel on the sidebar. */
	position: number;
	declare type: ChannelTypes.GUILD_CATEGORY;
	constructor(data: RawRESTCategoryChannel, client: RESTClient) {
		super(data, client);
		this.permissionOverwrites = data.permission_overwrites.map(overwrite => new PermissionOverwrite(overwrite));
		this.position             = data.position;
	}

	/**
	 * Edit this channel.
	 *
	 * @param {Object} options
	 * @param {String} [options.name] - [All] The name of the channel.
	 * @param {?RawOverwrite[]} [options.permissionOverwrites] - [All Guild] Channel or category specific permissions
	 * @param {?Number} [options.position] - [All Guild] The position of the channel in the channel list.
	 * @param {String} [reason] - The reason to be displayed in the audit log.
	 * @returns {Promise<RESTCategoryChannel>}
	 */
	async edit(options: EditAnyGuildChannelOptions, reason?: string) {
		return this._client.channels.edit<RESTCategoryChannel>(this.id, options, reason);
	}
}
