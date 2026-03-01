export const downloadSources = {
    MEGA: 'Mega',
    MEDIAFIRE: 'MediaFire',
    WETRANSFER: 'WeTransfer',
    PIXELDRAIN: 'Pixeldrain',
    GETCOMICS: 'GetComics',
    GETCOMICS_TORRENT: 'GetComics (torrent)',
    LIBGENPLUS: 'Libgen+',
    LIBGENPLUS_TORRENT: 'Libgen+ (torrent)',
    ANNAS_ARCHIVE: "Anna's Archive",
} as const;

export default downloadSources;

export type DownloadSource =
    (typeof downloadSources)[keyof typeof downloadSources];
