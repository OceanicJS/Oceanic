"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Properties_1 = __importDefault(require("../util/Properties"));
class BaseRoute {
    _manager;
    constructor(manager) {
        Properties_1.default.looseDefine(this, "_manager", manager);
    }
    // client is private, so we have to use [] to access it
    get _client() { return this._manager["_client"]; }
}
exports.default = BaseRoute;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZVJvdXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3JvdXRlcy9CYXNlUm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxvRUFBNEM7QUFFNUMsTUFBOEIsU0FBUztJQUN6QixRQUFRLENBQWM7SUFDaEMsWUFBWSxPQUFvQjtRQUM1QixvQkFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCx1REFBdUQ7SUFDdkQsSUFBYyxPQUFPLEtBQUssT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUMvRDtBQVJELDRCQVFDIn0=