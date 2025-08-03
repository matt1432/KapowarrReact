// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import FileBrowserModalContent, {
    type FileBrowserModalContentProps,
} from './FileBrowserModalContent';

// CSS
import styles from './FileBrowserModal.module.css';

// Types
interface FileBrowserModalProps extends FileBrowserModalContentProps {
    isOpen: boolean;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

function FileBrowserModal({ isOpen, onModalClose, ...otherProps }: FileBrowserModalProps) {
    return (
        <Modal className={styles.modal} isOpen={isOpen} onModalClose={onModalClose}>
            <FileBrowserModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}

export default FileBrowserModal;
