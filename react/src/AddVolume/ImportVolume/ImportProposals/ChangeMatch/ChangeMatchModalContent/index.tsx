// IMPORTS

// React

// Redux

// Misc
import translate from 'Utilities/String/translate';

// Hooks

// General Components
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// CSS

// Types
import type { ProposedImport } from 'typings/Search';
import type { VolumeMetadata } from 'AddVolume/AddVolume';

export interface ChangeMatchModalContentProps {
    proposal: ProposedImport & { id: number };
    onEditMatch: (match: VolumeMetadata) => void;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

export default function ChangeMatchModalContent({
    proposal,
    // onEditMatch, TODO:
    onModalClose,
}: ChangeMatchModalContentProps) {
    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>
                {translate('ChangeMatchModalHeader', { title: proposal.fileTitle })}
            </ModalHeader>

            <ModalBody>TODO:</ModalBody>

            <ModalFooter>
                <Button onPress={onModalClose}>{translate('Cancel')}</Button>
            </ModalFooter>
        </ModalContent>
    );
}
