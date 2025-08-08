// TODO:
// IMPORTS

// React
import React, { useCallback, useEffect, useState } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { saveDimensions } from 'Store/Slices/App';

// Misc
import useAppPage from 'Helpers/Hooks/useAppPage';

// General Components
import ColorImpairedContext from 'App/ColorImpairedContext';
import ConnectionLostModal from 'App/ConnectionLostModal';
import AuthenticationRequiredModal from 'FirstRun/AuthenticationRequiredModal';

// Specific Components
import ErrorPage from './ErrorPage';
import PageHeader from './Header/PageHeader';
import LoadingPage from './LoadingPage';
import PageSidebar from './Sidebar/PageSidebar';

// CSS
import styles from './Page.module.css';

// Types
interface PageProps {
    children?: React.ReactNode;
}

// IMPLEMENTATIONS

function Page({ children = [] }: PageProps) {
    const dispatch = useRootDispatch();
    const { hasError, errors, isPopulated, isLocalStorageSupported } = useAppPage();
    const [isConnectionLostModalOpen, setIsConnectionLostModalOpen] = useState(false);

    const { isSmallScreen } = useRootSelector((state) => state.app.dimensions);
    const { enableColorImpairedMode } = useRootSelector((state) => state.uiSettings);

    // const { authentication } = useSelector(createSystemStatusSelector());
    // const authenticationEnabled = authentication !== 'none';

    const { isSidebarVisible } = useRootSelector((state) => state.app);

    // TODO: implement this
    // const { isDisconnected } = useSelector(
    //     (state: AppState) => state.app,
    // );
    const isDisconnected = false;

    const handleResize = useCallback(() => {
        dispatch(
            saveDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            }),
        );
    }, [dispatch]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    useEffect(() => {
        if (isDisconnected) {
            setIsConnectionLostModalOpen(true);
        }
    }, [isDisconnected]);

    if (hasError || !isLocalStorageSupported) {
        return (
            <ErrorPage
                {...errors}
                version={window.Kapowarr.version}
                isLocalStorageSupported={isLocalStorageSupported}
            />
        );
    }

    if (!isPopulated) {
        return <LoadingPage />;
    }

    return (
        <ColorImpairedContext.Provider value={enableColorImpairedMode}>
            <div className={styles.page}>
                <PageHeader />

                <div className={styles.main}>
                    <PageSidebar
                        isSmallScreen={isSmallScreen}
                        isSidebarVisible={isSidebarVisible}
                    />

                    {children}
                </div>

                <ConnectionLostModal isOpen={isConnectionLostModalOpen} />

                <AuthenticationRequiredModal isOpen={false /* !authenticationEnabled */} />
            </div>
        </ColorImpairedContext.Provider>
    );
}

export default Page;
