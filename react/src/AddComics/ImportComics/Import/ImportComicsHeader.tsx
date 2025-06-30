import ComicsMonitoringOptionsPopoverContent from 'AddComics/ComicsMonitoringOptionsPopoverContent';
import ComicsTypePopoverContent from 'AddComics/ComicsTypePopoverContent';
import Icon from 'Components/Icon';
import VirtualTableHeader from 'Components/Table/VirtualTableHeader';
import VirtualTableHeaderCell from 'Components/Table/VirtualTableHeaderCell';
import VirtualTableSelectAllHeaderCell from 'Components/Table/VirtualTableSelectAllHeaderCell';
import Popover from 'Components/Tooltip/Popover';
import { icons, tooltipPositions } from 'Helpers/Props';
import { type CheckInputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import styles from './ImportComicsHeader.module.css';

interface ImportComicsHeaderProps {
    allSelected: boolean;
    allUnselected: boolean;
    onSelectAllChange: (change: CheckInputChanged) => void;
}

function ImportComicsHeader({
    allSelected,
    allUnselected,
    onSelectAllChange,
}: ImportComicsHeaderProps) {
    return (
        <VirtualTableHeader>
            <VirtualTableSelectAllHeaderCell
                allSelected={allSelected}
                allUnselected={allUnselected}
                onSelectAllChange={onSelectAllChange}
            />

            <VirtualTableHeaderCell className={styles.folder} name="folder">
                {translate('Folder')}
            </VirtualTableHeaderCell>

            <VirtualTableHeaderCell className={styles.monitor} name="monitor">
                {translate('Monitor')}

                <Popover
                    anchor={<Icon className={styles.detailsIcon} name={icons.INFO} />}
                    title={translate('MonitoringOptions')}
                    body={<ComicsMonitoringOptionsPopoverContent />}
                    position={tooltipPositions.RIGHT}
                />
            </VirtualTableHeaderCell>

            <VirtualTableHeaderCell className={styles.qualityProfile} name="qualityProfileId">
                {translate('QualityProfile')}
            </VirtualTableHeaderCell>

            <VirtualTableHeaderCell className={styles.comicsType} name="comicsType">
                {translate('ComicsType')}

                <Popover
                    anchor={<Icon className={styles.detailsIcon} name={icons.INFO} />}
                    title={translate('ComicsType')}
                    body={<ComicsTypePopoverContent />}
                    position={tooltipPositions.RIGHT}
                />
            </VirtualTableHeaderCell>

            <VirtualTableHeaderCell className={styles.seasonFolder} name="seasonFolder">
                {translate('SeasonFolder')}
            </VirtualTableHeaderCell>

            <VirtualTableHeaderCell className={styles.comics} name="comics">
                {translate('Comics')}
            </VirtualTableHeaderCell>
        </VirtualTableHeader>
    );
}

export default ImportComicsHeader;
