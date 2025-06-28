import { useMemo } from 'react';
import * as comicsTypes from 'Utilities/Comics/comicsTypes';
import translate from 'Utilities/String/translate';
import EnhancedSelectInput, {
    type EnhancedSelectInputProps,
    type EnhancedSelectInputValue,
} from './EnhancedSelectInput';
import ComicsTypeSelectInputOption from './ComicsTypeSelectInputOption';
import ComicsTypeSelectInputSelectedValue from './ComicsTypeSelectInputSelectedValue';

export interface ComicsTypeSelectInputProps
    extends Omit<EnhancedSelectInputProps<EnhancedSelectInputValue<string>, string>, 'values'> {
    includeNoChange?: boolean;
    includeNoChangeDisabled?: boolean;
    includeMixed?: boolean;
}

export interface IComicsTypeOption {
    key: string;
    value: string;
    format?: string;
    isDisabled?: boolean;
}

const comicsTypeOptions: IComicsTypeOption[] = [
    {
        key: comicsTypes.STANDARD,
        value: 'Standard',
        get format() {
            return translate('StandardEpisodeTypeFormat', { format: 'S01E05' });
        },
    },
    {
        key: comicsTypes.DAILY,
        value: 'Daily / Date',
        get format() {
            return translate('DailyEpisodeTypeFormat', { format: '2020-05-25' });
        },
    },
    {
        key: comicsTypes.ANIME,
        value: 'Anime / Absolute',
        get format() {
            return translate('AnimeEpisodeTypeFormat', { format: '005' });
        },
    },
];

function ComicsTypeSelectInput(props: ComicsTypeSelectInputProps) {
    const { includeNoChange = false, includeNoChangeDisabled = true, includeMixed = false } = props;

    const values = useMemo(() => {
        const result = [...comicsTypeOptions];

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
            optionComponent={ComicsTypeSelectInputOption}
            selectedValueComponent={ComicsTypeSelectInputSelectedValue}
        />
    );
}

export default ComicsTypeSelectInput;
