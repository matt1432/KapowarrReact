export const GCDownloadSources = {
    MEGA: 'Mega',
    MEDIAFIRE: 'MediaFire',
    WETRANSFER: 'WeTransfer',
    PIXELDRAIN: 'Pixeldrain',
    GETCOMICS: 'GetComics',
    GETCOMICS_TORRENT: 'GetComics (torrent)',
} as const;

export default GCDownloadSources;

export type GCDownloadSource = (typeof GCDownloadSources)[keyof typeof GCDownloadSources];
