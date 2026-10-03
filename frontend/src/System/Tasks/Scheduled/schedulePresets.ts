import translate from 'Utilities/String/translate';

import type { EnhancedSelectInputValue } from 'Components/Form/Select/EnhancedSelectInput';

const schedulePresets: EnhancedSelectInputValue<string>[] = [
    { key: '0 * * * *', value: translate('EveryHour') },
    { key: '0 0 * * *', value: translate('OncePerDay') },
];

export default schedulePresets;
