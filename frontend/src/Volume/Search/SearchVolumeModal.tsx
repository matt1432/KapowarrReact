// IMPORTS

// Redux
import { useSearchVolumeQuery } from 'Store/Api/Volumes';

// Misc
import { scrollDirections, sizes } from 'Helpers/Props';

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
    const { issues } = useSearchVolumeQuery(
        { volumeId },
        {
            selectFromResult: ({ data }) => ({
                issues: data?.issues ?? [],
            }),
        },
    );

    return (
        <Modal
            isOpen={isOpen}
            onModalClose={onModalClose}
            size={sizes.EXTRA_EXTRA_LARGE}
        >
            <ModalContent onModalClose={onModalClose}>
                <ModalHeader>
                    {translate('InteractiveSearchModalHeader')}
                </ModalHeader>

                <ModalBody scrollDirection={scrollDirections.BOTH}>
                    <InteractiveSearch searchPayload={{ volumeId, issues }} />
                </ModalBody>

                <ModalFooter>
                    <Button onPress={onModalClose}>{translate('Close')}</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
