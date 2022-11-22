/** @module OAuthHelper */
import type RESTManager from "./RESTManager";
import Application from "../structures/Application";
import type {
    AuthorizationInformation,
    Connection,
    OAuthURLOptions,
    RawAuthorizationInformation,
    RawConnection,
    RESTApplication,
    RevokeTokenOptions
} from "../types/oauth";
import type { RawOAuthGuild, RESTMember } from "../types/guilds";
import * as Routes from "../util/Routes";
import PartialApplication from "../structures/PartialApplication";
import Integration from "../structures/Integration";
import Member from "../structures/Member";
import OAuthGuild from "../structures/OAuthGuild";
import ExtendedUser from "../structures/ExtendedUser";
import type { RawOAuthUser } from "../types";
import { BASE_URL } from "../Constants";
import { FormData } from "undici";

/** A helper to make using authenticated oauth requests without needing a new client instance. */
export default class OAuthHelper {
    #manager: RESTManager;
    #token: string;
    constructor(manager: RESTManager, token: string) {
        this.#token = token;
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

    /**
     * Get the current OAuth2 application's information.
     */
    async getApplication(): Promise<Application> {
        return this.#manager.request<RESTApplication>({
            method: "GET",
            path:   Routes.OAUTH_APPLICATION,
            auth:   this.#token
        }).then(data => new Application(data, this.#manager.client));
    }

    /**
     * Get information about the current authorization.
     */
    async getCurrentAuthorizationInformation(): Promise<AuthorizationInformation> {
        return this.#manager.request<RawAuthorizationInformation>({
            method: "GET",
            path:   Routes.OAUTH_INFO,
            auth:   this.#token
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
     * Note: Requires the `connections` scope.
     */
    async getCurrentConnections(): Promise<Array<Connection>> {
        return this.#manager.request<Array<RawConnection>>({
            method: "GET",
            path:   Routes.OAUTH_CONNECTIONS,
            auth:   this.#token
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
     * Note: Requires the `guilds.members.read` scope.
     * @param guild the ID of the guild
     */
    async getCurrentGuildMember(guild: string): Promise<Member> {
        return this.#manager.request<RESTMember>({
            method: "GET",
            path:   Routes.OAUTH_GUILD_MEMBER(guild),
            auth:   this.#token
        }).then(data => new Member(data, this.#manager.client, guild));
    }

    /**
     * Get the currently authenticated user's guilds. Note these are missing several properties gateway guilds have.
     */
    async getCurrentGuilds(): Promise<Array<OAuthGuild>> {
        return this.#manager.request<Array<RawOAuthGuild>>({
            method: "GET",
            path:   Routes.OAUTH_GUILDS,
            auth:   this.#token
        }).then(data => data.map(d => new OAuthGuild(d, this.#manager.client)));
    }

    /**
     * Get the currently authenticated user's information.
     *
     * Note: This does not touch the client's cache in any way.
     */
    async getCurrentUser(): Promise<ExtendedUser> {
        return this.#manager.request<RawOAuthUser>({
            method: "GET",
            path:   Routes.OAUTH_CURRENT_USER,
            auth:   this.#token
        }).then(data => new ExtendedUser(data, this.#manager.client));
    }


    /**
     * Revoke the used access token.
     * @param options The options for revoking the token.
     */
    async revokeToken(options: Omit<RevokeTokenOptions, "token">): Promise<void> {
        const form = new FormData();
        form.append("client_id", options.clientID);
        form.append("client_secret", options.clientSecret);
        form.append("token", this.#token);
        await this.#manager.authRequest<null>({
            method: "POST",
            path:   Routes.OAUTH_TOKEN_REVOKE,
            form
        });
    }
}
