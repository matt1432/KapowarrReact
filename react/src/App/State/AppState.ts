import { type ModelBase } from 'App/ModelBase';
import { type DateFilterValue, type FilterType } from 'Helpers/Props/filterTypes';
import { type AppSectionState } from './AppSectionState';
import { type OAuthAppState } from './OAuthAppState';
import { type PathsAppState } from './PathsAppState';

export interface PropertyFilter {
    key: string;
    value: string | string[] | number[] | boolean[] | DateFilterValue;
    type: FilterType;
}

export interface CustomFilter extends ModelBase {
    type: string;
    label: string;
    filters: PropertyFilter[];
}

export interface AppState {
    app: AppSectionState<unknown>; // TODO: what to put here instead of unknown
    // blocklist: BlocklistAppState;
    // calendar: CalendarAppState;
    // commands: CommandAppState;
    // customFilters: CustomFiltersAppState;
    // episodeFiles: EpisodeFilesAppState;
    // episodeHistory: HistoryAppState;
    // episodes: EpisodesAppState;
    // episodesSelection: EpisodesAppState;
    // history: HistoryAppState;
    // importSeries: ImportSeriesAppState;
    // interactiveImport: InteractiveImportAppState;
    oAuth: OAuthAppState;
    // organizePreview: OrganizePreviewAppState;
    // parse: ParseAppState;
    paths: PathsAppState;
    // providerOptions: ProviderOptionsAppState;
    // queue: QueueAppState;
    // releases: ReleasesAppState;
    // rootFolders: RootFolderAppState;
    // series: SeriesAppState;
    // seriesHistory: SeriesHistoryAppState;
    // seriesIndex: SeriesIndexAppState;
    // settings: SettingsAppState;
    // system: SystemAppState;
    // tags: TagsAppState;
    // wanted: WantedAppState;
}
