import PermissionOverwrite from "./PermissionOverwrite";
import Channel from "./Channel";
import type Client from "../Client";
import type { ChannelTypes } from "../Constants";
import Collection from "../util/Collection";
import type { EditAnyGuildChannelOptions, RawCategoryChannel, RawOverwrite } from "../types/channels";

/** Represents a guild category channel. */
export default class CategoryChannel extends Channel {
	/** The permission overwrites of this channel. */
	permissionOverwrites: Collection<string, RawOverwrite, PermissionOverwrite>;
	/** The position of this channel on the sidebar. */
	position: number;
	declare type: ChannelTypes.GUILD_CATEGORY;
	constructor(data: RawCategoryChannel, client: Client) {
		super(data, client);
		this.permissionOverwrites = new Collection(PermissionOverwrite, client);
		this.update(data);
	}

	protected update(data: RawCategoryChannel) {
		super.update(data);
		this.position = data.position;
		data.permission_overwrites.map(overwrite => this.permissionOverwrites.update(overwrite));
	}

	/**
	 * Edit this channel.
	 *
	 * @param {Object} options
	 * @param {String} [options.name] - [All] The name of the channel.
	 * @param {?RawOverwrite[]} [options.permissionOverwrites] - [All Guild] Channel or category specific permissions
	 * @param {?Number} [options.position] - [All Guild] The position of the channel in the channel list.
	 * @param {String} [reason] - The reason to be displayed in the audit log.
	 * @returns {Promise<CategoryChannel>}
	 */
	async edit(options: EditAnyGuildChannelOptions, reason?: string) {
		return this._client.rest.channels.edit<CategoryChannel>(this.id, options, reason);
	}
}
