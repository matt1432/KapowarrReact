// IMPORTS

// React
import { useCallback } from 'react';

// Misc
import { kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Button from 'Components/Link/Button';
import Modal from 'Components/Modal/Modal';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// CSS
import styles from './ConnectionLostModal.module.css';

// Types
interface ConnectionLostModalProps {
    isOpen: boolean;
}

// IMPLEMENTATIONS

function ConnectionLostModal(props: ConnectionLostModalProps) {
    const { isOpen } = props;

    const handleModalClose = useCallback(() => {
        location.reload();
    }, []);

    return (
        <Modal isOpen={isOpen} onModalClose={handleModalClose}>
            <ModalContent onModalClose={handleModalClose}>
                <ModalHeader>{translate('ConnectionLost')}</ModalHeader>

                <ModalBody>
                    <div>{translate('ConnectionLostToBackend')}</div>

                    <div className={styles.automatic}>{translate('ConnectionLostReconnect')}</div>
                </ModalBody>
                <ModalFooter>
                    <Button kind={kinds.PRIMARY} onPress={handleModalClose}>
                        {translate('Reload')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default ConnectionLostModal;
