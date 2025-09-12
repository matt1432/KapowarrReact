const downloadStates = {
    QUEUED: 'queued',
    PAUSED: 'paused',
    DOWNLOADING: 'downloading',
    SEEDING: 'seeding',
    IMPORTING: 'importing',

    FAILED: 'failed',
    CANCELED: 'canceled',
    SHUTDOWN: 'shutting down',
} as const;

export default downloadStates;

export type DownloadState = (typeof downloadStates)[keyof typeof downloadStates];
