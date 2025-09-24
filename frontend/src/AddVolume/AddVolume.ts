import type { CamelCasedProperties } from 'type-fest';

export interface RawIssueMetadata {
    comicvine_id: number;
    volume_id: number;
    issue_number: string;
    calculated_issue_number: number;
    title: string | null;
    date: string | null;
    description: string;
}

export type IssueMetadata = CamelCasedProperties<RawIssueMetadata>;

export interface RawVolumeMetadata {
    comicvine_id: number;
    title: string;
    year: number | null;
    volume_number: number;
    cover_link: string;
    description: string;
    site_url: string;
    aliases: string[];
    publisher: string | null;
    issue_count: number;
    translated: boolean;
    already_added: number | null;
    issues: RawIssueMetadata[] | null;
    folder_name: string;
}

export type VolumeMetadata = CamelCasedProperties<
    Omit<RawVolumeMetadata, 'issues'>
> & {
    issues: IssueMetadata[] | null;
};

export type AddVolume = VolumeMetadata;
