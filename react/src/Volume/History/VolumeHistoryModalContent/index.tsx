// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// General Components
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// Specific Components
import VolumeHistory from 'History';

// Types
export interface VolumeHistoryModalContentProps {
    volumeId: number;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

export default function VolumeHistoryModalContent({
    volumeId,
    onModalClose,
}: VolumeHistoryModalContentProps) {
    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('History')}</ModalHeader>

            <ModalBody>
                <VolumeHistory volumeId={volumeId} />
            </ModalBody>

            <ModalFooter>
                <Button onPress={onModalClose}>{translate('Close')}</Button>
            </ModalFooter>
        </ModalContent>
    );
}
