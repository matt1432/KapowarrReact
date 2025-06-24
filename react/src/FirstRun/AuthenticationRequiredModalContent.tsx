// TODO: https://github.com/Sonarr/Sonarr/blob/v5-develop/frontend/src/FirstRun/AuthenticationRequiredModalContent.tsx
import Alert from 'Components/Alert';
import SpinnerButton from 'Components/Link/SpinnerButton';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { kinds } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import styles from './AuthenticationRequiredModalContent.module.css';

function onModalClose() {
    // No-op
}

export default function AuthenticationRequiredModalContent() {
    return (
        <ModalContent showCloseButton={false} onModalClose={onModalClose}>
            <ModalHeader>{translate('AuthenticationRequired')}</ModalHeader>

            <ModalBody>
                <Alert className={styles.authRequiredAlert} kind={kinds.WARNING}>
                    {translate('AuthenticationRequiredWarning')}
                </Alert>
            </ModalBody>

            <ModalFooter>
                <SpinnerButton kind={kinds.PRIMARY} isSpinning isDisabled>
                    {translate('Save')}
                </SpinnerButton>
            </ModalFooter>
        </ModalContent>
    );
}
