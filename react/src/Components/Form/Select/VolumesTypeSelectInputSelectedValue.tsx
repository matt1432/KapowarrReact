import HintedSelectInputSelectedValue from './HintedSelectInputSelectedValue';
import { type IVolumesTypeOption } from './VolumesTypeSelectInput';

interface VolumesTypeSelectInputOptionProps {
    selectedValue: string;
    values: IVolumesTypeOption[];
    format: string;
}
function VolumesTypeSelectInputSelectedValue(props: VolumesTypeSelectInputOptionProps) {
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

export default VolumesTypeSelectInputSelectedValue;
