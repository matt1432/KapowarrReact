// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';

// Misc
import { inputTypes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';

// Types
import type { InputChanged } from 'typings/Inputs';

interface VolumeIndexTableOptionsProps {
    onTableOptionChange(...args: unknown[]): unknown;
}

// IMPLEMENTATIONS

function VolumeIndexTableOptions({ onTableOptionChange }: VolumeIndexTableOptionsProps) {
    const { tableOptions } = useRootSelector((state) => state.volumeIndex);

    const { showSearchAction } = tableOptions;

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

    return (
        <>
            <FormGroup>
                <FormLabel>{translate('ShowSearch')}</FormLabel>

                <FormInputGroup
                    type={inputTypes.CHECK}
                    name="showSearchAction"
                    value={showSearchAction}
                    helpText={translate('ShowSearchHelpText')}
                    onChange={onTableOptionChangeWrapper}
                />
            </FormGroup>
        </>
    );
}

export default VolumeIndexTableOptions;
