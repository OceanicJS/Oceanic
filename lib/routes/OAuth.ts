import BaseRoute from "./BaseRoute";
import type { RawUser } from "./Users";
import type { RawGuild, RawIntegration, RawMember } from "./Guilds";
import * as Routes from "../util/Routes";
import type { ConnectionService, Permission, TeamMembershipState, VisibilityTypes } from "../Constants";
import { BASE_URL } from "../Constants";
import Application from "../structures/Application";
import { PartialApplication } from "../structures/PartialApplication";
import type User from "../structures/User";
import Member from "../structures/Member";
import Guild from "../structures/Guild";
import { FormData } from "undici";

export default class OAuth extends BaseRoute {
	/**
	 * Get an access token for the application owner. If the application is owned by a team, this is restricted to `identify` & `applications.commands.update`.
	 *
	 * @param {Object} options
	 * @param {string[]} options.scopes - The [scopes](https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes) to request.
	 * @returns {Promise<ClientCredentialsTokenResponse>}
	 */
	async clientCredentialsToken(options: clientCredentialsTokenOptions) {
		const form = new FormData();
		form.append("grant_type", "client_credentials");
		form.append("scope", options.scopes.join(" "));
		return this._manager.authRequest<RawClientCredentialsTokenResponse>({
			method: "POST",
			path:   Routes.OAUTH_TOKEN,
			form
		}).then(data => ({
			accessToken: data.access_token,
			expiresIn:   data.expires_in,
			scopes:      data.scope.split(" "),
			tokenType:   data.token_type
		}) as ClientCredentialsTokenResponse);
	}

	/**
	 * Construct an oauth authorization url.
	 *
	 * @param {Object} options
	 * @param {String} options.clientID - The client id of the application.
	 * @param {Boolean} [options.disableGuildSelect] - If the guild dropdown should be disabled.
	 * @param {String} [options.guildID] - The id of the guild to preselect.
	 * @param {String} [options.permissions] - The permissions to request.
	 * @param {("consent" | "none")} [options.prompt] - `consent` to show the prompt, `none` to not show the prompt if the user has already authorized previously.
	 * @param {String} [options.redirectURI] - The redirect uri of the application.
	 * @param {string[]} options.scopes - The [scopes](https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes) to request.
	 * @param {String} [options.state] - The state to send.
	 * @returns {String}
	 */
	constructURL(options: OAuthURLOption) {
		const params: Array<string> = [
			`client_id=${options.clientID}`,
			`response_type=${options.responseType || "code"}`,
			`scope=${options.scopes.join("%20")}`
		];
		if (options.redirectURI) params.push(`redirect_uri=${options.redirectURI}`);
		if (typeof options.disableGuildSelect !== "undefined") params.push(`disable_guild_select=${String(options.disableGuildSelect)}`);
		if (options.prompt) params.push(`prompt=${options.prompt}`);
		if (options.permissions) params.push(`permissions=${options.permissions}`);
		if (options.guildID) params.push(`guild_id=${options.guildID}`);
		if (options.state) params.push(`state=${options.state}`);
		return `${BASE_URL}${Routes.OAUTH_AUTHORIZE}?${params.join("&")}`;
	}

	/**
	 * Exchange a code for an access token.
	 *
	 * @param {Object} options.clientID - The id of the client the authorization was performed with.
	 * @param {Object} options.clientSecret - The secret of the client the authorization was performed with.
	 * @param {Object} options.code - The code from the authorization.
	 * @param {Object} options.redirectURI - The redirect uri used in the authorization.
	 * @returns {Promise<ExchangeCodeResponse>}
	 */
	async exchangeCode(options: ExchangeCodeOptions) {
		const form = new FormData();
		form.append("client_id", options.clientID);
		form.append("client_secret", options.clientSecret);
		form.append("code", options.code);
		form.append("grant_type", "authorization_code");
		form.append("redirect_uri", options.redirectURI);
		return this._manager.authRequest<RawExchangeCodeResponse>({
			method: "POST",
			path:   Routes.OAUTH_TOKEN,
			form
		}).then(data => ({
			accessToken:  data.access_token,
			expiresIn:    data.expires_in,
			refreshToken: data.refresh_token,
			scopes:       data.scope.split(" "),
			tokenType:    data.token_type
		}) as ExchangeCodeResponse);
	}

	/**
	 * Get the OAuth application information.
	 *
	 * @returns {Promise<Application>}
	 */
	async getApplication() {
		return this._manager.authRequest<RESTApplication>({
			method: "GET",
			path:   Routes.OAUTH_APPLICATION
		}).then(data => new Application(data, this._client));
	}

	/**
	 * Get information about the current authorization.
	 *
	 * Note: OAuth only. Bots cannot use this.
	 *
	 * @returns {Promise<AuthorizationInformation>}
	 */
	async getCurrentAuthorizationInformation() {
		return this._manager.authRequest<RawAuthorizationInformation>({
			method: "GET",
			path:   Routes.OAUTH_INFO
		}).then(data => ({
			application: new PartialApplication(data.application, this._client),
			expires:     new Date(data.expires),
			scopes:      data.scopes,
			user:        this._client.users.update(data.user)
		}) as AuthorizationInformation);
	}

	/**
	 * Get the connections of the currently authenticated user.
	 *
	 * Note: Requires the `connections` scope when using oauth.
	 *
	 * @returns {Promise<Connection>}
	 */
	async getCurrentConnections() {
		return this._manager.authRequest<Connection>({
			method: "GET",
			path:   Routes.OAUTH_CONNECTIONS
		});
	}

	/**
	 * Get the guild member information about the currently authenticated user.
	 *
	 * Note: OAuth only. Requires the `guilds.members.read` scope. Bots cannot use this.
	 *
	 * @param {String} guild - the id of the guild
	 * @returns {Promise<Member>}
	 */
	async getCurrentGuildMember(guild: string) {
		return this._manager.authRequest<RawMember>({
			method: "GET",
			path:   Routes.OAUTH_GUILD_MEMBER(guild)
		}).then(data => new Member(data, this._client, guild));
	}

	/**
	 * Get the currently authenticated user's guilds.
	 *
	 * @returns {Promise<Guild[]>}
	 */
	async getCurrentGuilds() {
		return this._manager.authRequest<Array<RawGuild>>({
			method: "GET",
			path:   Routes.OAUTH_GUILDS
		}).then(data => data.map(d => new Guild(d, this._client)));
	}


	/**
	 * Exchange a code for an access token.
	 *
	 * @param {Object} options.clientID - The id of the client the authorization was performed with.
	 * @param {Object} options.clientSecret - The secret of the client the authorization was performed with.
	 * @param {Object} options.refreshToken - The refresh token from when the code was exchanged.
	 * @returns {Promise<ExchangeCodeResponse>}
	 */
	async refreshToken(options: RefreshTokenOptions) {
		const form = new FormData();
		form.append("client_id", options.clientID);
		form.append("client_secret", options.clientSecret);
		form.append("grant_type", "refresh_token");
		form.append("refresh_token", options.refreshToken);
		return this._manager.authRequest<RawExchangeCodeResponse>({
			method: "POST",
			path:   Routes.OAUTH_TOKEN,
			form
		}).then(data => ({
			accessToken:  data.access_token,
			expiresIn:    data.expires_in,
			refreshToken: data.refresh_token,
			scopes:       data.scope.split(" "),
			tokenType:    data.token_type
		}) as ExchangeCodeResponse);
	}
}

export interface RawApplication {
	bot_public: boolean;
	bot_require_code_grant: boolean;
	cover_image?: string;
	custom_install_url?: string;
	description: string;
	flags?: number;
	guild_id?: string;
	icon: string | null;
	id: string;
	install_params?: InstallParams;
	name: string;
	owner?: RawUser;
	primary_sku_id?: string;
	privacy_policy_url?: string;
	rpc_origins?: Array<string>;
	slug?: string;
	// summary is deprecated and being removed in v11
	tags?: Array<string>;
	team: RawTeam | null;
	terms_of_service_url?: string;
	verify_key: string;
}
export type RawPartialApplication = Pick<RawApplication, "id" | "name" | "icon" | "description" | "bot_public" | "bot_require_code_grant" | "verify_key">;
export type RESTApplication = Omit<RawApplication, "cover_image" | "flags" | "install_params" | "owner" | "rpc_origins"> & Required<Pick<RawApplication, "cover_image" | "flags" | "install_params" | "owner" | "rpc_origins">>;

export interface RawTeam {
	icon: string | null;
	id: string;
	members: Array<RawTeamMember>;
	name: string;
	owner_user_id: string;
}

export interface RawTeamMember {
	membership_state: TeamMembershipState;
	permissions: ["*"];
	team_id: string;
	user: RawUser;
}

export interface InstallParams {
	permissions: Array<Permission>;
	scopes: Array<string>;
}

export interface RawAuthorizationInformation {
	application: RawPartialApplication;
	expires: string;
	scopes: Array<string>;
	user: RawUser;
}

export interface AuthorizationInformation {
	application: PartialApplication;
	expires: Date;
	scopes: Array<string>;
	user: User;
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

export interface OAuthURLOption {
	clientID: string;
	disableGuildSelect?: boolean;
	guildID?: string;
	permissions?: string;
	prompt?: "consent" | "none";
	redirectURI?: string;
	responseType?: "code" | "token";
	scopes: Array<string>;
	state?: string;
}

export interface ExchangeCodeOptions {
	clientID: string;
	clientSecret: string;
	code: string;
	redirectURI: string;
}

export interface RawExchangeCodeResponse {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	token_type: "Bearer";
}

export interface ExchangeCodeResponse {
	accessToken: string;
	expiresIn: number;
	refreshToken: string;
	scopes: Array<string>;
	tokenType: "Bearer";
}

export interface RefreshTokenOptions {
	clientID: string;
	clientSecret: string;
	refreshToken: string;
}

export interface clientCredentialsTokenOptions {
	scopes: Array<string>;
}

export type RawClientCredentialsTokenResponse = Omit<RawExchangeCodeResponse, "refresh_token">;
export type ClientCredentialsTokenResponse = Omit<ExchangeCodeResponse, "refreshToken">;

// @TODO token revocation, `webhook.incoming` response
