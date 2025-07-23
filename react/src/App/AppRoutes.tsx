// IMPORTS

// React
import { Route, Routes } from 'react-router-dom';

// Components
import VolumeDetailsPage from 'Volume/Details/VolumeDetailsPage';
import VolumeIndex from 'Volume/Index';
import NotFound from 'Components/NotFound';

// Types
import type { History } from 'history';

/*
import AddNewVolume from 'AddVolume/AddNewVolume/AddNewVolume';
import ImportVolumePage from 'AddVolume/ImportVolume/ImportVolumePage';

import Queue from 'Activity/Queue/Queue';
import History from 'Activity/History/History';
import Blocklist from 'Activity/Blocklist/Blocklist';

import Settings from 'Settings/Settings';
import MediaManagement from 'Settings/MediaManagement/MediaManagement';
import DownloadClientSettings from 'Settings/DownloadClients/DownloadClientSettings';
import GeneralSettings from 'Settings/General/GeneralSettings';
import UISettings from 'Settings/UI/UISettings';

import Status from 'System/Status/Status';
import Tasks from 'System/Tasks/Tasks';
*/

// IMPLEMENTATIONS

function AppRoutes({ history }: { history: History }) {
    return (
        <Routes>
            {/*Volume*/}
            <Route path="/" element={<VolumeIndex history={history} />} />

            <Route path="/volumes/:titleSlug" element={<VolumeDetailsPage />} />

            {/*
            <Route path="/add/new" element={<AddNewVolume />} />

            <Route path="/add/import" element={<ImportVolumePage />} />

            {/*Activity*/
            /*}
            <Route path="/activity/queue" element={<Queue />} />

            <Route path="/activity/history" element={<History />} />

            <Route path="/activity/blocklist" element={<Blocklist />} />

            {/*Settings*/
            /*}
            <Route exact={true} path="/settings" element={<Settings />} />

            <Route path="/settings/mediamanagement" element={<MediaManagement />} />

            <Route path="/settings/downloadclients" element={<DownloadClientSettings />} />

            <Route path="/settings/general" element={<GeneralSettings />} />

            <Route path="/settings/ui" element={<UISettings />} />

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

export default AppRoutes;
