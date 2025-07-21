export type CommandName =
    | 'refresh_and_scan'
    | 'auto_search'
    | 'auto_search_issue'
    | 'mass_rename'
    | 'mass_rename_issue'
    | 'mass_convert'
    | 'mass_convert_issue'
    | 'update_all'
    | 'search_all';

const REFRESH_VOLUME: CommandName = 'refresh_and_scan';
const VOLUME_SEARCH: CommandName = 'auto_search';
const ISSUE_SEARCH: CommandName = 'auto_search_issue';
const RENAME_VOLUME: CommandName = 'mass_rename';
const RENAME_ISSUE: CommandName = 'mass_rename_issue';
const CONVERT_VOLUME: CommandName = 'mass_convert';
const CONVERT_ISSUE: CommandName = 'mass_convert_issue';
const DOWNLOADED_EPISODES_SCAN: CommandName = 'update_all';
const SEARCH_ALL: CommandName = 'search_all';

export const commandNames = {
    REFRESH_VOLUME,
    VOLUME_SEARCH,
    ISSUE_SEARCH,
    RENAME_VOLUME,
    RENAME_ISSUE,
    CONVERT_VOLUME,
    CONVERT_ISSUE,
    DOWNLOADED_EPISODES_SCAN,
    SEARCH_ALL,
};

export default commandNames;
