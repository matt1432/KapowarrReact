// TODO:
/*import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Alert from 'Components/Alert';
import FieldSet from 'Components/FieldSet';
import Button from 'Components/Link/Button';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { kinds } from 'Helpers/Props';
// import { fetchDownloadClientSchema } from 'Store/Actions/settingsActions';
import type { DownloadClient } from 'typings/DownloadClient';
import translate from 'Utilities/String/translate';
import AddDownloadClientItem from '../AddDownloadClientItem';
import styles from './index.module.css';
*/
export interface AddDownloadClientModalContentProps {
    onDownloadClientSelect: () => void;
    onModalClose: () => void;
}

export default function AddDownloadClientModalContent({
    onDownloadClientSelect,
    onModalClose,
}: AddDownloadClientModalContentProps) {
    void onDownloadClientSelect;
    void onModalClose;

    /*
    const { isSchemaFetching, isSchemaPopulated, schemaError, schema } = useSelector(
        (state: AppState) => state.settings.downloadClients,
    );

    const { usenetDownloadClients, torrentDownloadClients } = useMemo(() => {
        return schema.reduce<{
            usenetDownloadClients: DownloadClient[];
            torrentDownloadClients: DownloadClient[];
        }>(
            (acc, item) => {
                if (item.protocol === 'usenet') {
                    acc.usenetDownloadClients.push(item);
                }
                else if (item.protocol === 'torrent') {
                    acc.torrentDownloadClients.push(item);
                }

                return acc;
            },
            {
                usenetDownloadClients: [],
                torrentDownloadClients: [],
            },
        );
    }, [schema]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('AddDownloadClient')}</ModalHeader>

            <ModalBody>
                {isSchemaFetching ? <LoadingIndicator /> : null}

                {!isSchemaFetching && !!schemaError ? (
                    <Alert kind={kinds.DANGER}>{translate('AddDownloadClientError')}</Alert>
                ) : null}

                {isSchemaPopulated && !schemaError ? (
                    <div>
                        <Alert kind={kinds.INFO}>
                            <div>{translate('SupportedDownloadClients')}</div>
                            <div>{translate('SupportedDownloadClientsMoreInfo')}</div>
                        </Alert>

                        <FieldSet legend={translate('Usenet')}>
                            <div className={styles.downloadClients}>
                                {usenetDownloadClients.map((downloadClient) => {
                                    return (
                                        <AddDownloadClientItem
                                            key={downloadClient.implementation}
                                            {...downloadClient}
                                            implementation={downloadClient.implementation}
                                            onDownloadClientSelect={onDownloadClientSelect}
                                        />
                                    );
                                })}
                            </div>
                        </FieldSet>

                        <FieldSet legend={translate('Torrents')}>
                            <div className={styles.downloadClients}>
                                {torrentDownloadClients.map((downloadClient) => {
                                    return (
                                        <AddDownloadClientItem
                                            key={downloadClient.implementation}
                                            {...downloadClient}
                                            implementation={downloadClient.implementation}
                                            onDownloadClientSelect={onDownloadClientSelect}
                                        />
                                    );
                                })}
                            </div>
                        </FieldSet>
                    </div>
                ) : null}
            </ModalBody>
            <ModalFooter>
                <Button onPress={onModalClose}>{translate('Close')}</Button>
            </ModalFooter>
        </ModalContent>
    );
    */
    return null;
}
