// IMPORTS

// General Components
import RelativeDateCell from 'Components/Table/Cells/RelativeDateCell';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';

// CSS
import styles from './index.module.css';

// Types
import type { DownloadHistoryItem } from 'typings/Queue';

type IssueHistoryRowProps = DownloadHistoryItem;

// IMPLEMENTATIONS

export default function IssueHistoryRow({
    source,
    webLink,
    webTitle,
    webSubTitle,
    fileTitle,
    downloadedAt,
}: IssueHistoryRowProps) {
    return (
        <TableRow>
            <TableRowCell>{source}</TableRowCell>

            <TableRowCell>{webLink}</TableRowCell>

            <TableRowCell>{webTitle}</TableRowCell>

            <TableRowCell>{webSubTitle}</TableRowCell>

            <TableRowCell>{fileTitle}</TableRowCell>

            <RelativeDateCell date={downloadedAt * 1000} includeSeconds={true} includeTime={true} />

            <TableRowCell className={styles.actions}>
                {/*
                TODO: add to blocklist button?
                <Popover
                    anchor={<Icon name={icons.INFO} />}
                    title={getTitle(eventType)}
                    body={
                        <HistoryDetails
                            eventType={eventType}
                            sourceTitle={sourceTitle}
                            data={data}
                            downloadId={downloadId}
                        />
                    }
                    position={tooltipPositions.LEFT}
                />
                */}
            </TableRowCell>
        </TableRow>
    );
}
