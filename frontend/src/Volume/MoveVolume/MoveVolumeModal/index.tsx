// IMPORTS

// Misc
import { kinds, sizes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Button from 'Components/Link/Button';
import Modal from 'Components/Modal/Modal';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// CSS
import styles from './index.module.css';

// Types
interface MoveVolumeModalProps {
    originalPath?: string;
    destinationPath?: string;
    destinationRootFolder?: string;
    isOpen: boolean;
    onModalClose: () => void;
    onSavePress: () => void;
    onMoveVolumePress: () => void;
}

// IMPLEMENTATIONS

export default function MoveVolumeModal({
    originalPath,
    destinationPath,
    destinationRootFolder,
    isOpen,
    onModalClose,
    onSavePress,
    onMoveVolumePress,
}: MoveVolumeModalProps) {
    if (isOpen && !originalPath && !destinationPath && !destinationRootFolder) {
        console.error('originalPath and destinationPath OR destinationRootFolder must be provided');
    }

    return (
        <Modal
            isOpen={isOpen}
            size={sizes.MEDIUM}
            closeOnBackgroundClick={false}
            onModalClose={onModalClose}
        >
            <ModalContent showCloseButton={true} onModalClose={onModalClose}>
                <ModalHeader>{translate('MoveFiles')}</ModalHeader>

                <ModalBody>
                    {destinationRootFolder
                        ? translate('MoveVolumeFoldersToRootFolder', {
                              destinationRootFolder,
                          })
                        : null}

                    {originalPath && destinationPath
                        ? translate('MoveVolumeFoldersToNewPath', {
                              originalPath,
                              destinationPath,
                          })
                        : null}
                </ModalBody>

                <ModalFooter>
                    <Button className={styles.doNotMoveButton} onPress={onSavePress}>
                        {translate('MoveVolumeFoldersDontMoveFiles')}
                    </Button>

                    <Button kind={kinds.DANGER} onPress={onMoveVolumePress}>
                        {translate('MoveVolumeFoldersMoveFiles')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
