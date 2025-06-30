import { type ModelBase } from 'App/ModelBase';
import { type AppSectionItemState } from 'App/State/AppSectionState';
import { type Issue } from 'Issue/Issue';
import { type Language } from 'Language/Language';
import { type QualityModel } from 'Quality/Quality';
import { type Comics } from 'Comics/Comics';
import { type CustomFormat } from 'typings/CustomFormat';

export interface ComicsTitleInfo {
    title: string;
    titleWithoutYear: string;
    year: number;
    allTitles: string[];
}

export interface ParsedIssueInfo {
    releaseTitle: string;
    comicsTitle: string;
    comicsTitleInfo: ComicsTitleInfo;
    quality: QualityModel;
    seasonNumber: number;
    episodeNumbers: number[];
    absoluteIssueNumbers: number[];
    specialAbsoluteIssueNumbers: number[];
    languages: Language[];
    fullSeason: boolean;
    isPartialSeason: boolean;
    isMultiSeason: boolean;
    isSeasonExtra: boolean;
    special: boolean;
    releaseHash: string;
    seasonPart: number;
    releaseGroup?: string;
    releaseTokens: string;
    airDate?: string;
    isDaily: boolean;
    isAbsoluteNumbering: boolean;
    isPossibleSpecialIssue: boolean;
    isPossibleSceneSeasonSpecial: boolean;
}

export interface ParseModel extends ModelBase {
    title: string;
    parsedIssueInfo: ParsedIssueInfo;
    comics?: Comics;
    episodes: Issue[];
    languages?: Language[];
    customFormats?: CustomFormat[];
    customFormatScore?: number;
}

export type ParseAppState = AppSectionItemState<ParseModel>;
