import type { CamelCasedProperties } from 'type-fest';

import type { DownloadType } from 'Helpers/Props/downloadTypes';
import type { Nullable } from './Misc';

export type BuiltInType =
    | 'Mega'
    | 'MediaFire'
    | 'WeTransfer'
    | 'Pixeldrain'
    | 'GetComics'
    | 'Libgen+';

export type ClientType = 'qBittorrent';

export interface RawDownloadClient {
    id: number;
    download_type: DownloadType;
    client_type: ClientType;
    title: string;
    base_url: string;
    username: Nullable<string>;
    password: Nullable<string>;
    api_token: Nullable<string>;
}

export type DownloadClient = CamelCasedProperties<RawDownloadClient>;

export type ClientToken = 'title' | 'base_url' | 'username' | 'password' | 'api_token';
export type DownloadClientOptions = Record<ClientType, ClientToken[]>;

export type CredentialSource = 'mega' | 'pixeldrain';

export interface RawCredentialData {
    id: number;
    source: CredentialSource;
    username: Nullable<string>;
    email: Nullable<string>;
    password: Nullable<string>;
    api_key: Nullable<string>;
}

export type CredentialData = CamelCasedProperties<RawCredentialData>;
