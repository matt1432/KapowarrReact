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

interface InteractiveSearchIssueTableOptionsProps {
    onTableOptionChange(
        payload: SetTableOptionsParams<'interactiveSearch'>,
    ): void;
}

// IMPLEMENTATIONS

export default function InteractiveSearchIssueTableOptions({
    onTableOptionChange,
}: InteractiveSearchIssueTableOptionsProps) {
    const { hideUnmatched } = useRootSelector(
        (state) => state.tableOptions.interactiveSearch,
    );

    const onTableOptionChangeWrapper = useCallback(
        ({ name, value }: CheckInputChanged<'hideUnmatched'>) => {
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
                <FormLabel>{translate('HideUnmatchedIssues')}</FormLabel>

                <FormInputGroup
                    type={inputTypes.CHECK}
                    name="hideUnmatched"
                    value={hideUnmatched}
                    helpText={translate('HideUnmatchedIssuesHelpText')}
                    onChange={onTableOptionChangeWrapper}
                />
            </FormGroup>
        </>
    );
}
