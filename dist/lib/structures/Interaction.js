"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
const Constants_1 = require("../Constants");
const Properties_1 = __importDefault(require("../util/Properties"));
class Interaction extends Base_1.default {
    acknowledged;
    /** The application this interaction is for. This can be a partial object with only an `id` property. */
    application;
    /** The token of this interaction. */
    token;
    /** The [type](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type) of this interaction. */
    type;
    /** Read-only property, always `1` */
    version;
    constructor(data, client) {
        super(data.id, client);
        Properties_1.default.looseDefine(this, "acknowledged", false, true);
        this.application = client.application?.id === data.application_id ? client.application : { id: data.application_id };
        this.token = data.token;
        this.type = data.type;
        this.version = data.version;
    }
    static from(data, client) {
        switch (data.type) {
            case Constants_1.InteractionTypes.PING: return new PingInteraction(data, client);
            case Constants_1.InteractionTypes.APPLICATION_COMMAND: return new CommandInteraction(data, client);
            case Constants_1.InteractionTypes.MESSAGE_COMPONENT: return new ComponentInteraction(data, client);
            case Constants_1.InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE: return new AutocompleteInteraction(data, client);
            case Constants_1.InteractionTypes.MODAL_SUBMIT: return new ModalSubmitInteraction(data, client);
            default: return new Interaction(data, client);
        }
    }
    toJSON() {
        return {
            ...super.toJSON(),
            application: this.application.id,
            token: this.token,
            type: this.type,
            version: this.version
        };
    }
}
exports.default = Interaction;
// Yes this sucks, but it works. That's the important part. Circular imports are hell.
/* eslint-disable */
const AutocompleteInteraction = require("./AutocompleteInteraction").default;
const CommandInteraction = require("./CommandInteraction").default;
const ComponentInteraction = require("./ComponentInteraction").default;
const ModalSubmitInteraction = require("./ModalSubmitInteraction").default;
const PingInteraction = require("./PingInteraction").default;
/* eslint-enable */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9JbnRlcmFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQVkxQiw0Q0FBZ0Q7QUFDaEQsb0VBQTRDO0FBSTVDLE1BQXFCLFdBQVksU0FBUSxjQUFJO0lBQy9CLFlBQVksQ0FBVztJQUNqQyx3R0FBd0c7SUFDeEcsV0FBVyxDQUErQjtJQUMxQyxxQ0FBcUM7SUFDckMsS0FBSyxDQUFTO0lBQ2QscUpBQXFKO0lBQ3JKLElBQUksQ0FBbUI7SUFDdkIscUNBQXFDO0lBQ3JDLE9BQU8sQ0FBSTtJQUNYLFlBQVksSUFBdUIsRUFBRSxNQUFjO1FBQy9DLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLG9CQUFVLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUFFLEtBQUssSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3JILElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ2hDLENBQUM7SUFHRCxNQUFNLENBQUMsSUFBSSxDQUE0QyxJQUFvQixFQUFFLE1BQWM7UUFDdkYsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2YsS0FBSyw0QkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksZUFBZSxDQUFDLElBQUksRUFBRSxNQUFNLENBQU0sQ0FBQztZQUMxRSxLQUFLLDRCQUFnQixDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxJQUFJLGtCQUFrQixDQUFDLElBQXdDLEVBQUUsTUFBTSxDQUFNLENBQUM7WUFDaEksS0FBSyw0QkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxJQUFzQyxFQUFFLE1BQU0sQ0FBTSxDQUFDO1lBQzlILEtBQUssNEJBQWdCLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxPQUFPLElBQUksdUJBQXVCLENBQUMsSUFBa0MsRUFBRSxNQUFNLENBQU0sQ0FBQztZQUM1SSxLQUFLLDRCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sSUFBSSxzQkFBc0IsQ0FBQyxJQUFpQyxFQUFFLE1BQU0sQ0FBTSxDQUFDO1lBQ3RILE9BQU8sQ0FBQyxDQUFDLE9BQU8sSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBVSxDQUFDO1NBQzFEO0lBQ0wsQ0FBQztJQUVRLE1BQU07UUFDWCxPQUFPO1lBQ0gsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2pCLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDaEMsS0FBSyxFQUFRLElBQUksQ0FBQyxLQUFLO1lBQ3ZCLElBQUksRUFBUyxJQUFJLENBQUMsSUFBSTtZQUN0QixPQUFPLEVBQU0sSUFBSSxDQUFDLE9BQU87U0FDNUIsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQXhDRCw4QkF3Q0M7QUFHRCxzRkFBc0Y7QUFDdEYsb0JBQW9CO0FBQ3BCLE1BQU0sdUJBQXVCLEdBQUksT0FBTyxDQUFDLDJCQUEyQixDQUFnRCxDQUFDLE9BQU8sQ0FBQztBQUM3SCxNQUFNLGtCQUFrQixHQUFJLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBMkMsQ0FBQyxPQUFPLENBQUM7QUFDOUcsTUFBTSxvQkFBb0IsR0FBSSxPQUFPLENBQUMsd0JBQXdCLENBQTZDLENBQUMsT0FBTyxDQUFDO0FBQ3BILE1BQU0sc0JBQXNCLEdBQUksT0FBTyxDQUFDLDBCQUEwQixDQUErQyxDQUFDLE9BQU8sQ0FBQztBQUMxSCxNQUFNLGVBQWUsR0FBSSxPQUFPLENBQUMsbUJBQW1CLENBQXdDLENBQUMsT0FBTyxDQUFDO0FBQ3JHLG1CQUFtQiJ9