import autoprefixer from 'autoprefixer';
// @ts-expect-error no types
import postcssColorFunction from 'postcss-color-function';
// @ts-expect-error no types
import postcssMixins from 'postcss-mixins';
import postcssNested from 'postcss-nested';
import postcssSimpleVars from 'postcss-simple-vars';

// @ts-expect-error no types
import cssDimensions from './src/Styles/Variables/dimensions';
// @ts-expect-error no types
import cssFonts from './src/Styles/Variables/fonts';
// @ts-expect-error no types
import cssAnimations from './src/Styles/Variables/animations';
// @ts-expect-error no types
import cssZIndexes from './src/Styles/Variables/zIndexes';

export default {
    plugins: [
        autoprefixer,

        postcssColorFunction,

        postcssMixins({
            mixinsDir: './src/Styles/Mixins',
        }),

        postcssNested,

        postcssSimpleVars({
            variables: [cssDimensions, cssFonts, cssAnimations, cssZIndexes].reduce((acc, vars) => {
                return Object.assign(acc, vars);
            }, {}),
        }),
    ],
};
