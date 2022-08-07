import RESTBase from "./RESTBase";
import RESTPartialUser from "./RESTPartialUser";
import type { RawRESTGroupChannel } from "../../routes/Channels";
import type RESTClient from "../../RESTClient";
import type { ChannelTypes } from "../../Constants";

export default class RestGroupChannel extends RESTBase {
	applicationID: string;
	icon: string | null;
	managed: boolean;
	name: string | null;
	nicks?: Record<"id" | "nick", string>;
	ownerID: string;
	recipients: Array<RESTPartialUser>;
	type: ChannelTypes.GROUP_DM;
	constructor(data: RawRESTGroupChannel, client: RESTClient) {
		super(data.id, client);
		this.applicationID = data.application_id;
		this.icon          = data.icon;
		this.managed       = data.managed;
		this.name          = data.name;
		this.nicks         = data.nicks;
		this.ownerID       = data.owner_id;
		this.recipients    = data.recipients.map(user => new RESTPartialUser(user, client));
		this.type          = data.type;
	}
}
