import { orderBy } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useDispatch /*, useSelector */ } from 'react-redux';
// import { RENAME_VOLUMES } from 'Commands/commandNames';
import Alert from 'Components/Alert';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { icons, kinds } from 'Helpers/Props';
import { type Volume } from 'Volume/Volume';
// import { executeCommand } from 'Store/Actions/commandActions';
// import createAllVolumeSelector from 'Store/Selectors/createAllVolumeSelector';
import translate from 'Utilities/String/translate';
import styles from './OrganizeVolumeModalContent.module.css';

interface OrganizeVolumeModalContentProps {
    volumeIds: number[];
    onModalClose: () => void;
}

function OrganizeVolumeModalContent(props: OrganizeVolumeModalContentProps) {
    const { volumeIds, onModalClose } = props;

    const allVolume: Volume[] = []; // useSelector(createAllVolumeSelector());
    const dispatch = useDispatch();

    const volumeTitles = useMemo(() => {
        const volumes = volumeIds.reduce((acc: Volume[], id) => {
            const s = allVolume.find((s) => s.id === id);

            if (s) {
                acc.push(s);
            }

            return acc;
        }, []);

        const sorted = orderBy(volumes, ['sortTitle']);

        return sorted.map((s) => s.title);
    }, [volumeIds, allVolume]);

    const onOrganizePress = useCallback(() => {
        /*
        dispatch(
            executeCommand({
                name: RENAME_VOLUMES,
                volumeIds,
            }),
        );*/

        onModalClose();
    }, [volumeIds, onModalClose, dispatch]);

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
