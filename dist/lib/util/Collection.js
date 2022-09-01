"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("../structures/Base"));
const collections_1 = require("@augu/collections");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Collection extends collections_1.Collection {
    #baseObject;
    #client;
    constructor(baseObject, client) {
        super();
        if (!(baseObject.prototype instanceof Base_1.default))
            throw new Error("baseObject must be a class that extends Base");
        this.#baseObject = baseObject;
        this.#client = client;
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
        if (value instanceof this.#baseObject) {
            if ("update" in value)
                value["update"].call(value, value);
            return value;
        }
        // if the object does not have a direct id, we're forced to construct a whole new object
        let item = "id" in value && value.id ? this.get(value.id) : undefined;
        if (!item)
            item = this.add(new this.#baseObject(value, this.#client, ...extra));
        else if ("update" in item)
            item["update"].call(item, value);
        return item;
    }
}
exports.default = Collection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi91dGlsL0NvbGxlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSw4REFBc0M7QUFDdEMsbURBQWtFO0FBSWxFLDhEQUE4RDtBQUM5RCxNQUFxQixVQUFvSCxTQUFRLHdCQUFxQjtJQUNsSyxXQUFXLENBQW9CO0lBQy9CLE9BQU8sQ0FBUztJQUNoQixZQUFZLFVBQTZCLEVBQUUsTUFBYztRQUNyRCxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLFlBQVksY0FBSSxDQUFDO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1FBQzdHLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQzFCLENBQUM7SUFFRCxHQUFHLENBQWMsS0FBUTtRQUNyQixJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7WUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDL0IsT0FBTyxLQUFLLENBQUM7U0FDaEI7YUFBTTtZQUNILE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLGdEQUFnRCxDQUFDLENBQUM7WUFDeEUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNqRCxNQUFNLEdBQUcsQ0FBQztTQUNiO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFtQyxFQUFFLEdBQUcsS0FBUTtRQUNuRCxJQUFJLEtBQUssWUFBWSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ25DLElBQUksUUFBUSxJQUFJLEtBQUs7Z0JBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDMUQsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCx3RkFBd0Y7UUFDeEYsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQzNFLElBQUksQ0FBQyxJQUFJO1lBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzthQUNoRixJQUFJLFFBQVEsSUFBSSxJQUFJO1lBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBaENELDZCQWdDQyJ9