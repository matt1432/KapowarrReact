// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import FileBrowserModalContent, {
    type FileBrowserModalContentProps,
} from '../FileBrowserModalContent';

// CSS
import styles from './index.module.css';

// Types
interface FileBrowserModalProps<K extends string> extends FileBrowserModalContentProps<K> {
    isOpen: boolean;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

export default function FileBrowserModal<K extends string>({
    isOpen,
    onModalClose,
    ...otherProps
}: FileBrowserModalProps<K>) {
    return (
        <Modal className={styles.modal} isOpen={isOpen} onModalClose={onModalClose}>
            <FileBrowserModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}
