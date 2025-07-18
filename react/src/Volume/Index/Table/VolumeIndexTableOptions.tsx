// IMPORTS

// React
// import { useCallback } from 'react';

// Redux
// import { useSelector } from 'react-redux'
// import selectTableOptions from './selectTableOptions';

// Misc
import { inputTypes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';

// Specific Components

// CSS

// Types
// import type { InputChanged } from 'typings/inputs';

interface VolumeIndexTableOptionsProps {
    onTableOptionChange(...args: unknown[]): unknown;
}

// IMPLEMENTATIONS

// @ts-expect-error TODO:
// eslint-disable-next-line
function VolumeIndexTableOptions(props: VolumeIndexTableOptionsProps) {
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

export default VolumeIndexTableOptions;
