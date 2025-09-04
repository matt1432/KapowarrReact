// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

// Redux
import { useUpdateIssueMutation } from 'Store/Api/Issues';
import { useSearchVolumeQuery } from 'Store/Api/Volumes';

// Misc
import translate from 'Utilities/String/translate';

// General Components
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import MonitorToggleButton from 'Components/MonitorToggleButton';

// Specific Components
import IssueSearch from '../Search';
import IssueSummary from '../Summary/IssueSummary';

// CSS
import styles from './index.module.css';

// Types
import type { IssueDetailsTab } from 'Issue/IssueDetailsTab';

export interface IssueDetailsModalContentProps {
    issueId: number;
    volumeId: number;
    issueTitle: string;
    showOpenVolumeButton?: boolean;
    selectedTab?: IssueDetailsTab;
    startInteractiveSearch?: boolean;
    startLibgenFileSearch?: boolean;
    onTabChange(isSearch: boolean): void;
    onModalClose(): void;
}

// IMPLEMENTATIONS

// TODO: add history

const TABS: IssueDetailsTab[] = ['details', 'search'];

export default function IssueDetailsModalContent({
    issueId,
    volumeId,
    issueTitle,
    showOpenVolumeButton = false,
    startInteractiveSearch: initialStartInteractiveSearch = false,
    startLibgenFileSearch: initialStartLibgenFileSearch = false,
    selectedTab = 'details',
    onTabChange,
    onModalClose,
}: IssueDetailsModalContentProps) {
    const { volume, issue, refetch } = useSearchVolumeQuery(
        { volumeId },
        {
            selectFromResult: ({ data }) => ({
                volume: data,
                issue: data?.issues.find((issue) => issue.id === issueId),
            }),
        },
    );

    const [isToggling, setIsToggling] = useState(false);

    const [updateIssue, { isSuccess }] = useUpdateIssueMutation();

    useEffect(() => {
        if (isSuccess) {
            refetch().finally(() => {
                setIsToggling(false);
            });
        }
    }, [refetch, isSuccess]);

    const [currentlySelectedTab, setCurrentlySelectedTab] = useState(selectedTab);

    const { title: volumeTitle, id: titleSlug, monitored: volumeMonitored } = volume!;
    const { monitored } = issue!;

    const [startInteractiveSearch, setStartInteractiveSearch] = useState(
        initialStartInteractiveSearch,
    );
    const [startLibgenFileSearch, setStartLibgenFileSearch] = useState(
        initialStartLibgenFileSearch,
    );

    const handleTabSelect = useCallback(
        (selectedIndex: number) => {
            const tab = TABS[selectedIndex];
            onTabChange(tab === 'search');
            setCurrentlySelectedTab(tab);
            setStartInteractiveSearch(false);
            setStartLibgenFileSearch(false);
        },
        [onTabChange],
    );

    const handleMonitorIssuePress = useCallback(
        (monitored: boolean) => {
            setIsToggling(true);
            updateIssue({
                issueId,
                monitored,
            });
        },
        [issueId, updateIssue],
    );

    const volumeLink = `/volumes/${titleSlug}`;

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>
                <MonitorToggleButton
                    monitored={monitored}
                    size={18}
                    isDisabled={!volumeMonitored}
                    isSaving={isToggling}
                    onPress={handleMonitorIssuePress}
                />

                <span className={styles.volumeTitle}>{volumeTitle}</span>

                <span className={styles.separator}>-</span>

                {issueTitle}
            </ModalHeader>

            <ModalBody>
                <Tabs
                    className={styles.tabs}
                    selectedIndex={TABS.indexOf(currentlySelectedTab)}
                    onSelect={handleTabSelect}
                >
                    <TabList className={styles.tabList}>
                        <Tab className={styles.tab} selectedClassName={styles.selectedTab}>
                            {translate('Details')}
                        </Tab>

                        <Tab className={styles.tab} selectedClassName={styles.selectedTab}>
                            {translate('Search')}
                        </Tab>
                    </TabList>

                    <TabPanel>
                        <div className={styles.tabContent}>
                            <IssueSummary issueId={issueId} volumeId={volumeId} />
                        </div>
                    </TabPanel>

                    <TabPanel>
                        {/* Don't wrap in tabContent so we don't have a top margin */}
                        <IssueSearch
                            volumeId={volumeId}
                            issueId={issueId}
                            startInteractiveSearch={startInteractiveSearch}
                            startLibgenFileSearch={startLibgenFileSearch}
                            onModalClose={onModalClose}
                        />
                    </TabPanel>
                </Tabs>
            </ModalBody>

            <ModalFooter>
                {showOpenVolumeButton && (
                    <Button
                        className={styles.openVolumeButton}
                        to={volumeLink}
                        onPress={onModalClose}
                    >
                        {translate('OpenVolume')}
                    </Button>
                )}

                <Button onPress={onModalClose}>{translate('Close')}</Button>
            </ModalFooter>
        </ModalContent>
    );
}
