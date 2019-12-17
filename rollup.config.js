import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "./src/ts/index.ts",
  output: [
    {
      file: "./dist/standalone/index.js",
      format: "iife",
      name: "Layrs"
    },
    {
      file: "./dist/cjs/index.js",
      format: "cjs"
    },
    {
      file: "./dist/esm/index.mjs",
      format: "esm"
    }
  ],
  plugins: [typescript(), commonjs()]
};
