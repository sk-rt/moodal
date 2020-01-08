import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import { eslint } from 'rollup-plugin-eslint';
import json from 'rollup-plugin-json';
import { version } from './package.json';
import replace from '@rollup/plugin-replace';

export default {
    input: './src/ts/index.ts',
    output: [
        {
            file: './lib/standalone/moodal.js',
            format: 'iife',
            name: 'Moodal',
            compact: true,
            exports: 'named'
        },
        {
            file: './lib/cjs/index.js',
            format: 'cjs',
            exports: 'named'
        },
        {
            file: './lib/esm/index.mjs',
            format: 'esm'
        }
    ],
    plugins: [
        eslint({
            fix: true
        }),
        typescript({
            useTsconfigDeclarationDir: true
        }),
        replace({
            __VERSION__: version
        }),
        commonjs(),
        json()
    ]
};
