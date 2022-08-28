"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TypedEmitter_1 = __importDefault(require("../util/TypedEmitter"));
class VoiceConnection extends TypedEmitter_1.default {
    id;
    constructor(id) {
        super();
        this.id = id;
    }
}
exports.default = VoiceConnection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVm9pY2VDb25uZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3ZvaWNlL1ZvaWNlQ29ubmVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHdFQUFnRDtBQUVoRCxNQUFxQixlQUFnQixTQUFRLHNCQUF5QjtJQUNsRSxFQUFFLENBQVM7SUFDWCxZQUFZLEVBQVU7UUFDbEIsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNqQixDQUFDO0NBQ0o7QUFORCxrQ0FNQyJ9