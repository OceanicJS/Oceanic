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
import RestGroupChannel from "../structures/rest/RESTGroupChannel";

const BASE64URL_REGEX = /^data:image\/(?:jpeg|png|gif);base64,(?:[A-Za-z0-9+/]{2}[A-Za-z0-9+/]{2})*(?:[A-Za-z0-9+/]{2}(==)?|[A-Za-z0-9+/]{3}=?)?$/;
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
	 * @returns {Promise<RestGroupChannel>}
	 */
	async createGroupDM(accessTokens: Array<string>, nicks?: Record<string, string>) {
		return this._client.authRequest<RawRESTGroupChannel>("POST", Routes.OAUTH_CHANNELS, {
			access_tokens: accessTokens,
			nicks
		}).then(data => new RestGroupChannel(data, this._client));
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
	async modifySelf(options: ModifySelfUser) {
		if (options.avatar) {
			if (Buffer.isBuffer(options.avatar)) {
				const b64 = options.avatar.toString("base64");
				let mime: string | undefined;
				const magic = [...new Uint8Array(options.avatar.subarray(0, 4))].map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
				switch (magic) {
					case "47494638": mime = "image/gif"; break;
					case "89504E47": mime = "image/png"; break;
					case "FFD8FFDB": case "FFD8FFE0": case "49460001": case "FFD8FFEE": case "69660000": mime = "image/jpeg"; break;
				}
				if (!mime) throw new Error(`Failed to determine image format. (magic: ${magic})`);
				options.avatar = `data:${mime};base64,${b64}`;
			}
			if (!BASE64URL_REGEX.test(options.avatar)) throw new Error("Invalid avatar provided. Ensure you are providing a valid, fully-qualified base64 url.");
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

export interface ModifySelfUser {
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
