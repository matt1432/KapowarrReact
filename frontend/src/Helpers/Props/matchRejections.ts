const matchRejections = {
    BLOCKLISTED: 'Link is blocklisted',
    ANNUAL: 'Annual conflict',
    TITLE: "Titles don't match",
    VOLUME_NUMBER: "Volume numbers don't match",
    ISSUE_NUMBER: "Issue numbers don't match",
    SPECIAL_VERSION: 'Special version conflict',
    YEAR: "Year doesn't match",
} as const;

export default matchRejections;

export type MatchRejection = (typeof matchRejections)[keyof typeof matchRejections];
