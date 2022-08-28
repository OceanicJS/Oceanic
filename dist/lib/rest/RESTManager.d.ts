/// <reference types="node" />
import type Client from "../Client";
import Channels from "../routes/Channels";
import Guilds from "../routes/Guilds";
import Users from "../routes/Users";
import OAuth from "../routes/OAuth";
import Webhooks from "../routes/Webhooks";
import type { RESTOptions } from "../types/client";
import type { RequestOptions } from "../types/request-handler";
import ApplicationCommands from "../routes/ApplicationCommands";
import Interactions from "../routes/Interactions";
import type { GetBotGatewayResponse, GetGatewayResponse } from "../types/gateway";
export default class RESTManager {
    private _client;
    private _handler;
    applicationCommands: ApplicationCommands;
    channels: Channels;
    guilds: Guilds;
    interactions: Interactions;
    oauth: OAuth;
    users: Users;
    webhooks: Webhooks;
    constructor(client: Client, options?: RESTOptions);
    get client(): Client;
    get options(): import("../types/request-handler").RequestHandlerInstanceOptions;
    /** @hidden intentionally not documented - this is an internal function */
    _convertImage(image: Buffer | string, name: string): string;
    /** Alias for {@link RequestHandler#authRequest} */
    authRequest<T = unknown>(options: Omit<RequestOptions, "auth">): Promise<T>;
    /**
     * Get the gateway information related to your bot client.
     *
     * @returns {Promise<GetBotGatewayResponse>}
     */
    getBotGateway(): Promise<GetBotGatewayResponse>;
    /**
     * Get the gateway information.
     *
     * @returns {Promise<GetGatewayResponse>}
     */
    getGateway(): Promise<GetGatewayResponse>;
    /** Alias for {@link RequestHandler#request} */
    request<T = unknown>(options: RequestOptions): Promise<T>;
}
