// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';

// Redux
import { useGetSettingsQuery, useSaveSettingsMutation } from 'Store/Api/Settings';

// Misc
import translate from 'Utilities/String/translate';

// General Components
import Button from 'Components/Link/Button';
import FieldSet from 'Components/FieldSet';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import ModalBody from 'Components/Modal/ModalBody';
import ModalFooter from 'Components/Modal/ModalFooter';

// Specific Components
import BuiltInClient from '../BuiltInClient';

// Types
import type { CheckInputChanged } from 'typings/Inputs';

// IMPLEMENTATIONS

export default function GetComics() {
    const [saveSettings] = useSaveSettingsMutation();

    const { enableGetcomics } = useGetSettingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        selectFromResult: ({ data }) => ({
            enableGetcomics: Boolean(data?.enableGetcomics),
        }),
    });

    const [enable, setEnable] = useState(Boolean(enableGetcomics));

    useEffect(() => {
        setEnable(Boolean(enableGetcomics));
    }, [enableGetcomics]);

    const handleEnableChange = useCallback(
        ({ value }: CheckInputChanged<'enable'>) => {
            setEnable(value);
            saveSettings({ enableGetcomics: value });
        },
        [saveSettings],
    );

    return (
        <BuiltInClient title="GetComics">
            {(onModalClose) => (
                <>
                    <ModalBody>
                        <p>
                            <a href="https://getcomics.org" target="_blank">
                                GetComics
                            </a>{' '}
                            is a website that offers a vast amount of downloads for comics. Kapowarr
                            can search this website to find downloads for the volumes in your
                            library. The comics can be downloaded via multiple services. Kapowarr
                            has built-in support for almost all these services.
                            <br />
                            <br />
                            When downloading directly from the servers of GetComics (instead of
                            using an external service), the download speed will be significantly
                            reduced 400MB into the download. This behaviour is set up by the owner
                            of the website, is intentional, and is not planned to be removed.
                            <br />
                            <br />
                            Also, most often on Wednesday and Thursday, the site is very busy so the
                            downloads speed goes down a lot. Preferring external services in the
                            service preference list is advised in order to avoid this.
                        </p>

                        <FieldSet legend={translate('Settings')}>
                            <FormGroup>
                                <FormLabel>{translate('Enable')}</FormLabel>
                                <FormInputGroup
                                    type="check"
                                    name="enable"
                                    onChange={handleEnableChange}
                                    value={enable}
                                />
                            </FormGroup>
                        </FieldSet>
                    </ModalBody>

                    <ModalFooter>
                        <Button onPress={onModalClose}>{translate('Close')}</Button>
                    </ModalFooter>
                </>
            )}
        </BuiltInClient>
    );
}
