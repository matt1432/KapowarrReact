import type { ModelBase } from 'App/ModelBase';

export interface DelayProfile extends ModelBase {
    name: string;
    enableUsenet: boolean;
    enableTorrent: boolean;
    preferredProtocol: string;
    usenetDelay: number;
    torrentDelay: number;
    bypassIfHighestQuality: boolean;
    bypassIfAboveCustomFormatScore: boolean;
    minimumCustomFormatScore: number;
    order: number;
    tags: number[];
}
