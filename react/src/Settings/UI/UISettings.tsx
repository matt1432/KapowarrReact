// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { setUISettingsOption, type UISettingsState } from 'Store/Slices/UISettings';

// Misc
import { inputTypes, kinds } from 'Helpers/Props';

import titleCase from 'Utilities/String/titleCase';
import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import FieldSet from 'Components/FieldSet';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';

// Specific Components
import SettingsToolbar from 'Settings/SettingsToolbar';

// CSS
import themes from 'Styles/Themes';

// Types
import type { InputChanged } from 'typings/inputs';

// IMPLEMENTATIONS

function UISettings() {
    const dispatch = useRootDispatch();

    const { theme, enableColorImpairedMode } = useRootSelector((state) => state.uiSettings);

    const themeOptions = Object.keys(themes).map((theme) => ({
        key: theme,
        value: titleCase(theme),
    }));

    const handleThemeChange = useCallback(
        ({ value }: InputChanged<UISettingsState['theme']>) => {
            dispatch(setUISettingsOption('theme', value));
        },
        [dispatch],
    );

    const handleColorImpairedChange = useCallback(
        ({ value }: InputChanged<UISettingsState['enableColorImpairedMode']>) => {
            dispatch(setUISettingsOption('enableColorImpairedMode', value));
        },
        [dispatch],
    );

    // TODO: implement this when we start fetching settings
    /*
    const handleSavePress = useCallback(() => {
        dispatch(saveUISettings());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchUISettings());

        return () => {
            dispatch(setUISettingsValue({ section: `settings.${SECTION}` }));
        };
    }, [dispatch]);
    */

    const hasPendingChanges = false;
    const isSaving = false;
    const isFetching = false;
    const isPopulated = true;
    const error = undefined;
    const hasSettings = true;

    return (
        <PageContent title={translate('UiSettings')}>
            <SettingsToolbar
                hasPendingChanges={hasPendingChanges}
                isSaving={isSaving}
                // onSavePress={handleSavePress}
            />

            <PageContentBody>
                {isFetching && isPopulated ? <LoadingIndicator /> : null}

                {!isFetching && error ? (
                    <Alert kind={kinds.DANGER}>{translate('UiSettingsLoadError')}</Alert>
                ) : null}

                {hasSettings && isPopulated && !error ? (
                    <Form
                        id="uiSettings"
                        // validationErrors={validationErrors}
                        // validationWarnings={validationWarnings}
                    >
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
                ) : null}
            </PageContentBody>
        </PageContent>
    );
}

export default UISettings;
