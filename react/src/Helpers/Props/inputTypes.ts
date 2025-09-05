export const inputTypes = {
    AUTO_COMPLETE: 'autoComplete',
    CHECK: 'check',
    DATE: 'date',
    KEY_VALUE_LIST: 'keyValueList',
    MONITOR_ISSUES_SELECT: 'monitorIssuesSelect',
    MONITOR_NEW_ITEMS_SELECT: 'monitorNewItemsSelect',
    FILE: 'file',
    FLOAT: 'float',
    NUMBER: 'number',
    PASSWORD: 'password',
    DOWNLOAD_CLIENT_SELECT: 'downloadClientSelect',
    ROOT_FOLDER_SELECT: 'rootFolderSelect',
    SELECT: 'select',
    DYNAMIC_SELECT: 'dynamicSelect',
    VOLUME_TYPE_SELECT: 'specialVersionSelect',
    TEXT: 'text',
    TEXT_AREA: 'textArea',
    UMASK: 'umask',
} as const;

export default inputTypes;

export type InputType = (typeof inputTypes)[keyof typeof inputTypes];
