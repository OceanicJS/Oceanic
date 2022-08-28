"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GatewayError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
exports.default = GatewayError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2F0ZXdheUVycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL2dhdGV3YXkvR2F0ZXdheUVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBcUIsWUFBYSxTQUFRLEtBQUs7SUFDOUMsSUFBSSxDQUFTO0lBQ2IsWUFBWSxPQUFlLEVBQUUsSUFBWTtRQUN4QyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNsQixDQUFDO0NBQ0Q7QUFORCwrQkFNQyJ9