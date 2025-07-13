import { type Provider } from './Provider';

export interface Notification extends Provider {
    enable: boolean;
    onGrab: boolean;
    onDownload: boolean;
    onUpgrade: boolean;
    onImportComplete: boolean;
    onRename: boolean;
    onVolumeAdd: boolean;
    onVolumeDelete: boolean;
    onIssueFileDelete: boolean;
    onIssueFileDeleteForUpgrade: boolean;
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
    supportsOnVolumeAdd: boolean;
    supportsOnVolumeDelete: boolean;
    supportsOnIssueFileDelete: boolean;
    supportsOnIssueFileDeleteForUpgrade: boolean;
    supportsOnHealthIssue: boolean;
    supportsOnHealthRestored: boolean;
    supportsOnApplicationUpdate: boolean;
    supportsOnManualInteractionRequired: boolean;
    tags: number[];
}
