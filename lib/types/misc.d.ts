export interface GetGatewayResponse {
	url: string;
}

export interface RawGetBotGatewayResponse extends GetGatewayResponse {
	session_start_limit: RawSessionStartLimit;
	shards: number;
}

export interface RawSessionStartLimit {
	max_concurrency: number;
	remaining: number;
	reset_after: number;
	total: number;
}

export interface SessionStartLimit {
	maxConcurrency: number;
	remaining: number;
	resetAfter: number;
	total: number;
}


export interface GetBotGatewayResponse extends GetGatewayResponse {
	sessionStartLimit: SessionStartLimit;
	shards: number;
}
