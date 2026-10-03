import translate from './translate';

import type { TranslateKey } from './translate';

const blocklistReasons: Record<string, TranslateKey> = {
    link_broken: 'BlocklistReasonLinkBroken',
    no_working_links: 'BlocklistReasonNoWorkingLinks',
    added_by_user: 'BlocklistReasonAddedByUser',
};

const brokenClientReasons: Record<string, TranslateKey> = {
    connection_error: 'BrokenClientReasonConnectionError',
    not_client_instance: 'BrokenClientReasonNotClientInstance',
    version_not_supported: 'BrokenClientReasonVersionNotSupported',
    failed_processing_response: 'BrokenClientReasonFailedProcessingResponse',
    access_denied: 'BrokenClientReasonAccessDenied',
    invalid_credentials: 'BrokenClientReasonInvalidCredentials',
};

const enqueueFailureReasons: Record<string, TranslateKey> = {
    webpage_broken: 'EnqueueFailureReasonWebpageBroken',
    no_matches: 'EnqueueFailureReasonNoMatches',
    no_working_links: 'EnqueueFailureReasonNoWorkingLinks',
    only_rate_limited_links: 'EnqueueFailureReasonOnlyRateLimitedLinks',
    link_broken: 'EnqueueFailureReasonLinkBroken',
    link_rate_limited: 'EnqueueFailureReasonLinkRateLimited',
};

const invalidDatabaseReasons: Record<string, TranslateKey> = {
    not_kapowarr_db: 'InvalidDatabaseReasonNotKapowarrDb',
    version_not_supported: 'InvalidDatabaseReasonVersionNotSupported',
};

function translateWith(map: Record<string, TranslateKey>, reason: string) {
    return reason in map ? translate(map[reason]) : reason;
}

export function translateBlocklistReason(reason: string) {
    return translateWith(blocklistReasons, reason);
}

export function translateBrokenClientReason(reason: string) {
    return translateWith(brokenClientReasons, reason);
}

export function translateEnqueueFailureReason(reason: string) {
    return translateWith(enqueueFailureReasons, reason);
}

export function translateInvalidDatabaseReason(reason: string) {
    return translateWith(invalidDatabaseReasons, reason);
}
