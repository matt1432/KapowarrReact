// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import SelectStringValueModalContent from './SelectStringValueModalContent';

// Types
import type { SelectStringValueModalContentProps } from './SelectStringValueModalContent';

interface SelectStringValueModalProps extends SelectStringValueModalContentProps {
    isOpen: boolean;
    onModalClose(): void;
}

export default function SelectStringValueModal({
    isOpen,
    onModalClose,
    ...rest
}: SelectStringValueModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <SelectStringValueModalContent
                {...rest}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}
