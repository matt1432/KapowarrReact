// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';

// Redux
import { useLazyGetIssueQuery } from 'Store/Api/Issues';
import { useDeleteBlocklistItemMutation } from 'Store/Api/Queue';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

import classNames from 'classnames';

// General Components
import IconButton from 'Components/Link/IconButton';
import RelativeDateCell from 'Components/Table/Cells/RelativeDateCell';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';
import VolumeTitleLink from 'Volume/VolumeTitleLink';

// CSS
import styles from './index.module.css';

// Types
import type { Column } from 'Components/Table/Column';
import type { BlocklistItem } from 'typings/Queue';
import type { BlocklistColumnName } from '../columns';

type BlocklistRowProps = BlocklistItem & {
    columns: Column<BlocklistColumnName>[];
    columnWidth: number;
    refetch: () => void;
};

// IMPLEMENTATIONS

export default function BlocklistRow({
    columns,
    columnWidth,
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

    const [isTruncated, setIsTruncated] = useState(true);

    const [prevWebLink, setPrevWebLink] = useState(webLink);
    if (webLink !== prevWebLink) {
        setPrevWebLink(webLink);
        // Reset truncated status when link changes
        setIsTruncated(true);
    }

    const toggleTruncated = useCallback(() => {
        setIsTruncated(!isTruncated);
    }, [isTruncated]);

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
            {columns.map(({ isVisible, name }) => {
                if (!isVisible) {
                    return null;
                }

                if (name === 'source') {
                    return (
                        <TableRowCell className={styles[name]}>
                            {source}
                        </TableRowCell>
                    );
                }

                if (name === 'volumeId') {
                    return (
                        <TableRowCell className={styles[name]}>
                            {typeof volumeId === 'number' ||
                            typeof issue?.volumeId === 'number' ? (
                                <VolumeTitleLink
                                    title={(
                                        volumeId ??
                                        issue?.volumeId ??
                                        ''
                                    ).toString()}
                                    titleSlug={(
                                        volumeId ??
                                        issue?.volumeId ??
                                        ''
                                    ).toString()}
                                />
                            ) : null}
                        </TableRowCell>
                    );
                }

                if (name === 'issueId') {
                    return (
                        <TableRowCell className={styles[name]}>
                            {issueId}
                        </TableRowCell>
                    );
                }

                if (name === 'downloadLink') {
                    return (
                        <TableRowCell
                            className={classNames(
                                styles[name],
                                isTruncated && styles.truncate,
                            )}
                            style={{ maxWidth: columnWidth }}
                        >
                            {downloadLink}
                        </TableRowCell>
                    );
                }

                if (name === 'webLink') {
                    return (
                        <TableRowCell
                            className={classNames(
                                styles[name],
                                isTruncated && styles.truncate,
                            )}
                            style={{ maxWidth: columnWidth }}
                        >
                            {webLink}
                        </TableRowCell>
                    );
                }

                if (name === 'webTitle') {
                    return (
                        <TableRowCell
                            className={classNames(
                                styles[name],
                                isTruncated && styles.truncate,
                            )}
                            style={{ maxWidth: columnWidth }}
                        >
                            {webTitle}
                        </TableRowCell>
                    );
                }

                if (name === 'webSubTitle') {
                    return (
                        <TableRowCell
                            className={classNames(
                                styles[name],
                                isTruncated && styles.truncate,
                            )}
                            style={{ maxWidth: columnWidth }}
                        >
                            {webSubTitle}
                        </TableRowCell>
                    );
                }

                if (name === 'reason') {
                    return (
                        <TableRowCell
                            className={classNames(
                                styles[name],
                                isTruncated && styles.truncate,
                            )}
                            style={{ maxWidth: columnWidth }}
                        >
                            {reason}
                        </TableRowCell>
                    );
                }

                if (name === 'addedAt') {
                    return (
                        <RelativeDateCell
                            date={addedAt * 1000}
                            includeSeconds={true}
                            includeTime={true}
                        />
                    );
                }

                if (name === 'actions') {
                    return (
                        <TableRowCell className={styles[name]}>
                            <IconButton
                                name={isTruncated ? icons.INFO : icons.SUBTRACT}
                                title={
                                    isTruncated
                                        ? translate('ShowMore')
                                        : translate('ShowLess')
                                }
                                onPress={toggleTruncated}
                            />
                            <SpinnerIconButton
                                name={icons.DELETE}
                                title={translate('RemoveFromBlocklist')}
                                isSpinning={isLoading}
                                onPress={onDeletePress}
                            />
                        </TableRowCell>
                    );
                }
            })}
        </TableRow>
    );
}
