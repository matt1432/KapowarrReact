import type { CamelCasedProperties } from 'type-fest';

export interface RootFolder {
    id: number;
    folder: string;
    size: {
        free: number;
        total: number;
        used: number;
    };
}

export interface RawRemoteMapping {
    id: number;
    external_download_client_id: number;
    remote_path: string;
    local_path: string;
}

export type RemoteMapping = CamelCasedProperties<RawRemoteMapping>;
