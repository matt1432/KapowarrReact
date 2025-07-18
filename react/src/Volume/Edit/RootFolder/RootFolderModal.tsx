// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import RootFolderModalContent, { type RootFolderModalContentProps } from './RootFolderModalContent';

// Types
interface RootFolderModalProps extends RootFolderModalContentProps {
    isOpen: boolean;
}

// IMPLEMENTATIONS

function RootFolderModal(props: RootFolderModalProps) {
    const { isOpen, rootFolderPath, volumeId, onSavePress, onModalClose } = props;

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <RootFolderModalContent
                volumeId={volumeId}
                rootFolderPath={rootFolderPath}
                onSavePress={onSavePress}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}

export default RootFolderModal;
