import BaseRoute from "./BaseRoute";
import type { RawIntegration, RawRESTGuild, RawRESTMember } from "./Guilds";
import type { RawRESTDMChannel, RawRESTGroupChannel } from "./Channels";
import type { ConnectionService, PremiumTypes, VisibilityTypes } from "../Constants";
import * as Routes from "../util/Routes";
import RESTUser from "../structures/rest/RESTUser";
import RESTSelfUser from "../structures/rest/RESTSelfUser";
import RESTGuild from "../structures/rest/RESTGuild";
import RESTMember from "../structures/rest/RESTMember";
import RESTDMChannel from "../structures/rest/RESTDMChannel";
import RestGroupDMChannel from "../structures/rest/RESTGroupDMChannel";

export default class Users extends BaseRoute {
	/**
	 * Create a direct message.
	 *
	 * @param {String} recipient - The id of the recipient of the direct message.
	 * @returns {Promise<RESTDMChannel>}
	 */
	async createDM(recipient: string) {
		return this._client.authRequest<RawRESTDMChannel>("POST", Routes.OAUTH_CHANNELS, {
			recipient_id: recipient
		}).then(data => new RESTDMChannel(data, this._client));
	}

	/**
	 * Create a group dm.
	 *
	 * @param {String[]} accessTokens - An array of access tokens with the `gdm.join` scope.
	 * @param {Object} [nicks] - A dictionary of ids to nicknames, looks unused.
	 * @returns {Promise<RestGroupDMChannel>}
	 */
	async createGroupDM(accessTokens: Array<string>, nicks?: Record<string, string>) {
		return this._client.authRequest<RawRESTGroupChannel>("POST", Routes.OAUTH_CHANNELS, {
			access_tokens: accessTokens,
			nicks
		}).then(data => new RestGroupDMChannel(data, this._client));
	}

	/**
	 * Get a user by their id
	 *
	 * @param {String} id - the id of the user
	 * @returns {Promise<RESTUser>}
	 */
	async get(id: string) {
		return this._client.authRequest<RawRESTUser>("GET", Routes.USER(id))
			.then(data => new RESTUser(data, this._client));
	}

	/**
	 * Get the connections of the currently authenticated user.
	 *
	 * Note: Requires the `connections` scope when using oauth.
	 *
	 * @returns {Promise<Connection>}
	 */
	async getCurrentConnections() {
		return this._client.authRequest<Connection>("GET", Routes.OAUTH_CONNECTIONS);
	}

	/**
	 * Get the guild member information about the currently authenticated user.
	 *
	 * Note: OAuth only. Requires the `guilds.members.read` scope. Bots cannot use this.
	 *
	 * @param {String} guild - the id of the guild
	 * @returns {Promise<RESTMember>}
	 */
	async getCurrentGuildMember(guild: string) {
		return this._client.authRequest<RawRESTMember>("GET", Routes.OAUTH_GUILD_MEMBER(guild))
			.then(data => new RESTMember(data, this._client, guild));
	}

	/**
	 * Get the currently authenticated user's guilds.
	 *
	 * @returns {Promise<RESTGuild[]>}
	 */
	async getCurrentGuilds() {
		return this._client.authRequest<Array<RawRESTGuild>>("GET", Routes.OAUTH_GUILDS)
			.then(data => data.map(d => new RESTGuild(d, this._client)));
	}

	/**
	 * Get the currently authenticated user's information.
	 *
	 * @returns {Promise<RESTSelfUser>}
	 */
	async getCurrentUser() {
		return this._client.authRequest<RawRESTSelfUser>("GET", Routes.OAUTH_CURRENT_USER)
			.then(data => new RESTSelfUser(data, this._client));
	}

	/**
	 * Leave a guild.
	 *
	 * @param {String} id - The id of the guild to leave.
	 * @returns {Promise<Boolean>}
	 */
	async leaveGuild(id: string) {
		return this._client.authRequest<null>("DELETE", Routes.OAUTH_GUILD(id)).then(res => res === null);
	}

	/**
	 * Modify the currently authenticated user.
	 *
	 * @param {Object} options
	 * @param {String} [options.username] - The new username
	 * @param {?(String | Buffer)} [options.avatar] - The new avatar (buffer, or full data url). `null` to remove the current avatar.
	 * @returns {Promise<RESTSelfUser>}
	 */
	async modifySelf(options: EditSelfUserOptions) {
		if (options.avatar) {
			try {
				options.avatar = this._client._convertImage(options.avatar);
			} catch (err) {
				throw new Error("Invalid avatar provided. Ensure you are providing a valid, fully-qualified base64 url.", { cause: err });
			}
		}
		return this._client.authRequest<RawRESTSelfUser>("PATCH", Routes.USER("@me"), options)
			.then(data => new RESTSelfUser(data, this._client));
	}
}

// avatar_decoration, (self) bio
export interface RawUser {
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
export type RawPartialUser = Required<Pick<RawUser, "id" | "username" | "avatar" | "discriminator" | "public_flags">> & Pick<RawUser, "bot" | "system">;
export type RawRESTUser = Pick<RawUser, "id" | "username" | "discriminator" | "avatar" | "bot" | "system"> & Required<Pick<RawUser, "banner" | "accent_color" | "public_flags">>;
export type RawRESTSelfUser = Pick<RawUser, "id" | "username" | "discriminator" | "avatar" | "bot" | "system"> & Required<Pick<RawUser, "banner" | "accent_color" | "locale" | "mfa_enabled" | "email" | "verified" | "flags" | "public_flags">>;

export interface EditSelfUserOptions {
	avatar?: Buffer | string | null;
	username?: string;
}

export interface Connection {
	friend_sync: boolean;
	id: string;
	integrations?: Array<RawIntegration>;
	name: string;
	revoked?: boolean;
	show_activity: boolean;
	type: ConnectionService;
	verified: boolean;
	visibility: VisibilityTypes;
}
