import { type Provider } from './Provider';

export interface Notification extends Provider {
    enable: boolean;
    onGrab: boolean;
    onDownload: boolean;
    onUpgrade: boolean;
    onImportComplete: boolean;
    onRename: boolean;
    onComicsAdd: boolean;
    onComicsDelete: boolean;
    onEpisodeFileDelete: boolean;
    onEpisodeFileDeleteForUpgrade: boolean;
    onHealthIssue: boolean;
    includeHealthWarnings: boolean;
    onHealthRestored: boolean;
    onApplicationUpdate: boolean;
    onManualInteractionRequired: boolean;
    supportsOnGrab: boolean;
    supportsOnDownload: boolean;
    supportsOnUpgrade: boolean;
    supportsOnImportComplete: boolean;
    supportsOnRename: boolean;
    supportsOnComicsAdd: boolean;
    supportsOnComicsDelete: boolean;
    supportsOnEpisodeFileDelete: boolean;
    supportsOnEpisodeFileDeleteForUpgrade: boolean;
    supportsOnHealthIssue: boolean;
    supportsOnHealthRestored: boolean;
    supportsOnApplicationUpdate: boolean;
    supportsOnManualInteractionRequired: boolean;
    tags: number[];
}
