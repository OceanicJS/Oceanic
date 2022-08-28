"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../Constants");
const Properties_1 = __importDefault(require("../util/Properties"));
class Permission {
    _json;
    /** The allowed permissions for this permission instance. */
    allow;
    /** The denied permissions for this permission instance. */
    deny;
    constructor(allow, deny = 0n) {
        this.allow = BigInt(allow);
        this.deny = BigInt(deny);
        Properties_1.default.looseDefine(this, "_json", undefined, true);
    }
    /** A key-value map of permission to if it's been allowed or denied (not present if neither) */
    get json() {
        if (!this._json) {
            const json = {};
            for (const perm of Object.keys(Constants_1.Permissions)) {
                if (this.allow & Constants_1.Permissions[perm])
                    json[perm] = true;
                else if (this.deny & Constants_1.Permissions[perm])
                    json[perm] = false;
            }
            return (this._json = json);
        }
        else
            return this._json;
    }
    /**
     * Check if this permissions instance has the given permissions allowed
     *
     * @param {...PermissionNames} permissions - The permissions to check for.
     * @returns {Boolean}
     */
    has(...permissions) {
        for (const perm of permissions) {
            if (!(this.allow & Constants_1.Permissions[perm]))
                return false;
        }
        return true;
    }
    toJSON() {
        return {
            allow: this.allow.toString(),
            deny: this.deny.toString()
        };
    }
    toString() {
        return `[${this.constructor.name} +${this.allow} -${this.deny}]`;
    }
}
exports.default = Permission;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGVybWlzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL1Blcm1pc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSw0Q0FBMkM7QUFDM0Msb0VBQTRDO0FBRzVDLE1BQXFCLFVBQVU7SUFDdEIsS0FBSyxDQUF3RDtJQUNyRSw0REFBNEQ7SUFDNUQsS0FBSyxDQUFTO0lBQ2QsMkRBQTJEO0lBQzNELElBQUksQ0FBUztJQUNiLFlBQVksS0FBc0IsRUFBRSxPQUF3QixFQUFFO1FBQzdELElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLG9CQUFVLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCwrRkFBK0Y7SUFDL0YsSUFBSSxJQUFJO1FBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDaEIsTUFBTSxJQUFJLEdBQUcsRUFBK0MsQ0FBQztZQUM3RCxLQUFLLE1BQU0sSUFBSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQVcsQ0FBb0MsRUFBRTtnQkFDL0UsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLHVCQUFXLENBQUMsSUFBSSxDQUFDO29CQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7cUJBQ2pELElBQUksSUFBSSxDQUFDLElBQUksR0FBRyx1QkFBVyxDQUFDLElBQUksQ0FBQztvQkFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO2FBQzNEO1lBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDM0I7O1lBQU0sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzFCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEdBQUcsQ0FBQyxHQUFHLFdBQW1DO1FBQ3pDLEtBQUssTUFBTSxJQUFJLElBQUksV0FBVyxFQUFFO1lBQy9CLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsdUJBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFBRSxPQUFPLEtBQUssQ0FBQztTQUNwRDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVELE1BQU07UUFDTCxPQUFPO1lBQ04sS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQzVCLElBQUksRUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtTQUMzQixDQUFDO0lBQ0gsQ0FBQztJQUVELFFBQVE7UUFDUCxPQUFPLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUM7SUFDbEUsQ0FBQztDQUNEO0FBL0NELDZCQStDQyJ9