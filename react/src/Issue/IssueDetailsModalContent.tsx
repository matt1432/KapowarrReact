// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

// Redux
import { useSearchVolumeQuery, useToggleIssueMonitoredMutation } from 'Store/createApiEndpoints';
// import { cancelFetchReleases, clearReleases } from 'Store/Actions/releaseActions';

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
import IssueSearch from './Search/IssueSearch';
// import IssueSummary from './Summary/IssueSummary';

// CSS
import styles from './IssueDetailsModalContent.module.css';

// Types
import type { IssueDetailsTab } from 'Issue/IssueDetailsTab';

export interface IssueDetailsModalContentProps {
    issueId: number;
    volumeId: number;
    issueTitle: string;
    isSaving?: boolean;
    showOpenVolumeButton?: boolean;
    selectedTab?: IssueDetailsTab;
    startInteractiveSearch?: boolean;
    onTabChange(isSearch: boolean): void;
    onModalClose(): void;
}

// IMPLEMENTATIONS

const TABS: IssueDetailsTab[] = ['details', 'search'];

function IssueDetailsModalContent({
    issueId,
    volumeId,
    issueTitle,
    isSaving = false,
    showOpenVolumeButton = false,
    startInteractiveSearch = false,
    selectedTab = 'details',
    onTabChange,
    onModalClose,
}: IssueDetailsModalContentProps) {
    const { volume, issue } = useSearchVolumeQuery(
        { volumeId },
        {
            selectFromResult: ({ data }) => ({
                volume: data,
                issue: data?.issues.find((issue) => issue.id === issueId),
            }),
        },
    );

    const [toggleIssueMonitored] = useToggleIssueMonitoredMutation();

    const [currentlySelectedTab, setCurrentlySelectedTab] = useState(selectedTab);

    const { title: volumeTitle, id: titleSlug, monitored: volumeMonitored } = volume!;
    const { monitored } = issue!;

    const handleTabSelect = useCallback(
        (selectedIndex: number) => {
            const tab = TABS[selectedIndex];
            onTabChange(tab === 'search');
            setCurrentlySelectedTab(tab);
        },
        [onTabChange],
    );

    const handleMonitorIssuePress = useCallback(
        (monitored: boolean) => {
            toggleIssueMonitored({
                issueId,
                monitored,
            });
        },
        [issueId, toggleIssueMonitored],
    );

    useEffect(
        () => {
            return () => {
                // Clear pending releases here, so we can reshow the search
                // results even after switching tabs.
                // TODO:
                // dispatch(cancelFetchReleases());
                // dispatch(clearReleases());
            };
        },
        [
            /*dispatch*/
        ],
    );

    const volumeLink = `/volume/${titleSlug}`;

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>
                <MonitorToggleButton
                    monitored={monitored}
                    size={18}
                    isDisabled={!volumeMonitored}
                    isSaving={isSaving}
                    onPress={handleMonitorIssuePress}
                />

                <span className={styles.volumeTitle}>{volumeTitle}</span>

                <span className={styles.separator}>-</span>

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
                            {translate('History')}
                        </Tab>

                        <Tab className={styles.tab} selectedClassName={styles.selectedTab}>
                            {translate('Search')}
                        </Tab>
                    </TabList>

                    {/*
                    <TabPanel>
                        <div className={styles.tabContent}>
                            <IssueSummary
                                issueId={issueId}
                                issueFileId={issueFileId}
                                volumeId={volumeId}
                            />
                        </div>
                    </TabPanel>
                    */}

                    <TabPanel>
                        {/* Don't wrap in tabContent so we not have a top margin */}
                        <IssueSearch
                            volumeId={volumeId}
                            issueId={issueId}
                            startInteractiveSearch={startInteractiveSearch}
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

export default IssueDetailsModalContent;
