import type {
    AppSectionState,
    AppSectionDeleteState,
    AppSectionSaveState,
} from 'App/State/AppSectionState';
import { type CustomFilter } from './AppState';

export interface CustomFiltersAppState
    extends AppSectionState<CustomFilter>,
        AppSectionDeleteState,
        AppSectionSaveState {}
