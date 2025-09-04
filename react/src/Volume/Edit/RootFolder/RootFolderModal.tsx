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

export default function RootFolderModal({
    isOpen,
    rootFolderPath,
    volumeId,
    onSavePress,
    onModalClose,
}: RootFolderModalProps) {
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
