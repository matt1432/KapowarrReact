import { Route } from 'react-router-dom';
import Switch from 'Components/Router/Switch';
import ImportComics from './Import/ImportComics';
import ImportComicsSelectFolder from './SelectFolder/ImportComicsSelectFolder';

function ImportComicsPage() {
    return (
        <Switch>
            <Route exact={true} path="/add/import" component={ImportComicsSelectFolder} />

            <Route path="/add/import/:rootFolderId" component={ImportComics} />
        </Switch>
    );
}

export default ImportComicsPage;
