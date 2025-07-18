// IMPORTS

// React
import { useMemo } from 'react';

// Misc
import translate from 'Utilities/String/translate';

import * as volumeTypes from 'Utilities/Volume/volumeTypes';

// Specific Components
import EnhancedSelectInput, {
    type EnhancedSelectInputProps,
    type EnhancedSelectInputValue,
} from './EnhancedSelectInput';
import VolumeTypeSelectInputOption from './VolumeTypeSelectInputOption';
import VolumeTypeSelectInputSelectedValue from './VolumeTypeSelectInputSelectedValue';

// Types
export interface VolumeTypeSelectInputProps
    extends Omit<EnhancedSelectInputProps<EnhancedSelectInputValue<string>, string>, 'values'> {
    includeNoChange?: boolean;
    includeNoChangeDisabled?: boolean;
    includeMixed?: boolean;
}

export interface IVolumeTypeOption {
    key: string;
    value: string;
    format?: string;
    isDisabled?: boolean;
}

// IMPLEMENTATIONS

const volumeTypeOptions: IVolumeTypeOption[] = [
    {
        key: volumeTypes.STANDARD,
        value: 'Standard',
        get format() {
            return translate('StandardIssueTypeFormat', { format: 'S01E05' });
        },
    },
    {
        key: volumeTypes.DAILY,
        value: 'Daily / Date',
        get format() {
            return translate('DailyIssueTypeFormat', { format: '2020-05-25' });
        },
    },
    {
        key: volumeTypes.ANIME,
        value: 'Anime / Absolute',
        get format() {
            return translate('AnimeIssueTypeFormat', { format: '005' });
        },
    },
];

function VolumeTypeSelectInput(props: VolumeTypeSelectInputProps) {
    const { includeNoChange = false, includeNoChangeDisabled = true, includeMixed = false } = props;

    const values = useMemo(() => {
        const result = [...volumeTypeOptions];

        if (includeNoChange) {
            result.unshift({
                key: 'noChange',
                value: translate('NoChange'),
                isDisabled: includeNoChangeDisabled,
            });
        }

        if (includeMixed) {
            result.unshift({
                key: 'mixed',
                value: `(${translate('Mixed')})`,
                isDisabled: true,
            });
        }

        return result;
    }, [includeNoChange, includeNoChangeDisabled, includeMixed]);

    return (
        <EnhancedSelectInput
            {...props}
            values={values}
            optionComponent={VolumeTypeSelectInputOption}
            selectedValueComponent={VolumeTypeSelectInputSelectedValue}
        />
    );
}

export default VolumeTypeSelectInput;
