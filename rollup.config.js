import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: './src/ts/index.ts',
    output: [
        {
            file: './lib/standalone/layrs.js',
            format: 'iife',
            name: 'Layrs',
            compact: true
        },
        {
            file: './lib/cjs/index.js',
            format: 'cjs'
        },
        {
            file: './lib/esm/index.mjs',
            format: 'esm'
        }
    ],
    plugins: [
        typescript({
            useTsconfigDeclarationDir: true
        }),
        commonjs()
    ]
};
