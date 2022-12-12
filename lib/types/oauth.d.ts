/** @module Types/OAuth */
import type { RawUser } from "./users";
import type { OAuthWebhook } from "./webhooks";
import type { RawIntegration } from "./guilds";
import type { LocaleMap } from "./application-commands";
import type {
    ConnectionService,
    PermissionName,
    RoleConnectionMetadataTypes,
    TeamMembershipState,
    VisibilityTypes
} from "../Constants";
import type PartialApplication from "../structures/PartialApplication";
import type User from "../structures/User";
import type Webhook from "../structures/Webhook";
import type Integration from "../structures/Integration";

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
    role_connections_verification_url?: string;
    rpc_origins?: Array<string>;
    slug?: string;
    // summary is deprecated and being removed in v11
    tags?: Array<string>;
    team: RawTeam | null;
    terms_of_service_url?: string;
    verify_key: string;
}
export type RawPartialApplication = Pick<RawApplication, "id" | "name" | "icon" | "description"> & Partial<Pick<RawApplication, "bot_public" | "bot_require_code_grant" | "verify_key">>;
export type RESTApplication = Omit<RawApplication, "cover_image" | "flags" | "owner" | "rpc_origins"> & Required<Pick<RawApplication, "cover_image" | "flags" | "install_params" | "owner" | "rpc_origins">>;
export type RawClientApplication = Required<Pick<RawApplication, "id" | "flags">>;

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
    permissions: Array<PermissionName>;
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

export interface RawConnection {
    friend_sync: boolean;
    id: string;
    integrations?: Array<RawIntegration>;
    name: string;
    revoked?: boolean;
    show_activity: boolean;
    two_way_link: boolean;
    type: ConnectionService;
    verified: boolean;
    visibility: VisibilityTypes;
}

export interface Connection {
    friendSync: boolean;
    id: string;
    integrations?: Array<Integration>;
    name: string;
    revoked?: boolean;
    showActivity: boolean;
    twoWayLink: boolean;
    type: ConnectionService;
    verified: boolean;
    visibility: VisibilityTypes;
}

export interface OAuthURLOptions {
    /** The client id of the application. */
    clientID: string;
    /** If the guild dropdown should be disabled. */
    disableGuildSelect?: boolean;
    /** The id of the guild to preselect. */
    guildID?: string;
    /** The permissions to request. */
    permissions?: string;
    /** `consent` to show the prompt, `none` to not show the prompt if the user has already authorized previously. */
    prompt?: "consent" | "none";
    /** The redirect uri of the application. */
    redirectURI?: string;
    /** The response type when authorized. `code` will result in query parameters that need to be exchanged with Discord for a token. `token` will result in fragment parameters that are not accessible server side, but this will be an immediate token. */
    responseType?: "code" | "token";
    /** The [scopes](https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes) to request. */
    scopes: Array<string>;
    /** The state to send. */
    state?: string;
}

export interface ExchangeCodeOptions {
    /** The id of the client the authorization was performed with. */
    clientID: string;
    /** The secret of the client the authorization was performed with. */
    clientSecret: string;
    /** The code from the authorization. */
    code: string;
    /** The redirect uri used in the authorization. */
    redirectURI: string;
}

export interface RawExchangeCodeResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: "Bearer";
    webhook?: OAuthWebhook;
}

export interface ExchangeCodeResponse {
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
    scopes: Array<string>;
    tokenType: "Bearer";
    webhook: Webhook | null;
}

export interface RefreshTokenOptions {
    /** The id of the client the authorization was performed with. */
    clientID: string;
    /** The secret of the client the authorization was performed with. */
    clientSecret: string;
    /** The refresh token from when the code was exchanged. */
    refreshToken: string;
}

export type RawRefreshTokenResponse = Omit<RawExchangeCodeResponse, "webhook">;
export type RefreshTokenResponse = Omit<ExchangeCodeResponse, "webhook">;

export interface ClientCredentialsTokenOptions {
    /** The id of the client to perform the authorization with. This can be omitted if the global authorization is the proper (Basic base64(clientID:clientSecret)) already, or if connected to the gateway and ready. */
    clientID?: string;
    /** The secret of the client to perform the authorization with. This can be omitted if the global authorization is the proper (Basic base64(clientID:clientSecret)) already. */
    clientSecret?: string;
    /** The [scopes](https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes) to request. */
    scopes: Array<string>;
}

export type RawClientCredentialsTokenResponse = Omit<RawExchangeCodeResponse, "refresh_token">;
export type ClientCredentialsTokenResponse = Omit<ExchangeCodeResponse, "refreshToken">;

export interface RevokeTokenOptions {
    /** The id of the client the authorization was performed with. */
    clientID: string;
    /** The secret of the client the authorization was performed with. */
    clientSecret: string;
    /** The access token to revoke. */
    token: string;
}

export interface TeamMember {
    /** This member's [membership state](https://discord.com/developers/docs/topics/teams#data-models-membership-state-enum) on this team. */
    membershipState: TeamMembershipState;
    /** An array of permissions this member has for this team. Currently, always only has one entry: `*`.  */
    permissions: ["*"];
    /** The id of the team this member is associated with. */
    teamID: string;
    /** The user associated with this team member. */
    user: User;
}

export interface GetCurrentGuildsOptions {
    /** Get guilds after this id. */
    after?: string;
    /** Get guilds before this id. */
    before?: string;
    /** Max number of guilds to return (1-200). */
    limit?: number;
    /** Whether to include approximate member and presence counts. */
    withCounts?: boolean;
}

export interface UpdateRoleConnectionOptions {
    metadata?: Record<string, RoleConnectionMetadataOptions>;
    platformName?: string;
    platformUsername?: string;
}

export interface RoleConnectionMetadataOptions {
    description: string;
    descriptionLocalizations?: LocaleMap;
    key: string;
    name: string;
    nameLocalizations?: LocaleMap;
    type: RoleConnectionMetadataTypes;
}

export interface RawRoleConnection {
    metadata: Record<string, RawRoleConnectionMetadata>;
    platform_name: string | null;
    platform_username: string | null;
}

export interface RawRoleConnectionMetadata {
    description: string;
    description_localizations?: LocaleMap;
    key: string;
    name: string;
    name_localizations?: LocaleMap;
    type: RoleConnectionMetadataTypes;
}

export interface RoleConnection {
    metadata: Record<string, RoleConnectionMetadata>;
    platformName: string | null;
    platformUsername: string | null;
}

export interface RoleConnectionMetadata {
    description: string;
    descriptionLocalizations?: LocaleMap;
    key: string;
    name: string;
    nameLocalizations?: LocaleMap;
    type: RoleConnectionMetadataTypes;
}
