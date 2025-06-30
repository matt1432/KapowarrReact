import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import themes from 'Styles/Themes';

function createThemeSelector() {
    return createSelector(
        () => window.Kapowarr.theme,
        (theme) => {
            return theme;
        },
    );
}

const useTheme = (): keyof typeof themes => {
    return useSelector(createThemeSelector());
};

export default useTheme;

export const useThemeColor = (color: keyof typeof themes.dark): string => {
    const theme = useTheme();
    const themeVariables = themes[theme];

    return themeVariables[color];
};
