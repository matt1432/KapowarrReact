// IMPORTS

// Redux
import { useGetIndexerOptionsQuery } from 'Store/Api/Indexers';

// Misc
import { kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import Button from 'Components/Link/Button';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// Specific Components
import AddIndexerItem from '../AddIndexerItem';

// CSS
import styles from './index.module.css';

// Types
import type { DownloadType } from 'Helpers/Props/downloadTypes';
import type { IndexerClientType } from 'typings/Indexer';

export interface AddIndexerModalContentProps {
    downloadType: DownloadType;
    onIndexerSelect: (clientType: IndexerClientType) => void;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

export default function AddIndexerModalContent({
    downloadType,
    onIndexerSelect,
    onModalClose,
}: AddIndexerModalContentProps) {
    const { clientTypes, isFetching, isPopulated, error } =
        useGetIndexerOptionsQuery(undefined, {
            selectFromResult: ({
                data,
                isFetching,
                isUninitialized,
                error,
            }) => ({
                clientTypes: Object.keys(
                    data?.[downloadType] ?? {},
                ) as IndexerClientType[],
                isFetching,
                isPopulated: !isUninitialized,
                error,
            }),
        });

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('AddIndexer')}</ModalHeader>

            <ModalBody>
                {isFetching ? <LoadingIndicator /> : null}

                {!isFetching && !!error ? (
                    <Alert kind={kinds.DANGER}>
                        {translate('AddIndexerError')}
                    </Alert>
                ) : null}

                {isPopulated && !error ? (
                    <div className={styles.indexers}>
                        {clientTypes.map((clientType) => {
                            return (
                                <AddIndexerItem
                                    key={clientType}
                                    clientType={clientType}
                                    onIndexerSelect={onIndexerSelect}
                                />
                            );
                        })}
                    </div>
                ) : null}
            </ModalBody>

            <ModalFooter>
                <Button onPress={onModalClose}>{translate('Close')}</Button>
            </ModalFooter>
        </ModalContent>
    );
}
