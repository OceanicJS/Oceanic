"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Properties_1 = __importDefault(require("./Properties"));
const Base_1 = __importDefault(require("../structures/Base"));
const collections_1 = require("@augu/collections");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Collection extends collections_1.Collection {
    _baseObject;
    _client;
    constructor(baseObject, client) {
        super();
        if (!(baseObject.prototype instanceof Base_1.default))
            throw new Error("baseObject must be a class that extends Base");
        Properties_1.default.new(this)
            .looseDefine("_baseObject", baseObject)
            .looseDefine("_client", client);
    }
    add(value) {
        if ("id" in value) {
            this.set(value.id, value);
            return value;
        }
        else {
            const err = new Error("Collection.add: value must have an id property");
            Object.defineProperty(err, "_object", { value });
            throw err;
        }
    }
    update(value, ...extra) {
        if (value instanceof this._baseObject) {
            if ("update" in value)
                value["update"].call(value, value);
            return value;
        }
        // if the object does not have a direct id, we're forced to construct a whole new object
        let item = "id" in value && value.id ? this.get(value.id) : undefined;
        if (!item)
            item = this.add(new this._baseObject(value, this._client, ...extra));
        else if ("update" in item)
            item["update"].call(item, value);
        return item;
    }
}
exports.default = Collection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi91dGlsL0NvbGxlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4REFBc0M7QUFFdEMsOERBQXNDO0FBQ3RDLG1EQUFrRTtBQUlsRSw4REFBOEQ7QUFDOUQsTUFBcUIsVUFBb0gsU0FBUSx3QkFBcUI7SUFDM0osV0FBVyxDQUFvQjtJQUMvQixPQUFPLENBQVM7SUFDMUIsWUFBWSxVQUE2QixFQUFFLE1BQWM7UUFDeEQsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxZQUFZLGNBQUksQ0FBQztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztRQUM3RyxvQkFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7YUFDbEIsV0FBVyxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUM7YUFDdEMsV0FBVyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsR0FBRyxDQUFjLEtBQVE7UUFDeEIsSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMvQixPQUFPLEtBQUssQ0FBQztTQUNiO2FBQU07WUFDTixNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDakQsTUFBTSxHQUFHLENBQUM7U0FDVjtJQUNGLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBbUMsRUFBRSxHQUFHLEtBQVE7UUFDdEQsSUFBSSxLQUFLLFlBQVksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUN0QyxJQUFJLFFBQVEsSUFBSSxLQUFLO2dCQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzFELE9BQU8sS0FBSyxDQUFDO1NBQ2I7UUFDRCx3RkFBd0Y7UUFDeEYsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQzNFLElBQUksQ0FBQyxJQUFJO1lBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzthQUNoRixJQUFJLFFBQVEsSUFBSSxJQUFJO1lBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUQsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0NBQ0Q7QUFqQ0QsNkJBaUNDIn0=