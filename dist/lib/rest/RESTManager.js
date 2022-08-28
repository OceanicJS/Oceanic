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
    /** @hidden intentionally not documented - this is an internal function */
    _convertImage(image, name) {
        try {
            return this._client._convertImage(image);
        }
        catch (err) {
            throw new Error(`Invalid ${name} provided. Ensure you are providing a valid, fully-qualified base64 url.`, { cause: err });
        }
    }
    /** Alias for {@link RequestHandler#authRequest} */
    async authRequest(options) {
        return this._handler.authRequest(options);
    }
    /**
     * Get the gateway information related to your bot client.
     *
     * @returns {Promise<GetBotGatewayResponse>}
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
     *
     * @returns {Promise<GetGatewayResponse>}
     */
    async getGateway() {
        return this.request({
            method: "GET",
            path: Routes.GATEWAY
        });
    }
    /** Alias for {@link RequestHandler#request} */
    async request(options) {
        return this._handler.request(options);
    }
}
exports.default = RESTManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUkVTVE1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvcmVzdC9SRVNUTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQThDO0FBRTlDLGtFQUEwQztBQUMxQyw4REFBc0M7QUFDdEMsNERBQW9DO0FBQ3BDLG9FQUE0QztBQUM1Qyw0REFBb0M7QUFDcEMsa0VBQTBDO0FBRzFDLHdGQUFnRTtBQUNoRSwwRUFBa0Q7QUFDbEQsdURBQXlDO0FBR3pDLE1BQXFCLFdBQVc7SUFDdkIsT0FBTyxDQUFTO0lBQ2hCLFFBQVEsQ0FBaUI7SUFDakMsbUJBQW1CLENBQXNCO0lBQ3pDLFFBQVEsQ0FBVztJQUNuQixNQUFNLENBQVM7SUFDZixZQUFZLENBQWU7SUFDM0IsS0FBSyxDQUFRO0lBQ2IsS0FBSyxDQUFRO0lBQ2IsUUFBUSxDQUFXO0lBQ25CLFlBQVksTUFBYyxFQUFFLE9BQXFCO1FBQ2hELG9CQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQzthQUNsQixXQUFXLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQzthQUM5QixXQUFXLENBQUMsVUFBVSxFQUFFLElBQUksd0JBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDMUQsTUFBTSxDQUFDLHFCQUFxQixFQUFFLElBQUksNkJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDNUQsTUFBTSxDQUFDLFVBQVUsRUFBRSxJQUFJLGtCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDdEMsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbEMsTUFBTSxDQUFDLGNBQWMsRUFBRSxJQUFJLHNCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDOUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLGVBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNoQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksZUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsSUFBSSxrQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELElBQUksTUFBTSxLQUFLLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDckMsSUFBSSxPQUFPLEtBQUssT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFL0MsMEVBQTBFO0lBQzFFLGFBQWEsQ0FBQyxLQUFzQixFQUFFLElBQVk7UUFDakQsSUFBSTtZQUNILE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDekM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxJQUFJLDBFQUEwRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQVksRUFBRSxDQUFDLENBQUM7U0FDcEk7SUFDRixDQUFDO0lBRUQsbURBQW1EO0lBQ25ELEtBQUssQ0FBQyxXQUFXLENBQWMsT0FBcUM7UUFDbkUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBSSxPQUFPLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxhQUFhO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBMkI7WUFDakQsTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUksTUFBTSxDQUFDLFdBQVc7U0FDMUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEIsR0FBRyxFQUFnQixJQUFJLENBQUMsR0FBRztZQUMzQixjQUFjLEVBQUssSUFBSSxDQUFDLGVBQWU7WUFDdkMsTUFBTSxFQUFhLElBQUksQ0FBQyxNQUFNO1lBQzlCLGlCQUFpQixFQUFFO2dCQUNsQixLQUFLLEVBQVcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUs7Z0JBQzlDLFNBQVMsRUFBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUztnQkFDbEQsVUFBVSxFQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXO2dCQUNwRCxjQUFjLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGVBQWU7YUFDeEQ7U0FDRCxDQUEwQixDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsVUFBVTtRQUNmLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBcUI7WUFDdkMsTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUksTUFBTSxDQUFDLE9BQU87U0FDdEIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELCtDQUErQztJQUMvQyxLQUFLLENBQUMsT0FBTyxDQUFjLE9BQXVCO1FBQ2pELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUksT0FBTyxDQUFDLENBQUM7SUFDMUMsQ0FBQztDQUNEO0FBOUVELDhCQThFQyJ9