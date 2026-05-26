import type { DateType } from 'Helpers/Props/dateTypes';
import type { GCDownloadSource } from 'Helpers/Props/GCDownloadSources';
import type { ProxyType } from 'Helpers/Props/proxyTypes';
import type { SeedingHandling } from 'Helpers/Props/seedingHandlingValues';
import type { CamelCasedProperties } from 'type-fest';

export interface RawSettingsValue {
    api_key: string;
    auth_password: string;
    auth_username: string;
    auto_search_torrents: boolean;
    avoid_large_gc_downloads: boolean;
    change_file_date: string | null;
    chmod_folder: string;
    chown_group: string;
    comicvine_api_key: string;
    concurrent_direct_downloads: number;
    convert: boolean;
    create_empty_volume_folders: boolean;
    date_type: DateType;
    delete_completed_downloads: boolean;
    delete_empty_folders: boolean;
    download_folder: string;
    enable_getcomics: boolean;
    enable_libgen: boolean;
    extract_issue_ranges: boolean;
    failing_download_timeout: number;
    file_naming: string;
    file_naming_empty: string;
    file_naming_special_version: string;
    file_naming_vai: string;
    flaresolverr_base_url: string;
    format_preference: string[]; // improve type?
    host: string;
    include_cover_only_files: boolean;
    include_scanned_books: boolean;
    issue_padding: number;
    log_level: number;
    long_special_version: boolean;
    port: number;
    proxy_type: ProxyType;
    proxy_host: string;
    proxy_port: number;
    proxy_username: string;
    proxy_password: string;
    proxy_ignored_addresses: string;
    remove_ads: boolean;
    rename_downloaded_files: boolean;
    replace_illegal_characters: boolean;
    seeding_handling: SeedingHandling;
    service_preference: GCDownloadSource[];
    unmonitor_deleted_issues: boolean;
    url_base: string;
    volume_folder_naming: string;
    volume_padding: number;
}

export type SettingsValue = CamelCasedProperties<RawSettingsValue>;
