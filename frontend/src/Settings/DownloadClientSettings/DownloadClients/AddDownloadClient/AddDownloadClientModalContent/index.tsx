// IMPORTS

// Redux
import { useGetDownloadClientOptionsQuery } from 'Store/Api/DownloadClients';

// Misc
import { kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import Button from 'Components/Link/Button';
import FieldSet from 'Components/FieldSet';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// Specific Components
import AddDownloadClientItem from '../AddDownloadClientItem';

// CSS
import styles from './index.module.css';

// Types
import type { ClientType } from 'typings/DownloadClient';

export interface AddDownloadClientModalContentProps {
    onDownloadClientSelect: (clientType: ClientType) => void;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

export default function AddDownloadClientModalContent({
    onDownloadClientSelect,
    onModalClose,
}: AddDownloadClientModalContentProps) {
    const { clientTypes, isFetching, isPopulated, error } =
        useGetDownloadClientOptionsQuery(undefined, {
            selectFromResult: ({
                data,
                isFetching,
                isUninitialized,
                error,
            }) => ({
                clientTypes: (data ? Object.keys(data) : []) as ClientType[],
                isFetching,
                isPopulated: !isUninitialized,
                error,
            }),
        });

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('AddDownloadClient')}</ModalHeader>

            <ModalBody>
                {isFetching ? <LoadingIndicator /> : null}

                {!isFetching && !!error ? (
                    <Alert kind={kinds.DANGER}>
                        {translate('AddDownloadClientError')}
                    </Alert>
                ) : null}

                {isPopulated && !error ? (
                    <div>
                        <FieldSet legend={translate('Torrents')}>
                            <div className={styles.downloadClients}>
                                {clientTypes.map((downloadClient) => {
                                    return (
                                        <AddDownloadClientItem
                                            key={downloadClient}
                                            clientType={downloadClient}
                                            onDownloadClientSelect={
                                                onDownloadClientSelect
                                            }
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
}
