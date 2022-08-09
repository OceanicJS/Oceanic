import BaseRoute from "./BaseRoute";
import type { RawPrivateChannel, RawGroupChannel } from "./Channels";
import type { PremiumTypes } from "../Constants";
import * as Routes from "../util/Routes";
import PrivateChannel from "../structures/PrivateChannel";
import GroupChannel from "../structures/GroupChannel";
import User from "../structures/User";
import ExtendedUser from "../structures/ExtendedUser";

export default class Users extends BaseRoute {
	/**
	 * Create a direct message.
	 *
	 * @param {String} recipient - The id of the recipient of the direct message.
	 * @returns {Promise<PrivateChannel>}
	 */
	async createDM(recipient: string) {
		return this._manager.authRequest<RawPrivateChannel>({
			method: "POST",
			path:   Routes.OAUTH_CHANNELS,
			json:   {
				recipient_id: recipient
			} }
		).then(data => this._client.privateChannels.update(data));
	}

	/**
	 * Create a group dm.
	 *
	 * @param {Object} options
	 * @param {String[]} options.accessTokens - An array of access tokens with the `gdm.join` scope.
	 * @param {Object} [options.nicks] - A dictionary of ids to nicknames, looks unused.
	 * @returns {Promise<GroupChannel>}
	 */
	async createGroupDM(options: CreateGroupChannelOptions) {
		return this._manager.authRequest<RawGroupChannel>({
			method: "POST",
			path:   Routes.OAUTH_CHANNELS,
			json:   {
				access_tokens: options.accessTokens,
				nicks:         options.nicks
			} }).then(data => this._client.groupChannels.update(data));
	}

	/**
	 * Get a user by their id
	 *
	 * @param {String} id - the id of the user
	 * @returns {Promise<User>}
	 */
	async get(id: string) {
		return this._manager.authRequest<RawUser>({
			method: "GET",
			path:   Routes.USER(id)
		}).then(data => this._client.users.update(data));
	}

	/**
	 * Get the currently authenticated user's information.
	 *
	 * @returns {Promise<ExtendedUser>}
	 */
	async getCurrentUser() {
		return this._manager.authRequest<RawExtendedUser>({
			method: "GET",
			path:   Routes.OAUTH_CURRENT_USER
		}).then(data => new ExtendedUser(data, this._client));
	}

	/**
	 * Leave a guild.
	 *
	 * @param {String} id - The id of the guild to leave.
	 * @returns {Promise<Boolean>}
	 */
	async leaveGuild(id: string) {
		return this._manager.authRequest<null>({
			method: "DELETE",
			path:   Routes.OAUTH_GUILD(id)
		}).then(res => res === null);
	}

	/**
	 * Modify the currently authenticated user.
	 *
	 * @param {Object} options
	 * @param {String} [options.username] - The new username
	 * @param {?(String | Buffer)} [options.avatar] - The new avatar (buffer, or full data url). `null` to remove the current avatar.
	 * @returns {Promise<ExtendedUser>}
	 */
	async modifySelf(options: EditSelfUserOptions) {
		if (options.avatar) {
			try {
				options.avatar = this._client._convertImage(options.avatar);
			} catch (err) {
				throw new Error("Invalid avatar provided. Ensure you are providing a valid, fully-qualified base64 url.", { cause: err as Error });
			}
		}
		return this._manager.authRequest<RawExtendedUser>({
			method: "PATCH",
			path:   Routes.USER("@me"),
			json:   options
		}).then(data => new ExtendedUser(data, this._client));
	}
}

// avatar_decoration, (self) bio
export interface RESTUser {
	accent_color?: number | null;
	avatar: string | null;
	banner?: string | null;
	bot?: boolean;
	discriminator: string;
	email?: string | null;
	flags?: number;
	id: string;
	locale?: string;
	mfa_enabled?: boolean;
	premium_type?: PremiumTypes;
	public_flags?: number;
	system?: boolean;
	username: string;
	verified?: boolean;
}
export type RawUser = Pick<RESTUser, "id" | "username" | "discriminator" | "avatar" | "bot" | "system" | "banner" | "accent_color"> & Required<Pick<RESTUser, "public_flags">>;
export type RawExtendedUser = Pick<RESTUser, "id" | "username" | "discriminator" | "avatar" | "bot" | "system"> & Required<Pick<RESTUser, "banner" | "accent_color" | "locale" | "mfa_enabled" | "email" | "verified" | "flags" | "public_flags">>;

export interface EditSelfUserOptions {
	avatar?: Buffer | string | null;
	username?: string;
}

export interface CreateGroupChannelOptions {
	accessTokens: Array<string>;
	nicks?: Record<string, string>;
}
