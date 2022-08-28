"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = __importDefault(require("./BaseRoute"));
const Routes = __importStar(require("../util/Routes"));
const Constants_1 = require("../Constants");
const Application_1 = __importDefault(require("../structures/Application"));
const PartialApplication_1 = __importDefault(require("../structures/PartialApplication"));
const Member_1 = __importDefault(require("../structures/Member"));
const Guild_1 = __importDefault(require("../structures/Guild"));
const Webhook_1 = __importDefault(require("../structures/Webhook"));
const Integration_1 = __importDefault(require("../structures/Integration"));
const undici_1 = require("undici");
class OAuth extends BaseRoute_1.default {
    /**
     * Get an access token for the application owner. If the application is owned by a team, this is restricted to `identify` & `applications.commands.update`.
     *
     * @param {Object} options
     * @param {string[]} options.scopes - The [scopes](https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes) to request.
     * @returns {Promise<ClientCredentialsTokenResponse>}
     */
    async clientCredentialsGrant(options) {
        const form = new undici_1.FormData();
        form.append("grant_type", "client_credentials");
        form.append("scope", options.scopes.join(" "));
        return this._manager.authRequest({
            method: "POST",
            path: Routes.OAUTH_TOKEN,
            form
        }).then(data => ({
            accessToken: data.access_token,
            expiresIn: data.expires_in,
            scopes: data.scope.split(" "),
            tokenType: data.token_type
        }));
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
    constructURL(options) {
        const params = [
            `client_id=${options.clientID}`,
            `response_type=${options.responseType || "code"}`,
            `scope=${options.scopes.join("%20")}`
        ];
        if (options.redirectURI)
            params.push(`redirect_uri=${options.redirectURI}`);
        if (typeof options.disableGuildSelect !== "undefined")
            params.push(`disable_guild_select=${String(options.disableGuildSelect)}`);
        if (options.prompt)
            params.push(`prompt=${options.prompt}`);
        if (options.permissions)
            params.push(`permissions=${options.permissions}`);
        if (options.guildID)
            params.push(`guild_id=${options.guildID}`);
        if (options.state)
            params.push(`state=${options.state}`);
        return `${Constants_1.BASE_URL}${Routes.OAUTH_AUTHORIZE}?${params.join("&")}`;
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
    async exchangeCode(options) {
        const form = new undici_1.FormData();
        form.append("client_id", options.clientID);
        form.append("client_secret", options.clientSecret);
        form.append("code", options.code);
        form.append("grant_type", "authorization_code");
        form.append("redirect_uri", options.redirectURI);
        return this._manager.authRequest({
            method: "POST",
            path: Routes.OAUTH_TOKEN,
            form
        }).then(data => ({
            accessToken: data.access_token,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            scopes: data.scope.split(" "),
            tokenType: data.token_type,
            webhook: !data.webhook ? null : new Webhook_1.default(data.webhook, this._client)
        }));
    }
    /**
     * Get the OAuth application information.
     *
     * @returns {Promise<Application>}
     */
    async getApplication() {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.OAUTH_APPLICATION
        }).then(data => new Application_1.default(data, this._client));
    }
    /**
     * Get information about the current authorization.
     *
     * Note: OAuth only. Bots cannot use this.
     *
     * @returns {Promise<AuthorizationInformation>}
     */
    async getCurrentAuthorizationInformation() {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.OAUTH_INFO
        }).then(data => ({
            application: new PartialApplication_1.default(data.application, this._client),
            expires: new Date(data.expires),
            scopes: data.scopes,
            user: this._client.users.update(data.user)
        }));
    }
    /**
     * Get the connections of the currently authenticated user.
     *
     * Note: Requires the `connections` scope when using oauth.
     *
     * @returns {Promise<Connection[]>}
     */
    async getCurrentConnections() {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.OAUTH_CONNECTIONS
        }).then(data => data.map(connection => ({
            friendSync: connection.friend_sync,
            id: connection.id,
            integrations: connection.integrations?.map(integration => new Integration_1.default(integration, this._client)),
            name: connection.name,
            revoked: connection.revoked,
            showActivity: connection.show_activity,
            type: connection.type,
            verified: connection.verified,
            visibility: connection.visibility
        })));
    }
    /**
     * Get the guild member information about the currently authenticated user.
     *
     * Note: OAuth only. Requires the `guilds.members.read` scope. Bots cannot use this.
     *
     * @param {String} guild - the id of the guild
     * @returns {Promise<Member>}
     */
    async getCurrentGuildMember(guild) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.OAUTH_GUILD_MEMBER(guild)
        }).then(data => new Member_1.default(data, this._client, guild));
    }
    /**
     * Get the currently authenticated user's guilds.
     *
     * @returns {Promise<Guild[]>}
     */
    async getCurrentGuilds() {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.OAUTH_GUILDS
        }).then(data => data.map(d => new Guild_1.default(d, this._client)));
    }
    /**
     * Exchange a code for an access token.
     *
     * @param {Object} options.clientID - The id of the client the authorization was performed with.
     * @param {Object} options.clientSecret - The secret of the client the authorization was performed with.
     * @param {Object} options.refreshToken - The refresh token from when the code was exchanged.
     * @returns {Promise<ExchangeCodeResponse>}
     */
    async refreshToken(options) {
        const form = new undici_1.FormData();
        form.append("client_id", options.clientID);
        form.append("client_secret", options.clientSecret);
        form.append("grant_type", "refresh_token");
        form.append("refresh_token", options.refreshToken);
        return this._manager.authRequest({
            method: "POST",
            path: Routes.OAUTH_TOKEN,
            form
        }).then(data => ({
            accessToken: data.access_token,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            scopes: data.scope.split(" "),
            tokenType: data.token_type,
            webhook: !data.webhook ? undefined : new Webhook_1.default(data.webhook, this._client)
        }));
    }
    /**
     * Revoke an access token.
     *
     * @param {Object} options.clientID - The id of the client the authorization was performed with.
     * @param {Object} options.clientSecret - The secret of the client the authorization was performed with.
     * @param {Object} options.token - The access token to revoke.
     * @returns {Promise<void>}
     */
    async revokeToken(options) {
        const form = new undici_1.FormData();
        form.append("client_id", options.clientID);
        form.append("client_secret", options.clientSecret);
        form.append("token", options.token);
        await this._manager.authRequest({
            method: "POST",
            path: Routes.OAUTH_TOKEN_REVOKE,
            form
        });
    }
}
exports.default = OAuth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT0F1dGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvcm91dGVzL09BdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0REFBb0M7QUFrQnBDLHVEQUF5QztBQUN6Qyw0Q0FBd0M7QUFDeEMsNEVBQW9EO0FBQ3BELDBGQUFrRTtBQUNsRSxrRUFBMEM7QUFDMUMsZ0VBQXdDO0FBQ3hDLG9FQUE0QztBQUM1Qyw0RUFBb0Q7QUFDcEQsbUNBQWtDO0FBRWxDLE1BQXFCLEtBQU0sU0FBUSxtQkFBUztJQUMzQzs7Ozs7O09BTUc7SUFDSCxLQUFLLENBQUMsc0JBQXNCLENBQUMsT0FBc0M7UUFDbEUsTUFBTSxJQUFJLEdBQUcsSUFBSSxpQkFBUSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQW9DO1lBQ25FLE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFJLE1BQU0sQ0FBQyxXQUFXO1lBQzFCLElBQUk7U0FDSixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoQixXQUFXLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDOUIsU0FBUyxFQUFJLElBQUksQ0FBQyxVQUFVO1lBQzVCLE1BQU0sRUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7WUFDbEMsU0FBUyxFQUFJLElBQUksQ0FBQyxVQUFVO1NBQzVCLENBQW1DLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7T0FhRztJQUNILFlBQVksQ0FB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