import type { CamelCasedProperties } from 'type-fest';

export interface RawAboutInfo {
    version: string;
    python_version: string;
    database_version: number;
    database_location: string;
    data_folder: string;
    os: string;
    runs64bit: boolean;
}

export type AboutInfo = CamelCasedProperties<RawAboutInfo>;

export interface RawDatabaseBackup {
    index: number;
    creation_date: number;
    filepath: string;
    filename: string;
}

export type DatabaseBackup = CamelCasedProperties<RawDatabaseBackup>;

export type StatusCheckType =
    | 'cv_rate_limit'
    | 'download_service_rate_limit'
    | 'root_folder_almost_full'
    | 'root_folder_full'
    | 'cf_challenge_with_no_fs';

export interface RawStatusCheck {
    type: StatusCheckType;
    display_subtypes: string[];
}

export type StatusCheck = CamelCasedProperties<RawStatusCheck>;
