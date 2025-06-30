import { type ModelBase } from 'App/ModelBase';
import type {
    AppSectionState,
    AppSectionDeleteState,
    AppSectionSaveState,
} from 'App/State/AppSectionState';

export interface Tag extends ModelBase {
    label: string;
}

export interface TagDetail extends ModelBase {
    label: string;
    autoTagIds: number[];
    delayProfileIds: number[];
    downloadClientIds: [];
    importListIds: number[];
    indexerIds: number[];
    notificationIds: number[];
    restrictionIds: number[];
    volumesIds: number[];
}

export interface TagDetailAppState
    extends AppSectionState<TagDetail>,
        AppSectionDeleteState,
        AppSectionSaveState {}

export interface TagsAppState extends AppSectionState<Tag>, AppSectionDeleteState {
    details: TagDetailAppState;
}
