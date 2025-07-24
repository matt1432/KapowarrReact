// IMPORTS

// Specific Components
import HintedSelectInputSelectedValue from './HintedSelectInputSelectedValue';

// Types
import type { ISpecialVersionOption } from './SpecialVersionSelectInput';

interface SpecialVersionSelectInputOptionProps {
    selectedValue: string;
    values: ISpecialVersionOption[];
}

// IMPLEMENTATIONS

function SpecialVersionSelectInputSelectedValue(props: SpecialVersionSelectInputOptionProps) {
    const { selectedValue, values, ...otherProps } = props;

    return (
        <HintedSelectInputSelectedValue
            {...otherProps}
            selectedValue={selectedValue}
            values={values}
        />
    );
}

export default SpecialVersionSelectInputSelectedValue;
