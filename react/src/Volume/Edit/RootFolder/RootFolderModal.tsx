import Modal from 'Components/Modal/Modal';
import RootFolderModalContent, { type RootFolderModalContentProps } from './RootFolderModalContent';

interface RootFolderModalProps extends RootFolderModalContentProps {
    isOpen: boolean;
}

function RootFolderModal(props: RootFolderModalProps) {
    const { isOpen, rootFolderPath, volumeId, onSavePress, onModalClose } = props;

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <RootFolderModalContent
                volumeId={volumeId}
                rootFolderPath={rootFolderPath}
                onSavePress={onSavePress}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}

export default RootFolderModal;
