"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
/** Represents a guild that is unavailable. */
class UnavailableGuild extends Base_1.default {
    unavailable;
    constructor(data, client) {
        super(data.id, client);
        this.unavailable = data.unavailable;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            unavailable: this.unavailable
        };
    }
}
exports.default = UnavailableGuild;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5hdmFpbGFibGVHdWlsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL1VuYXZhaWxhYmxlR3VpbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFLMUIsOENBQThDO0FBQzlDLE1BQXFCLGdCQUFpQixTQUFRLGNBQUk7SUFDakQsV0FBVyxDQUFPO0lBQ2xCLFlBQVksSUFBeUIsRUFBRSxNQUFjO1FBQ3BELEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUNyQyxDQUFDO0lBRUQsTUFBTTtRQUNMLE9BQU87WUFDTixHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDakIsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1NBQzdCLENBQUM7SUFDSCxDQUFDO0NBQ0Q7QUFiRCxtQ0FhQyJ9