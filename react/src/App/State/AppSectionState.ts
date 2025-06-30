import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { ValidationFailure } from 'typings/pending';
import type { Filter, FilterBuilderProp } from './AppState';
import type { Column } from 'Components/Table/Column';

export interface Error {
    status?: number;
    responseJSON:
        | {
              message: string | undefined;
          }
        | ValidationFailure[]
        | undefined;
}

export interface AppSectionDeleteState {
    isDeleting: boolean;
    deleteError: Error;
}

export interface AppSectionSaveState {
    isSaving: boolean;
    saveError: Error;
}

export interface PagedAppSectionState {
    page: number;
    pageSize: number;
    totalPages: number;
    totalRecords?: number;
}

export interface AppSectionSchemaState<T> {
    isSchemaFetching: boolean;
    isSchemaPopulated: boolean;
    schemaError: Error;
    schema: T[];
    selectedSchema?: T;
}

export interface TableAppSectionState {
    columns: Column[];
}

export interface AppSectionFilterState<T> {
    selectedFilterKey: string;
    filters: Filter[];
    filterBuilderProps: FilterBuilderProp<T>[];
}

export interface AppSectionItemSchemaState<T> {
    isSchemaFetching: boolean;
    isSchemaPopulated: boolean;
    schemaError: Error;
    schema: T;
}

export interface AppSectionItemState<T> {
    isFetching: boolean;
    isPopulated: boolean;
    error: Error;
    pendingChanges: Partial<T>;
    item: T;
}

export interface AppSectionListState<T> {
    isFetching: boolean;
    isPopulated: boolean;
    error: Error;
    items: T[];
    pendingChanges: Partial<T>[];
}

export interface AppSectionProviderState<T> extends AppSectionDeleteState, AppSectionSaveState {
    isFetching: boolean;
    isPopulated: boolean;
    isTesting?: boolean;
    error: Error;
    items: T[];
    pendingChanges?: Partial<T>;
}

export interface AppSectionState<T> {
    isFetching: boolean;
    isPopulated: boolean;
    error: Error;
    items: T[];
    sortKey: string;
    sortDirection: SortDirection;
}
