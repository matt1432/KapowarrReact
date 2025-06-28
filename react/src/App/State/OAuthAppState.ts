import { type Error } from './AppSectionState';

export interface OAuthAppState {
    authorizing: boolean;
    result: Record<string, unknown> | null;
    error: Error;
}
