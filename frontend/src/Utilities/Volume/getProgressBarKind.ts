import { kinds } from 'Helpers/Props';

function getProgressBarKind(
    monitored: boolean,
    progress: number,
    isDownloading: boolean,
    marvelIssueCount = 0,
) {
    if (isDownloading) {
        return kinds.PURPLE;
    }

    if (progress === 100) {
        return marvelIssueCount ? kinds.PRIMARY : kinds.SUCCESS;
    }

    if (monitored) {
        return kinds.DANGER;
    }

    return kinds.WARNING;
}

export default getProgressBarKind;
