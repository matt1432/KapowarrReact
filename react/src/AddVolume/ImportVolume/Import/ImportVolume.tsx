// IMPORTS

// React
// import { useEffect, useMemo, useRef, type RefObject } from 'react';
// import { useParams } from 'react-router';

// Redux
// import { useDispatch, useSelector } from 'react-redux';
// import { clearImportVolume } from 'Store/Actions/importVolumeActions';
// import { fetchRootFolders } from 'Store/Actions/rootFolderActions';

// Misc
// import { kinds } from 'Helpers/Props';

// import translate from 'Utilities/String/translate';

// General Components
// import { SelectProvider } from 'App/SelectContext';

// import Alert from 'Components/Alert';
// import LoadingIndicator from 'Components/Loading/LoadingIndicator';
// import PageContent from 'Components/Page/PageContent';
// import PageContentBody from 'Components/Page/PageContentBody';

// Specific Components
// import ImportVolumeFooter from './ImportVolumeFooter';
// import ImportVolumeTable from './ImportVolumeTable';

// IMPLEMENTATIONS

function ImportVolume() {
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

    const defaultQualityProfileId = useAddVolumeOption('qualityProfileId');

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
            // dispatch(clearImportVolume());
        };
    }, [rootFolderId, dispatch]);

    useEffect(() => {
        if (
            !defaultQualityProfileId ||
            !qualityProfiles.some((p) => p.id === defaultQualityProfileId)
        ) {
            setAddVolumeOption('qualityProfileId', qualityProfiles[0].id);
        }
    }, [defaultQualityProfileId, qualityProfiles, dispatch]);
    return (
        <SelectProvider items={items}>
            <PageContent title={translate('ImportVolume')}>
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
                            {translate('AllVolumeInRootFolderHaveBeenImported', { path })}
                        </Alert>
                    ) : null}

                    {!rootFoldersError &&
                    !rootFoldersFetching &&
                    rootFoldersPopulated &&
                    !!unmappedFolders.length &&
                    scrollerRef.current ? (
                        <ImportVolumeTable
                            unmappedFolders={unmappedFolders}
                            scrollerRef={scrollerRef}
                        />
                    ) : null}
                </PageContentBody>

                {!rootFoldersError && !rootFoldersFetching && !!unmappedFolders.length ? (
                    <ImportVolumeFooter />
                ) : null}
            </PageContent>
        </SelectProvider>
    );
    */
    return null;
}

export default ImportVolume;
