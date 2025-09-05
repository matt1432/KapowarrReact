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
import type { EnhancedSelectInputValue } from 'Components/Form/Select/EnhancedSelectInput';

// IMPLEMENTATIONS

const shortDateFormatOptions: EnhancedSelectInputValue<string>[] = [
    { key: 'MMM D YYYY', value: 'Mar 25 2014', hint: 'MMM D YYYY' },
    { key: 'DD MMM YYYY', value: '25 Mar 2014', hint: 'DD MMM YYYY' },
    { key: 'MM/D/YYYY', value: '03/25/2014', hint: 'MM/D/YYYY' },
    { key: 'MM/DD/YYYY', value: '03/25/2014', hint: 'MM/DD/YYYY' },
    { key: 'DD/MM/YYYY', value: '25/03/2014', hint: 'DD/MM/YYYY' },
    { key: 'YYYY-MM-DD', value: '2014-03-25', hint: 'YYYY-MM-DD' },
];

const longDateFormatOptions: EnhancedSelectInputValue<string>[] = [
    { key: 'dddd, MMMM D YYYY', value: 'Tuesday, March 25, 2014', hint: 'dddd, MMMM D YYYY' },
    { key: 'dddd, D MMMM YYYY', value: 'Tuesday, 25 March, 2014', hint: 'dddd, D MMMM YYYY' },
];

const timeFormatOptions: EnhancedSelectInputValue<string>[] = [
    { key: 'h(:mm)a', value: '5pm/5:30pm', hint: 'h(:mm)a' },
    { key: 'HH:mm', value: '17:00/17:30', hint: 'HH:mm' },
];

export default function UISettings() {
    const dispatch = useRootDispatch();

    const {
        theme,
        enableColorImpairedMode,
        showRelativeDates,
        shortDateFormat,
        longDateFormat,
        timeFormat,
    } = useRootSelector((state) => state.uiSettings);

    const themeOptions = Object.keys(themes).map((theme) => ({
        key: theme,
        value: titleCase(theme),
    }));

    const handleInputChange = useCallback(
        <Key extends keyof UISettingsState>({
            name,
            value,
        }: InputChanged<Key, UISettingsState[Key]>) => {
            dispatch(setUISettingsOption(name, value));
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
                                onChange={handleInputChange<'theme'>}
                                value={theme}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('EnableColorImpairedMode')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="enableColorImpairedMode"
                                helpText={translate('EnableColorImpairedModeHelpText')}
                                onChange={handleInputChange<'enableColorImpairedMode'>}
                                value={enableColorImpairedMode}
                            />
                        </FormGroup>
                    </FieldSet>

                    <FieldSet legend={translate('Dates')}>
                        <FormGroup>
                            <FormLabel>{translate('ShortDateFormat')}</FormLabel>

                            <FormInputGroup
                                type={inputTypes.SELECT}
                                name="shortDateFormat"
                                values={shortDateFormatOptions}
                                onChange={handleInputChange<'shortDateFormat'>}
                                value={shortDateFormat}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('LongDateFormat')}</FormLabel>

                            <FormInputGroup
                                type={inputTypes.SELECT}
                                name="longDateFormat"
                                values={longDateFormatOptions}
                                onChange={handleInputChange<'longDateFormat'>}
                                value={longDateFormat}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('TimeFormat')}</FormLabel>

                            <FormInputGroup
                                type={inputTypes.SELECT}
                                name="timeFormat"
                                values={timeFormatOptions}
                                onChange={handleInputChange<'timeFormat'>}
                                value={timeFormat}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('ShowRelativeDates')}</FormLabel>

                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="showRelativeDates"
                                helpText={translate('ShowRelativeDatesHelpText')}
                                onChange={handleInputChange}
                                value={showRelativeDates}
                            />
                        </FormGroup>
                    </FieldSet>
                </Form>
            </PageContentBody>
        </PageContent>
    );
}
