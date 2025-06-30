export interface MediaManagement {
    autoUnmonitorPreviouslyDownloadedIssues: boolean;
    recycleBin: string;
    recycleBinCleanupDays: number;
    downloadPropersAndRepacks: string;
    createEmptyComicsFolders: boolean;
    deleteEmptyFolders: boolean;
    fileDate: string;
    rescanAfterRefresh: string;
    setPermissionsLinux: boolean;
    chmodFolder: string;
    chownGroup: string;
    issueTitleRequired: string;
    skipFreeSpaceCheckWhenImporting: boolean;
    minimumFreeSpaceWhenImporting: number;
    copyUsingHardlinks: boolean;
    useScriptImport: boolean;
    scriptImportPath: string;
    importExtraFiles: boolean;
    extraFileExtensions: string;
    enableMediaInfo: boolean;
}
