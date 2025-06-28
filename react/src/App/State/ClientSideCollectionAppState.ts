import { type CustomFilter } from './AppState';

export interface ClientSideCollectionAppState {
    totalItems: number;
    customFilters: CustomFilter[];
}
