import type RESTClient from "../RESTClient";
import Properties from "../util/Properties";

export default abstract class BaseRoute {
	protected _client: RESTClient;
	constructor(client: RESTClient) {
		Properties.define(this, "_client", client);
	}
}
