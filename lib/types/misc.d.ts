/** @module Types/Miscellaneous */
import type * as Types from "./namespaced";

export interface RawRefreshAttachmentURLsResponse {
    refreshed_urls: Array<RefreshedAttachment>;
}
export interface RefreshAttachmentURLsResponse {
    refreshedURLs: Array<RefreshedAttachment>;
}

export interface RefreshedAttachment {
    original: string;
    refreshed: string;
}

export interface Emoji {
    animated?: boolean;
    available?: boolean;
    id: string | null;
    managed?: boolean;
    name: string;
    require_colons?: boolean;
    roles?: Array<string>;
    user?: Types.Users.RawUser;
}
