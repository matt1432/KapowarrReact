export const commandNames = {
    REFRESH_VOLUME: 'refresh_and_scan',
    VOLUME_SEARCH: 'auto_search',
    ISSUE_SEARCH: 'auto_search_issue',
    RENAME_VOLUME: 'mass_rename',
    RENAME_ISSUE: 'mass_rename_issue',
    CONVERT_VOLUME: 'mass_convert',
    CONVERT_ISSUE: 'mass_convert_issue',
    DOWNLOADED_ISSUES_SCAN: 'update_all',
    UPDATE_ALL: 'update_all',
    SEARCH_ALL: 'search_all',
} as const;

export default commandNames;

export type CommandName = (typeof commandNames)[keyof typeof commandNames];
