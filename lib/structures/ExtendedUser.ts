/** @module ExtendedUser */
import User from "./User";
import type Client from "../Client";
import type { EditSelfUserOptions, RawOAuthUser } from "../types/users";
import type { JSONExtendedUser } from "../types/json";

/** Represents the currently authenticated user. */
export default class ExtendedUser extends User {
    /** The user's email. (always null for bots) */
    email: string | null;
    /** The flags of the user. */
    flags: number;
    /** The locale of the user */
    locale?: string;
    /** If the user has mfa enabled on their account */
    mfaEnabled: boolean;
    /** If this user's email is verified. (always true for bots) */
    verified: boolean;
    constructor(data: RawOAuthUser, client: Client) {
        super(data, client);
        this.email = data.email;
        this.flags = data.flags;
        this.verified = !!data.verified;
        this.mfaEnabled = !!data.mfa_enabled;
        this.update(data);
    }

    protected override update(data: Partial<RawOAuthUser>): void {
        super.update(data);
        if (data.email !== undefined) {
            this.email = data.email;
        }
        if (data.flags !== undefined) {
            this.flags = data.flags;
        }
        if (data.locale !== undefined) {
            this.locale = data.locale;
        }
    }

    /**
     * Modify this user.
     * @param options The options for editing the user.
     */
    async edit(options: EditSelfUserOptions): Promise<ExtendedUser> {
        return this.client.rest.users.editSelf(options);
    }

    override toJSON(): JSONExtendedUser {
        return {
            ...super.toJSON(),
            email:      this.email,
            flags:      this.flags,
            locale:     this.locale,
            mfaEnabled: this.mfaEnabled,
            verified:   this.verified
        };
    }
}
