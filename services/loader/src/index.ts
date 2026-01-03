import { Loader } from './loader';
import type { LoaderOptions } from './types';

export * from './loader';
export * from './types';

const loader = (options?: LoaderOptions | string) => {
  return new Loader(options);
};

loader.promise = Loader.promise;

export default loader;

