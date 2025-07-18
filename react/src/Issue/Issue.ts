import type { ModelBase } from 'App/ModelBase';

export interface FileData extends ModelBase {
    filepath: string;
    size: number;
    releaser: string;
    scan_type: string;
    resolution: string;
    dpi: string;
}

export interface GeneralFileData extends FileData {
    file_type: string;
}

export interface IssueData extends ModelBase {
    volume_id: number;
    comicvine_id: number;
    issue_number: string;
    calculated_issue_number: number;
    title: string | null;
    date: string | null;
    description: string | null;
    monitored: boolean;
    files: FileData[];
}

export type Issue = IssueData;
