import type {
    AppSectionState,
    AppSectionDeleteState,
    AppSectionItemSchemaState,
    AppSectionItemState,
    AppSectionListState,
    AppSectionSaveState,
    AppSectionSchemaState,
    PagedAppSectionState,
} from 'App/State/AppSectionState';
import { type Language } from 'Language/Language';
import { type AutoTagging, type AutoTaggingSpecification } from 'typings/AutoTagging';
import { type CustomFormat } from 'typings/CustomFormat';
import { type CustomFormatSpecification } from 'typings/CustomFormatSpecification';
import { type DelayProfile } from 'typings/DelayProfile';
import { type DownloadClient } from 'typings/DownloadClient';
import { type ImportList } from 'typings/ImportList';
import { type ImportListExclusion } from 'typings/ImportListExclusion';
import { type ImportListOptionsSettings } from 'typings/ImportListOptionsSettings';
import { type Indexer } from 'typings/Indexer';
import { type IndexerFlag } from 'typings/IndexerFlag';
import { type Notification } from 'typings/Notification';
import { type QualityDefinition } from 'typings/QualityDefinition';
import { type QualityProfile } from 'typings/QualityProfile';
import { type DownloadClientOptions } from 'typings/Settings/DownloadClientOptions';
import { type General } from 'typings/Settings/General';
import { type IndexerOptions } from 'typings/Settings/IndexerOptions';
import { type MediaManagement } from 'typings/Settings/MediaManagement';
import { type NamingConfig } from 'typings/Settings/NamingConfig';
import { type NamingExample } from 'typings/Settings/NamingExample';
import { type ReleaseProfile } from 'typings/Settings/ReleaseProfile';
import { type RemotePathMapping } from 'typings/Settings/RemotePathMapping';
import { type UiSettings } from 'typings/Settings/UiSettings';
import { type MetadataAppState } from './MetadataAppState';

type Presets<T> = T & {
    presets: T[];
};

export interface AutoTaggingAppState
    extends AppSectionState<AutoTagging>,
        AppSectionDeleteState,
        AppSectionSaveState {}

export interface AutoTaggingSpecificationAppState
    extends AppSectionState<AutoTaggingSpecification>,
        AppSectionDeleteState,
        AppSectionSaveState,
        AppSectionSchemaState<AutoTaggingSpecification> {}

export interface DelayProfileAppState
    extends AppSectionListState<DelayProfile>,
        AppSectionDeleteState,
        AppSectionSaveState {}

export interface DownloadClientAppState
    extends AppSectionState<DownloadClient>,
        AppSectionDeleteState,
        AppSectionSaveState,
        AppSectionSchemaState<Presets<DownloadClient>> {
    isTestingAll: boolean;
}

export interface DownloadClientOptionsAppState
    extends AppSectionItemState<DownloadClientOptions>,
        AppSectionSaveState {}

export interface GeneralAppState extends AppSectionItemState<General>, AppSectionSaveState {}

export interface MediaManagementAppState
    extends AppSectionItemState<MediaManagement>,
        AppSectionSaveState {}

export interface NamingAppState extends AppSectionItemState<NamingConfig>, AppSectionSaveState {}

export type NamingExamplesAppState = AppSectionItemState<NamingExample>;

export interface ImportListAppState
    extends AppSectionState<ImportList>,
        AppSectionDeleteState,
        AppSectionSaveState,
        AppSectionSchemaState<Presets<ImportList>> {
    isTestingAll: boolean;
}

export interface IndexerOptionsAppState
    extends AppSectionItemState<IndexerOptions>,
        AppSectionSaveState {}

export interface IndexerAppState
    extends AppSectionState<Indexer>,
        AppSectionDeleteState,
        AppSectionSaveState,
        AppSectionSchemaState<Presets<Indexer>> {
    isTestingAll: boolean;
}

export interface NotificationAppState
    extends AppSectionState<Notification>,
        AppSectionDeleteState,
        AppSectionSaveState,
        AppSectionSchemaState<Presets<Notification>> {}

export interface QualityDefinitionsAppState
    extends AppSectionState<QualityDefinition>,
        AppSectionSaveState {
    pendingChanges: {
        [key: number]: Partial<QualityProfile>;
    };
}

export interface QualityProfilesAppState
    extends AppSectionState<QualityProfile>,
        AppSectionItemSchemaState<QualityProfile>,
        AppSectionDeleteState,
        AppSectionSaveState {}

export interface ReleaseProfilesAppState
    extends AppSectionState<ReleaseProfile>,
        AppSectionSaveState {
    pendingChanges: Partial<ReleaseProfile>;
}

export interface CustomFormatAppState
    extends AppSectionState<CustomFormat>,
        AppSectionDeleteState,
        AppSectionSaveState {}

export interface CustomFormatSpecificationAppState
    extends AppSectionState<CustomFormatSpecification>,
        AppSectionDeleteState,
        AppSectionSaveState,
        AppSectionSchemaState<Presets<CustomFormatSpecification>> {}

export interface ImportListOptionsSettingsAppState
    extends AppSectionItemState<ImportListOptionsSettings>,
        AppSectionSaveState {}

export interface ImportListExclusionsSettingsAppState
    extends AppSectionState<ImportListExclusion>,
        AppSectionSaveState,
        PagedAppSectionState,
        AppSectionDeleteState {
    pendingChanges: Partial<ImportListExclusion>;
}

export interface RemotePathMappingsAppState
    extends AppSectionState<RemotePathMapping>,
        AppSectionDeleteState,
        AppSectionSaveState {
    pendingChanges: Partial<RemotePathMapping>;
}

export type IndexerFlagSettingsAppState = AppSectionState<IndexerFlag>;
export type LanguageSettingsAppState = AppSectionState<Language>;
export type UiSettingsAppState = AppSectionItemState<UiSettings>;

export interface SettingsAppState {
    advancedSettings: boolean;
    autoTaggings: AutoTaggingAppState;
    autoTaggingSpecifications: AutoTaggingSpecificationAppState;
    customFormats: CustomFormatAppState;
    customFormatSpecifications: CustomFormatSpecificationAppState;
    delayProfiles: DelayProfileAppState;
    downloadClients: DownloadClientAppState;
    downloadClientOptions: DownloadClientOptionsAppState;
    general: GeneralAppState;
    importListExclusions: ImportListExclusionsSettingsAppState;
    importListOptions: ImportListOptionsSettingsAppState;
    importLists: ImportListAppState;
    indexerFlags: IndexerFlagSettingsAppState;
    indexerOptions: IndexerOptionsAppState;
    indexers: IndexerAppState;
    languages: LanguageSettingsAppState;
    mediaManagement: MediaManagementAppState;
    metadata: MetadataAppState;
    naming: NamingAppState;
    namingExamples: NamingExamplesAppState;
    notifications: NotificationAppState;
    qualityDefinitions: QualityDefinitionsAppState;
    qualityProfiles: QualityProfilesAppState;
    releaseProfiles: ReleaseProfilesAppState;
    remotePathMappings: RemotePathMappingsAppState;
    ui: UiSettingsAppState;
}
