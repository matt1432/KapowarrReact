// TODO:
// IMPORTS

// React
import { useCallback } from 'react';

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import AppUpdatedModalContent from './AppUpdatedModalContent';

// Types
interface AppUpdatedModalProps {
    isOpen: boolean;
    onModalClose: (...args: unknown[]) => unknown;
}

// IMPLEMENTATIONS

function AppUpdatedModal(props: AppUpdatedModalProps) {
    const { isOpen, onModalClose } = props;

    const handleModalClose = useCallback(() => {
        location.reload();
    }, []);

    return (
        <Modal isOpen={isOpen} closeOnBackgroundClick={false} onModalClose={onModalClose}>
            <AppUpdatedModalContent onModalClose={handleModalClose} />
        </Modal>
    );
}

export default AppUpdatedModal;
