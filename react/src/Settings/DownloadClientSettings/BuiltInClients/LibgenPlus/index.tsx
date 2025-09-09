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

export default function LibgenPlus() {
    const [saveSettings] = useSaveSettingsMutation();

    const { enableLibgen } = useGetSettingsQuery(undefined, {
        selectFromResult: ({ data }) => ({
            enableLibgen: Boolean(data?.enableLibgen),
        }),
    });

    const [enable, setEnable] = useState(Boolean(enableLibgen));

    useEffect(() => {
        setEnable(Boolean(enableLibgen));
    }, [enableLibgen]);

    const handleEnableChange = useCallback(
        ({ value }: CheckInputChanged<'enable'>) => {
            setEnable(value);
            saveSettings({ enableLibgen: value });
        },
        [saveSettings],
    );

    return (
        <BuiltInClient title="Libgen+">
            {(onModalClose) => (
                <>
                    <ModalBody>
                        <p>
                            <a href="https://libgen.gs/json.php" target="_blank">
                                Libgen+
                            </a>{' '}
                            is a website that offers a vast amount of downloads for comics. Kapowarr
                            can search this website to find downloads for the volumes in your
                            library.
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
