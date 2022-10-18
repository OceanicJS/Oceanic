/** @module PartialApplication */
import Base from "./Base";
import type Client from "../Client";
import type { ImageFormat } from "../Constants";
import * as Routes from "../util/Routes";
import type { RawPartialApplication } from "../types/oauth";
import type { JSONPartialApplication } from "../types/json";

/** Represents a partial application. */
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
    constructor(data: RawPartialApplication, client: Client) {
        super(data.id, client);
        this.description = data.description;
        this.icon = null;
        this.name = data.name;
        this.verifyKey = data.verify_key;
        this.update(data);
    }

    protected override update(data: RawPartialApplication): void {
        if (data.bot_public !== undefined) {
            this.botPublic = data.bot_public;
        }
        if (data.bot_require_code_grant !== undefined) {
            this.botRequireCodeGrant = data.bot_require_code_grant;
        }
        if (data.description !== undefined) {
            this.description = data.description;
        }
        if (data.icon !== undefined) {
            this.icon = data.icon;
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
    }

    /**
     * The url of this application's icon.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    iconURL(format?: ImageFormat, size?: number): string | null {
        return this.icon === null ? null : this.client.util.formatImage(Routes.APPLICATION_COVER(this.id, this.icon), format, size);
    }

    override toJSON(): JSONPartialApplication {
        return {
            ...super.toJSON(),
            botPublic:           this.botPublic,
            botRequireCodeGrant: this.botRequireCodeGrant,
            description:         this.description,
            icon:                this.icon,
            name:                this.name,
            verifyKey:           this.verifyKey
        };
    }
}
