import type { RawIntegration } from "./guilds";
import type { RawUser } from "./users";
import type { OAuthWebhook } from "./webhooks";
import type { ConnectionService, Permission, TeamMembershipState, VisibilityTypes } from "../Constants";
import type { PartialApplication } from "../structures/PartialApplication";
import type User from "../structures/User";
import type Webhook from "../structures/Webhook";

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
	clientID: string;
	clientSecret: string;
	refreshToken: string;
}

export interface ClientCredentialsTokenOptions {
	scopes: Array<string>;
}

export type RawClientCredentialsTokenResponse = Omit<RawExchangeCodeResponse, "refresh_token">;
export type ClientCredentialsTokenResponse = Omit<ExchangeCodeResponse, "refreshToken">;

export interface RevokeTokenOptions {
	clientID: string;
	clientSecret: string;
	token: string;
}
