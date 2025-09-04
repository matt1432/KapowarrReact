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

// import Queue from 'Activity/Queue/Queue';
// import History from 'Activity/History/History';
// import Blocklist from 'Activity/Blocklist/Blocklist';

import UISettings from 'Settings/UI/UISettings';
// import MediaManagement from 'Settings/MediaManagement/MediaManagement';
// import DownloadClientSettings from 'Settings/DownloadClients/DownloadClientSettings';
// import GeneralSettings from 'Settings/General/GeneralSettings';

// import Status from 'System/Status/Status';
// import Tasks from 'System/Tasks/Tasks';

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

            {/*Activity*/
            /*}
            <Route path="/activity/queue" element={<Queue />} />

            <Route path="/activity/history" element={<History />} />

            <Route path="/activity/blocklist" element={<Blocklist />} />

            {/*Settings*/}
            <Route path="/settings" element={<UISettings />} />

            {/*
            <Route path="/settings/mediamanagement" element={<MediaManagement />} />

            <Route path="/settings/downloadclients" element={<DownloadClientSettings />} />

            <Route path="/settings/general" element={<GeneralSettings />} />

            {/*System*/
            /*}
            <Route path="/system/status" element={<Status />} />

            <Route path="/system/tasks" element={<Tasks />} />
             */}

            {/*Not Found*/}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
