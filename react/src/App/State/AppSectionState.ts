import type { SortDirection } from 'Helpers/Props/sortDirections';
import { type ValidationFailure } from 'typings/pending';

export interface Error {
    status?: number;
    responseJSON:
        | {
              message: string | undefined;
          }
        | ValidationFailure[]
        | undefined;
}

export interface AppSectionState<T> {
    isFetching: boolean;
    isPopulated: boolean;
    error: Error;
    items: T[];
    sortKey: string;
    sortDirection: SortDirection;
}
