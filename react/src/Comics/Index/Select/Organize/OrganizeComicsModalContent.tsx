import { orderBy } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { RENAME_COMICS } from 'Commands/commandNames';
import Alert from 'Components/Alert';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { icons, kinds } from 'Helpers/Props';
import { type Comics } from 'Comics/Comics';
// import { executeCommand } from 'Store/Actions/commandActions';
import createAllComicsSelector from 'Store/Selectors/createAllComicsSelector';
import translate from 'Utilities/String/translate';
import styles from './OrganizeComicsModalContent.module.css';

interface OrganizeComicsModalContentProps {
    comicsIds: number[];
    onModalClose: () => void;
}

function OrganizeComicsModalContent(props: OrganizeComicsModalContentProps) {
    const { comicsIds, onModalClose } = props;

    const allComics: Comics[] = useSelector(createAllComicsSelector());
    const dispatch = useDispatch();

    const comicsTitles = useMemo(() => {
        const comics = comicsIds.reduce((acc: Comics[], id) => {
            const s = allComics.find((s) => s.id === id);

            if (s) {
                acc.push(s);
            }

            return acc;
        }, []);

        const sorted = orderBy(comics, ['sortTitle']);

        return sorted.map((s) => s.title);
    }, [comicsIds, allComics]);

    const onOrganizePress = useCallback(() => {
        /*
        dispatch(
            executeCommand({
                name: RENAME_COMICS,
                comicsIds,
            }),
        );*/

        onModalClose();
    }, [comicsIds, onModalClose, dispatch]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('OrganizeSelectedComicsModalHeader')}</ModalHeader>

            <ModalBody>
                <Alert>
                    {translate('OrganizeSelectedComicsModalAlert')}
                    <Icon className={styles.renameIcon} name={icons.ORGANIZE} />
                </Alert>

                <div className={styles.message}>
                    {translate('OrganizeSelectedComicsModalConfirmation', {
                        count: comicsTitles.length,
                    })}
                </div>

                <ul>
                    {comicsTitles.map((title) => {
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

export default OrganizeComicsModalContent;
