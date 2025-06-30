import { kinds } from 'Helpers/Props';
import { type ComicsStatus } from 'Comics/Comics';

function getProgressBarKind(
    status: ComicsStatus,
    monitored: boolean,
    progress: number,
    isDownloading: boolean,
) {
    if (isDownloading) {
        return kinds.PURPLE;
    }

    if (progress === 100) {
        return status === 'ended' ? kinds.SUCCESS : kinds.PRIMARY;
    }

    if (monitored) {
        return kinds.DANGER;
    }

    return kinds.WARNING;
}

export default getProgressBarKind;
