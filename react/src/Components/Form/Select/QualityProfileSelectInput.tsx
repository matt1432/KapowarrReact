// IMPORTS

// React
import { useCallback, useEffect } from 'react';

// Redux
// import { useSelector } from 'react-redux';
// import { createSelector } from 'reselect';
// import createSortedSectionSelector from 'Store/Selectors/createSortedSectionSelector';

// Misc
// import sortByProp from 'Utilities/Array/sortByProp';
// import translate from 'Utilities/String/translate';

// Specific Components
import EnhancedSelectInput, {
    type EnhancedSelectInputProps,
    type EnhancedSelectInputValue,
} from './EnhancedSelectInput';

// Types
import type { EnhancedSelectInputChanged } from 'typings/inputs';

export interface QualityProfileSelectInputProps
    extends Omit<
        EnhancedSelectInputProps<EnhancedSelectInputValue<number | string>, number | string>,
        'values'
    > {
    name: string;
    includeNoChange?: boolean;
    includeNoChangeDisabled?: boolean;
    includeMixed?: boolean;
}

// IMPLEMENTATIONS

/*
function createQualityProfilesSelector(
    includeNoChange: boolean,
    includeNoChangeDisabled: boolean,
    includeMixed: boolean,
) {
    return createSelector(
        createSortedSectionSelector<QualityProfile, QualityProfilesAppState>(
            'settings.qualityProfiles',
            sortByProp<QualityProfile, 'name'>('name'),
        ),
        (qualityProfiles: QualityProfilesAppState) => {
            const values: EnhancedSelectInputValue<number | string>[] = qualityProfiles.items.map(
                (qualityProfile) => {
                    return {
                        key: qualityProfile.id,
                        value: qualityProfile.name,
                    };
                },
            );

            if (includeNoChange) {
                values.unshift({
                    key: 'noChange',
                    get value() {
                        return translate('NoChange');
                    },
                    isDisabled: includeNoChangeDisabled,
                });
            }

            if (includeMixed) {
                values.unshift({
                    key: 'mixed',
                    get value() {
                        return `(${translate('Mixed')})`;
                    },
                    isDisabled: true,
                });
            }

            return values;
        },
    );
}
*/

function QualityProfileSelectInput({
    name,
    value,
    // includeNoChange = false,
    // includeNoChangeDisabled = true,
    // includeMixed = false,
    onChange,
    ...otherProps
}: QualityProfileSelectInputProps) {
    // const values = useSelector(
    //     createQualityProfilesSelector(includeNoChange, includeNoChangeDisabled, includeMixed),
    // );

    // @ts-expect-error TODO:
    const values = [];

    const handleChange = useCallback(
        ({ value }: EnhancedSelectInputChanged<string | number>) => {
            onChange({ name, value });
        },
        [name, onChange],
    );

    useEffect(() => {
        // @ts-expect-error TODO:
        if (!value || !values.some((option) => option.key === value || option.key === value)) {
            // @ts-expect-error TODO:
            const firstValue = values.find((option) => typeof option.key === 'number');

            if (firstValue) {
                onChange({ name, value: firstValue.key });
            }
        }
        // @ts-expect-error TODO:
    }, [name, value, values, onChange]);

    return (
        <EnhancedSelectInput
            {...otherProps}
            name={name}
            value={value}
            // @ts-expect-error TODO:
            values={values}
            onChange={handleChange}
        />
    );
}

export default QualityProfileSelectInput;
