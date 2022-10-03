/** @module Routes/OAuth */
import type {
    AuthorizationInformation,
    ClientCredentialsTokenOptions,
    ClientCredentialsTokenResponse,
    Connection,
    ExchangeCodeOptions,
    ExchangeCodeResponse,
    OAuthURLOptions,
    RawAuthorizationInformation,
    RawClientCredentialsTokenResponse,
    RawConnection,
    RawExchangeCodeResponse,
    RawRefreshTokenResponse,
    RefreshTokenOptions,
    RefreshTokenResponse,
    RESTApplication,
    RevokeTokenOptions
} from "../types/oauth";
import type { RawGuild, RESTMember } from "../types/guilds";
import * as Routes from "../util/Routes";
import { BASE_URL } from "../Constants";
import Application from "../structures/Application";
import PartialApplication from "../structures/PartialApplication";
import Member from "../structures/Member";
import Guild from "../structures/Guild";
import Webhook from "../structures/Webhook";
import Integration from "../structures/Integration";
import type RESTManager from "../rest/RESTManager";
import OAuthHelper from "../rest/OAuthHelper";
import { FormData } from "undici";

/** Various methods for interacting with oauth. */
export default class OAuth {
    #manager: RESTManager;
    constructor(manager: RESTManager) {
        this.#manager = manager;
    }

    /**
     * Construct an oauth authorization url.
     * @param options The options to construct the url with.
     */
    static constructURL(options: OAuthURLOptions): string {
        const params: Array<string> = [
            `client_id=${options.clientID}`,
            `response_type=${options.responseType ?? "code"}`,
            `scope=${options.scopes.join("%20")}`
        ];
        if (options.redirectURI) {
            params.push(`redirect_uri=${options.redirectURI}`);
        }
        if (typeof options.disableGuildSelect !== "undefined") {
            params.push(`disable_guild_select=${String(options.disableGuildSelect)}`);
        }
        if (options.prompt) {
            params.push(`prompt=${options.prompt}`);
        }
        if (options.permissions) {
            params.push(`permissions=${options.permissions}`);
        }
        if (options.guildID) {
            params.push(`guild_id=${options.guildID}`);
        }
        if (options.state) {
            params.push(`state=${options.state}`);
        }
        return `${BASE_URL}${Routes.OAUTH_AUTHORIZE}?${params.join("&")}`;
    }

    get constructURL(): typeof OAuth["constructURL"] {
        return OAuth.constructURL.bind(OAuth);
    }

    /**
     * Get an access token for the application owner. If the application is owned by a team, this is restricted to `identify` & `applications.commands.update`.
     * @param options The options to for the client credentials grant.
     */
    async clientCredentialsGrant(options: ClientCredentialsTokenOptions): Promise<ClientCredentialsTokenResponse> {
        const form = new FormData();
        form.append("grant_type", "client_credentials");
        form.append("scope", options.scopes.join(" "));
        return this.#manager.request<RawClientCredentialsTokenResponse>({
            method: "POST",
            path:   Routes.OAUTH_TOKEN,
            form,
            auth:   (options.clientID ?? this.#manager.client.application) && options.clientSecret ? `Basic ${Buffer.from(`${options.clientID ?? this.#manager.client.application.id}:${options.clientSecret}`).toString("base64")}` : true
        }).then(data => ({
            accessToken: data.access_token,
            expiresIn:   data.expires_in,
            scopes:      data.scope.split(" "),
            tokenType:   data.token_type,
            webhook:     !data.webhook ? null : new Webhook(data.webhook, this.#manager.client)
        }));
    }

    /**
     * Exchange a code for an access token.
     * @param options The options for exchanging the code.
     */
    async exchangeCode(options: ExchangeCodeOptions): Promise<ExchangeCodeResponse> {
        const form = new FormData();
        form.append("client_id", options.clientID);
        form.append("client_secret", options.clientSecret);
        form.append("code", options.code);
        form.append("grant_type", "authorization_code");
        form.append("redirect_uri", options.redirectURI);
        return this.#manager.authRequest<RawExchangeCodeResponse>({
            method: "POST",
            path:   Routes.OAUTH_TOKEN,
            form
        }).then(data => ({
            accessToken:  data.access_token,
            expiresIn:    data.expires_in,
            refreshToken: data.refresh_token,
            scopes:       data.scope.split(" "),
            tokenType:    data.token_type,
            webhook:      !data.webhook ? null : new Webhook(data.webhook, this.#manager.client)
        }));
    }

    /**
     * Get the current OAuth2 application's information.
     */
    async getApplication(): Promise<Application> {
        return this.#manager.authRequest<RESTApplication>({
            method: "GET",
            path:   Routes.OAUTH_APPLICATION
        }).then(data => new Application(data, this.#manager.client));
    }

    /**
     * Get information about the current authorization.
     *
     * Note: OAuth only. Bots cannot use this.
     */
    async getCurrentAuthorizationInformation(): Promise<AuthorizationInformation> {
        return this.#manager.authRequest<RawAuthorizationInformation>({
            method: "GET",
            path:   Routes.OAUTH_INFO
        }).then(data => ({
            application: new PartialApplication(data.application, this.#manager.client),
            expires:     new Date(data.expires),
            scopes:      data.scopes,
            user:        this.#manager.client.users.update(data.user)
        }));
    }

    /**
     * Get the connections of the currently authenticated user.
     *
     * Note: Requires the `connections` scope when using oauth.
     */
    async getCurrentConnections(): Promise<Array<Connection>> {
        return this.#manager.authRequest<Array<RawConnection>>({
            method: "GET",
            path:   Routes.OAUTH_CONNECTIONS
        }).then(data => data.map(connection => ({
            friendSync:   connection.friend_sync,
            id: 	         connection.id,
            integrations: connection.integrations?.map(integration => new Integration(integration, this.#manager.client)),
            name:         connection.name,
            revoked:      connection.revoked,
            showActivity: connection.show_activity,
            twoWayLink:   connection.two_way_link,
            type:         connection.type,
            verified:     connection.verified,
            visibility:   connection.visibility
        })));
    }

    /**
     * Get the guild member information about the currently authenticated user.
     *
     * Note: OAuth only. Requires the `guilds.members.read` scope. Bots cannot use this.
     * @param guild the ID of the guild
     */
    async getCurrentGuildMember(guild: string): Promise<Member> {
        return this.#manager.authRequest<RESTMember>({
            method: "GET",
            path:   Routes.OAUTH_GUILD_MEMBER(guild)
        }).then(data => new Member(data, this.#manager.client, guild));
    }

    /**
     * Get the currently authenticated user's guilds.
     *
     * Note: This does NOT add the guilds to the client's cache.
     */
    async getCurrentGuilds(): Promise<Array<Guild>> {
        return this.#manager.authRequest<Array<RawGuild>>({
            method: "GET",
            path:   Routes.OAUTH_GUILDS
        }).then(data => data.map(d => new Guild(d, this.#manager.client)));
    }

    /** Get a helper instance that can be used with a specific bearer token. */
    getHelper(token: string): OAuthHelper {
        return new OAuthHelper(this.#manager, token);
    }

    /**
     * Refresh an existing access token.
     * @param options The options for refreshing the token.
     */
    async refreshToken(options: RefreshTokenOptions): Promise<RefreshTokenResponse> {
        const form = new FormData();
        form.append("client_id", options.clientID);
        form.append("client_secret", options.clientSecret);
        form.append("grant_type", "refresh_token");
        form.append("refresh_token", options.refreshToken);
        return this.#manager.authRequest<RawRefreshTokenResponse>({
            method: "POST",
            path:   Routes.OAUTH_TOKEN,
            form
        }).then(data => ({
            accessToken:  data.access_token,
            expiresIn:    data.expires_in,
            refreshToken: data.refresh_token,
            scopes:       data.scope.split(" "),
            tokenType:    data.token_type
        }));
    }


    /**
     * Revoke an access token.
     * @param options The options for revoking the token.
     */
    async revokeToken(options: RevokeTokenOptions): Promise<void> {
        const form = new FormData();
        form.append("client_id", options.clientID);
        form.append("client_secret", options.clientSecret);
        form.append("token", options.token);
        await this.#manager.authRequest<null>({
            method: "POST",
            path:   Routes.OAUTH_TOKEN_REVOKE,
            form
        });
    }
}
