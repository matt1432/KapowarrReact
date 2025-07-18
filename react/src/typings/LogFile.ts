import type { ModelBase } from 'App/ModelBase';

export interface LogFile extends ModelBase {
    filename: string;
    lastWriteTime: string;
    contentsUrl: string;
    downloadUrl: string;
}
