// IMPORTS

// React
import { useCallback, useEffect } from 'react';

// Redux
import { useLazyGetIssueQuery } from 'Store/Api/Issues';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import RelativeDateCell from 'Components/Table/Cells/RelativeDateCell';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';
import VolumeTitleLink from 'Volume/VolumeTitleLink';

// Types
import type { BlocklistItem } from 'typings/Queue';
import { useDeleteBlocklistItemMutation } from 'Store/Api/Queue';

type BlocklistRowProps = BlocklistItem & {
    refetch: () => void;
};

// IMPLEMENTATIONS

export default function BlocklistRow({
    id,
    source,
    volumeId,
    issueId,
    downloadLink,
    webLink,
    webTitle,
    webSubTitle,
    reason,
    addedAt,
    refetch,
}: BlocklistRowProps) {
    const [getIssue, { data: issue }] = useLazyGetIssueQuery();

    useEffect(() => {
        if (typeof issueId === 'number') {
            getIssue({ issueId });
        }
    }, [getIssue, issueId]);

    const [deleteItem, { isLoading }] = useDeleteBlocklistItemMutation();

    const onDeletePress = useCallback(() => {
        deleteItem({ id }).finally(() => {
            refetch();
        });
    }, [deleteItem, id, refetch]);

    return (
        <TableRow>
            <TableRowCell>{source}</TableRowCell>

            <TableRowCell>
                {typeof volumeId === 'number' || typeof issue?.volumeId === 'number' ? (
                    <VolumeTitleLink
                        title={(volumeId ?? issue?.volumeId ?? '').toString()}
                        titleSlug={(volumeId ?? issue?.volumeId ?? '').toString()}
                    />
                ) : null}
            </TableRowCell>

            <TableRowCell>{issueId}</TableRowCell>

            <TableRowCell>{downloadLink}</TableRowCell>

            <TableRowCell>{webLink}</TableRowCell>

            <TableRowCell>{webTitle}</TableRowCell>

            <TableRowCell>{webSubTitle}</TableRowCell>

            <TableRowCell>{reason}</TableRowCell>

            <RelativeDateCell date={addedAt * 1000} includeSeconds={true} includeTime={true} />

            <TableRowCell>
                <SpinnerIconButton
                    name={icons.DELETE}
                    title={translate('RemoveFromBlocklist')}
                    isSpinning={isLoading}
                    onPress={onDeletePress}
                />
            </TableRowCell>
        </TableRow>
    );
}
