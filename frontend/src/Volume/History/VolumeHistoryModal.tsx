// IMPORTS

// Misc
import { sizes } from 'Helpers/Props';

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import VolumeHistoryModalContent from './VolumeHistoryModalContent';

// Types
import type { VolumeHistoryModalContentProps } from './VolumeHistoryModalContent';

interface VolumeHistoryModalProps extends VolumeHistoryModalContentProps {
    isOpen: boolean;
}

// IMPLEMENTATIONS

export default function VolumeHistoryModal({
    isOpen,
    onModalClose,
    ...otherProps
}: VolumeHistoryModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            size={sizes.EXTRA_EXTRA_LARGE}
            onModalClose={onModalClose}
        >
            <VolumeHistoryModalContent
                {...otherProps}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}
