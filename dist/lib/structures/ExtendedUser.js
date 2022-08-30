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
     * @param options - The options for editing the user.
     */
    async edit(options) {
        return this._client.rest.users.editSelf(options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXh0ZW5kZWRVc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvRXh0ZW5kZWRVc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBSzFCLDJEQUEyRDtBQUMzRCxNQUFxQixZQUFhLFNBQVEsY0FBSTtJQUMxQywrQ0FBK0M7SUFDL0MsS0FBSyxDQUFnQjtJQUNyQiw2QkFBNkI7SUFDN0IsS0FBSyxDQUFTO0lBQ2QsNkJBQTZCO0lBQzdCLE1BQU0sQ0FBVTtJQUNoQixtREFBbUQ7SUFDbkQsVUFBVSxDQUFVO0lBQ3BCLCtEQUErRDtJQUMvRCxRQUFRLENBQVU7SUFDbEIsWUFBWSxJQUFrQixFQUFFLE1BQWM7UUFDMUMsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRVMsTUFBTSxDQUFDLElBQTJCO1FBQ3hDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkIsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdEQsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdEQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDN0QsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBNEI7UUFDbkMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFUSxNQUFNO1FBQ1gsT0FBTztZQUNILEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQixLQUFLLEVBQU8sSUFBSSxDQUFDLEtBQUs7WUFDdEIsS0FBSyxFQUFPLElBQUksQ0FBQyxLQUFLO1lBQ3RCLE1BQU0sRUFBTSxJQUFJLENBQUMsTUFBTTtZQUN2QixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDM0IsUUFBUSxFQUFJLElBQUksQ0FBQyxRQUFRO1NBQzVCLENBQUM7SUFDTixDQUFDO0NBQ0o7QUEzQ0QsK0JBMkNDIn0=