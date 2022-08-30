import BaseRoute from "./BaseRoute";
import type { AuthorizationInformation, ClientCredentialsTokenOptions, ClientCredentialsTokenResponse, Connection, ExchangeCodeOptions, ExchangeCodeResponse, OAuthURLOptions, RefreshTokenOptions, RevokeTokenOptions } from "../types/oauth";
import Application from "../structures/Application";
import Member from "../structures/Member";
import Guild from "../structures/Guild";
export default class OAuth extends BaseRoute {
    /**
     * Get an access token for the application owner. If the application is owned by a team, this is restricted to `identify` & `applications.commands.update`.
     * @param options The options to for the client credentials grant.
     */
    clientCredentialsGrant(options: ClientCredentialsTokenOptions): Promise<ClientCredentialsTokenResponse>;
    /**
     * Construct an oauth authorization url.
     * @param options The options to construct the url with.
     */
    constructURL(options: OAuthURLOptions): string;
    /**
     * Exchange a code for an access token.
     * @param options The options for exchanging the code.
     */
    exchangeCode(options: ExchangeCodeOptions): Promise<ExchangeCodeResponse>;
    /**
     * Get the OAuth application information.
     */
    getApplication(): Promise<Application>;
    /**
     * Get information about the current authorization.
     *
     * Note: OAuth only. Bots cannot use this.
     */
    getCurrentAuthorizationInformation(): Promise<AuthorizationInformation>;
    /**
     * Get the connections of the currently authenticated user.
     *
     * Note: Requires the `connections` scope when using oauth.
     */
    getCurrentConnections(): Promise<Connection[]>;
    /**
     * Get the guild member information about the currently authenticated user.
     *
     * Note: OAuth only. Requires the `guilds.members.read` scope. Bots cannot use this.
     * @param guild the ID of the guild
     */
    getCurrentGuildMember(guild: string): Promise<Member>;
    /**
     * Get the currently authenticated user's guilds.
     */
    getCurrentGuilds(): Promise<Guild[]>;
    /**
     * Refresh an existing access token.
     * @param options The options for refreshing the token.
     */
    refreshToken(options: RefreshTokenOptions): Promise<ExchangeCodeResponse>;
    /**
     * Revoke an access token.
     * @param options The options for revoking the token.
     */
    revokeToken(options: RevokeTokenOptions): Promise<void>;
}
