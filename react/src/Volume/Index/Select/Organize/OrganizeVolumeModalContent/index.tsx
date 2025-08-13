// IMPORTS

// React
import { useCallback, useMemo } from 'react';

// Redux
import { useGetVolumesQuery, useMassEditMutation } from 'Store/createApiEndpoints';

// Misc
import { orderBy } from 'lodash';
import { icons, kinds, massEditActions } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// CSS
import styles from './index.module.css';

// Types
import type { VolumePublicInfo } from 'Volume/Volume';

interface OrganizeVolumeModalContentProps {
    volumeIds: number[];
    onModalClose: () => void;
}

// IMPLEMENTATIONS

function OrganizeVolumeModalContent({ volumeIds, onModalClose }: OrganizeVolumeModalContentProps) {
    const { data: allVolumes = [] } = useGetVolumesQuery(undefined);
    const [runMassEditAction] = useMassEditMutation();

    const volumeTitles = useMemo(() => {
        const volumes = volumeIds.reduce((acc: VolumePublicInfo[], id) => {
            const s = allVolumes.find((s) => s.id === id);

            if (s) {
                acc.push(s);
            }

            return acc;
        }, []);

        const sorted = orderBy(volumes, ['title']);

        return sorted.map((s) => s.title);
    }, [volumeIds, allVolumes]);

    const onOrganizePress = useCallback(() => {
        runMassEditAction({
            action: massEditActions.RENAME,
            volumeIds,
        });

        onModalClose();
    }, [volumeIds, onModalClose, runMassEditAction]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('OrganizeSelectedVolumeModalHeader')}</ModalHeader>

            <ModalBody>
                <Alert>
                    {translate('OrganizeSelectedVolumeModalAlert')}
                    <Icon className={styles.renameIcon} name={icons.ORGANIZE} />
                </Alert>

                <div className={styles.message}>
                    {translate('OrganizeSelectedVolumeModalConfirmation', {
                        count: volumeTitles.length,
                    })}
                </div>

                <ul>
                    {volumeTitles.map((title) => {
                        return <li key={title}>{title}</li>;
                    })}
                </ul>
            </ModalBody>

            <ModalFooter>
                <Button onPress={onModalClose}>{translate('Cancel')}</Button>

                <Button kind={kinds.DANGER} onPress={onOrganizePress}>
                    {translate('Organize')}
                </Button>
            </ModalFooter>
        </ModalContent>
    );
}

export default OrganizeVolumeModalContent;
