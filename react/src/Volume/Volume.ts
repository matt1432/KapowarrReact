import type { CamelCasedProperties } from 'type-fest';

import type { GeneralFileData, Issue, RawIssue } from 'Issue/Issue';
import type { SpecialVersion } from 'Helpers/Props/specialVersions';

export type VolumeColumnName =
    | 'monitored'
    | 'title'
    | 'volumeNumber'
    | 'year'
    | 'publisher'
    | 'issuesDownloadedMonitored'
    | 'issueCountMonitored'
    | 'folder'
    | 'totalSize'
    | 'monitorNewIssues'
    | 'actions';

export type MonitoringScheme = 'all' | 'missing' | 'none' | 'noChange';

export type RawVolume = {
    id: number;
    comicvine_id: number;
    libgen_series_id: number | null;
    title: string;
    alt_title: string | null;
    year: number;
    publisher: string;
    volume_number: number;
    description: string;
    site_url: string;
    monitored: boolean;
    monitor_new_issues: boolean;
    root_folder: number;
    folder: string;
    custom_folder: boolean;
    special_version: SpecialVersion;
    special_version_locked: boolean;
    last_cv_fetch: number;
    issue_count: number;
    issues_downloaded: number;
    total_size: number;
    volume_folder: string;
    issues: RawIssue[];
    general_files: GeneralFileData[];
};

export type Volume = Omit<CamelCasedProperties<RawVolume>, 'issues'> & {
    issues: Issue[];
};

export type RawVolumePublicInfo = Pick<
    RawVolume,
    | 'id'
    | 'comicvine_id'
    | 'description'
    | 'folder'
    | 'issue_count'
    | 'issues_downloaded'
    | 'monitor_new_issues'
    | 'monitored'
    | 'publisher'
    | 'title'
    | 'total_size'
    | 'volume_number'
    | 'year'
> & {
    issue_count_monitored: number;
    issue_file_count: number;
    issues_downloaded_monitored: number;
} & {
    actions: never; // for columns
};

export type VolumePublicInfo = CamelCasedProperties<RawVolumePublicInfo>;
