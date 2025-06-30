import Button from 'Components/Link/Button';
import Modal from 'Components/Modal/Modal';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { kinds, sizes } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import styles from './MoveVolumesModal.module.css';

interface MoveVolumesModalProps {
    originalPath?: string;
    destinationPath?: string;
    destinationRootFolder?: string;
    isOpen: boolean;
    onModalClose: () => void;
    onSavePress: () => void;
    onMoveVolumesPress: () => void;
}

function MoveVolumesModal({
    originalPath,
    destinationPath,
    destinationRootFolder,
    isOpen,
    onModalClose,
    onSavePress,
    onMoveVolumesPress,
}: MoveVolumesModalProps) {
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
                        ? translate('MoveVolumesFoldersToRootFolder', {
                              destinationRootFolder,
                          })
                        : null}

                    {originalPath && destinationPath
                        ? translate('MoveVolumesFoldersToNewPath', {
                              originalPath,
                              destinationPath,
                          })
                        : null}
                </ModalBody>

                <ModalFooter>
                    <Button className={styles.doNotMoveButton} onPress={onSavePress}>
                        {translate('MoveVolumesFoldersDontMoveFiles')}
                    </Button>

                    <Button kind={kinds.DANGER} onPress={onMoveVolumesPress}>
                        {translate('MoveVolumesFoldersMoveFiles')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default MoveVolumesModal;
