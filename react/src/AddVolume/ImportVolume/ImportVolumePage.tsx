// TODO:
// IMPORTS

// React
import { Route, Routes } from 'react-router-dom';

// Specific Components
import ImportVolume from './Import/ImportVolume';
import ImportVolumeSelectFolder from './SelectFolder/ImportVolumeSelectFolder';

// IMPLEMENTATIONS

function ImportVolumePage() {
    return (
        <Routes>
            <Route path="/add/import">
                <ImportVolumeSelectFolder />
            </Route>

            <Route path="/add/import/:rootFolderId">
                <ImportVolume />
            </Route>
        </Routes>
    );
}

export default ImportVolumePage;
