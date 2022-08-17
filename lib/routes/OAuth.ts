import BaseRoute from "./BaseRoute";
import type {
	AuthorizationInformation,
	ClientCredentialsTokenOptions,
	ClientCredentialsTokenResponse,
	Connection,
	ExchangeCodeOptions,
	ExchangeCodeResponse,
	OAuthURLOption,
	RawAuthorizationInformation,
	RawClientCredentialsTokenResponse,
	RawExchangeCodeResponse,
	RefreshTokenOptions,
	RESTApplication,
	RevokeTokenOptions
} from "../types/oauth";
import type { RawGuild, RawMember } from "../types/guilds";
import * as Routes from "../util/Routes";
import { BASE_URL } from "../Constants";
import Application from "../structures/Application";
import { PartialApplication } from "../structures/PartialApplication";
import Member from "../structures/Member";
import Guild from "../structures/Guild";
import Webhook from "../structures/Webhook";
import { FormData } from "undici";

export default class OAuth extends BaseRoute {
	/**
	 * Get an access token for the application owner. If the application is owned by a team, this is restricted to `identify` & `applications.commands.update`.
	 *
	 * @param {Object} options
	 * @param {string[]} options.scopes - The [scopes](https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes) to request.
	 * @returns {Promise<ClientCredentialsTokenResponse>}
	 */
	async clientCredentialsGrant(options: ClientCredentialsTokenOptions) {
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
			tokenType:    data.token_type,
			webhook:      !data.webhook ? null : new Webhook(data.webhook, this._client)
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
			tokenType:    data.token_type,
			webhook: 	    !data.webhook ? undefined : new Webhook(data.webhook, this._client)
		}) as ExchangeCodeResponse);
	}


	/**
	 * Revoke an access token.
	 *
	 * @param {Object} options.clientID - The id of the client the authorization was performed with.
	 * @param {Object} options.clientSecret - The secret of the client the authorization was performed with.
	 * @param {Object} options.token - The access token to revoke.
	 * @returns {Promise<void>}
	 */
	async revokeToken(options: RevokeTokenOptions) {
		const form = new FormData();
		form.append("client_id", options.clientID);
		form.append("client_secret", options.clientSecret);
		form.append("token", options.token);
		await this._manager.authRequest<null>({
			method: "POST",
			path:   Routes.OAUTH_TOKEN_REVOKE,
			form
		});
	}
}
