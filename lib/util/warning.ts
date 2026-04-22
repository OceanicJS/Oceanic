export enum WarningCodes {
    OCEANIC_CACHE_DISABLED = "OCEANIC_CACHE_DISABLED",
    OCEANIC_COLLECTIONS_LIMIT_WITH_CACHE_DISABLED = "OCEANIC_COLLECTIONS_LIMIT_WITH_CACHE_DISABLED",
    OCEANIC_AUTH_AND_TOKEN_PROVIDED = "OCEANIC_AUTH_AND_TOKEN_PROVIDED",
}

const WarningOptions = {
    [WarningCodes.OCEANIC_CACHE_DISABLED]: {
        detail: "Set the disableCache option to the literal string \"no-warning\" to disable this warning.",
        message: "Enabling the disableCache option is not recommended. This will break many aspects of the library, as it is not designed to function without cache."
    },
    [WarningCodes.OCEANIC_COLLECTIONS_LIMIT_WITH_CACHE_DISABLED]: {
        detail: "Remove the collectionsLimit option, or zero out all of the possible options to disable this warning.",
        message: "Providing the collectionsLimit option when the disableCache option has been enabled is redundant. Any provided values will be ignored."
    },
    [WarningCodes.OCEANIC_AUTH_AND_TOKEN_PROVIDED]: {
        detail: "Remove either the auth or token option to disable this warning.",
        message: "Providing both the token and auth options is redundant. The auth option will be used over token."
    }
} satisfies Record<WarningCodes, { detail?: string; message: string; }>;

const warnedCodes = new Set<WarningCodes>();
export function warning(code: WarningCodes): void {
    if (warnedCodes.has(code)) return;

    const options = WarningOptions[code];
    process.emitWarning(options.message, {
        code,
        detail: options.detail
    });
}
