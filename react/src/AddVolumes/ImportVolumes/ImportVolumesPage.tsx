import { Route, Routes } from 'react-router-dom';
import ImportVolumes from './Import/ImportVolumes';
import ImportVolumesSelectFolder from './SelectFolder/ImportVolumesSelectFolder';

function ImportVolumesPage() {
    return (
        <Routes>
            <Route path="/add/import">
                <ImportVolumesSelectFolder />
            </Route>

            <Route path="/add/import/:rootFolderId">
                <ImportVolumes />
            </Route>
        </Routes>
    );
}

export default ImportVolumesPage;
