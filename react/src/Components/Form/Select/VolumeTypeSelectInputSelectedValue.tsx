// IMPORTS

// Specific Components
import HintedSelectInputSelectedValue from './HintedSelectInputSelectedValue';

// Types
import type { IVolumeTypeOption } from './VolumeTypeSelectInput';

interface VolumeTypeSelectInputOptionProps {
    selectedValue: string;
    values: IVolumeTypeOption[];
    format: string;
}

// IMPLEMENTATIONS

function VolumeTypeSelectInputSelectedValue(props: VolumeTypeSelectInputOptionProps) {
    const { selectedValue, values, ...otherProps } = props;
    const format = values.find((v) => v.key === selectedValue)?.format;

    return (
        <HintedSelectInputSelectedValue
            {...otherProps}
            selectedValue={selectedValue}
            values={values}
            hint={format}
        />
    );
}

export default VolumeTypeSelectInputSelectedValue;
