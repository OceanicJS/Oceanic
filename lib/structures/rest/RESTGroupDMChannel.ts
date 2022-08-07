import RESTPartialUser from "./RESTPartialUser";
import RESTChannel from "./RESTChannel";
import type { EditGroupDMOptions, RawRESTGroupChannel } from "../../routes/Channels";
import type RESTClient from "../../RESTClient";
import type { ChannelTypes } from "../../Constants";

/** Represents a group direct message. */
export default class RestGroupDMChannel extends RESTChannel {
	applicationID: string;
	icon: string | null;
	managed: boolean;
	name: string | null;
	nicks?: Record<"id" | "nick", string>;
	ownerID: string;
	recipients: Array<RESTPartialUser>;
	type: ChannelTypes.GROUP_DM;
	constructor(data: RawRESTGroupChannel, client: RESTClient) {
		super(data, client);
		this.applicationID = data.application_id;
		this.icon          = data.icon;
		this.managed       = data.managed;
		this.name          = data.name;
		this.nicks         = data.nicks;
		this.ownerID       = data.owner_id;
		this.recipients    = data.recipients.map(user => new RESTPartialUser(user, client));
		this.type          = data.type;
	}

	/**
	 * Edit this channel.
	 *
	 * @param {?String} [options.icon] - The icon of the channel.
	 * @param {String} [options.name] - The name of the channel.
	 * @returns {Promise<RestGroupDMChannel>}
	 */
	async edit(options: EditGroupDMOptions, reason?: string) {
		return this._client.channels.edit<RestGroupDMChannel>(this.id, options, reason);
	}
}
