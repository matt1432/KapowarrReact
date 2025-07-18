// IMPORTS

// React
import { type SyntheticEvent, useCallback } from 'react';

// Misc
import { useSelect } from 'App/SelectContext';
import { icons } from 'Helpers/Props';

// General Components
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';

// CSS
import styles from './VolumeIndexPosterSelect.module.css';

// Types
interface VolumeIndexPosterSelectProps {
    volumeId: number;
}

// IMPLEMENTATIONS

function VolumeIndexPosterSelect(props: VolumeIndexPosterSelectProps) {
    const { volumeId } = props;
    const [selectState, selectDispatch] = useSelect();
    const isSelected = selectState.selectedState[volumeId];

    const onSelectPress = useCallback(
        (event: SyntheticEvent<HTMLElement, PointerEvent>) => {
            const shiftKey = event.nativeEvent.shiftKey;

            selectDispatch({
                type: 'toggleSelected',
                id: volumeId,
                isSelected: !isSelected,
                shiftKey,
            });
        },
        [volumeId, isSelected, selectDispatch],
    );

    return (
        <Link className={styles.checkButton} onPress={onSelectPress}>
            <span className={styles.checkContainer}>
                <Icon
                    className={isSelected ? styles.selected : styles.unselected}
                    name={isSelected ? icons.CHECK_CIRCLE : icons.CIRCLE_OUTLINE}
                    size={20}
                />
            </span>
        </Link>
    );
}

export default VolumeIndexPosterSelect;
