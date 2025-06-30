import { useMemo } from 'react';
import * as volumesTypes from 'Utilities/Volumes/volumesTypes';
import translate from 'Utilities/String/translate';
import EnhancedSelectInput, {
    type EnhancedSelectInputProps,
    type EnhancedSelectInputValue,
} from './EnhancedSelectInput';
import VolumesTypeSelectInputOption from './VolumesTypeSelectInputOption';
import VolumesTypeSelectInputSelectedValue from './VolumesTypeSelectInputSelectedValue';

export interface VolumesTypeSelectInputProps
    extends Omit<EnhancedSelectInputProps<EnhancedSelectInputValue<string>, string>, 'values'> {
    includeNoChange?: boolean;
    includeNoChangeDisabled?: boolean;
    includeMixed?: boolean;
}

export interface IVolumesTypeOption {
    key: string;
    value: string;
    format?: string;
    isDisabled?: boolean;
}

const volumesTypeOptions: IVolumesTypeOption[] = [
    {
        key: volumesTypes.STANDARD,
        value: 'Standard',
        get format() {
            return translate('StandardIssueTypeFormat', { format: 'S01E05' });
        },
    },
    {
        key: volumesTypes.DAILY,
        value: 'Daily / Date',
        get format() {
            return translate('DailyIssueTypeFormat', { format: '2020-05-25' });
        },
    },
    {
        key: volumesTypes.ANIME,
        value: 'Anime / Absolute',
        get format() {
            return translate('AnimeIssueTypeFormat', { format: '005' });
        },
    },
];

function VolumesTypeSelectInput(props: VolumesTypeSelectInputProps) {
    const { includeNoChange = false, includeNoChangeDisabled = true, includeMixed = false } = props;

    const values = useMemo(() => {
        const result = [...volumesTypeOptions];

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
            optionComponent={VolumesTypeSelectInputOption}
            selectedValueComponent={VolumesTypeSelectInputSelectedValue}
        />
    );
}

export default VolumesTypeSelectInput;
