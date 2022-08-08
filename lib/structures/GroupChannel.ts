import Channel from "./Channel";
import type { AddGroupRecipientOptions, EditGroupDMOptions, RawGroupChannel } from "../routes/Channels";
import type { ChannelTypes, ImageFormat } from "../Constants";
import type Client from "../Client";
import Properties from "../util/Properties";
import * as Routes from "../util/Routes";

/** Represents a group direct message. */
export default class GroupChannel extends Channel {
	private _recipients: Array<string>;
	/** The id of the application that made this group channel. */
	applicationID: string;
	/** The icon hash of this group, if any. */
	icon: string | null;
	/** If this group channel is managed by an application. */
	managed: boolean;
	/** The name of this group channel. */
	name: string | null;
	/** The nicknames used when creating this group channel. */
	nicks?: Record<"id" | "nick", string>;
	/** The id of the owner of this group channel. */
	ownerID: string;
	declare type: ChannelTypes.GROUP_DM;
	constructor(data: RawGroupChannel, client: Client) {
		super(data, client);
		Properties.define(this, "_recipients", data.recipients.map(user => user.id), true);
		this.update(data);
	}

	protected update(data: RawGroupChannel) {
		super.update(data);
		this.applicationID = data.application_id;
		this.icon          = data.icon;
		this.managed       = data.managed;
		this.name          = data.name;
		this.nicks         = data.nicks;
		this.ownerID       = data.owner_id;
		this.type          = data.type;
		data.recipients.map(user => this._client.users.update(user));
		this._recipients = data.recipients.map(user => user.id);
	}

	/** The users in this group channel. */
	get recipients() { return this._recipients.map(user => this._client.users.get(user)!); }

	/**
	 * Add a user to this channel.
	 *
	 * @param {Object} options
	 * @param {String} options.accessToken - The access token of the user to add.
	 * @param {String} [options.nick] - The nickname of the user to add.
	 * @param {String} options.userID - The id of the user to add.
	 * @returns {Promise<boolean>}
	 */
	async addRecipient(options: AddGroupRecipientOptions) {
		return this._client.rest.channels.addGroupRecipient(this.id, options);
	}

	/**
	 * Edit this channel.
	 *
	 * @param {?String} [options.icon] - The icon of the channel.
	 * @param {String} [options.name] - The name of the channel.
	 * @returns {Promise<GroupChannel>}
	 */
	async edit(options: EditGroupDMOptions, reason?: string) {
		return this._client.rest.channels.edit<GroupChannel>(this.id, options, reason);
	}

	iconURL(format?: ImageFormat, size?: number) {
		return this.icon === null ? null : this._client._formatImage(Routes.APPLICATION_ICON(this.applicationID, this.icon), format, size);
	}

	/**
	 * Remove a user from this channel.
	 *
	 * @param {String} userID - The id of the user to remove.
	 * @returns {Promise<boolean>}
	 */
	async removeGroupRecipient(userID: string) {
		return this._client.rest.channels.removeGroupRecipient(this.id, userID);
	}
}
