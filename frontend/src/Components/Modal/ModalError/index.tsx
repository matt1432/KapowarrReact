// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// General Components
import ErrorBoundaryError, {
    type ErrorBoundaryErrorProps,
} from 'Components/Error/ErrorBoundaryError';
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// CSS
import styles from './index.module.css';

// Types
interface ModalErrorProps extends ErrorBoundaryErrorProps {
    onModalClose: () => void;
}

// IMPLEMENTATIONS

export default function ModalError({ onModalClose, ...otherProps }: ModalErrorProps) {
    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('Error')}</ModalHeader>

            <ModalBody>
                <ErrorBoundaryError
                    {...otherProps}
                    messageClassName={styles.message}
                    detailsClassName={styles.details}
                    message={translate('ErrorLoadingItem')}
                />
            </ModalBody>

            <ModalFooter>
                <Button onPress={onModalClose}>{translate('Close')}</Button>
            </ModalFooter>
        </ModalContent>
    );
}
