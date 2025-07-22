export type InputType =
    | 'autoComplete'
    | 'check'
    | 'date'
    | 'keyValueList'
    | 'monitorIssuesSelect'
    | 'monitorNewItemsSelect'
    | 'file'
    | 'float'
    | 'number'
    | 'oauth'
    | 'password'
    | 'path'
    | 'downloadClientSelect'
    | 'rootFolderSelect'
    | 'select'
    | 'dynamicSelect'
    | 'volumeTypeSelect'
    | 'text'
    | 'textArea'
    | 'umask';

const AUTO_COMPLETE: InputType = 'autoComplete';
const CHECK: InputType = 'check';
const DATE: InputType = 'date';
const KEY_VALUE_LIST: InputType = 'keyValueList';
const MONITOR_ISSUES_SELECT: InputType = 'monitorIssuesSelect';
const MONITOR_NEW_ITEMS_SELECT: InputType = 'monitorNewItemsSelect';
const FILE: InputType = 'file';
const FLOAT: InputType = 'float';
const NUMBER: InputType = 'number';
const OAUTH: InputType = 'oauth';
const PASSWORD: InputType = 'password';
const PATH: InputType = 'path';
const DOWNLOAD_CLIENT_SELECT: InputType = 'downloadClientSelect';
const ROOT_FOLDER_SELECT: InputType = 'rootFolderSelect';
const SELECT: InputType = 'select';
const DYNAMIC_SELECT: InputType = 'dynamicSelect';
const VOLUME_TYPE_SELECT: InputType = 'volumeTypeSelect';
const TEXT: InputType = 'text';
const TEXT_AREA: InputType = 'textArea';
const UMASK: InputType = 'umask';

const all = [
    AUTO_COMPLETE,
    CHECK,
    DATE,
    KEY_VALUE_LIST,
    MONITOR_ISSUES_SELECT,
    MONITOR_NEW_ITEMS_SELECT,
    FILE,
    FLOAT,
    NUMBER,
    OAUTH,
    PASSWORD,
    PATH,
    DOWNLOAD_CLIENT_SELECT,
    ROOT_FOLDER_SELECT,
    SELECT,
    DYNAMIC_SELECT,
    VOLUME_TYPE_SELECT,
    TEXT,
    TEXT_AREA,
    UMASK,
] as const;

export const inputTypes = {
    AUTO_COMPLETE,
    CHECK,
    DATE,
    KEY_VALUE_LIST,
    MONITOR_ISSUES_SELECT,
    MONITOR_NEW_ITEMS_SELECT,
    FILE,
    FLOAT,
    NUMBER,
    OAUTH,
    PASSWORD,
    PATH,
    DOWNLOAD_CLIENT_SELECT,
    ROOT_FOLDER_SELECT,
    SELECT,
    DYNAMIC_SELECT,
    VOLUME_TYPE_SELECT,
    TEXT,
    TEXT_AREA,
    UMASK,
    all,
};

export default inputTypes;
