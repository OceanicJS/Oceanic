import RESTBase from "./RESTBase";
import RESTPartialUser from "./RESTPartialUser";
import type { RawRESTDMChannel } from "../../routes/Channels";
import type RESTClient from "../../RESTClient";
import type { ChannelTypes } from "../../Constants";

export default class RESTDMChannel extends RESTBase {
	lastMessageID: string | null;
	recipients: Array<RESTPartialUser>;
	type: ChannelTypes.DM;
	constructor(data: RawRESTDMChannel, client: RESTClient) {
		super(data.id, client);
		this.lastMessageID = data.last_message_id;
		this.recipients    = data.recipients.map(user => new RESTPartialUser(user, client));
		this.type          = data.type;
	}
}
