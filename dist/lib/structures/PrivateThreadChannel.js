"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ThreadChannel_1 = __importDefault(require("./ThreadChannel"));
/** Represents a guild thread channel. */
class PrivateThreadChannel extends ThreadChannel_1.default {
    constructor(data, client) {
        super(data, client);
    }
    /**
     * Edit this channel.
     * @param options The options to edit the channel with.
     */
    async edit(options) {
        return this.client.rest.channels.edit(this.id, options);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            threadMetadata: this.threadMetadata,
            type: this.type
        };
    }
}
exports.default = PrivateThreadChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJpdmF0ZVRocmVhZENoYW5uZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9Qcml2YXRlVGhyZWFkQ2hhbm5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9FQUE0QztBQU01Qyx5Q0FBeUM7QUFDekMsTUFBcUIsb0JBQXFCLFNBQVEsdUJBQW1DO0lBR2pGLFlBQVksSUFBNkIsRUFBRSxNQUFjO1FBQ3JELEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVEOzs7T0FHRztJQUNNLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBd0M7UUFDeEQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFPLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELE1BQU07UUFDRixPQUFPO1lBQ0gsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2pCLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYztZQUNuQyxJQUFJLEVBQVksSUFBSSxDQUFDLElBQUk7U0FDNUIsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQXRCRCx1Q0FzQkMifQ==