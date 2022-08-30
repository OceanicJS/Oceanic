"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
const Permission_1 = __importDefault(require("./Permission"));
const Properties_1 = __importDefault(require("../util/Properties"));
class PermissionOverwrite extends Base_1.default {
    /** The permissions of this overwrite. */
    permission;
    /** The type of this overwrite. `0` for role, `1` for user. */
    type;
    constructor(data, client) {
        super(data.id, client);
        Properties_1.default.looseDefine(this, "_client", client);
        this.permission = new Permission_1.default(data.allow, data.deny);
        this.type = data.type;
    }
    get allow() { return this.permission.allow; }
    get deny() { return this.permission.deny; }
    /** A key-value map of permission to if it's been allowed or denied (not present if neither) */
    get json() { return this.permission.json; }
    /**
     *Check if this permissions instance has the given permissions allowed
     *
     * @param {...PermissionNames} permissions - The permissions to check for.
     * @returns {Boolean}
     */
    has(...permissions) {
        return this.permission.has(...permissions);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            permission: this.permission.toJSON(),
            type: this.type
        };
    }
}
exports.default = PermissionOverwrite;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGVybWlzc2lvbk92ZXJ3cml0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL1Blcm1pc3Npb25PdmVyd3JpdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsOERBQXNDO0FBR3RDLG9FQUE0QztBQUk1QyxNQUFxQixtQkFBb0IsU0FBUSxjQUFJO0lBQ2pELHlDQUF5QztJQUN6QyxVQUFVLENBQWE7SUFDdkIsOERBQThEO0lBQzlELElBQUksQ0FBaUI7SUFDckIsWUFBWSxJQUFrQixFQUFFLE1BQWM7UUFDMUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkIsb0JBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksb0JBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUksS0FBSyxLQUFLLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzdDLElBQUksSUFBSSxLQUFLLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRTNDLCtGQUErRjtJQUMvRixJQUFJLElBQUksS0FBSyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUUzQzs7Ozs7T0FLRztJQUNILEdBQUcsQ0FBQyxHQUFHLFdBQW1DO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRVEsTUFBTTtRQUNYLE9BQU87WUFDSCxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDakIsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO1lBQ3BDLElBQUksRUFBUSxJQUFJLENBQUMsSUFBSTtTQUN4QixDQUFDO0lBQ04sQ0FBQztDQUNKO0FBbkNELHNDQW1DQyJ9