import VirtualTableRowCell from 'Components/Table/Cells/VirtualTableRowCell';
import Popover from 'Components/Tooltip/Popover';
import SeasonDetails from 'Volumes/Index/Select/SeasonPass/SeasonDetails';
import { type Season } from 'Volumes/Volumes';
import translate from 'Utilities/String/translate';
import styles from './SeasonsCell.module.css';

interface VolumesStatusCellProps {
    className: string;
    volumesId: number;
    seasonCount: number;
    seasons: Season[];
    isSelectMode: boolean;
}

function SeasonsCell(props: VolumesStatusCellProps) {
    const { className, volumesId, seasonCount, seasons, isSelectMode, ...otherProps } = props;

    return (
        <VirtualTableRowCell className={className} {...otherProps}>
            {isSelectMode ? (
                <Popover
                    className={styles.seasonCount}
                    anchor={seasonCount}
                    title={translate('SeasonDetails')}
                    body={<SeasonDetails volumesId={volumesId} seasons={seasons} />}
                    position="left"
                />
            ) : (
                seasonCount
            )}
        </VirtualTableRowCell>
    );
}

export default SeasonsCell;
