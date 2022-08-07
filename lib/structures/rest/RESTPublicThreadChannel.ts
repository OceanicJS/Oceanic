import type { ThreadMetadata } from "./RESTThreadChannel";
import RESTThreadChannel from "./RESTThreadChannel";
import type { EditPublicThreadChannelOptions, RawRESTPublicThreadChannel } from "../../routes/Channels";
import type RESTClient from "../../RESTClient";
import type { ChannelTypes, ThreadAutoArchiveDuration } from "../../Constants";

/** Represents a guild thread channel. */
export default class RESTPublicThreadChannel extends RESTThreadChannel {
	declare threadMetadata: ThreadMetadata;
	declare type: ChannelTypes.GUILD_PUBLIC_THREAD;
	constructor(data: RawRESTPublicThreadChannel, client: RESTClient) {
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
	 * @param {Boolean} [options.locked] - If the thread should be locked.
	 * @param {String} [options.name] - The name of the channel.
	 * @param {?Number} [options.rateLimitPerUser] - The seconds between sending messages for users. Between 0 and 21600.
	 * @param {String} [reason] - The reason to be displayed in the audit log.
	 * @returns {Promise<RESTPublicThreadChannel>}
	 */
	override async edit(options: EditPublicThreadChannelOptions, reason?: string) {
		return this._client.channels.edit<RESTPublicThreadChannel>(this.id, options, reason);
	}
}
