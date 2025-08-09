// IMPORTS

// Misc
import { sizes } from 'Helpers/Props';

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import KeyboardShortcutsModalContent from '../KeyboardShortcutsModalContent';

// Types
interface KeyboardShortcutsModalProps {
    isOpen: boolean;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

function KeyboardShortcutsModal({ isOpen, onModalClose }: KeyboardShortcutsModalProps) {
    return (
        <Modal isOpen={isOpen} size={sizes.SMALL} onModalClose={onModalClose}>
            <KeyboardShortcutsModalContent onModalClose={onModalClose} />
        </Modal>
    );
}

export default KeyboardShortcutsModal;
