// IMPORTS

// Misc
import { sizes } from 'Helpers/Props';

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import KeyboardShortcutsModalContent from './KeyboardShortcutsModalContent';

// Types
interface KeyboardShortcutsModalProps {
    isOpen: boolean;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

function KeyboardShortcutsModal(props: KeyboardShortcutsModalProps) {
    const { isOpen, onModalClose } = props;

    return (
        <Modal isOpen={isOpen} size={sizes.SMALL} onModalClose={onModalClose}>
            <KeyboardShortcutsModalContent onModalClose={onModalClose} />
        </Modal>
    );
}

export default KeyboardShortcutsModal;
