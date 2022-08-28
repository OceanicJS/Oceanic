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
        this.application = this._client.application?.id === data.application_id ? this._client.application : { id: data.application_id };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9JbnRlcmFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQVkxQiw0Q0FBZ0Q7QUFDaEQsb0VBQTRDO0FBSTVDLE1BQXFCLFdBQVksU0FBUSxjQUFJO0lBQy9CLFlBQVksQ0FBVTtJQUNoQyx3R0FBd0c7SUFDeEcsV0FBVyxDQUErQjtJQUMxQyxxQ0FBcUM7SUFDckMsS0FBSyxDQUFTO0lBQ2QscUpBQXFKO0lBQ3JKLElBQUksQ0FBbUI7SUFDdkIscUNBQXFDO0lBQ3JDLE9BQU8sQ0FBSTtJQUNYLFlBQVksSUFBdUIsRUFBRSxNQUFjO1FBQy9DLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLG9CQUFVLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDakksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDaEMsQ0FBQztJQUdELE1BQU0sQ0FBQyxJQUFJLENBQTRDLElBQW9CLEVBQUUsTUFBYztRQUN2RixRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDZixLQUFLLDRCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBTSxDQUFDO1lBQzFFLEtBQUssNEJBQWdCLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLElBQUksa0JBQWtCLENBQUMsSUFBd0MsRUFBRSxNQUFNLENBQU0sQ0FBQztZQUNoSSxLQUFLLDRCQUFnQixDQUFDLGlCQUFpQixDQUFDLENBQUMsT0FBTyxJQUFJLG9CQUFvQixDQUFDLElBQXNDLEVBQUUsTUFBTSxDQUFNLENBQUM7WUFDOUgsS0FBSyw0QkFBZ0IsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLE9BQU8sSUFBSSx1QkFBdUIsQ0FBQyxJQUFrQyxFQUFFLE1BQU0sQ0FBTSxDQUFDO1lBQzVJLEtBQUssNEJBQWdCLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxJQUFJLHNCQUFzQixDQUFDLElBQWlDLEVBQUUsTUFBTSxDQUFNLENBQUM7WUFDdEgsT0FBTyxDQUFDLENBQUMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFVLENBQUM7U0FDMUQ7SUFDTCxDQUFDO0lBRVEsTUFBTTtRQUNYLE9BQU87WUFDSCxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDakIsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUNoQyxLQUFLLEVBQVEsSUFBSSxDQUFDLEtBQUs7WUFDdkIsSUFBSSxFQUFTLElBQUksQ0FBQyxJQUFJO1lBQ3RCLE9BQU8sRUFBTSxJQUFJLENBQUMsT0FBTztTQUM1QixDQUFDO0lBQ04sQ0FBQztDQUNKO0FBeENELDhCQXdDQztBQUdELHNGQUFzRjtBQUN0RixvQkFBb0I7QUFDcEIsTUFBTSx1QkFBdUIsR0FBSSxPQUFPLENBQUMsMkJBQTJCLENBQWdELENBQUMsT0FBTyxDQUFDO0FBQzdILE1BQU0sa0JBQWtCLEdBQUksT0FBTyxDQUFDLHNCQUFzQixDQUEyQyxDQUFDLE9BQU8sQ0FBQztBQUM5RyxNQUFNLG9CQUFvQixHQUFJLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBNkMsQ0FBQyxPQUFPLENBQUM7QUFDcEgsTUFBTSxzQkFBc0IsR0FBSSxPQUFPLENBQUMsMEJBQTBCLENBQStDLENBQUMsT0FBTyxDQUFDO0FBQzFILE1BQU0sZUFBZSxHQUFJLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBd0MsQ0FBQyxPQUFPLENBQUM7QUFDckcsbUJBQW1CIn0=