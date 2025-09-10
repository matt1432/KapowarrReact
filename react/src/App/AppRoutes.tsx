// TODO:
// IMPORTS

// React
import { Route, Routes } from 'react-router-dom';

// Components
import VolumeIndex from 'Volume/Index';
import VolumeDetailsPage from 'Volume/Details/VolumeDetailsPage';

import AddNewVolume from 'AddVolume/AddNewVolume/AddNewVolume';

// TODO: do this one from scratch to follow how it works in Kapowarr
// import ImportVolumePage from 'AddVolume/ImportVolume/ImportVolumePage';

// import Queue from 'Activity/Queue';
import History from 'Activity/History';
import Blocklist from 'Activity/Blocklist';

import GeneralSettings from 'Settings/GeneralSettings';
import MediaManagement from 'Settings/MediaManagement';
import DownloadSettings from 'Settings/DownloadSettings';
import DownloadClientSettings from 'Settings/DownloadClientSettings';
import UISettings from 'Settings/UISettings';

import Status from 'System/Status';
import Tasks from 'System/Tasks';

import NotFound from 'Components/NotFound';

// IMPLEMENTATIONS

export default function AppRoutes() {
    return (
        <Routes>
            {/*Volume*/}
            <Route path="/" element={<VolumeIndex />} />

            <Route path="/volumes/:titleSlug" element={<VolumeDetailsPage />} />

            <Route path="/add/new" element={<AddNewVolume />} />

            {/*
            <Route path="/add/import" element={<ImportVolumePage />} />

            {/*Activity*/}
            {/*
            <Route path="/activity/queue" element={<Queue />} />*/}

            <Route path="/activity/history" element={<History />} />

            <Route path="/activity/blocklist" element={<Blocklist />} />

            {/*Settings*/}
            <Route path="/settings" element={<GeneralSettings />} />

            <Route path="/settings/mediamanagement" element={<MediaManagement />} />

            <Route path="/settings/download" element={<DownloadSettings />} />

            <Route path="/settings/downloadclients" element={<DownloadClientSettings />} />

            <Route path="/settings/ui" element={<UISettings />} />

            {/*System*/}
            <Route path="/system/status" element={<Status />} />

            <Route path="/system/tasks" element={<Tasks />} />

            {/*Not Found*/}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
