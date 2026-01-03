import type { BuildConfig } from 'bun';

export interface BuilderOptions {
  config: Readonly<BuildConfig>;
  watch?: boolean;
}

export async function createBuilder(options: BuilderOptions) {
  const { watch, config } = options;

  const build = async () => {
    console.log('Building...');
    const result = await Bun.build(config);

    if (!result.success) {
      console.error('Build failed:');
      result.logs.forEach(log => console.error(log));
    } else {
      console.log('Build successful!');
    }
  };

  await build();

  if (watch) {
    console.log('Watching for changes...');
    // A more robust watch implementation will be added later.
  }
}