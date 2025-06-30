import { icons } from 'Helpers/Props';
import { type VolumesStatus } from 'Volumes/Volumes';
import translate from 'Utilities/String/translate';

export function getVolumesStatusDetails(status: VolumesStatus) {
    let statusDetails = {
        icon: icons.VOLUMES_CONTINUING,
        title: translate('Continuing'),
        message: translate('ContinuingVolumesDescription'),
    };

    if (status === 'deleted') {
        statusDetails = {
            icon: icons.VOLUMES_DELETED,
            title: translate('Deleted'),
            message: translate('DeletedVolumesDescription'),
        };
    }
    else if (status === 'ended') {
        statusDetails = {
            icon: icons.VOLUMES_ENDED,
            title: translate('Ended'),
            message: translate('EndedVolumesDescription'),
        };
    }
    else if (status === 'upcoming') {
        statusDetails = {
            icon: icons.VOLUMES_CONTINUING,
            title: translate('Upcoming'),
            message: translate('UpcomingVolumesDescription'),
        };
    }

    return statusDetails;
}
