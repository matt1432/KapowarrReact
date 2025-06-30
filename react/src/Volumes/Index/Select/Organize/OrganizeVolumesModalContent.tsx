import { orderBy } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { RENAME_VOLUMES } from 'Commands/commandNames';
import Alert from 'Components/Alert';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { icons, kinds } from 'Helpers/Props';
import { type Volumes } from 'Volumes/Volumes';
// import { executeCommand } from 'Store/Actions/commandActions';
import createAllVolumesSelector from 'Store/Selectors/createAllVolumesSelector';
import translate from 'Utilities/String/translate';
import styles from './OrganizeVolumesModalContent.module.css';

interface OrganizeVolumesModalContentProps {
    volumesIds: number[];
    onModalClose: () => void;
}

function OrganizeVolumesModalContent(props: OrganizeVolumesModalContentProps) {
    const { volumesIds, onModalClose } = props;

    const allVolumes: Volumes[] = useSelector(createAllVolumesSelector());
    const dispatch = useDispatch();

    const volumesTitles = useMemo(() => {
        const volumes = volumesIds.reduce((acc: Volumes[], id) => {
            const s = allVolumes.find((s) => s.id === id);

            if (s) {
                acc.push(s);
            }

            return acc;
        }, []);

        const sorted = orderBy(volumes, ['sortTitle']);

        return sorted.map((s) => s.title);
    }, [volumesIds, allVolumes]);

    const onOrganizePress = useCallback(() => {
        /*
        dispatch(
            executeCommand({
                name: RENAME_VOLUMES,
                volumesIds,
            }),
        );*/

        onModalClose();
    }, [volumesIds, onModalClose, dispatch]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('OrganizeSelectedVolumesModalHeader')}</ModalHeader>

            <ModalBody>
                <Alert>
                    {translate('OrganizeSelectedVolumesModalAlert')}
                    <Icon className={styles.renameIcon} name={icons.ORGANIZE} />
                </Alert>

                <div className={styles.message}>
                    {translate('OrganizeSelectedVolumesModalConfirmation', {
                        count: volumesTitles.length,
                    })}
                </div>

                <ul>
                    {volumesTitles.map((title) => {
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

export default OrganizeVolumesModalContent;
