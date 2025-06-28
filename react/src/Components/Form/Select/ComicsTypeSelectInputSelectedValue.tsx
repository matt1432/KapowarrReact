import HintedSelectInputSelectedValue from './HintedSelectInputSelectedValue';
import { type IComicsTypeOption } from './ComicsTypeSelectInput';

interface ComicsTypeSelectInputOptionProps {
    selectedValue: string;
    values: IComicsTypeOption[];
    format: string;
}
function ComicsTypeSelectInputSelectedValue(props: ComicsTypeSelectInputOptionProps) {
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

export default ComicsTypeSelectInputSelectedValue;
