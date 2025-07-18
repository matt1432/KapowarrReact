import type { ModelBase } from 'App/ModelBase';

export interface UnmappedFolder {
    name: string;
    path: string;
    relativePath: string;
}

export interface RootFolder extends ModelBase {
    id: number;
    path: string;
    accessible: boolean;
    freeSpace?: number;
    unmappedFolders: UnmappedFolder[];
}
