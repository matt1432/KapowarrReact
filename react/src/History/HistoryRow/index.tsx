// IMPORTS

// General Components
import RelativeDateCell from 'Components/Table/Cells/RelativeDateCell';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';

// Types
import type { DownloadHistoryItem } from 'typings/Queue';

type HistoryRowProps = DownloadHistoryItem;

// IMPLEMENTATIONS

export default function HistoryRow({
    source,
    webLink,
    webTitle,
    webSubTitle,
    fileTitle,
    downloadedAt,
}: HistoryRowProps) {
    return (
        <TableRow>
            <TableRowCell>{source}</TableRowCell>

            <TableRowCell>{webLink}</TableRowCell>

            <TableRowCell>{webTitle}</TableRowCell>

            <TableRowCell>{webSubTitle}</TableRowCell>

            <TableRowCell>{fileTitle}</TableRowCell>

            <RelativeDateCell date={downloadedAt * 1000} includeSeconds={true} includeTime={true} />
        </TableRow>
    );
}
