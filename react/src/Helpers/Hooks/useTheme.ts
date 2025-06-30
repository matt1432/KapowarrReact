import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';
import themes from 'Styles/Themes';

function createThemeSelector() {
    return createSelector(
        (state: AppState) => state.settings.ui.item.theme || window.Kapowarr.theme,
        (theme) => {
            return theme;
        },
    );
}

const useTheme = (): keyof typeof themes => {
    return useSelector(createThemeSelector());
};

export default useTheme;

export const useThemeColor = (color: string): string => {
    const theme = useTheme();
    const themeVariables = themes[theme];

    // @ts-expect-error TODO:
    return themeVariables[color];
};
