// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import SimilarPagesModalContent, {
    type SimilarPagesModalContentProps,
} from './ModalContent';

// Types
export type { SimilarPageItem } from './ModalContent';

interface SimilarPagesModalProps extends SimilarPagesModalContentProps {
    isOpen: boolean;
}

// IMPLEMENTATIONS

export default function SimilarPagesModal({
    isOpen,
    onModalClose,
    ...otherProps
}: SimilarPagesModalProps) {
    return (
        <Modal isOpen={isOpen} size="extraLarge" onModalClose={onModalClose}>
            <SimilarPagesModalContent
                {...otherProps}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}
