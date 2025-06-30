import { Route } from 'react-router-dom';
import Switch from 'Components/Router/Switch';
import ImportVolumes from './Import/ImportVolumes';
import ImportVolumesSelectFolder from './SelectFolder/ImportVolumesSelectFolder';

function ImportVolumesPage() {
    return (
        <Switch>
            <Route exact={true} path="/add/import" component={ImportVolumesSelectFolder} />

            <Route path="/add/import/:rootFolderId" component={ImportVolumes} />
        </Switch>
    );
}

export default ImportVolumesPage;
