import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSelect } from 'App/SelectContext';
import { type ClientSideCollectionAppState } from 'App/State/ClientSideCollectionAppState';
import type { ComicsAppState, ComicsIndexAppState } from 'App/State/ComicsAppState';
import { REFRESH_COMICS } from 'Commands/commandNames';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import { icons } from 'Helpers/Props';
// import { executeCommand } from 'Store/Actions/commandActions';
import createCommandExecutingSelector from 'Store/Selectors/createCommandExecutingSelector';
import createComicsClientSideCollectionItemsSelector from 'Store/Selectors/createComicsClientSideCollectionItemsSelector';
import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';

interface ComicsIndexRefreshComicsButtonProps {
    isSelectMode: boolean;
    selectedFilterKey: string;
}

function ComicsIndexRefreshComicsButton(props: ComicsIndexRefreshComicsButtonProps) {
    const isRefreshing = useSelector(createCommandExecutingSelector(REFRESH_COMICS));
    // @ts-expect-error TODO:
    const {
        items,
        totalItems,
    }: ComicsAppState & ComicsIndexAppState & ClientSideCollectionAppState = useSelector(
        createComicsClientSideCollectionItemsSelector('comicsIndex'),
    );

    const dispatch = useDispatch();
    const { isSelectMode, selectedFilterKey } = props;
    const [selectState] = useSelect();
    const { selectedState } = selectState;

    const selectedComicsIds = useMemo(() => {
        return getSelectedIds(selectedState);
    }, [selectedState]);

    const comicsToRefresh =
        isSelectMode && selectedComicsIds.length > 0 ? selectedComicsIds : items.map((m) => m.id);

    let refreshLabel = translate('UpdateAll');

    if (selectedComicsIds.length > 0) {
        refreshLabel = translate('UpdateSelected');
    }
    else if (selectedFilterKey !== 'all') {
        refreshLabel = translate('UpdateFiltered');
    }

    const onPress = useCallback(() => {
        /*
        dispatch(
            executeCommand({
                name: REFRESH_COMICS,
                comicsIds: comicsToRefresh,
            }),
        );*/
    }, [dispatch, comicsToRefresh]);

    return (
        <PageToolbarButton
            label={refreshLabel}
            isSpinning={isRefreshing}
            isDisabled={!totalItems}
            iconName={icons.REFRESH}
            onPress={onPress}
        />
    );
}

export default ComicsIndexRefreshComicsButton;
