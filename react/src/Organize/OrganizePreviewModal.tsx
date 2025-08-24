// TODO:
// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useDispatch } from 'react-redux';

// import { clearOrganizePreview } from 'Store/Actions/organizePreviewActions';

// Misc

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import OrganizePreviewModalContent from './OrganizePreviewModalContent';

// CSS

// Types
import type { OrganizePreviewModalContentProps } from './OrganizePreviewModalContent';

interface OrganizePreviewModalProps extends OrganizePreviewModalContentProps {
    isOpen: boolean;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

export default function OrganizePreviewModal({
    isOpen,
    onModalClose,
    ...otherProps
}: OrganizePreviewModalProps) {
    const dispatch = useDispatch();

    const handleOnModalClose = useCallback(() => {
        // dispatch(clearOrganizePreview());
        onModalClose();
    }, [dispatch, onModalClose]);

    return (
        <Modal isOpen={isOpen} onModalClose={handleOnModalClose}>
            {isOpen ? (
                <OrganizePreviewModalContent {...otherProps} onModalClose={handleOnModalClose} />
            ) : null}
        </Modal>
    );
}
