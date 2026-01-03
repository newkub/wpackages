import { createBuilder } from './src';

const isWatchMode = process.argv.includes('--watch');

createBuilder({
  config: {
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    target: 'bun',
  },
  watch: isWatchMode,
});
