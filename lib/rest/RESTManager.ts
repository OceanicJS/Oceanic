import RequestHandler from "./RequestHandler";
import type Client from "../Client";
import Channels from "../routes/Channels";
import Guilds from "../routes/Guilds";
import Users from "../routes/Users";
import Properties from "../util/Properties";
import OAuth from "../routes/OAuth";
import Webhooks from "../routes/Webhooks";
import type { RESTOptions } from "../types/client";
import type { RequestOptions } from "../types/request-handler";
import ApplicationCommands from "../routes/ApplicationCommands";
import Interactions from "../routes/Interactions";
import * as Routes from "../util/Routes";
import type { GetBotGatewayResponse, GetGatewayResponse, RawGetBotGatewayResponse } from "../types/gateway";

export default class RESTManager {
    private _client: Client;
    private _handler: RequestHandler;
    applicationCommands: ApplicationCommands;
    channels: Channels;
    guilds: Guilds;
    interactions: Interactions;
    oauth: OAuth;
    users: Users;
    webhooks: Webhooks;
    constructor(client: Client, options?: RESTOptions) {
        Properties.new(this)
            .looseDefine("_client", client)
            .looseDefine("_handler", new RequestHandler(this, options))
            .define("applicationCommands", new ApplicationCommands(this))
            .define("channels", new Channels(this))
            .define("guilds", new Guilds(this))
            .define("interactions", new Interactions(this))
            .define("oauth", new OAuth(this))
            .define("users", new Users(this))
            .define("webhooks", new Webhooks(this));
    }

    get client() { return this._client; }
    get options() { return this._handler.options; }

    /** Alias for {@link rest/RequestHandler~RequestHandler#authRequest | RequestHandler#authRequest} */
    async authRequest<T = unknown>(options: Omit<RequestOptions, "auth">) {
        return this._handler.authRequest<T>(options);
    }

    /**
     * Get the gateway information related to your bot client.
     */
    async getBotGateway() {
        return this.authRequest<RawGetBotGatewayResponse>({
            method: "GET",
            path:   Routes.GATEWAY_BOT
        }).then(data => ({
            url:               data.url,
            maxConcurrency:    data.max_concurrency,
            shards:            data.shards,
            sessionStartLimit: {
                total:          data.session_start_limit.total,
                remaining:      data.session_start_limit.remaining,
                resetAfter:     data.session_start_limit.reset_after,
                maxConcurrency: data.session_start_limit.max_concurrency
            }
        }) as GetBotGatewayResponse);
    }

    /**
     * Get the gateway information.
     */
    async getGateway() {
        return this.request<GetGatewayResponse>({
            method: "GET",
            path:   Routes.GATEWAY
        });
    }

    /** Alias for {@link rest/RequestHandler~RequestHandler#request | RequestHandler#request} */
    async request<T = unknown>(options: RequestOptions) {
        return this._handler.request<T>(options);
    }
}
