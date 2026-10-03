export default function buildMatchTitle(
    title: string | null,
    year: number | null,
    issueCount: number | null,
) {
    let result = '';
    if (title) {
        result += title;
    }

    if (year !== null) {
        result += ` (${year})`;
    }

    if (issueCount !== null) {
        const plural = issueCount !== 1 ? 's' : '';
        result += ` [${issueCount} issue${plural}]`;
    }

    return result;
}
