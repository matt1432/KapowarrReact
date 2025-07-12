import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Dimensions {
    width: number;
    height: number;
    isExtraSmallScreen: boolean;
    isSmallScreen: boolean;
    isMediumScreen: boolean;
    isLargeScreen: boolean;
}

interface AppState {
    dimensions: Dimensions;
    isSidebarVisible: boolean;
}

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
    isSidebarVisible: !getDimensions(window.innerWidth, window.innerHeight).isSmallScreen,
} satisfies AppState as AppState;

const appSlice = createSlice({
    name: 'app',
    initialState,
    selectors: {
        selectDimensions: (state) => state.dimensions,
        selectIsSidebarVisible: (state) => state.isSidebarVisible,
    },
    reducers: {
        saveDimensions(state, { payload }: PayloadAction<Pick<Dimensions, 'width' | 'height'>>) {
            const { width, height } = payload;

            state.dimensions = getDimensions(width, height);
        },

        setIsSidebarVisible(state, { payload }: PayloadAction<boolean>) {
            state.isSidebarVisible = payload;
        },
    },
});

export const { selectDimensions, selectIsSidebarVisible } = appSlice.selectors;
export const { saveDimensions, setIsSidebarVisible } = appSlice.actions;
export default appSlice;
