import type Collection from "../Collection";
import { WrapperError } from "../Errors";

/**
 * Maps raw select menu values to resolved objects.
 *
 * If `ensurePresent` is false, values that aren't in resolved will be ignored.
 */
export function mapRawToResolved<S, R extends Collection<string, S>>(
    type: string,
    raw: Array<string>,
    resolved: R,
    ensurePresent = false
): Array<S> {
    return raw
        .map(id => {
            const value = resolved.get(id);
            if (!value && ensurePresent) {
                throw new WrapperError(`Failed to find ${type} in resolved data: ${id}`);
            }
            return value!;
        })
        .filter(Boolean);
}
