const downloadTypes = {
    DIRECT: 1,
    TORRENT: 2,
} as const;

export default downloadTypes;

export type DownloadType = (typeof downloadTypes)[keyof typeof downloadTypes];
