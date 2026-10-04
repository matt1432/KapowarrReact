// IMPORTS

// React
import { useCallback, useMemo, useState, type MouseEvent } from 'react';

// Misc
import classNames from 'classnames';

import { kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import CheckInput from 'Components/Form/CheckInput';
import Button from 'Components/Link/Button';
import SpinnerErrorButton from 'Components/Link/SpinnerErrorButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// CSS
import styles from './index.module.css';

// Types
import type { AnyError } from 'typings/Api';
import type { CheckInputChanged } from 'typings/Inputs';

export interface SimilarPageItem {
    id: string;
    src: string;
    /** Pages are listed under a header per group (e.g. the book they're in) */
    group: string;
    label: string;
    /** How different the page is from the reference, from 0 to 1 */
    distance?: number;
}

export interface SimilarPagesModalContentProps {
    title: string;
    message?: string;
    pages: SimilarPageItem[] | undefined;
    isFetching: boolean;
    fetchError?: AnyError;
    confirmLabel?: string;
    isConfirming: boolean;
    confirmError?: AnyError;
    onConfirm: (selectedIds: string[]) => void;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

function stopPropagation(event: MouseEvent) {
    event.stopPropagation();
}

function SimilarPageCard({
    id,
    src,
    label,
    distance,
    isSelected,
    onToggle,
}: SimilarPageItem & {
    isSelected: boolean;
    onToggle: (id: string, value: boolean) => void;
}) {
    const handleClick = useCallback(
        () => onToggle(id, !isSelected),
        [id, isSelected, onToggle],
    );

    const handleCheckChange = useCallback(
        ({ value }: CheckInputChanged<string>) => onToggle(id, value),
        [id, onToggle],
    );

    return (
        <div
            className={classNames(styles.page, isSelected && styles.selected)}
            title={label}
            onClick={handleClick}
        >
            <img className={styles.image} src={src} loading="lazy" />

            <div className={styles.caption}>
                <span onClick={stopPropagation}>
                    <CheckInput
                        name={id}
                        value={isSelected}
                        onChange={handleCheckChange}
                    />
                </span>

                <span className={styles.label}>{label}</span>

                {distance === undefined ? null : (
                    <span className={styles.similarity}>
                        {translate('SimilarPagesSimilarity', {
                            similarity: Math.round((1 - distance) * 100),
                        })}
                    </span>
                )}
            </div>
        </div>
    );
}

export default function SimilarPagesModalContent({
    title,
    message,
    pages,
    isFetching,
    fetchError,
    confirmLabel = translate('Delete'),
    isConfirming,
    confirmError,
    onConfirm,
    onModalClose,
}: SimilarPagesModalContentProps) {
    // All pages are selected by default
    const [selected, setSelected] = useState(
        () => new Set(pages?.map(({ id }) => id)),
    );

    const [prevPages, setPrevPages] = useState(pages);
    if (pages !== prevPages) {
        setPrevPages(pages);
        setSelected(new Set(pages?.map(({ id }) => id)));
    }

    const groups = useMemo(() => {
        const result = new Map<string, SimilarPageItem[]>();
        pages?.forEach((page) => {
            const group = result.get(page.group);
            if (group) {
                group.push(page);
            }
            else {
                result.set(page.group, [page]);
            }
        });
        return result;
    }, [pages]);

    const togglePage = useCallback((id: string, value: boolean) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (value) {
                next.add(id);
            }
            else {
                next.delete(id);
            }
            return next;
        });
    }, []);

    const pageCount = pages?.length ?? 0;
    const selectAllValue =
        selected.size === 0 ? false : selected.size === pageCount ? true : null;

    const handleSelectAllChange = useCallback(
        ({ value }: CheckInputChanged<string>) => {
            setSelected(new Set(value ? pages?.map(({ id }) => id) : []));
        },
        [pages],
    );

    const handleConfirmPress = useCallback(() => {
        onConfirm(
            pages?.filter(({ id }) => selected.has(id)).map(({ id }) => id) ??
                [],
        );
    }, [onConfirm, pages, selected]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{title}</ModalHeader>

            <ModalBody>
                {isFetching ? <LoadingIndicator /> : null}

                {!isFetching && fetchError ? (
                    <Alert kind={kinds.DANGER}>
                        {translate('SimilarPagesLoadError')}
                    </Alert>
                ) : null}

                {!isFetching && !fetchError && pages && !pages.length ? (
                    <div>{translate('SimilarPagesNoneFound')}</div>
                ) : null}

                {!isFetching && !fetchError && pages?.length ? (
                    <>
                        {message ? <Alert>{message}</Alert> : null}

                        {[...groups].map(([group, groupPages]) => (
                            <div key={group} className={styles.group}>
                                <div className={styles.groupHeader}>
                                    {group}
                                </div>

                                <div className={styles.pages}>
                                    {groupPages.map((page) => (
                                        <SimilarPageCard
                                            key={page.id}
                                            {...page}
                                            isSelected={selected.has(page.id)}
                                            onToggle={togglePage}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                ) : null}
            </ModalBody>

            <ModalFooter>
                {pageCount ? (
                    <>
                        <CheckInput
                            className={styles.selectAllInput}
                            containerClassName={styles.selectAllInputContainer}
                            name="selectAll"
                            value={selectAllValue}
                            onChange={handleSelectAllChange}
                        />

                        <span className={styles.selectedCount}>
                            {translate('SimilarPagesSelectedCount', {
                                selected: selected.size,
                                total: pageCount,
                            })}
                        </span>
                    </>
                ) : null}

                <Button onPress={onModalClose}>{translate('Cancel')}</Button>

                <SpinnerErrorButton
                    kind={kinds.DANGER}
                    error={confirmError}
                    isSpinning={isConfirming}
                    isDisabled={isFetching || selected.size === 0}
                    onPress={handleConfirmPress}
                >
                    {confirmLabel}
                </SpinnerErrorButton>
            </ModalFooter>
        </ModalContent>
    );
}
