import { type ModelBase } from 'App/ModelBase';
import type { GeneralFileData, Issue } from 'Issue/Issue';

export interface Volume extends ModelBase {
    comicvine_id: number;
    libgen_url: string | null;
    title: string;
    alt_title: string | null;
    year: number;
    publisher: string;
    volume_number: number;
    description: string;
    site_url: string;
    monitored: boolean;
    monitor_new_issues: boolean;
    root_folder: string;
    folder: string;
    custom_folder: boolean;
    special_version: string;
    special_version_locked: boolean;
    last_cv_fetch: number;
    issue_count: number;
    issues_downloaded: number;
    total_size: number;
    volume_folder: string;
    issues: Issue[];
    general_files: GeneralFileData[];
}

export interface VolumePublicInfo extends ModelBase {
    comicvine_id: number;
    description: string;
    folder: string;
    issue_count: number;
    issue_count_monitored: number;
    issue_file_count: number;
    issues_downloaded: number;
    issues_downloaded_monitored: number;
    monitor_new_issues: boolean;
    monitored: boolean;
    publisher: string;
    title: string;
    total_size: number;
    volume_number: number;
    year: number;
}
