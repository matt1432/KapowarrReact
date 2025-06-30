import { type ModelBase } from 'App/ModelBase';

export interface RemotePathMapping extends ModelBase {
    host: string;
    localPath: string;
    remotePath: string;
}
