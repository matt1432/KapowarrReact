// import { useCallback } from 'react';
// import { useSelector } from 'react-redux';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import { inputTypes } from 'Helpers/Props';
// import { type InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
// import selectTableOptions from './selectTableOptions';

interface VolumesIndexTableOptionsProps {
    onTableOptionChange(...args: unknown[]): unknown;
}

function VolumesIndexTableOptions(props: VolumesIndexTableOptionsProps) {
    console.log(props);
    // const { onTableOptionChange } = props;

    // const tableOptions = useSelector(selectTableOptions);

    // const { showBanners, showSearchAction } = tableOptions;

    /*
    const onTableOptionChangeWrapper = useCallback(
        ({ name, value }: InputChanged<boolean>) => {
            onTableOptionChange({
                tableOptions: {
                    ...tableOptions,
                    [name]: value,
                },
            });
        },
        [tableOptions, onTableOptionChange],
    );
    */

    return (
        <>
            <FormGroup>
                <FormLabel>{translate('ShowBanners')}</FormLabel>

                <FormInputGroup
                    type={inputTypes.CHECK}
                    name="showBanners"
                    value={'' /*showBanners*/}
                    helpText={translate('ShowBannersHelpText')}
                    onChange={() => {} /*onTableOptionChangeWrapper*/}
                />
            </FormGroup>

            <FormGroup>
                <FormLabel>{translate('ShowSearch')}</FormLabel>

                <FormInputGroup
                    type={inputTypes.CHECK}
                    name="showSearchAction"
                    value={'' /*showSearchAction*/}
                    helpText={translate('ShowSearchHelpText')}
                    onChange={() => {} /*onTableOptionChangeWrapper*/}
                />
            </FormGroup>
        </>
    );
}

export default VolumesIndexTableOptions;
