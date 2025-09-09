import type { CamelCasedProperties } from 'type-fest';

import type { DownloadType } from 'Helpers/Props/downloadTypes';
import type { Nullable } from './Misc';

export interface RawDownloadClient {
    id: number;
    download_type: DownloadType;
    client_type: string;
    title: string;
    base_url: string;
    username: Nullable<string>;
    password: Nullable<string>;
    api_token: Nullable<string>;
}

export type DownloadClient = CamelCasedProperties<RawDownloadClient>;

export type ClientToken = 'title' | 'base_url' | 'username' | 'password' | 'api_token';
export type DownloadClientOptions = Record<string, ClientToken[]>;
