// IMPORTS

// React
import { useMemo } from 'react';

// Misc
import translate from 'Utilities/String/translate';

import * as specialVersions from 'Utilities/Volume/specialVersions';

// Specific Components
import EnhancedSelectInput, {
    type EnhancedSelectInputProps,
    type EnhancedSelectInputValue,
} from './EnhancedSelectInput';
import SpecialVersionSelectInputOption from './SpecialVersionSelectInputOption';
import SpecialVersionSelectInputSelectedValue from './SpecialVersionSelectInputSelectedValue';

// Types
export interface SpecialVersionSelectInputProps
    extends Omit<EnhancedSelectInputProps<EnhancedSelectInputValue<string>, string>, 'values'> {
    includeNoChange?: boolean;
    includeNoChangeDisabled?: boolean;
    includeMixed?: boolean;
}

export interface ISpecialVersionOption {
    key: string;
    value: string;
    isDisabled?: boolean;
}

// IMPLEMENTATIONS

const specialVersionOptions: ISpecialVersionOption[] = [
    {
        key: specialVersions.TPB,
        value: 'Trade Paperback',
    },
    {
        key: specialVersions.ONE_SHOT,
        value: 'Oneshot',
    },
    {
        key: specialVersions.HARD_COVER,
        value: 'Hard Cover',
    },
    {
        key: specialVersions.VOL_AS_ISSUE,
        value: 'Volume as Issue',
    },
];

function SpecialVersionSelectInput(props: SpecialVersionSelectInputProps) {
    const { includeNoChange = false, includeNoChangeDisabled = true, includeMixed = false } = props;

    const values = useMemo(() => {
        const result = [...specialVersionOptions];

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
            optionComponent={SpecialVersionSelectInputOption}
            selectedValueComponent={SpecialVersionSelectInputSelectedValue}
        />
    );
}

export default SpecialVersionSelectInput;
