// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Types
import AddNewVolumeModalContent, {
    type AddNewVolumeModalContentProps,
} from './AddNewVolumeModalContent';

interface AddNewVolumeModalProps extends AddNewVolumeModalContentProps {
    isOpen: boolean;
}

// IMPLEMENTATIONS

export default function AddNewVolumeModal({
    isOpen,
    onModalClose,
    ...otherProps
}: AddNewVolumeModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <AddNewVolumeModalContent
                {...otherProps}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}
