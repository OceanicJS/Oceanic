import type RESTManager from "../rest/RESTManager";
export default abstract class BaseRoute {
    protected _manager: RESTManager;
    constructor(manager: RESTManager);
    protected get _client(): import("..").Client;
}
