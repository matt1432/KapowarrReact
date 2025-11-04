// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';

// Redux
import {
    useGetSettingsQuery,
    useSaveSettingsMutation,
} from 'Store/Api/Settings';

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

    const {
        enableLibgen,
        autoSearchTorrents,
        includeCoverOnlyFiles,
        includeScannedBooks,
    } = useGetSettingsQuery(undefined, {
        selectFromResult: ({ data }) => ({
            enableLibgen: Boolean(data?.enableLibgen),
            autoSearchTorrents: Boolean(data?.autoSearchTorrents),
            includeCoverOnlyFiles: Boolean(data?.includeCoverOnlyFiles),
            includeScannedBooks: Boolean(data?.includeScannedBooks),
        }),
    });

    const [enable, setEnable] = useState(enableLibgen);

    useEffect(() => {
        setEnable(enableLibgen);
    }, [enableLibgen]);

    const handleEnableChange = useCallback(
        ({ value }: CheckInputChanged<'enable'>) => {
            setEnable(value);
            saveSettings({ enableLibgen: value });
        },
        [saveSettings],
    );

    const [autoTorrents, setAutoTorrents] = useState(autoSearchTorrents);

    useEffect(() => {
        setAutoTorrents(autoSearchTorrents);
    }, [autoSearchTorrents]);

    const handleAutoTorrentsChange = useCallback(
        ({ value }: CheckInputChanged<'autoTorrents'>) => {
            setAutoTorrents(value);
            saveSettings({ autoSearchTorrents: value });
        },
        [saveSettings],
    );

    const [coverOnly, setCoverOnly] = useState(includeCoverOnlyFiles);

    useEffect(() => {
        setCoverOnly(includeCoverOnlyFiles);
    }, [includeCoverOnlyFiles]);

    const handleCoverOnlyChange = useCallback(
        ({ value }: CheckInputChanged<'coverOnly'>) => {
            setCoverOnly(value);
            saveSettings({ includeCoverOnlyFiles: value });
        },
        [saveSettings],
    );

    const [scanned, setScanned] = useState(includeScannedBooks);

    useEffect(() => {
        setScanned(includeScannedBooks);
    }, [includeScannedBooks]);

    const handleScannedChange = useCallback(
        ({ value }: CheckInputChanged<'scanned'>) => {
            setScanned(value);
            saveSettings({ includeScannedBooks: value });
        },
        [saveSettings],
    );

    return (
        <BuiltInClient title="Libgen+">
            {(onModalClose) => (
                <>
                    <ModalBody>
                        <p>
                            <a
                                href="https://libgen.gs/json.php"
                                target="_blank"
                            >
                                Libgen+
                            </a>{' '}
                            is a website that offers a vast amount of downloads
                            for comics. Kapowarr can search this website to find
                            downloads for the volumes in your library.
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

                            <FormGroup>
                                <FormLabel>
                                    {translate('AutoSearchTorrents')}
                                </FormLabel>
                                <FormInputGroup
                                    type="check"
                                    name="autoTorrents"
                                    helpText={translate(
                                        'AutoSearchTorrentsHelpText',
                                    )}
                                    onChange={handleAutoTorrentsChange}
                                    value={autoTorrents}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>
                                    {translate('IncludeCoverOnlyFiles')}
                                </FormLabel>
                                <FormInputGroup
                                    type="check"
                                    name="coverOnly"
                                    helpText={translate(
                                        'IncludeCoverOnlyFilesHelpText',
                                    )}
                                    onChange={handleCoverOnlyChange}
                                    value={coverOnly}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>
                                    {translate('IncludeScannedBooks')}
                                </FormLabel>
                                <FormInputGroup
                                    type="check"
                                    name="scanned"
                                    helpText={translate(
                                        'IncludeScannedBooksHelpText',
                                    )}
                                    onChange={handleScannedChange}
                                    value={scanned}
                                />
                            </FormGroup>
                        </FieldSet>
                    </ModalBody>

                    <ModalFooter>
                        <Button onPress={onModalClose}>
                            {translate('Close')}
                        </Button>
                    </ModalFooter>
                </>
            )}
        </BuiltInClient>
    );
}
