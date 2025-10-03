// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Dimensions {
    width: number;
    height: number;
    isExtraSmallScreen: boolean;
    isSmallScreen: boolean;
    isMediumScreen: boolean;
    isLargeScreen: boolean;
}

export type ScrollPositionKey = keyof AppState['scrollPositions'];

export type ScrollPayload = PayloadAction<{
    name: ScrollPositionKey;
    value: number;
}>;

export interface AppState {
    dimensions: Dimensions;
    isSidebarVisible: boolean;
    isHandlingBreakingChange: boolean;

    scrollPositions: {
        volumeIndex: number;
    };
}

// IMPLEMENTATIONS

function getDimensions(width: number, height: number): Dimensions {
    const dimensions: Dimensions = {
        width,
        height,
        isExtraSmallScreen: width <= 480,
        isSmallScreen: width <= 768,
        isMediumScreen: width <= 992,
        isLargeScreen: width <= 1200,
    };

    return dimensions;
}

const initialState = {
    dimensions: getDimensions(window.innerWidth, window.innerHeight),
    isSidebarVisible: !getDimensions(window.innerWidth, window.innerHeight)
        .isSmallScreen,
    isHandlingBreakingChange: false,

    scrollPositions: {
        volumeIndex: 0,
    },
} satisfies AppState as AppState;

const AppSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        saveDimensions(
            state,
            {
                payload: value,
            }: PayloadAction<Pick<Dimensions, 'width' | 'height'>>,
        ) {
            const { width, height } = value;

            state.dimensions = getDimensions(width, height);
        },

        setIsSidebarVisible(state, { payload: value }: PayloadAction<boolean>) {
            state.isSidebarVisible = value;
        },

        setIsHandlingBreakingChange(
            state,
            { payload: value }: PayloadAction<boolean>,
        ) {
            state.isHandlingBreakingChange = value;
        },

        setScrollPosition(state, { payload: { name, value } }: ScrollPayload) {
            state.scrollPositions[name] = value;
        },
    },
});

export const {
    saveDimensions,
    setIsSidebarVisible,
    setIsHandlingBreakingChange,
    setScrollPosition,
} = AppSlice.actions;

export default AppSlice;
