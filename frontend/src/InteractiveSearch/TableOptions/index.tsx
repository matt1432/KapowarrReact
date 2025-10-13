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
import type { CheckInputChanged } from 'typings/Inputs';
import type { SetTableOptionsParams } from 'Store/Slices/TableOptions';

interface InteractiveSearchTableOptionsProps {
    onTableOptionChange(
        payload: SetTableOptionsParams<'interactiveSearch'>,
    ): void;
}

// IMPLEMENTATIONS

export default function InteractiveSearchTableOptions({
    onTableOptionChange,
}: InteractiveSearchTableOptionsProps) {
    const { hideDownloaded, hideUnmonitored } = useRootSelector(
        (state) => state.tableOptions.interactiveSearch,
    );

    const onTableOptionChangeWrapper = useCallback(
        ({
            name,
            value,
        }: CheckInputChanged<'hideUnmonitored' | 'hideDownloaded'>) => {
            onTableOptionChange({
                tableName: 'interactiveSearch',
                [name]: value,
            });
        },
        [onTableOptionChange],
    );

    return (
        <>
            <FormGroup>
                <FormLabel>{translate('HideDownloadedIssues')}</FormLabel>

                <FormInputGroup
                    type={inputTypes.CHECK}
                    name="hideDownloaded"
                    value={hideDownloaded}
                    helpText={translate('HideDownloadedIssuesHelpText')}
                    onChange={onTableOptionChangeWrapper}
                />
            </FormGroup>

            <FormGroup>
                <FormLabel>{translate('HideUnmonitoredIssues')}</FormLabel>

                <FormInputGroup
                    type={inputTypes.CHECK}
                    name="hideUnmonitored"
                    value={hideUnmonitored}
                    helpText={translate('HideUnmonitoredIssuesHelpText')}
                    onChange={onTableOptionChangeWrapper}
                />
            </FormGroup>
        </>
    );
}
