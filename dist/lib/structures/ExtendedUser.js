"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
/** Represents the currently authenticated user (oauth). */
class ExtendedUser extends User_1.default {
    /** The user's email. (always null for bots) */
    email;
    /** The flags of the user. */
    flags;
    /** The locale of the user */
    locale;
    /** If the user has mfa enabled on their account */
    mfaEnabled;
    /** If this user's email is verified. (always true for bots) */
    verified;
    constructor(data, client) {
        super(data, client);
        this.verified = !!data.verified;
        this.mfaEnabled = !!data.mfa_enabled;
        this.update(data);
    }
    update(data) {
        super.update(data);
        if (data.email !== undefined)
            this.email = data.email;
        if (data.flags !== undefined)
            this.flags = data.flags;
        if (data.locale !== undefined)
            this.locale = data.locale;
    }
    /**
     * Modify this user.
     *
     * @param {Object} options
     * @param {String} [options.username] - The new username
     * @param {?(String | Buffer)} [options.avatar] - The new avatar (buffer, or full data url). `null` to remove the current avatar.
     * @returns {Promise<ExtendedUser>}
     */
    async edit(options) {
        return this._client.rest.users.modifySelf(options);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            email: this.email,
            flags: this.flags,
            locale: this.locale,
            mfaEnabled: this.mfaEnabled,
            verified: this.verified
        };
    }
}
exports.default = ExtendedUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXh0ZW5kZWRVc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvRXh0ZW5kZWRVc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBSzFCLDJEQUEyRDtBQUMzRCxNQUFxQixZQUFhLFNBQVEsY0FBSTtJQUM3QywrQ0FBK0M7SUFDL0MsS0FBSyxDQUFnQjtJQUNyQiw2QkFBNkI7SUFDN0IsS0FBSyxDQUFTO0lBQ2QsNkJBQTZCO0lBQzdCLE1BQU0sQ0FBVTtJQUNoQixtREFBbUQ7SUFDbkQsVUFBVSxDQUFVO0lBQ3BCLCtEQUErRDtJQUMvRCxRQUFRLENBQVU7SUFDbEIsWUFBWSxJQUFrQixFQUFFLE1BQWM7UUFDN0MsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBRVMsTUFBTSxDQUFDLElBQTJCO1FBQzNDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkIsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdEQsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdEQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDMUQsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQTRCO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRVEsTUFBTTtRQUNkLE9BQU87WUFDTixHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDakIsS0FBSyxFQUFPLElBQUksQ0FBQyxLQUFLO1lBQ3RCLEtBQUssRUFBTyxJQUFJLENBQUMsS0FBSztZQUN0QixNQUFNLEVBQU0sSUFBSSxDQUFDLE1BQU07WUFDdkIsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO1lBQzNCLFFBQVEsRUFBSSxJQUFJLENBQUMsUUFBUTtTQUN6QixDQUFDO0lBQ0gsQ0FBQztDQUNEO0FBL0NELCtCQStDQyJ9