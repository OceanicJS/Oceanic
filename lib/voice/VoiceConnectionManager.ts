import type VoiceConnection from "./VoiceConnection";
import type Client from "../Client";
import Properties from "../util/Properties";
import { Collection } from "@augu/collections";

export default class VoiceConnectionManager extends Collection<string, VoiceConnection> {
	private _client: Client;
	constructor(client: Client) {
		super();
		Properties.looseDefine(this, "_client", client);
	}
}
