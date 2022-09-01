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
const Properties_1 = __importDefault(require("../util/Properties"));
const OAuth_1 = __importDefault(require("../routes/OAuth"));
const Webhooks_1 = __importDefault(require("../routes/Webhooks"));
const ApplicationCommands_1 = __importDefault(require("../routes/ApplicationCommands"));
const Interactions_1 = __importDefault(require("../routes/Interactions"));
const Routes = __importStar(require("../util/Routes"));
class RESTManager {
    _client;
    _handler;
    applicationCommands;
    channels;
    guilds;
    interactions;
    oauth;
    users;
    webhooks;
    constructor(client, options) {
        Properties_1.default.new(this)
            .looseDefine("_client", client)
            .looseDefine("_handler", new RequestHandler_1.default(this, options))
            .define("applicationCommands", new ApplicationCommands_1.default(this))
            .define("channels", new Channels_1.default(this))
            .define("guilds", new Guilds_1.default(this))
            .define("interactions", new Interactions_1.default(this))
            .define("oauth", new OAuth_1.default(this))
            .define("users", new Users_1.default(this))
            .define("webhooks", new Webhooks_1.default(this));
    }
    get client() { return this._client; }
    get options() { return this._handler.options; }
    /** Alias for {@link rest/RequestHandler~RequestHandler#authRequest | RequestHandler#authRequest} */
    async authRequest(options) {
        return this._handler.authRequest(options);
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
        return this._handler.request(options);
    }
}
exports.default = RESTManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUkVTVE1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvcmVzdC9SRVNUTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQThDO0FBRTlDLGtFQUEwQztBQUMxQyw4REFBc0M7QUFDdEMsNERBQW9DO0FBQ3BDLG9FQUE0QztBQUM1Qyw0REFBb0M7QUFDcEMsa0VBQTBDO0FBRzFDLHdGQUFnRTtBQUNoRSwwRUFBa0Q7QUFDbEQsdURBQXlDO0FBR3pDLE1BQXFCLFdBQVc7SUFDcEIsT0FBTyxDQUFVO0lBQ2pCLFFBQVEsQ0FBa0I7SUFDbEMsbUJBQW1CLENBQXVCO0lBQzFDLFFBQVEsQ0FBWTtJQUNwQixNQUFNLENBQVU7SUFDaEIsWUFBWSxDQUFnQjtJQUM1QixLQUFLLENBQVM7SUFDZCxLQUFLLENBQVM7SUFDZCxRQUFRLENBQVk7SUFDcEIsWUFBWSxNQUFjLEVBQUUsT0FBcUI7UUFDN0Msb0JBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO2FBQ2YsV0FBVyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUM7YUFDOUIsV0FBVyxDQUFDLFVBQVUsRUFBRSxJQUFJLHdCQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQzFELE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLDZCQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzVELE1BQU0sQ0FBQyxVQUFVLEVBQUUsSUFBSSxrQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3RDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsSUFBSSxzQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzlDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxlQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDaEMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLGVBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNoQyxNQUFNLENBQUMsVUFBVSxFQUFFLElBQUksa0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxJQUFJLE1BQU0sS0FBSyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLElBQUksT0FBTyxLQUFLLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBRS9DLG9HQUFvRztJQUNwRyxLQUFLLENBQUMsV0FBVyxDQUFjLE9BQXFDO1FBQ2hFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUksT0FBTyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLGFBQWE7UUFDZixPQUFPLElBQUksQ0FBQyxXQUFXLENBQTJCO1lBQzlDLE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFJLE1BQU0sQ0FBQyxXQUFXO1NBQzdCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2IsR0FBRyxFQUFnQixJQUFJLENBQUMsR0FBRztZQUMzQixjQUFjLEVBQUssSUFBSSxDQUFDLGVBQWU7WUFDdkMsTUFBTSxFQUFhLElBQUksQ0FBQyxNQUFNO1lBQzlCLGlCQUFpQixFQUFFO2dCQUNmLEtBQUssRUFBVyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSztnQkFDOUMsU0FBUyxFQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTO2dCQUNsRCxVQUFVLEVBQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVc7Z0JBQ3BELGNBQWMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsZUFBZTthQUMzRDtTQUNKLENBQTBCLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLLENBQUMsVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBcUI7WUFDcEMsTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUksTUFBTSxDQUFDLE9BQU87U0FDekIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELDRGQUE0RjtJQUM1RixLQUFLLENBQUMsT0FBTyxDQUFjLE9BQXVCO1FBQzlDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUksT0FBTyxDQUFDLENBQUM7SUFDN0MsQ0FBQztDQUNKO0FBakVELDhCQWlFQyJ9