import ora, { oraPromise } from 'ora';
import type { LoaderOptions } from './types';

export class Loader {
  private instance: ora.Ora;

  constructor(options: LoaderOptions | string = {}) {
    this.instance = ora(options);
  }

  static promise<T>(action: Promise<T>, options: LoaderOptions | string): Promise<T> {
    return oraPromise(action, options);
  }

  get text(): string {
    return this.instance.text;
  }

  set text(newText: string) {
    this.instance.text = newText;
  }

  start(text?: string) {
    this.instance.start(text);
    return this;
  }

  stop() {
    this.instance.stop();
    return this;
  }

  succeed(text?: string) {
    this.instance.succeed(text);
    return this;
  }

  fail(text?: string) {
    this.instance.fail(text);
    return this;
  }

  warn(text?: string) {
    this.instance.warn(text);
    return this;
  }

  info(text?: string) {
    this.instance.info(text);
    return this;
  }
}
