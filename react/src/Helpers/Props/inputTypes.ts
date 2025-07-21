export type InputType =
    | 'autoComplete'
    | 'check'
    | 'date'
    | 'device'
    | 'keyValueList'
    | 'monitorIssuesSelect'
    | 'monitorNewItemsSelect'
    | 'file'
    | 'float'
    | 'number'
    | 'oauth'
    | 'password'
    | 'path'
    | 'qualityProfileSelect'
    | 'indexerSelect'
    | 'indexerFlagsSelect'
    | 'languageSelect'
    | 'downloadClientSelect'
    | 'rootFolderSelect'
    | 'select'
    | 'dynamicSelect'
    | 'volumeTypeSelect'
    | 'tag'
    | 'text'
    | 'textArea'
    | 'textTag'
    | 'tagSelect'
    | 'umask';

const AUTO_COMPLETE: InputType = 'autoComplete';
const CHECK: InputType = 'check';
const DEVICE: InputType = 'device';
const KEY_VALUE_LIST: InputType = 'keyValueList';
const MONITOR_ISSUES_SELECT: InputType = 'monitorIssuesSelect';
const MONITOR_NEW_ITEMS_SELECT: InputType = 'monitorNewItemsSelect';
const FLOAT: InputType = 'float';
const NUMBER: InputType = 'number';
const OAUTH: InputType = 'oauth';
const PASSWORD: InputType = 'password';
const PATH: InputType = 'path';
const QUALITY_PROFILE_SELECT: InputType = 'qualityProfileSelect';
const INDEXER_SELECT: InputType = 'indexerSelect';
const LANGUAGE_SELECT: InputType = 'languageSelect';
const DOWNLOAD_CLIENT_SELECT: InputType = 'downloadClientSelect';
const ROOT_FOLDER_SELECT: InputType = 'rootFolderSelect';
const SELECT: InputType = 'select';
const DYNAMIC_SELECT: InputType = 'dynamicSelect';
const VOLUME_TYPE_SELECT: InputType = 'volumeTypeSelect';
const TAG: InputType = 'tag';
const TEXT: InputType = 'text';
const TEXT_AREA: InputType = 'textArea';
const TEXT_TAG: InputType = 'textTag';
const TAG_SELECT: InputType = 'tagSelect';
const UMASK: InputType = 'umask';

const all = [
    AUTO_COMPLETE,
    CHECK,
    DEVICE,
    KEY_VALUE_LIST,
    MONITOR_ISSUES_SELECT,
    MONITOR_NEW_ITEMS_SELECT,
    FLOAT,
    NUMBER,
    OAUTH,
    PASSWORD,
    PATH,
    QUALITY_PROFILE_SELECT,
    INDEXER_SELECT,
    DOWNLOAD_CLIENT_SELECT,
    ROOT_FOLDER_SELECT,
    LANGUAGE_SELECT,
    SELECT,
    DYNAMIC_SELECT,
    VOLUME_TYPE_SELECT,
    TAG,
    TEXT,
    TEXT_AREA,
    TEXT_TAG,
    TAG_SELECT,
    UMASK,
] as const;

export const inputTypes = {
    AUTO_COMPLETE,
    CHECK,
    DEVICE,
    KEY_VALUE_LIST,
    MONITOR_ISSUES_SELECT,
    MONITOR_NEW_ITEMS_SELECT,
    FLOAT,
    NUMBER,
    OAUTH,
    PASSWORD,
    PATH,
    QUALITY_PROFILE_SELECT,
    INDEXER_SELECT,
    DOWNLOAD_CLIENT_SELECT,
    ROOT_FOLDER_SELECT,
    LANGUAGE_SELECT,
    SELECT,
    DYNAMIC_SELECT,
    VOLUME_TYPE_SELECT,
    TAG,
    TEXT,
    TEXT_AREA,
    TEXT_TAG,
    TAG_SELECT,
    UMASK,
    all,
};

export default inputTypes;
