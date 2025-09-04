// IMPORTS

// Specific Components
import HintedSelectInputSelectedValue from '../HintedSelectInputSelectedValue';

// Types
import type { ISpecialVersionOption } from '../SpecialVersionSelectInput';

interface SpecialVersionSelectInputOptionProps {
    selectedValue: string;
    values: ISpecialVersionOption[];
}

// IMPLEMENTATIONS

export default function SpecialVersionSelectInputSelectedValue({
    selectedValue,
    values,
    ...otherProps
}: SpecialVersionSelectInputOptionProps) {
    return (
        <HintedSelectInputSelectedValue
            {...otherProps}
            selectedValue={selectedValue}
            values={values}
        />
    );
}
