import { icons } from 'Helpers/Props';
import { type ComicsStatus } from 'Comics/Comics';
import translate from 'Utilities/String/translate';

export function getComicsStatusDetails(status: ComicsStatus) {
    let statusDetails = {
        icon: icons.COMICS_CONTINUING,
        title: translate('Continuing'),
        message: translate('ContinuingComicsDescription'),
    };

    if (status === 'deleted') {
        statusDetails = {
            icon: icons.COMICS_DELETED,
            title: translate('Deleted'),
            message: translate('DeletedComicsDescription'),
        };
    }
    else if (status === 'ended') {
        statusDetails = {
            icon: icons.COMICS_ENDED,
            title: translate('Ended'),
            message: translate('EndedComicsDescription'),
        };
    }
    else if (status === 'upcoming') {
        statusDetails = {
            icon: icons.COMICS_CONTINUING,
            title: translate('Upcoming'),
            message: translate('UpcomingComicsDescription'),
        };
    }

    return statusDetails;
}
