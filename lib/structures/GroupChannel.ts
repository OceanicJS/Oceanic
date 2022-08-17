import Channel from "./Channel";
import type User from "./User";
import type { AddGroupRecipientOptions, EditGroupDMOptions, RawGroupChannel } from "../routes/Channels";
import type { ChannelTypes, ImageFormat } from "../Constants";
import type Client from "../Client";
import * as Routes from "../util/Routes";

/** Represents a group direct message. */
export default class GroupChannel extends Channel {
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
	/** The other recipients in this group channel. */
	recipients: Array<User>;
	declare type: ChannelTypes.GROUP_DM;
	constructor(data: RawGroupChannel, client: Client) {
		super(data, client);
		Object.defineProperty(this, "_recipients", {
			value:    data.recipients.map(user => user.id),
			writable: true
		});
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
		this.recipients    = data.recipients.map(user => this._client.users.update(user));
	}

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
