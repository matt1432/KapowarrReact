import autoprefixer from 'autoprefixer';
// @ts-expect-error no types
import postcssColorModFunction from 'postcss-color-mod-function';
import postcssMixins from 'postcss-mixins';
import postcssNested from 'postcss-nested';
import postcssSimpleVars from 'postcss-simple-vars';

import cssDimensions from './src/Styles/Variables/dimensions';
import cssFonts from './src/Styles/Variables/fonts';
import cssAnimations from './src/Styles/Variables/animations';
import cssZIndexes from './src/Styles/Variables/zIndexes';

export default {
    plugins: [
        autoprefixer,

        postcssColorModFunction(),

        postcssMixins({
            mixinsDir: './src/Styles/Mixins',
        }),

        postcssNested,

        postcssSimpleVars({
            variables: [
                cssDimensions,
                cssFonts,
                cssAnimations,
                cssZIndexes,
            ].reduce((acc, vars) => {
                return Object.assign(acc, vars);
            }, {}),
        }),
    ],
};
