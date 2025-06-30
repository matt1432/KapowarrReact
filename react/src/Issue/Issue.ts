import { type ModelBase } from 'App/ModelBase';
import { type Volumes } from 'Volumes/Volumes';

export interface Issue extends ModelBase {
    volumesId: number;
    tvdbId: number;
    issueFileId: number;
    seasonNumber: number;
    issueNumber: number;
    airDate: string;
    airDateUtc?: string;
    lastSearchTime?: string;
    runtime: number;
    absoluteIssueNumber?: number;
    sceneSeasonNumber?: number;
    sceneIssueNumber?: number;
    sceneAbsoluteIssueNumber?: number;
    overview: string;
    title: string;
    issueFile?: object;
    hasFile: boolean;
    monitored: boolean;
    grabbed?: boolean;
    unverifiedSceneNumbering: boolean;
    volumes?: Volumes;
    finaleType?: string;
}
