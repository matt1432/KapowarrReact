// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useResetApiKeyMutation } from 'Store/Api/Settings';

// Misc
import { icons, inputTypes, kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Hooks
import useEditSettings from 'Settings/useEditSettings';

// General Components
import ClipboardButton from 'Components/Link/ClipboardButton';
import FieldSet from 'Components/FieldSet';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputButton from 'Components/Form/FormInputButton';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Icon from 'Components/Icon';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import SettingsToolbar from 'Settings/SettingsToolbar';

// Types
import type { EnhancedSelectInputValue } from 'Components/Form/Select/EnhancedSelectInput';
import type { InputChanged } from 'typings/Inputs';

// IMPLEMENTATIONS

const logLevelOptions: EnhancedSelectInputValue<number>[] = [
    { key: 20, value: 'Info' },
    { key: 10, value: 'Debug' },
];

export default function GeneralSettings() {
    const { isSaving, hasPendingChanges, onSavePress, handleInputChange, changes } =
        useEditSettings();

    const handlePortChange = useCallback(
        ({ name, value }: InputChanged<'port', string>) => {
            handleInputChange<'port'>({ name, value: parseInt(value) });
        },
        [handleInputChange],
    );

    const [resetApiKey, { isLoading: isResettingApiKey }] = useResetApiKeyMutation();

    const handleResetApiKeyPress = useCallback(() => {
        resetApiKey();
    }, [resetApiKey]);

    return (
        <PageContent title={translate('GeneralSettings')}>
            <SettingsToolbar
                isSaving={isSaving}
                hasPendingChanges={hasPendingChanges}
                onSavePress={onSavePress}
            />

            <PageContentBody>
                <Form id="generalSettings">
                    <FieldSet legend={translate('Host')} subLegend={translate('HostInfo')}>
                        <FormGroup>
                            <FormLabel>{translate('BindAddress')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.TEXT}
                                name="host"
                                helpText={translate('BindAddressHelpText')}
                                onChange={handleInputChange}
                                value={changes.host}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('Port')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.TEXT}
                                name="port"
                                helpText={translate('PortHelpText')}
                                onChange={handlePortChange}
                                value={changes.port}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('UrlBase')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.TEXT}
                                name="urlBase"
                                helpText={translate('UrlBaseHelpText')}
                                onChange={handleInputChange}
                                value={changes.urlBase}
                            />
                        </FormGroup>
                    </FieldSet>

                    <FieldSet legend={translate('Security')}>
                        <FormGroup>
                            <FormLabel>{translate('Password')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.PASSWORD}
                                name="authPassword"
                                helpText={translate('PasswordHelpText')}
                                onChange={handleInputChange}
                                value={changes.authPassword}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('ApiKey')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.TEXT}
                                name="apiKey"
                                readOnly
                                onChange={() => {}}
                                value={changes.apiKey}
                                buttons={[
                                    <ClipboardButton
                                        key="copy"
                                        value={changes.apiKey}
                                        kind={kinds.DEFAULT_KIND}
                                    />,

                                    <FormInputButton
                                        key="reset"
                                        kind={kinds.DANGER}
                                        onPress={handleResetApiKeyPress}
                                    >
                                        <Icon name={icons.REFRESH} isSpinning={isResettingApiKey} />
                                    </FormInputButton>,
                                ]}
                            />
                        </FormGroup>
                    </FieldSet>

                    <FieldSet legend={translate('ExternalWebsites')}>
                        <FormGroup>
                            <FormLabel>{translate('ComicVineAPIKey')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.TEXT}
                                name="comicvineApiKey"
                                helpText={translate('ComicVineAPIKeyHelpText')}
                                onChange={handleInputChange}
                                value={changes.comicvineApiKey}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('FlareSolverrBaseURL')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.TEXT}
                                name="flaresolverrBaseUrl"
                                helpText={translate('FlareSolverrBaseURLHelpText')}
                                onChange={handleInputChange}
                                value={changes.flaresolverrBaseUrl}
                            />
                        </FormGroup>
                    </FieldSet>

                    <FieldSet legend={translate('Logging')}>
                        <FormGroup>
                            <FormLabel>{translate('LogLevel')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.SELECT}
                                name="logLevel"
                                helpText={translate('LogLevelHelpText')}
                                onChange={handleInputChange<'logLevel'>}
                                value={changes.logLevel}
                                values={logLevelOptions}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('DownloadLogs')}</FormLabel>
                            <div>
                                <FormInputButton
                                    style={{
                                        borderLeft: 'currentColor',
                                        borderTopLeftRadius: '4px',
                                        borderBottomLeftRadius: '4px',
                                    }}
                                    target="_blank"
                                    to={`/api/system/logs?api_key=${window.Kapowarr.apiKey}`}
                                >
                                    {translate('DownloadLogs')}
                                </FormInputButton>
                            </div>
                        </FormGroup>
                    </FieldSet>
                </Form>
            </PageContentBody>
        </PageContent>
    );
}
