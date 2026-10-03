// IMPORTS

// Misc
import { sizes } from 'Helpers/Props';

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import EditIndexerModalContent from './EditIndexerModalContent';

// Types
import type { EditIndexerModalContentProps } from './EditIndexerModalContent';

interface EditIndexerModalProps extends EditIndexerModalContentProps {
    isOpen: boolean;
}

// IMPLEMENTATIONS

export default function EditIndexerModal({
    isOpen,
    onModalClose,
    ...otherProps
}: EditIndexerModalProps) {
    return (
        <Modal size={sizes.MEDIUM} isOpen={isOpen} onModalClose={onModalClose}>
            <EditIndexerModalContent
                {...otherProps}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}
