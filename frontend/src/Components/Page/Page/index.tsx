// IMPORTS

// React
import React, { useCallback, useEffect } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { saveDimensions } from 'Store/Slices/App';

// Hooks
import useAppPage from 'Helpers/Hooks/useAppPage';

// General Components
import LoginPage from 'Login';
import ColorImpairedContext from 'App/ColorImpairedContext';
import ConnectionLostModal from 'App/ConnectionLostModal';

// Specific Components
import ErrorPage from '../ErrorPage';
import PageHeader from '../Header/PageHeader';
import LoadingPage from '../LoadingPage';
import PageSidebar from '../Sidebar/PageSidebar';

// CSS
import styles from './index.module.css';

// Types
interface PageProps {
    children?: React.ReactNode;
}

// IMPLEMENTATIONS

export default function Page({ children = [] }: PageProps) {
    const dispatch = useRootDispatch();

    const { isConnected } = useRootSelector((state) => state.socketEvents);

    const { hasError, errors, isPopulated, needsAuth } = useAppPage();

    const { isSmallScreen } = useRootSelector((state) => state.app.dimensions);
    const { enableColorImpairedMode } = useRootSelector(
        (state) => state.uiSettings,
    );

    const { isSidebarVisible } = useRootSelector((state) => state.app);

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

    if (hasError) {
        return <ErrorPage {...errors} version={window.Kapowarr.version} />;
    }

    if (needsAuth) {
        return <LoginPage />;
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

                <ConnectionLostModal isOpen={!isConnected} />
            </div>
        </ColorImpairedContext.Provider>
    );
}
