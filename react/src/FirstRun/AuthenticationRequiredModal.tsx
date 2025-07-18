// IMPORTS

// Misc
import { sizes } from 'Helpers/Props';

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import AuthenticationRequiredModalContent from './AuthenticationRequiredModalContent';

// Types
interface AuthenticationRequiredModalProps {
    isOpen: boolean;
}

// IMPLEMENTATIONS

function onModalClose() {
    // No-op
}

export default function AuthenticationRequiredModal({ isOpen }: AuthenticationRequiredModalProps) {
    return (
        <Modal
            size={sizes.MEDIUM}
            isOpen={isOpen}
            closeOnBackgroundClick={false}
            onModalClose={onModalClose}
        >
            <AuthenticationRequiredModalContent />
        </Modal>
    );
}
