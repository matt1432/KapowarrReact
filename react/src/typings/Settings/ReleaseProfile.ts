import { type ModelBase } from 'App/ModelBase';

export interface ReleaseProfile extends ModelBase {
    name: string;
    enabled: boolean;
    required: string[];
    ignored: string[];
    indexerId: number;
    tags: number[];
}
