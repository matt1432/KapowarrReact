export interface Changes {
    new: string[];
    fixed: string[];
}

export interface Update {
    version: string;
    branch: string;
    releaseDate: string;
    fileName: string;
    url: string;
    installed: boolean;
    installedOn: string;
    installable: boolean;
    latest: boolean;
    changes: Changes | null;
    hash: string;
}
