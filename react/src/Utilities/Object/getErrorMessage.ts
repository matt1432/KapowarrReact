// import type { Error } from 'App/State/AppSectionState';
import { ApiError } from 'Utilities/Fetch/fetchJson';

// eslint-disable-next-line
function getErrorMessage(error: any | ApiError | undefined, fallbackErrorMessage = '') {
    if (!error) {
        return fallbackErrorMessage;
    }

    if (error instanceof ApiError) {
        if (!error.statusBody) {
            return fallbackErrorMessage;
        }

        return error.statusBody.message;
    }

    if (!error.responseJSON) {
        return fallbackErrorMessage;
    }

    if ('message' in error.responseJSON && error.responseJSON.message) {
        return error.responseJSON.message;
    }

    return fallbackErrorMessage;
}

export default getErrorMessage;
