"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Interaction_1 = __importDefault(require("./Interaction"));
const Constants_1 = require("../Constants");
/** Represents a PING interaction. This will not be recieved over a gateway connection. */
class PingInteraction extends Interaction_1.default {
    constructor(data, client) {
        super(data, client);
    }
    /**
     * Responds to the interaction with a `PONG`.
     *
     * @returns {Promise<void>}
     */
    async pong() {
        return this._client.rest.interactions.createInteractionResponse(this.id, this.token, { type: Constants_1.InteractionResponseTypes.PONG });
    }
    toJSON() {
        return {
            ...super.toJSON(),
            type: this.type
        };
    }
}
exports.default = PingInteraction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGluZ0ludGVyYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvUGluZ0ludGVyYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0VBQXdDO0FBRXhDLDRDQUF3RDtBQUt4RCwwRkFBMEY7QUFDMUYsTUFBcUIsZUFBZ0IsU0FBUSxxQkFBVztJQUV2RCxZQUFZLElBQXdCLEVBQUUsTUFBYztRQUNuRCxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLElBQUk7UUFDVCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsb0NBQXdCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUMvSCxDQUFDO0lBRUQsTUFBTTtRQUNMLE9BQU87WUFDTixHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDakIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ2YsQ0FBQztJQUNILENBQUM7Q0FDRDtBQXJCRCxrQ0FxQkMifQ==