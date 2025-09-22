// IMPORTS

// Misc
import { scrollDirections } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Button from 'Components/Link/Button';
import Modal from 'Components/Modal/Modal';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// Specific Components
import InteractiveSearch from 'InteractiveSearch';

// Types
export interface SearchVolumeModalProps {
    isOpen: boolean;
    volumeId: number;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

export default function SearchVolumeModal({
    isOpen,
    volumeId,
    onModalClose,
}: SearchVolumeModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <ModalContent onModalClose={onModalClose}>
                <ModalHeader>{translate('InteractiveSearchModalHeader')}</ModalHeader>

                <ModalBody scrollDirection={scrollDirections.BOTH}>
                    <InteractiveSearch searchPayload={{ volumeId }} />
                </ModalBody>

                <ModalFooter>
                    <Button onPress={onModalClose}>{translate('Close')}</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
