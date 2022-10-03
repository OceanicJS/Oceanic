/** @module OAuthHelper */
import RESTManager from "./RESTManager";
import Application from "../structures/Application";
import {
    AuthorizationInformation,
    Connection,
    RawAuthorizationInformation,
    RawConnection,
    RawGuild,
    RESTApplication,
    RESTMember,
    RevokeTokenOptions
} from "../types";
import * as Routes from "../util/Routes";
import PartialApplication from "../structures/PartialApplication";
import Integration from "../structures/Integration";
import Member from "../structures/Member";
import Guild from "../structures/Guild";
import { FormData } from "undici";

/** A helper to make using authenitcated oauth requests without needing a new client instance. */
export default class OAuthHelper {
    #manager: RESTManager;
    #token: string;
    constructor(manager: RESTManager, token: string) {
        this.#token = token;
        this.#manager = manager;
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
     * Get the currently authenticated user's guilds.
     *
     * Note: This does NOT add the guilds to the client's cache.
     */
    async getCurrentGuilds(): Promise<Array<Guild>> {
        return this.#manager.request<Array<RawGuild>>({
            method: "GET",
            path:   Routes.OAUTH_GUILDS,
            auth:   this.#token
        }).then(data => data.map(guild => new Guild(guild, this.#manager.client)));
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
