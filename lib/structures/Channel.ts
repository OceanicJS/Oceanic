/* eslint-disable import/order */
import Base from "./Base";
import type {
	RawChannel,
	RawCategoryChannel,
	RawPrivateChannel,
	RawGroupChannel,
	RawNewsChannel,
	RawNewsThreadChannel,
	RawPrivateThreadChannel,
	RawPublicThreadChannel,
	RawStageChannel,
	RawTextChannel,
	RawVoiceChannel
} from "../routes/Channels";
import { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type ITextChannel from "./TextChannel";
import type IPrivateChannel from "./PrivateChannel";
import type IVoiceChannel from "./VoiceChannel";
import type ICategoryChannel from "./CategoryChannel";
import type IGroupChannel from "./GroupChannel";
import type INewsChannel from "./NewsChannel";
import type IPublicThreadChannel from "./PublicThreadChannel";
import type IPrivateThreadChannel from "./PrivateThreadChannel";
import type INewsThreadChannel from "./NewsThreadChannel";
import type IStageChannel from "./StageChannel";

export default class Channel extends Base {
	type: ChannelTypes;
	constructor(data: RawChannel, client: Client) {
		super(data.id, client);
		this.type = data.type;
	}

	static from(data: RawChannel, client: Client) {
		switch (data.type) {
			case ChannelTypes.GUILD_TEXT: return new TextChannel(data as RawTextChannel, client);
			case ChannelTypes.DM: return new PrivateChannel(data as RawPrivateChannel, client);
			case ChannelTypes.GUILD_VOICE: return new VoiceChannel(data as RawVoiceChannel, client);
			case ChannelTypes.GROUP_DM: return new GroupChannel(data as RawGroupChannel, client);
			case ChannelTypes.GUILD_CATEGORY: return new CategoryChannel(data as RawCategoryChannel, client);
			case ChannelTypes.GUILD_NEWS: return new NewsChannel(data as RawNewsChannel, client);
			case ChannelTypes.GUILD_NEWS_THREAD: return new NewsThreadChannel(data as RawNewsThreadChannel, client);
			case ChannelTypes.GUILD_PUBLIC_THREAD: return new PublicThreadChannel(data as RawPublicThreadChannel, client);
			case ChannelTypes.GUILD_PRIVATE_THREAD: return new PrivateThreadChannel(data as RawPrivateThreadChannel, client);
			case ChannelTypes.GUILD_STAGE_VOICE: return new StageChannel(data as RawStageChannel, client);
			default: return new Channel(data, client);
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
	protected update(data: RawChannel) {}

	/** A string that will mention this channel. */
	get mention() {
		return `<#${this.id}>`;
	}

	/**
	 * Close a direct message, leave a group channel, or delete a guild channel.
	 *
	 * @returns {Promise<void>}
	 */
	async delete() {
		await this._client.rest.channels.delete(this.id);
	}
}

// Yes this sucks, but it works. That's the important part. Circular imports are hell.
/* eslint-disable */
const TextChannel = require("./TextChannel") as typeof ITextChannel;
const PrivateChannel = require("./PrivateChannel") as typeof IPrivateChannel;
const VoiceChannel = require("./VoiceChannel") as typeof IVoiceChannel;
const CategoryChannel = require("./CategoryChannel") as typeof ICategoryChannel;
const GroupChannel = require("./GroupChannel") as typeof IGroupChannel;
const NewsChannel = require("./NewsChannel") as typeof INewsChannel;
const PublicThreadChannel = require("./PublicThreadChannel") as typeof IPublicThreadChannel;
const PrivateThreadChannel = require("./PrivateThreadChannel") as typeof IPrivateThreadChannel;
const NewsThreadChannel = require("./NewsThreadChannel") as typeof INewsThreadChannel;
const StageChannel = require("./StageChannel") as typeof IStageChannel;
/* eslint-disable */
