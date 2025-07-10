/*import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { setAddVolumesOption, useAddVolumesOption } from 'AddVolumes/addVolumesOptionsStore';
import { SelectProvider } from 'App/SelectContext';
// import { type AppState } from 'App/State/AppState';
import Alert from 'Components/Alert';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import { kinds } from 'Helpers/Props';
// import { clearImportVolumes } from 'Store/Actions/importVolumesActions';
// import { fetchRootFolders } from 'Store/Actions/rootFolderActions';
import translate from 'Utilities/String/translate';
import ImportVolumesFooter from './ImportVolumesFooter';
import ImportVolumesTable from './ImportVolumesTable';
*/

function ImportVolumes() {
    /*
    const dispatch = useDispatch();
    const { rootFolderId: rootFolderIdString } = useParams<{
        rootFolderId: string;
    }>();
    const rootFolderId = parseInt(rootFolderIdString!);

    const {
        isFetching: rootFoldersFetching,
        isPopulated: rootFoldersPopulated,
        error: rootFoldersError,
        items: rootFolders,
    } = useSelector((state: AppState) => state.rootFolders);

    const { path, unmappedFolders } = useMemo(() => {
        const rootFolder = rootFolders.find((r) => r.id === rootFolderId);

        return {
            path: rootFolder?.path ?? '',
            unmappedFolders:
                rootFolder?.unmappedFolders.map((unmappedFolders) => {
                    return {
                        ...unmappedFolders,
                        id: unmappedFolders.name,
                    };
                }) ?? [],
        };
    }, [rootFolders, rootFolderId]);

    const qualityProfiles = useSelector((state: AppState) => state.settings.qualityProfiles.items);

    const defaultQualityProfileId = useAddVolumesOption('qualityProfileId');

    const scrollerRef = useRef<HTMLDivElement>(undefined) as RefObject<HTMLDivElement>;

    const items = useMemo(() => {
        return unmappedFolders.map((unmappedFolder) => {
            return {
                ...unmappedFolder,
                id: unmappedFolder.name,
            };
        });
    }, [unmappedFolders]);

    useEffect(() => {
        // dispatch(fetchRootFolders({ id: rootFolderId, timeout: false }));

        return () => {
            // dispatch(clearImportVolumes());
        };
    }, [rootFolderId, dispatch]);

    useEffect(() => {
        if (
            !defaultQualityProfileId ||
            !qualityProfiles.some((p) => p.id === defaultQualityProfileId)
        ) {
            setAddVolumesOption('qualityProfileId', qualityProfiles[0].id);
        }
    }, [defaultQualityProfileId, qualityProfiles, dispatch]);
    return (
        <SelectProvider items={items}>
            <PageContent title={translate('ImportVolumes')}>
                <PageContentBody ref={scrollerRef}>
                    {rootFoldersFetching ? <LoadingIndicator /> : null}

                    {!rootFoldersFetching && !!rootFoldersError ? (
                        <Alert kind={kinds.DANGER}>{translate('RootFoldersLoadError')}</Alert>
                    ) : null}

                    {!rootFoldersError &&
                    !rootFoldersFetching &&
                    rootFoldersPopulated &&
                    !unmappedFolders.length ? (
                        <Alert kind={kinds.INFO}>
                            {translate('AllVolumesInRootFolderHaveBeenImported', { path })}
                        </Alert>
                    ) : null}

                    {!rootFoldersError &&
                    !rootFoldersFetching &&
                    rootFoldersPopulated &&
                    !!unmappedFolders.length &&
                    scrollerRef.current ? (
                        <ImportVolumesTable
                            unmappedFolders={unmappedFolders}
                            scrollerRef={scrollerRef}
                        />
                    ) : null}
                </PageContentBody>

                {!rootFoldersError && !rootFoldersFetching && !!unmappedFolders.length ? (
                    <ImportVolumesFooter />
                ) : null}
            </PageContent>
        </SelectProvider>
    );
    */
    return null;
}

export default ImportVolumes;
