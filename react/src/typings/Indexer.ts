import { type DownloadProtocol } from 'DownloadClient/DownloadProtocol';
import { type Provider } from './Provider';

export interface Indexer extends Provider {
    enableRss: boolean;
    enableAutomaticSearch: boolean;
    enableInteractiveSearch: boolean;
    supportsRss: boolean;
    supportsSearch: boolean;
    seasonSearchMaximumSingleIssueAge: number;
    protocol: DownloadProtocol;
    priority: number;
    downloadClientId: number;
    tags: number[];
}
