"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */
const events_1 = __importDefault(require("events"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TypedEmitter extends events_1.default {
    emit(eventName, ...args) {
        if (this.listenerCount(eventName) === 0)
            return false;
        return super.emit(eventName, ...args);
    }
}
exports.default = TypedEmitter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZWRFbWl0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3V0aWwvVHlwZWRFbWl0dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNEhBQTRIO0FBQzVILG9EQUFrQztBQWlCbEMsNkRBQTZEO0FBQzdELE1BQU0sWUFBMEQsU0FBUSxnQkFBWTtJQUNoRixJQUFJLENBQXlCLFNBQVksRUFBRSxHQUFHLElBQWU7UUFDekQsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUN0RCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBbUIsRUFBRSxHQUFHLElBQWtCLENBQUMsQ0FBQztJQUNsRSxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxZQUFZLENBQUMifQ==