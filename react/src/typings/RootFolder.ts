import type { ModelBase } from 'App/ModelBase';

export interface SizeData {
    total: number;
    used: number;
    free: number;
}

export interface RootFolder extends ModelBase {
    folder: string;
    path: string;
    size: SizeData;
}
