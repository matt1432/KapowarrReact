import VirtualTableRowCell from 'Components/Table/Cells/VirtualTableRowCell';
import Popover from 'Components/Tooltip/Popover';
import SeasonDetails from 'Comics/Index/Select/SeasonPass/SeasonDetails';
import { type Season } from 'Comics/Comics';
import translate from 'Utilities/String/translate';
import styles from './SeasonsCell.module.css';

interface ComicsStatusCellProps {
    className: string;
    comicsId: number;
    seasonCount: number;
    seasons: Season[];
    isSelectMode: boolean;
}

function SeasonsCell(props: ComicsStatusCellProps) {
    const { className, comicsId, seasonCount, seasons, isSelectMode, ...otherProps } = props;

    return (
        <VirtualTableRowCell className={className} {...otherProps}>
            {isSelectMode ? (
                <Popover
                    className={styles.seasonCount}
                    anchor={seasonCount}
                    title={translate('SeasonDetails')}
                    body={<SeasonDetails comicsId={comicsId} seasons={seasons} />}
                    position="left"
                />
            ) : (
                seasonCount
            )}
        </VirtualTableRowCell>
    );
}

export default SeasonsCell;
