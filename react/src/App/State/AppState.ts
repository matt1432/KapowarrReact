import { type ModelBase } from 'App/ModelBase';
import { type DateFilterValue, type FilterType } from 'Helpers/Props/filterTypes';
import { type OAuthAppState } from './OAuthAppState';
import { type PathsAppState } from './PathsAppState';
import { type SettingsAppState } from './SettingsAppState';
import { type ProviderOptionsAppState } from './ProviderOptionsAppState';
import { type TagsAppState } from './TagsAppState';
import { type FilterBuilderTypes } from 'Helpers/Props/filterBuilderTypes';
import { type ParseAppState } from './ParseAppState';
import { type MessagesAppState } from './MessagesAppState';
import { type VolumesAppState, type VolumesIndexAppState } from './VolumesAppState';
import { type CustomFiltersAppState } from './CustomFiltersAppState';
import { type CommandAppState } from './CommandAppState';
import { type SystemAppState } from './SystemAppState';
import { type ImportVolumesAppState } from './ImportVolumesAppState';
import { type RootFolderAppState } from './RootFolderAppState';
import { type QueueAppState } from './QueueAppState';

export interface FilterBuilderPropOption {
    id: string;
    name: string;
}

export interface FilterBuilderProp<T> {
    name: string;
    label: string | (() => string);
    type: FilterBuilderTypes;
    valueType?: string;
    optionsSelector?: (items: T[]) => FilterBuilderPropOption[];
}

export interface PropertyFilter {
    key: string;
    value: string | string[] | number[] | boolean[] | DateFilterValue;
    type: FilterType;
}

export interface Filter {
    key: string;
    label: string | (() => string);
    filters: PropertyFilter[];
}

export interface CustomFilter extends ModelBase {
    type: string;
    label: string;
    filters: PropertyFilter[];
}

export interface AppSectionState {
    isUpdated: boolean;
    isConnected: boolean;
    isDisconnected: boolean;
    isReconnecting: boolean;
    isRestarting: boolean;
    isSidebarVisible: boolean;
    version: string;
    prevVersion?: string;
    dimensions: {
        isSmallScreen: boolean;
        isLargeScreen: boolean;
        width: number;
        height: number;
    };
    translations: {
        error?: Error;
        isPopulated: boolean;
    };
    messages: MessagesAppState;
}

export interface AppState {
    app: AppSectionState;
    // blocklist: BlocklistAppState;
    // calendar: CalendarAppState;
    commands: CommandAppState;
    customFilters: CustomFiltersAppState;
    // issueFiles: IssueFilesAppState;
    // issueHistory: HistoryAppState;
    // issues: IssuesAppState;
    // issuesSelection: IssuesAppState;
    // history: HistoryAppState;
    importVolumes: ImportVolumesAppState;
    // interactiveImport: InteractiveImportAppState;
    oAuth: OAuthAppState;
    // organizePreview: OrganizePreviewAppState;
    parse: ParseAppState;
    paths: PathsAppState;
    providerOptions: ProviderOptionsAppState;
    queue: QueueAppState;
    // releases: ReleasesAppState;
    rootFolders: RootFolderAppState;
    volumes: VolumesAppState;
    // volumesHistory: VolumesHistoryAppState;
    volumesIndex: VolumesIndexAppState;
    settings: SettingsAppState;
    system: SystemAppState;
    tags: TagsAppState;
    // wanted: WantedAppState;
}
