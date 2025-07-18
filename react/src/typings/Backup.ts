import type { ModelBase } from 'App/ModelBase';

export type BackupType = 'manual' | 'scheduled' | 'update';

export interface Backup extends ModelBase {
    name: string;
    path: string;
    type: BackupType;
    size: number;
    time: string;
}
