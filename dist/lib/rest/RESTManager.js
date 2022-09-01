"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestHandler_1 = __importDefault(require("./RequestHandler"));
const Channels_1 = __importDefault(require("../routes/Channels"));
const Guilds_1 = __importDefault(require("../routes/Guilds"));
const Users_1 = __importDefault(require("../routes/Users"));
const OAuth_1 = __importDefault(require("../routes/OAuth"));
const Webhooks_1 = __importDefault(require("../routes/Webhooks"));
const ApplicationCommands_1 = __importDefault(require("../routes/ApplicationCommands"));
const Interactions_1 = __importDefault(require("../routes/Interactions"));
const Routes = __importStar(require("../util/Routes"));
class RESTManager {
    applicationCommands;
    channels;
    #client;
    guilds;
    #handler;
    interactions;
    oauth;
    users;
    webhooks;
    constructor(client, options) {
        this.applicationCommands = new ApplicationCommands_1.default(this);
        this.channels = new Channels_1.default(this);
        this.#client = client;
        this.guilds = new Guilds_1.default(this);
        this.#handler = new RequestHandler_1.default(this, options);
        this.interactions = new Interactions_1.default(this);
        this.oauth = new OAuth_1.default(this);
        this.users = new Users_1.default(this);
        this.webhooks = new Webhooks_1.default(this);
    }
    get client() { return this.#client; }
    get options() { return this.#handler.options; }
    /** Alias for {@link rest/RequestHandler~RequestHandler#authRequest | RequestHandler#authRequest} */
    async authRequest(options) {
        return this.#handler.authRequest(options);
    }
    /**
     * Get the gateway information related to your bot client.
     */
    async getBotGateway() {
        return this.authRequest({
            method: "GET",
            path: Routes.GATEWAY_BOT
        }).then(data => ({
            url: data.url,
            maxConcurrency: data.max_concurrency,
            shards: data.shards,
            sessionStartLimit: {
                total: data.session_start_limit.total,
                remaining: data.session_start_limit.remaining,
                resetAfter: data.session_start_limit.reset_after,
                maxConcurrency: data.session_start_limit.max_concurrency
            }
        }));
    }
    /**
     * Get the gateway information.
     */
    async getGateway() {
        return this.request({
            method: "GET",
            path: Routes.GATEWAY
        });
    }
    /** Alias for {@link rest/RequestHandler~RequestHandler#request | RequestHandler#request} */
    async request(options) {
        return this.#handler.request(options);
    }
}
exports.default = RESTManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUkVTVE1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvcmVzdC9SRVNUTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQThDO0FBRTlDLGtFQUEwQztBQUMxQyw4REFBc0M7QUFDdEMsNERBQW9DO0FBQ3BDLDREQUFvQztBQUNwQyxrRUFBMEM7QUFHMUMsd0ZBQWdFO0FBQ2hFLDBFQUFrRDtBQUNsRCx1REFBeUM7QUFHekMsTUFBcUIsV0FBVztJQUM1QixtQkFBbUIsQ0FBc0I7SUFDekMsUUFBUSxDQUFXO0lBQ25CLE9BQU8sQ0FBUztJQUNoQixNQUFNLENBQVM7SUFDZixRQUFRLENBQWlCO0lBQ3pCLFlBQVksQ0FBZTtJQUMzQixLQUFLLENBQVE7SUFDYixLQUFLLENBQVE7SUFDYixRQUFRLENBQVc7SUFDbkIsWUFBWSxNQUFjLEVBQUUsT0FBcUI7UUFDN0MsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksNkJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGtCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLHdCQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxzQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxlQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGVBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksa0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsSUFBSSxNQUFNLEtBQUssT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNyQyxJQUFJLE9BQU8sS0FBSyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUUvQyxvR0FBb0c7SUFDcEcsS0FBSyxDQUFDLFdBQVcsQ0FBYyxPQUFxQztRQUNoRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFJLE9BQU8sQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBQyxhQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUEyQjtZQUM5QyxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBSSxNQUFNLENBQUMsV0FBVztTQUM3QixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNiLEdBQUcsRUFBZ0IsSUFBSSxDQUFDLEdBQUc7WUFDM0IsY0FBYyxFQUFLLElBQUksQ0FBQyxlQUFlO1lBQ3ZDLE1BQU0sRUFBYSxJQUFJLENBQUMsTUFBTTtZQUM5QixpQkFBaUIsRUFBRTtnQkFDZixLQUFLLEVBQVcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUs7Z0JBQzlDLFNBQVMsRUFBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUztnQkFDbEQsVUFBVSxFQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXO2dCQUNwRCxjQUFjLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGVBQWU7YUFDM0Q7U0FDSixDQUEwQixDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxPQUFPLENBQXFCO1lBQ3BDLE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFJLE1BQU0sQ0FBQyxPQUFPO1NBQ3pCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCw0RkFBNEY7SUFDNUYsS0FBSyxDQUFDLE9BQU8sQ0FBYyxPQUF1QjtRQUM5QyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFJLE9BQU8sQ0FBQyxDQUFDO0lBQzdDLENBQUM7Q0FDSjtBQWhFRCw4QkFnRUMifQ==