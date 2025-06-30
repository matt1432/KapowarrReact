export type ListSyncLevel = 'disabled' | 'logOnly' | 'keepAndUnmonitor' | 'keepAndTag';

export interface ImportListOptionsSettings {
    listSyncLevel: ListSyncLevel;
    listSyncTag: number;
}
