export const specialVersions = {
    TPB: 'tpb',
    ONE_SHOT: 'one-shot',
    HARD_COVER: 'hard-cover',
    VOL_AS_ISSUE: 'volume-as-issue',
    COVER: 'cover',
    METADATA: 'metadata',
    NORMAL: '',
} as const;

export default specialVersions;

export type SpecialVersion = (typeof specialVersions)[keyof typeof specialVersions];
