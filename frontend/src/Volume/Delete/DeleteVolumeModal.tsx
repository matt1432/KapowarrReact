// IMPORTS

// Misc
import { sizes } from 'Helpers/Props';

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import DeleteVolumeModalContent, {
    type DeleteVolumeModalContentProps,
} from './DeleteVolumeModalContent';

// Types
interface DeleteVolumeModalProps extends DeleteVolumeModalContentProps {
    isOpen: boolean;
}

// IMPLEMENTATIONS

export default function DeleteVolumeModal({
    isOpen,
    onModalClose,
    ...otherProps
}: DeleteVolumeModalProps) {
    return (
        <Modal isOpen={isOpen} size={sizes.MEDIUM} onModalClose={onModalClose}>
            <DeleteVolumeModalContent
                {...otherProps}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}
