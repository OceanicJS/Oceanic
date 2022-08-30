import type User from "./User";
import Team from "./Team";
import ClientApplication from "./ClientApplication";
import type Guild from "./Guild";
import type Client from "../Client";
import type { InstallParams, RESTApplication } from "../types/oauth";
import type { ImageFormat } from "../Constants";
import type { JSONApplication } from "../types/json";
/** Represents an oauth application. */
export default class Application extends ClientApplication {
    /** When false, only the application's owners can invite the bot to guilds. */
    botPublic: boolean;
    /** When true, the applications bot will only join upon the completion of the full oauth2 code grant flow. */
    botRequireCodeGrant: boolean;
    /** This application's rich presence invite cover image hash, if any. */
    coverImage: string | null;
    /** This application's default custom authorization link, if any. */
    customInstallURL?: string;
    /** The description of the application. */
    description: string;
    /** If this application is a game sold on Discord, the guild to which it has been linked.*/
    guild?: Guild;
    /** The ID of the guild associated with this application, if any. */
    guildID?: string;
    /** The icon hash of the application. */
    icon: string | null;
    /** Settings for this application's in-app authorization link, if enabled. */
    installParams?: InstallParams;
    /** The name of the application. */
    name: string;
    /** The owner of this application. */
    owner: User;
    /** If this application is a game sold on Discord, the id of the Game's SKU. */
    primarySKUID?: string;
    /** A url to this application's privacy policy. */
    privacyPolicyURL?: string;
    /** A list of rpc origin urls, if rpc is enabled. */
    rpcOrigins: Array<string>;
    /** If this application is a game sold on Discord, the slug that links to its store page. */
    slug?: string;
    /** The tags for this application. */
    tags?: Array<string>;
    /** The team that owns this application, if any. */
    team: Team | null;
    /** A url to this application's terms of service. */
    termsOfServiceURL?: string;
    /** The bot's hex encoded public key. */
    verifyKey: string;
    constructor(data: RESTApplication, client: Client);
    protected update(data: Partial<RESTApplication>): void;
    /**
     * The url of this application's cover image.
     *
     * @param {ImageFormat} format - The format the url should be.
     * @param {Number} size - The dimensions of the image.
     * @returns {?String}
     */
    coverImageURL(format?: ImageFormat, size?: number): string | null;
    toJSON(): JSONApplication;
}
