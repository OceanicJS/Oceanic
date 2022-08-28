import BaseRoute from "./BaseRoute";
import type { AuthorizationInformation, ClientCredentialsTokenOptions, ClientCredentialsTokenResponse, Connection, ExchangeCodeOptions, ExchangeCodeResponse, OAuthURLOption, RefreshTokenOptions, RevokeTokenOptions } from "../types/oauth";
import Application from "../structures/Application";
import Member from "../structures/Member";
import Guild from "../structures/Guild";
export default class OAuth extends BaseRoute {
    /**
     * Get an access token for the application owner. If the application is owned by a team, this is restricted to `identify` & `applications.commands.update`.
     *
     * @param {Object} options
     * @param {string[]} options.scopes - The [scopes](https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes) to request.
     * @returns {Promise<ClientCredentialsTokenResponse>}
     */
    clientCredentialsGrant(options: ClientCredentialsTokenOptions): Promise<ClientCredentialsTokenResponse>;
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
    constructURL(options: OAuthURLOption): string;
    /**
     * Exchange a code for an access token.
     *
     * @param {Object} options.clientID - The id of the client the authorization was performed with.
     * @param {Object} options.clientSecret - The secret of the client the authorization was performed with.
     * @param {Object} options.code - The code from the authorization.
     * @param {Object} options.redirectURI - The redirect uri used in the authorization.
     * @returns {Promise<ExchangeCodeResponse>}
     */
    exchangeCode(options: ExchangeCodeOptions): Promise<ExchangeCodeResponse>;
    /**
     * Get the OAuth application information.
     *
     * @returns {Promise<Application>}
     */
    getApplication(): Promise<Application>;
    /**
     * Get information about the current authorization.
     *
     * Note: OAuth only. Bots cannot use this.
     *
     * @returns {Promise<AuthorizationInformation>}
     */
    getCurrentAuthorizationInformation(): Promise<AuthorizationInformation>;
    /**
     * Get the connections of the currently authenticated user.
     *
     * Note: Requires the `connections` scope when using oauth.
     *
     * @returns {Promise<Connection[]>}
     */
    getCurrentConnections(): Promise<Connection[]>;
    /**
     * Get the guild member information about the currently authenticated user.
     *
     * Note: OAuth only. Requires the `guilds.members.read` scope. Bots cannot use this.
     *
     * @param {String} guild - the id of the guild
     * @returns {Promise<Member>}
     */
    getCurrentGuildMember(guild: string): Promise<Member>;
    /**
     * Get the currently authenticated user's guilds.
     *
     * @returns {Promise<Guild[]>}
     */
    getCurrentGuilds(): Promise<Guild[]>;
    /**
     * Exchange a code for an access token.
     *
     * @param {Object} options.clientID - The id of the client the authorization was performed with.
     * @param {Object} options.clientSecret - The secret of the client the authorization was performed with.
     * @param {Object} options.refreshToken - The refresh token from when the code was exchanged.
     * @returns {Promise<ExchangeCodeResponse>}
     */
    refreshToken(options: RefreshTokenOptions): Promise<ExchangeCodeResponse>;
    /**
     * Revoke an access token.
     *
     * @param {Object} options.clientID - The id of the client the authorization was performed with.
     * @param {Object} options.clientSecret - The secret of the client the authorization was performed with.
     * @param {Object} options.token - The access token to revoke.
     * @returns {Promise<void>}
     */
    revokeToken(options: RevokeTokenOptions): Promise<void>;
}
