// IMPORTS

// Misc
import monitorOptions from 'Utilities/Volume/monitorOptions';
import translate from 'Utilities/String/translate';

// Specific Components
import EnhancedSelectInput, {
    type EnhancedSelectInputProps,
    type EnhancedSelectInputValue,
} from '../EnhancedSelectInput';

// Types
export interface MonitorIssuesSelectInputProps
    extends Omit<EnhancedSelectInputProps<EnhancedSelectInputValue<string>, string>, 'values'> {
    includeNoChange?: boolean;
    includeMixed?: boolean;
}

// IMPLEMENTATIONS

function MonitorIssuesSelectInput({
    includeNoChange = false,
    includeMixed = false,
    ...otherProps
}: MonitorIssuesSelectInputProps) {
    const values: EnhancedSelectInputValue<string>[] = [...monitorOptions];

    if (includeNoChange) {
        values.unshift({
            key: 'noChange',
            get value() {
                return translate('NoChange');
            },
            isDisabled: true,
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

    return <EnhancedSelectInput {...otherProps} values={values} />;
}

export default MonitorIssuesSelectInput;
