"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Properties_1 = __importDefault(require("../util/Properties"));
const util_1 = require("util");
/** A base class which most other classes extend. */
class Base {
    _client;
    id;
    constructor(id, client) {
        this.id = id;
        Properties_1.default.looseDefine(this, "_client", client);
    }
    static getCreatedAt(id) {
        return new Date(Base.getDiscordEpoch(id) + 1420070400000);
    }
    static getDiscordEpoch(id) {
        return Number(BigInt(id) / 4194304n);
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    update(data) { }
    get createdAt() {
        return Base.getCreatedAt(this.id);
    }
    [util_1.inspect.custom]() {
        // http://stackoverflow.com/questions/5905492/dynamic-function-name-in-javascript
        const copy = new { [this.constructor.name]: class {
            } }[this.constructor.name]();
        for (const key in this) {
            if (Object.hasOwn(this, key) && !key.startsWith("_") && this[key] !== undefined) {
                copy[key] = this[key];
            }
        }
        return copy;
    }
    toJSON() {
        return {
            createdAt: this.createdAt.getTime(),
            id: this.id
        };
    }
    toString() {
        return `[${this.constructor.name} ${this.id}]`;
    }
}
exports.default = Base;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL0Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxvRUFBNEM7QUFFNUMsK0JBQStCO0FBRS9CLG9EQUFvRDtBQUNwRCxNQUE4QixJQUFJO0lBQ3ZCLE9BQU8sQ0FBUztJQUMxQixFQUFFLENBQVM7SUFDWCxZQUFZLEVBQVUsRUFBRSxNQUFjO1FBQ3JDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2Isb0JBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFVO1FBQzdCLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsTUFBTSxDQUFDLGVBQWUsQ0FBQyxFQUFVO1FBQ2hDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsbUdBQW1HO0lBQ3pGLE1BQU0sQ0FBQyxJQUFhLElBQUcsQ0FBQztJQUVsQyxJQUFJLFNBQVM7UUFDWixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxDQUFDLGNBQU8sQ0FBQyxNQUFNLENBQUM7UUFDZixpRkFBaUY7UUFDakYsTUFBTSxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTthQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFVLENBQUM7UUFDeEYsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDdkIsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDaEYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN0QjtTQUNEO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsTUFBTTtRQUNMLE9BQU87WUFDTixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7WUFDbkMsRUFBRSxFQUFTLElBQUksQ0FBQyxFQUFFO1NBQ2xCLENBQUM7SUFDSCxDQUFDO0lBRUQsUUFBUTtRQUNQLE9BQU8sSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUM7SUFDaEQsQ0FBQztDQUNEO0FBNUNELHVCQTRDQyJ9