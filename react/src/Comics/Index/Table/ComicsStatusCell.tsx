import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Icon from 'Components/Icon';
import MonitorToggleButton from 'Components/MonitorToggleButton';
import VirtualTableRowCell from 'Components/Table/Cells/TableRowCell';
import { icons } from 'Helpers/Props';
import { type ComicsStatus } from 'Comics/Comics';
import { getComicsStatusDetails } from 'Comics/ComicsStatus';
// import { toggleComicsMonitored } from 'Store/Actions/comicsActions';
import translate from 'Utilities/String/translate';
import styles from './ComicsStatusCell.module.css';

interface ComicsStatusCellProps {
    className: string;
    comicsId: number;
    monitored: boolean;
    status: ComicsStatus;
    isSelectMode: boolean;
    isSaving: boolean;
    component?: React.ElementType;
}

function ComicsStatusCell(props: ComicsStatusCellProps) {
    const {
        className,
        comicsId,
        monitored,
        status,
        isSelectMode,
        isSaving,
        component: Component = VirtualTableRowCell,
        ...otherProps
    } = props;

    const statusDetails = getComicsStatusDetails(status);
    const dispatch = useDispatch();

    const onMonitoredPress = useCallback(() => {
        // dispatch(toggleComicsMonitored({ comicsId, monitored: !monitored }));
    }, [comicsId, monitored, dispatch]);

    return (
        <Component className={className} {...otherProps}>
            {isSelectMode ? (
                <MonitorToggleButton
                    className={styles.statusIcon}
                    monitored={monitored}
                    isSaving={isSaving}
                    onPress={onMonitoredPress}
                />
            ) : (
                <Icon
                    className={styles.statusIcon}
                    name={monitored ? icons.MONITORED : icons.UNMONITORED}
                    title={
                        monitored
                            ? translate('ComicsIsMonitored')
                            : translate('ComicsIsUnmonitored')
                    }
                />
            )}

            <Icon
                className={styles.statusIcon}
                name={statusDetails.icon}
                title={`${statusDetails.title}: ${statusDetails.message}`}
            />
        </Component>
    );
}

export default ComicsStatusCell;
