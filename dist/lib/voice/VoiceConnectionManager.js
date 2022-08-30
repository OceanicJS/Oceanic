"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Properties_1 = __importDefault(require("../util/Properties"));
const collections_1 = require("@augu/collections");
class VoiceConnectionManager extends collections_1.Collection {
    _client;
    constructor(client) {
        super();
        Properties_1.default.looseDefine(this, "_client", client);
    }
}
exports.default = VoiceConnectionManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVm9pY2VDb25uZWN0aW9uTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92b2ljZS9Wb2ljZUNvbm5lY3Rpb25NYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEsb0VBQTRDO0FBQzVDLG1EQUErQztBQUUvQyxNQUFxQixzQkFBdUIsU0FBUSx3QkFBbUM7SUFDM0UsT0FBTyxDQUFTO0lBQ3hCLFlBQVksTUFBYztRQUN0QixLQUFLLEVBQUUsQ0FBQztRQUNSLG9CQUFVLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDcEQsQ0FBQztDQUNKO0FBTkQseUNBTUMifQ==