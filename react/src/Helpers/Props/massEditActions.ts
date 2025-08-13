export type MassEditAction =
    | 'delete'
    | 'root_folder'
    | 'rename'
    | 'remove_ads'
    | 'update'
    | 'search'
    | 'convert'
    | 'unmonitor'
    | 'monitor'
    | 'monitoring_scheme';

const DELETE: MassEditAction = 'delete';
const ROOT_FOLDER = 'root_folder' as const;
const REMOVE_ADS: MassEditAction = 'remove_ads';
const RENAME: MassEditAction = 'rename';
const UPDATE: MassEditAction = 'update';
const SEARCH: MassEditAction = 'search';
const CONVERT: MassEditAction = 'convert';
const UNMONITOR: MassEditAction = 'unmonitor';
const MONITOR: MassEditAction = 'monitor';
const MONITORING_SCHEME: MassEditAction = 'monitoring_scheme';

const massEditActions = {
    DELETE,
    ROOT_FOLDER,
    REMOVE_ADS,
    RENAME,
    UPDATE,
    SEARCH,
    CONVERT,
    UNMONITOR,
    MONITOR,
    MONITORING_SCHEME,
};

export default massEditActions;
