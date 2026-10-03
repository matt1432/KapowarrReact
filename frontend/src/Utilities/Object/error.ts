import translate from 'Utilities/String/translate';
import {
    translateBrokenClientReason,
    translateEnqueueFailureReason,
} from 'Utilities/String/translateReason';

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

export function getErrorMessage(
    error: unknown,
    fallbackErrorMessage = 'Unknown error',
) {
    if (isApiError(error)) {
        if (
            error.data.error === 'InvalidKeyValue' &&
            error.data.result.key === 'comicvine_api_key'
        ) {
            return translate('InvalidComicVineApiKey');
        }
        if (
            error.data.error === 'ClientNotWorking' &&
            typeof error.data.result.reason === 'string'
        ) {
            return translateBrokenClientReason(error.data.result.reason);
        }
        if (
            error.data.error === 'EnqueuingDownloadFailure' &&
            typeof error.data.result.reason === 'string'
        ) {
            return translateEnqueueFailureReason(error.data.result.reason);
        }
        return translate(error.data.error);
    }
    if (isNonApiError(error)) {
        return error.error;
    }
    return fallbackErrorMessage;
}
