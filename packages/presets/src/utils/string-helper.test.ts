import { expect, test } from 'bun:test';
import { capitalize } from './string-helper';

test('capitalize', () => {
  expect(capitalize('hello')).toBe('Hello');
  expect(capitalize('WORLD')).toBe('WORLD');
  expect(capitalize('')).toBe('');
});
