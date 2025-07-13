import HintedSelectInputSelectedValue from './HintedSelectInputSelectedValue';
import { type IVolumeTypeOption } from './VolumeTypeSelectInput';

interface VolumeTypeSelectInputOptionProps {
    selectedValue: string;
    values: IVolumeTypeOption[];
    format: string;
}
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
