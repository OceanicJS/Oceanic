import Base from "./Base";
import type Client from "../Client";
import type { ImageFormat } from "../Constants";
import type { RawPartialApplication } from "../types/oauth";
import type { JSONPartialApplication } from "../types/json";
export default class PartialApplication extends Base {
    /** When false, only the application's owners can invite the bot to guilds. */
    botPublic?: boolean;
    /** When true, the applications bot will only join upon the completion of the full oauth2 code grant flow. */
    botRequireCodeGrant?: boolean;
    /** The description of the application. */
    description: string;
    /** The icon hash of the application. */
    icon: string | null;
    /** The name of the application. */
    name: string;
    /** The bot's hex encoded public key. */
    verifyKey?: string;
    constructor(data: RawPartialApplication, client: Client);
    protected update(data: RawPartialApplication): void;
    /**
     * The url of this application's icon.
     *
     * @param {ImageFormat} format - The format the url should be.
     * @param {Number} size - The dimensions of the image.
     * @returns {?String}
     */
    iconURL(format?: ImageFormat, size?: number): string | null;
    toJSON(): JSONPartialApplication;
}
