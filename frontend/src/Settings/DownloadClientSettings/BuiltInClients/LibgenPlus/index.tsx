// IMPORTS

// React
import { useCallback, useState } from 'react';

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

    const { refetch: _, ...query } = useGetSettingsQuery(undefined, {
        selectFromResult: ({ data }) => ({
            enableLibgen: Boolean(data?.enableLibgen),
            autoSearchTorrents: Boolean(data?.autoSearchTorrents),
            includeCoverOnlyFiles: Boolean(data?.includeCoverOnlyFiles),
            includeScannedBooks: Boolean(data?.includeScannedBooks),
        }),
    });

    const [draft, setDraft] = useState<Partial<typeof query>>({});

    const handleChange = useCallback(
        async <K extends keyof typeof query>({
            name,
            value,
        }: CheckInputChanged<K>) => {
            setDraft((prev) => ({ ...prev, [name]: value }));
            await saveSettings({ [name]: value });
        },
        [saveSettings],
    );

    const {
        enableLibgen,
        autoSearchTorrents,
        includeCoverOnlyFiles,
        includeScannedBooks,
    } = {
        ...query,
        ...draft,
    };

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
                                    name="enableLibgen"
                                    onChange={handleChange}
                                    value={enableLibgen}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>
                                    {translate('AutoSearchTorrents')}
                                </FormLabel>
                                <FormInputGroup
                                    type="check"
                                    name="autoSearchTorrents"
                                    helpText={translate(
                                        'AutoSearchTorrentsHelpText',
                                    )}
                                    onChange={handleChange}
                                    value={autoSearchTorrents}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>
                                    {translate('IncludeCoverOnlyFiles')}
                                </FormLabel>
                                <FormInputGroup
                                    type="check"
                                    name="includeCoverOnlyFiles"
                                    helpText={translate(
                                        'IncludeCoverOnlyFilesHelpText',
                                    )}
                                    onChange={handleChange}
                                    value={includeCoverOnlyFiles}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>
                                    {translate('IncludeScannedBooks')}
                                </FormLabel>
                                <FormInputGroup
                                    type="check"
                                    name="includeCoverOnlyFiles"
                                    helpText={translate(
                                        'IncludeScannedBooksHelpText',
                                    )}
                                    onChange={handleChange}
                                    value={includeScannedBooks}
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
