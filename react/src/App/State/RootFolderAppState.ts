import type {
    AppSectionState,
    AppSectionDeleteState,
    AppSectionSaveState,
} from 'App/State/AppSectionState';
import { type RootFolder } from 'typings/RootFolder';

export interface RootFolderAppState
    extends AppSectionState<RootFolder>,
        AppSectionDeleteState,
        AppSectionSaveState {}
