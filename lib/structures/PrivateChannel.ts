
import Channel from "./Channel";
import type User from "./User";
import Message from "./Message";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { RawMessage, RawPrivateChannel } from "../types/channels";
import type { Uncached } from "../types/shared";
import Collection from "../util/Collection";

/** Represents a direct message with a user. */
export default class PrivateChannel extends Channel {
	/** The last message sent in this channel, if any. This can be a partial object with only an `id` property. */
	lastMessage: Message | Uncached | null;
	/** The cached messages in this channel. */
	messages: Collection<string, RawMessage, Message>;
	/** The other user in this direct message. */
	recipient: User;
	declare type: ChannelTypes.DM;
	/** @hideconstructor */
	constructor(data: RawPrivateChannel, client: Client) {
		super(data, client);
		this.messages = new Collection(Message, client);
		this.lastMessage = null;
		this.recipient = this._client.users.update(data.recipients[0]);
	}

	protected update(data: Partial<RawPrivateChannel>) {
		if (data.last_message_id !== undefined) this.lastMessage = data.last_message_id === null ? null : this.messages.get(data.last_message_id) || { id: data.last_message_id };
	}
}
