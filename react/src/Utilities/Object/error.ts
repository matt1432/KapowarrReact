import translate from 'Utilities/String/translate';

import type { ApiError, NonApiError, FetchError } from 'typings/Api';

export function isFetchError(error: unknown): error is FetchError {
    return typeof error === 'object' && error !== null && 'status' in error;
}

export function isApiError(error: unknown): error is ApiError {
    return isFetchError(error) && typeof error.status === 'number';
}

export function isNonApiError(error: unknown): error is NonApiError {
    return isFetchError(error) && typeof error.status === 'number';
}

export function getErrorMessage(error: unknown, fallbackErrorMessage = 'Unknown error') {
    if (isApiError(error)) {
        return translate(error.data.error);
    }
    if (isNonApiError(error)) {
        return error.error;
    }
    return fallbackErrorMessage;
}
