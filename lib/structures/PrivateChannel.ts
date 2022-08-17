
import Channel from "./Channel";
import type User from "./User";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { RawPrivateChannel } from "../types/channels";

/** Represents a direct message with a user. */
export default class PrivateChannel extends Channel {
	/** The id of the last message sent in this channel, if any. */
	lastMessageID: string | null;
	/** The other user in this direct message. */
	recipient: User;
	declare type: ChannelTypes.DM;
	constructor(data: RawPrivateChannel, client: Client) {
		super(data, client);
		this.lastMessageID = data.last_message_id;
		this.recipient = this._client.users.update(data.recipients[0]);
	}
}
