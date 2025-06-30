import { type ModelBase } from 'App/ModelBase';
import { type Comics } from 'Comics/Comics';

export interface Issue extends ModelBase {
    comicsId: number;
    tvdbId: number;
    episodeFileId: number;
    seasonNumber: number;
    episodeNumber: number;
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
    episodeFile?: object;
    hasFile: boolean;
    monitored: boolean;
    grabbed?: boolean;
    unverifiedSceneNumbering: boolean;
    comics?: Comics;
    finaleType?: string;
}
