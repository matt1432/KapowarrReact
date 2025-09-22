import type { CamelCasedProperties } from 'type-fest';

export interface RawAboutInfo {
    version: string;
    python_version: string;
    database_version: number;
    database_location: string;
    data_folder: string;
}

export type AboutInfo = CamelCasedProperties<RawAboutInfo>;
