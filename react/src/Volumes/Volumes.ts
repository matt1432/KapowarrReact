import { type ModelBase } from 'App/ModelBase';
import type { GeneralFileData, Issue } from 'Issue/Issue';

export interface VolumePublicInfo extends ModelBase {
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

export type Volume = VolumePublicInfo;
