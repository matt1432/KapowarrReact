const massEditActions = {
    DELETE: 'delete',
    ROOT_FOLDER: 'root_folder',
    REMOVE_ADS: 'remove_ads',
    RENAME: 'rename',
    UPDATE: 'update',
    SEARCH: 'search',
    CONVERT: 'convert',
    UNMONITOR: 'unmonitor',
    MONITOR: 'monitor',
    MONITORING_SCHEME: 'monitoring_scheme',
} as const;

export default massEditActions;

export type MassEditAction = (typeof massEditActions)[keyof typeof massEditActions];
