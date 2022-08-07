import RESTPartialUser from "./RESTPartialUser";
import RESTChannel from "./RESTChannel";
import type { RawRESTDMChannel } from "../../routes/Channels";
import type RESTClient from "../../RESTClient";
import type { ChannelTypes } from "../../Constants";

/** Represents a direct message with a user. */
export default class RESTDMChannel extends RESTChannel {
	lastMessageID: string | null;
	recipients: Array<RESTPartialUser>;
	declare type: ChannelTypes.DM;
	constructor(data: RawRESTDMChannel, client: RESTClient) {
		super(data, client);
		this.lastMessageID = data.last_message_id;
		this.recipients    = data.recipients.map(user => new RESTPartialUser(user, client));
	}
}
