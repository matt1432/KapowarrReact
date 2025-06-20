import moment, { type MomentInput } from 'moment';
import { type FilterDateType } from 'Helpers/Props/filterTypes';

function isAfter(date: MomentInput, offsets: Partial<Record<FilterDateType, number>> = {}) {
    if (!date) {
        return false;
    }

    const offsetTime = moment();

    Object.entries(offsets).forEach(([key, value]) => {
        offsetTime.add(value, key as FilterDateType);
    });

    return moment(date).isAfter(offsetTime);
}

export default isAfter;
