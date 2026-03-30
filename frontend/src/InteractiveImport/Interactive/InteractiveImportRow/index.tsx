// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';

// Redux
import { useSearchVolumeQuery } from 'Store/Api/Volumes';

// Misc
import translate from 'Utilities/String/translate';

// General Components
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRowCellButton from 'Components/Table/Cells/TableRowCellButton';
import TableSelectCell from 'Components/Table/Cells/TableSelectCell';
import TableRow from 'Components/Table/TableRow';

// Specific Components
import SelectIssueModal from 'InteractiveImport/Issue/SelectIssueModal';
import SelectStringValueModal from 'InteractiveImport/SelectStringValue/SelectStringValueModal';
import InteractiveImportRowCellPlaceholder from '../InteractiveImportRowCellPlaceholder';

// CSS
import styles from './index.module.css';

// Types
import type { SelectedIssue } from 'InteractiveImport/Issue/SelectIssueModalContent';
import type { InteractiveImportColumnName } from '../columns';
import type { SelectStateInputProps } from 'typings/Inputs';
import type { Column } from 'Components/Table/Column';
import type {
    FileMatch,
    SelectType,
} from 'InteractiveImport/InteractiveImport';

type SelectedChangeProps = SelectStateInputProps & {
    hasIssueFileId: boolean;
};

export interface InteractiveImportRowProps {
    id: number;
    fileId: number | null;
    volumeId: number;
    columns: Column<InteractiveImportColumnName>[];
    isSelected?: boolean;
    modalTitle: string;
    filepath: string;
    issueIds: number[];
    releaser: string;
    scanType: string;
    resolution: string;
    dpi: string;
    notes: string;
    onSelectedChange(result: SelectedChangeProps): void;
    onValidRowChange(id: number, isValid: boolean): void;
    setFileMatchValue: <K extends keyof FileMatch, V extends FileMatch[K]>(
        id: number,
        key: K,
        value: V,
    ) => void;
}

export default function InteractiveImportRow({
    id,
    fileId: issueFileId,
    volumeId,
    columns,
    isSelected,
    filepath,
    modalTitle,
    issueIds = [],
    releaser,
    scanType,
    resolution,
    dpi,
    notes,
    onSelectedChange,
    onValidRowChange,
    setFileMatchValue,
}: InteractiveImportRowProps) {
    const { data: volume } = useSearchVolumeQuery({ volumeId });

    const [selectModalOpen, setSelectModalOpen] = useState<SelectType | null>(
        null,
    );

    useEffect(
        () => {
            if (issueIds.length) {
                onSelectedChange({
                    id,
                    hasIssueFileId: !!issueFileId,
                    value: true,
                    shiftKey: false,
                });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    useEffect(() => {
        const isValid = !!issueIds.length;

        if (isSelected && !isValid) {
            onValidRowChange(id, false);
        }
        else {
            onValidRowChange(id, true);
        }
    }, [id, issueIds, isSelected, onValidRowChange]);

    const handleSelectedChange = useCallback(
        (result: SelectStateInputProps) => {
            onSelectedChange({
                ...result,
                hasIssueFileId: !!issueFileId,
            });
        },
        [issueFileId, onSelectedChange],
    );

    const selectRowAfterChange = useCallback(() => {
        if (!isSelected) {
            onSelectedChange({
                id,
                hasIssueFileId: !!issueFileId,
                value: true,
                shiftKey: false,
            });
        }
    }, [id, issueFileId, isSelected, onSelectedChange]);

    const onSelectModalClose = useCallback(() => {
        setSelectModalOpen(null);
    }, [setSelectModalOpen]);

    const onSelectIssuePress = useCallback(() => {
        setSelectModalOpen('issueIds');
    }, [setSelectModalOpen]);

    const onIssuesSelect = useCallback(
        (selectedIssues: SelectedIssue[]) => {
            selectedIssues.forEach((selectedIssue) => {
                if (id !== selectedIssue.id) {
                    return;
                }
                setFileMatchValue(
                    id,
                    'issueIds',
                    selectedIssue.issues.map(({ id }) => id),
                );
            });

            setSelectModalOpen(null);
            selectRowAfterChange();
        },
        [id, setSelectModalOpen, selectRowAfterChange, setFileMatchValue],
    );

    const onSelectReleaseGroupPress = useCallback(() => {
        setSelectModalOpen('releaser');
    }, [setSelectModalOpen]);

    const onSelectResolutionPress = useCallback(() => {
        setSelectModalOpen('resolution');
    }, [setSelectModalOpen]);

    const onSelectDpiPress = useCallback(() => {
        setSelectModalOpen('dpi');
    }, [setSelectModalOpen]);

    const onSelectScanTypePress = useCallback(() => {
        setSelectModalOpen('scanType');
    }, [setSelectModalOpen]);

    const onSelectNotesPress = useCallback(() => {
        setSelectModalOpen('notes');
    }, [setSelectModalOpen]);

    const onValueSelect = useCallback(
        <K extends keyof FileMatch, V extends FileMatch[K]>(key: K) =>
            (value: V) => {
                setFileMatchValue(id, key, value);

                setSelectModalOpen(null);
                selectRowAfterChange();
            },
        [setSelectModalOpen, selectRowAfterChange, setFileMatchValue, id],
    );

    const issueInfo = volume?.issues
        .filter((issue) => issueIds.includes(issue.id))
        .map((issue) => {
            return (
                <div key={issue.id}>
                    {issue.issueNumber}
                    {` - ${issue.title ?? `Issue #${issue.issueNumber}`}`}
                </div>
            );
        });

    const showIssueNumbersPlaceholder = isSelected && !issueIds.length;
    const showReleaseGroupPlaceholder = isSelected && !releaser;
    const showResolutionPlaceholder = isSelected && !resolution;
    const showDpiPlaceholder = isSelected && !dpi;
    const showScanTypePlaceholder = isSelected && !scanType;
    const showNotesPlaceholder = isSelected && !notes;

    return (
        <TableRow>
            <TableSelectCell
                id={id}
                isSelected={isSelected}
                onSelectedChange={handleSelectedChange}
            />

            {columns.map((column) => {
                const { name, isVisible } = column;

                if (!isVisible) {
                    return null;
                }

                if (name === 'filepath') {
                    const relativePath = filepath.split('/').at(-1);
                    return (
                        <TableRowCell
                            key={name}
                            className={styles[name]}
                            title={relativePath}
                        >
                            {relativePath}
                        </TableRowCell>
                    );
                }

                if (name === 'issueIds') {
                    return (
                        <TableRowCellButton
                            key={name}
                            title={translate('ClickToChangeIssue')}
                            onPress={onSelectIssuePress}
                        >
                            {showIssueNumbersPlaceholder ? (
                                <InteractiveImportRowCellPlaceholder />
                            ) : (
                                issueInfo
                            )}
                        </TableRowCellButton>
                    );
                }

                if (name === 'releaser') {
                    return (
                        <TableRowCellButton
                            key={name}
                            title={translate('ClickToChangeReleaseGroup')}
                            onPress={onSelectReleaseGroupPress}
                        >
                            {showReleaseGroupPlaceholder ? (
                                <InteractiveImportRowCellPlaceholder
                                    isOptional={true}
                                />
                            ) : (
                                releaser
                            )}
                        </TableRowCellButton>
                    );
                }

                if (name === 'resolution') {
                    return (
                        <TableRowCellButton
                            key={name}
                            title={translate('ClickToChangeResolution')}
                            onPress={onSelectResolutionPress}
                        >
                            {showResolutionPlaceholder ? (
                                <InteractiveImportRowCellPlaceholder
                                    isOptional={true}
                                />
                            ) : (
                                resolution
                            )}
                        </TableRowCellButton>
                    );
                }

                if (name === 'dpi') {
                    return (
                        <TableRowCellButton
                            key={name}
                            title={translate('ClickToChangeDpi')}
                            onPress={onSelectDpiPress}
                        >
                            {showDpiPlaceholder ? (
                                <InteractiveImportRowCellPlaceholder
                                    isOptional={true}
                                />
                            ) : (
                                dpi
                            )}
                        </TableRowCellButton>
                    );
                }

                if (name === 'scanType') {
                    return (
                        <TableRowCellButton
                            key={name}
                            title={translate('ClickToChangeScanType')}
                            onPress={onSelectScanTypePress}
                        >
                            {showScanTypePlaceholder ? (
                                <InteractiveImportRowCellPlaceholder
                                    isOptional={true}
                                />
                            ) : (
                                scanType
                            )}
                        </TableRowCellButton>
                    );
                }

                if (name === 'notes') {
                    return (
                        <TableRowCellButton
                            key={name}
                            title={translate('ClickToChangeNotes')}
                            onPress={onSelectNotesPress}
                        >
                            {showNotesPlaceholder ? (
                                <InteractiveImportRowCellPlaceholder
                                    isOptional={true}
                                />
                            ) : (
                                notes
                            )}
                        </TableRowCellButton>
                    );
                }
            })}

            <SelectIssueModal
                isOpen={selectModalOpen === 'issueIds'}
                selectedIds={[id]}
                volumeId={volumeId}
                modalTitle={modalTitle}
                onIssuesSelect={onIssuesSelect}
                onModalClose={onSelectModalClose}
            />

            <SelectStringValueModal
                isOpen={selectModalOpen === 'releaser'}
                initialValue={releaser ?? ''}
                valueTitleKey="ReleaseGroup"
                modalTitleKey="SetReleaseGroupModalTitle"
                confirmKey="SetReleaseGroup"
                modalTitle={modalTitle}
                onValueSelect={onValueSelect('releaser')}
                onModalClose={onSelectModalClose}
            />

            <SelectStringValueModal
                isOpen={selectModalOpen === 'resolution'}
                initialValue={resolution ?? ''}
                valueTitleKey="Resolution"
                modalTitleKey="SetResolutionModalTitle"
                confirmKey="SetResolution"
                modalTitle={modalTitle}
                onValueSelect={onValueSelect('resolution')}
                onModalClose={onSelectModalClose}
            />

            <SelectStringValueModal
                isOpen={selectModalOpen === 'dpi'}
                initialValue={dpi ?? ''}
                valueTitleKey="DPI"
                modalTitleKey="SetDpiModalTitle"
                confirmKey="SetDpi"
                modalTitle={modalTitle}
                onValueSelect={onValueSelect('dpi')}
                onModalClose={onSelectModalClose}
            />

            <SelectStringValueModal
                isOpen={selectModalOpen === 'scanType'}
                initialValue={scanType ?? ''}
                valueTitleKey="ScanType"
                modalTitleKey="SetScanTypeModalTitle"
                confirmKey="SetScanType"
                modalTitle={modalTitle}
                onValueSelect={onValueSelect('scanType')}
                onModalClose={onSelectModalClose}
            />

            <SelectStringValueModal
                isOpen={selectModalOpen === 'notes'}
                initialValue={notes ?? ''}
                valueTitleKey="Notes"
                modalTitleKey="SetNotesModalTitle"
                confirmKey="SetNotes"
                modalTitle={modalTitle}
                onValueSelect={onValueSelect('notes')}
                onModalClose={onSelectModalClose}
            />
        </TableRow>
    );
}
