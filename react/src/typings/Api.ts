import type { SerializedError } from '@reduxjs/toolkit';
import type { ExtendableRecord } from 'typings/Misc';

export interface ApiErrorResponse<Result extends ExtendableRecord = ExtendableRecord> {
    error: string;
    result: Result;
}

export interface ApiError<Result extends ExtendableRecord = ExtendableRecord> {
    status: number;
    data: ApiErrorResponse<Result>;
}

export type NonApiError =
    | {
          /**
           * * `"FETCH_ERROR"`:
           *   An error that occurred during execution of `fetch` or the `fetchFn` callback option
           **/
          status: 'FETCH_ERROR';
          data?: undefined;
          error: string;
      }
    | {
          /**
           * * `"PARSING_ERROR"`:
           *   An error happened during parsing.
           *   Most likely a non-JSON-response was returned with the default `responseHandler` "JSON",
           *   or an error occurred while executing a custom `responseHandler`.
           **/
          status: 'PARSING_ERROR';
          originalStatus: number;
          data: string;
          error: string;
      }
    | {
          /**
           * * `"TIMEOUT_ERROR"`:
           *   Request timed out
           **/
          status: 'TIMEOUT_ERROR';
          data?: undefined;
          error: string;
      };

// Remake FetchBaseQueryError
export type FetchError<Result extends ExtendableRecord = ExtendableRecord> =
    | ApiError<Result>
    | NonApiError;

export type AnyError<Result extends ExtendableRecord = ExtendableRecord> =
    | FetchError<Result>
    | SerializedError;
