/** @module Errors */

import type Client from "../Client";
import type { IntentNames } from "../Constants";


/** An error that is thrown when we encounter an error, and no `error` listeners are present. */
export class UncaughtError extends Error {
    override name = "UncaughtError";
    constructor(error: Error | string) {
        super("Uncaught 'error' event", { cause: error });
    }
}

/** An error ancountered when an object is unexpectedly not cached. */
export class UncachedError extends Error {
    override name = "UncachedError";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    constructor(...args: [message: string] | [clazz: object, property: string, intent: IntentNames, client?: Client]) {
        let message: string;
        if (args.length === 1) {
            [message] = args;
        } else {
            const [clazz, property, intent, client] = args;
            message = client && client.options.restMode ? `${clazz.constructor.name}#${property} is not present in rest mode.` : `${clazz.constructor.name}#${property} is not present if you don't have the ${intent} intent.`;
        }

        super(message);
    }
}

/** An error encountered within {@link InteractionOptionsWrapper~InteractionOptionsWrapper | InteractionOptionsWrapper} & {@link SelectMenuValuesWrapper~SelectMenuValuesWrapper | SelectMenuValuesWrapper}. */
export class WrapperError extends Error {
    override name = "WrapperError";
    constructor(message: string) {
        super(message);
    }
}

/** An error encountered when a needed dependency is missing. */
export class DependencyError extends Error {
    override name = "DependencyError";
    constructor(message: string) {
        super(message);
    }
}


/** A gateway error. */
export default class GatewayError extends Error {
    code: number;
    override name = "GatewayError";
    constructor(message: string, code: number) {
        super(message);
        this.code = code;
    }
}
