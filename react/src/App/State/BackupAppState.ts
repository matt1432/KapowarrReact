import { type Backup } from 'typings/Backup';
import type { AppSectionState, Error } from './AppSectionState';

export interface BackupAppState extends AppSectionState<Backup> {
    isRestoring: boolean;
    restoreError?: Error;
}
