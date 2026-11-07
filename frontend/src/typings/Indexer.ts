import type { CamelCasedProperties } from 'type-fest';

import type { DownloadType } from 'Helpers/Props/downloadTypes';
import type { GCDownloadSource } from 'Helpers/Props/GCDownloadSources';
import type { Nullable } from './Misc';

export type IndexerClientType = 'GetComics' | 'Libgen+' | 'Torznab';

export type IndexerToken =
    | 'title'
    | 'enabled'
    | 'url'
    | 'gc_service_preference'
    | 'gc_avoid_large_downloads'
    | 'api_path'
    | 'api_key'
    | 'categories';

export interface RawIndexer {
    id: number;
    enabled: boolean;
    download_type: DownloadType;
    client_type: IndexerClientType;
    required_tokens: IndexerToken[];
    title: string;
    url: string;
    gc_service_preference: Nullable<GCDownloadSource[]>;
    gc_avoid_large_downloads: Nullable<boolean>;
    api_path: Nullable<string>;
    api_key: Nullable<string>;
    categories: Nullable<string[]>;
}

export type Indexer = CamelCasedProperties<RawIndexer>;

export interface IndexerClientOption {
    required_tokens: IndexerToken[];
    allow_multiple_instances: boolean;
}

export type IndexerOptions = Record<
    DownloadType,
    Partial<Record<IndexerClientType, IndexerClientOption>>
>;
