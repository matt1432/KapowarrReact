export interface RootFolder {
    id: number;
    folder: string;
    size: {
        free: number;
        total: number;
        used: number;
    };
}
