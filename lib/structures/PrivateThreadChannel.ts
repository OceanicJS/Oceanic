import type { PrivateThreadmetadata } from "./ThreadChannel";
import ThreadChannel from "./ThreadChannel";
import type { ChannelTypes, ThreadAutoArchiveDuration } from "../Constants";
import type Client from "../Client";
import type { EditPrivateThreadChannelOptions, RawPrivateThreadChannel } from "../types/channels";

/** Represents a guild thread channel. */
export default class PrivateThreadChannel extends ThreadChannel {
	declare threadMetadata: PrivateThreadmetadata;
	declare type: ChannelTypes.GUILD_PRIVATE_THREAD;
	constructor(data: RawPrivateThreadChannel, client: Client) {
		super(data, client);
	}

	/**
	 * Edit a channel.
	 *
	 * @param {String} id - The id of the channel to edit.
	 * @param {Object} options
	 * @param {Boolean} [options.archived] - If the thread is archived.
	 * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration after which the thread will be archived.
	 * @param {Number} [options.flags] - The [channel flags](https://discord.com/developers/docs/resources/channel#channel-object-channel-flags) to set on the channel.
	 * @param {Boolean} [options.invitable] - If non-moderators can add other non-moderators to the thread.
	 * @param {Boolean} [options.locked] - If the thread should be locked.
	 * @param {String} [options.name] - The name of the channel.
	 * @param {?Number} [options.rateLimitPerUser] - The seconds between sending messages for users. Between 0 and 21600.
	 * @param {String} [reason] - The reason to be displayed in the audit log.
	 * @returns {Promise<PrivateThreadChannel>}
	 */
	override async edit(options: EditPrivateThreadChannelOptions, reason?: string) {
		return this._client.rest.channels.edit<PrivateThreadChannel>(this.id, options, reason);
	}
}
