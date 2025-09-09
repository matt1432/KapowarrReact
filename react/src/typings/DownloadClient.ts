import type { CamelCasedProperties } from 'type-fest';

import type { DownloadType } from 'Helpers/Props/downloadTypes';

export interface RawDownloadClient {
    id: number;
    download_type: DownloadType;
    client_type: string;
    title: string;
    base_url: string;
    username: string;
    password: string;
    api_token: string | null;
}

export type DownloadClient = CamelCasedProperties<RawDownloadClient>;
