import { describe, test, expect } from 'vitest';
import { ENDPOINTS } from '../src/constants.ts';

describe('constants.js', () => {
  describe('ENDPOINTS', () => {
    test('should return an object with constants', () => {
      expect(Object.keys(ENDPOINTS).length).toEqual(3);
    });
  });
});
