// import { useSelector } from 'react-redux';
// import { createSelector } from 'reselect';
// import AppState from 'App/State/AppState';
import themes from 'Styles/Themes';

/*
function createThemeSelector() {
    return createSelector(
        (state: AppState) => state.settings.ui.item.theme || window.Sonarr.theme,
        (theme) => {
            return theme;
        },
    );
}
*/

const useTheme = (): keyof typeof themes => {
    return 'dark'; // useSelector(createThemeSelector());
};

export default useTheme;

export const useThemeColor = (color: string) => {
    const theme = useTheme();
    const themeVariables = themes[theme];

    return themeVariables[color as keyof typeof themeVariables];
};
