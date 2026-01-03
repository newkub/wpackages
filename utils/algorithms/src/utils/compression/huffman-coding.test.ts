import { describe, it, expect } from 'vitest';
import { huffmanCoding } from './huffman-coding';

describe('huffmanCoding', () => {
  it('should correctly encode a simple string', () => {
    const text = 'BCAADDDCCACACAC';
    const result = huffmanCoding(text);
    expect(result).not.toBeNull();
    expect(result!.codes).toEqual({ A: '10', B: '111', C: '0', D: '110' });
    expect(result!.encodedString).toBe('1110101011011011000100100');
  });

  it('should handle a string with a single character', () => {
    const text = 'aaaaa';
    const result = huffmanCoding(text);
    expect(result).not.toBeNull();
    expect(result!.codes).toEqual({ a: '0' });
    expect(result!.encodedString).toBe('00000');
  });

  it('should handle an empty string', () => {
    const text = '';
    const result = huffmanCoding(text);
    expect(result).toEqual({ codes: {}, encodedString: '' });
  });

  it('should handle a string with all unique characters', () => {
    const text = 'abcdefg';
    const result = huffmanCoding(text);
    expect(result).not.toBeNull();
    // The exact codes can vary, but let's check the structure
    expect(Object.keys(result!.codes).length).toBe(7);
    expect(result!.encodedString.length).toBeGreaterThan(7);
  });
});
