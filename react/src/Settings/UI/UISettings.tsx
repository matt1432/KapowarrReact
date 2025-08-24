// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { setUISettingsOption, type UISettingsState } from 'Store/Slices/UISettings';

// Misc
import { inputTypes } from 'Helpers/Props';

import titleCase from 'Utilities/String/titleCase';
import translate from 'Utilities/String/translate';

// General Components
import FieldSet from 'Components/FieldSet';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';

// Specific Components
import SettingsToolbar from 'Settings/SettingsToolbar';

// CSS
import themes from 'Styles/Themes';

// Types
import type { InputChanged } from 'typings/Inputs';

// IMPLEMENTATIONS

function UISettings() {
    const dispatch = useRootDispatch();

    const { theme, enableColorImpairedMode } = useRootSelector((state) => state.uiSettings);

    const themeOptions = Object.keys(themes).map((theme) => ({
        key: theme,
        value: titleCase(theme),
    }));

    const handleThemeChange = useCallback(
        ({ value }: InputChanged<'theme', UISettingsState['theme']>) => {
            dispatch(setUISettingsOption('theme', value));
        },
        [dispatch],
    );

    const handleColorImpairedChange = useCallback(
        ({
            value,
        }: InputChanged<'enableColorImpairedMode', UISettingsState['enableColorImpairedMode']>) => {
            dispatch(setUISettingsOption('enableColorImpairedMode', value));
        },
        [dispatch],
    );

    return (
        <PageContent title={translate('UiSettings')}>
            <SettingsToolbar hasPendingChanges={false} isSaving={false} />

            <PageContentBody>
                <Form id="uiSettings">
                    <FieldSet legend={translate('Style')}>
                        <FormGroup>
                            <FormLabel>{translate('Theme')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.SELECT}
                                name="theme"
                                helpText={translate('ThemeHelpText')}
                                values={themeOptions}
                                onChange={handleThemeChange}
                                value={theme}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('EnableColorImpairedMode')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="enableColorImpairedMode"
                                helpText={translate('EnableColorImpairedModeHelpText')}
                                onChange={handleColorImpairedChange}
                                value={enableColorImpairedMode}
                            />
                        </FormGroup>
                    </FieldSet>
                </Form>
            </PageContentBody>
        </PageContent>
    );
}

export default UISettings;
