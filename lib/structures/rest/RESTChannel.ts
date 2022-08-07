import RESTBase from "./RESTBase";
import RESTTextChannel from "./RESTTextableChannel";
import RESTDMChannel from "./RESTDMChannel";
import RESTVoiceChannel from "./RESTVoiceChannel";
import RESTCategoryChannel from "./RESTCategoryChannel";
import RestGroupDMChannel from "./RESTGroupDMChannel";
import RESTNewsChannel from "./RESTNewsChannel";
import RESTPublicThreadChannel from "./RESTPublicThreadChannel";
import RESTPrivateThreadChannel from "./RESTPrivateThreadChannel";
import RESTNewsThreadChannel from "./RESTNewsThreadChannel";
import RESTStageChannel from "./RESTStageChannel";
import type RESTClient from "../../RESTClient";
import type {
	RawChannel,
	RawRESTCategoryChannel,
	RawRESTDMChannel,
	RawRESTGroupChannel,
	RawRESTNewsChannel,
	RawRESTNewsThreadChannel,
	RawRESTPrivateThreadChannel,
	RawRESTPublicThreadChannel,
	RawRESTStageChannel,
	RawRESTTextChannel,
	RawRESTVoiceChannel
} from "../../routes/Channels";
import { ChannelTypes } from "../../Constants";

export default class RESTChannel extends RESTBase {
	type: ChannelTypes;
	constructor(data: RawChannel, client: RESTClient) {
		super(data.id, client);
		this.type = data.type;
	}

	static from(data: RawChannel, client: RESTClient) {
		switch (data.type) {
			case ChannelTypes.GUILD_TEXT: return new RESTTextChannel(data as RawRESTTextChannel, client);
			case ChannelTypes.DM: return new RESTDMChannel(data as RawRESTDMChannel, client);
			case ChannelTypes.GUILD_VOICE: return new RESTVoiceChannel(data as RawRESTVoiceChannel, client);
			case ChannelTypes.GROUP_DM: return new RestGroupDMChannel(data as RawRESTGroupChannel, client);
			case ChannelTypes.GUILD_CATEGORY: return new RESTCategoryChannel(data as RawRESTCategoryChannel, client);
			case ChannelTypes.GUILD_NEWS: return new RESTNewsChannel(data as RawRESTNewsChannel, client);
			case ChannelTypes.GUILD_NEWS_THREAD: return new RESTNewsThreadChannel(data as RawRESTNewsThreadChannel, client);
			case ChannelTypes.GUILD_PUBLIC_THREAD: return new RESTPublicThreadChannel(data as RawRESTPublicThreadChannel, client);
			case ChannelTypes.GUILD_PRIVATE_THREAD: return new RESTPrivateThreadChannel(data as RawRESTPrivateThreadChannel, client);
			case ChannelTypes.GUILD_STAGE_VOICE: return new RESTStageChannel(data as RawRESTStageChannel, client);
			default: return new RESTChannel(data, client);
		}
	}

	/**
	 * Close a direct message, leave a group channel, or delete a guild channel.
	 *
	 * @returns {Promise<void>}
	 */
	async delete() {
		await this._client.channels.delete(this.id);
	}
}
