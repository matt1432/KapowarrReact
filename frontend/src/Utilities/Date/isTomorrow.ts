import moment, { type MomentInput } from 'moment';

function isTomorrow(date: MomentInput) {
    if (!date) {
        return false;
    }

    return moment(date).isSame(moment().add(1, 'day'), 'day');
}

export default isTomorrow;
