import type {
    AppSectionState,
    AppSectionDeleteState,
    AppSectionSaveState,
} from 'App/State/AppSectionState';
import { type Column } from 'Components/Table/Column';
import { type SortDirection } from 'Helpers/Props/sortDirections';
import { type Volumes } from 'Volumes/Volumes';
import { type Filter, type FilterBuilderProp } from './AppState';

export interface VolumesIndexAppState {
    sortKey: string;
    sortDirection: SortDirection;
    secondarySortKey: string;
    secondarySortDirection: SortDirection;
    view: string;

    posterOptions: {
        detailedProgressBar: boolean;
        size: string;
        showTitle: boolean;
        showMonitored: boolean;
        showQualityProfile: boolean;
        showTags: boolean;
        showSearchAction: boolean;
    };

    overviewOptions: {
        detailedProgressBar: boolean;
        size: string;
        showMonitored: boolean;
        showNetwork: boolean;
        showQualityProfile: boolean;
        showPreviousAiring: boolean;
        showAdded: boolean;
        showSeasonCount: boolean;
        showPath: boolean;
        showSizeOnDisk: boolean;
        showTags: boolean;
        showSearchAction: boolean;
    };

    tableOptions: {
        showBanners: boolean;
        showSearchAction: boolean;
    };

    selectedFilterKey: string;
    filterBuilderProps: FilterBuilderProp<Volumes>[];
    filters: Filter[];
    columns: Column[];
}

export interface VolumesAppState
    extends AppSectionState<Volumes>,
        AppSectionDeleteState,
        AppSectionSaveState {
    itemMap: Record<number, number>;

    deleteOptions: {
        addImportListExclusion: boolean;
    };

    pendingChanges: Partial<Volumes>;
}
