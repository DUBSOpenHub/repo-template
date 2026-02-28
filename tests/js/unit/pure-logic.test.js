/**
 * Unit Test Template — Pure Logic
 *
 * Tests in this file validate pure functions with no side effects.
 * Every test is independent and deterministic.
 *
 * Replace 'YourModule' and example functions with your actual code.
 */

const { createFixture, createFixtureList } = require('../helpers');

// ─── Replace with your actual module import ───
// const { add, multiply, formatName } = require('../../../src/your-module');

// Example pure functions to demonstrate test patterns
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const formatName = (first, last) => {
  if (!first && !last) return '';
  if (!first) return last.trim();
  if (!last) return first.trim();
  return `${first.trim()} ${last.trim()}`;
};
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ─── Unit Tests ───

describe('Unit: Arithmetic', () => {
  it('should add two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should add negative numbers', () => {
    expect(add(-1, -1)).toBe(-2);
  });

  it('should add zero', () => {
    expect(add(0, 5)).toBe(5);
  });

  it('should multiply two numbers', () => {
    expect(multiply(3, 4)).toBe(12);
  });

  it('should multiply by zero', () => {
    expect(multiply(5, 0)).toBe(0);
  });
});

describe('Unit: formatName', () => {
  it('should format first and last name', () => {
    expect(formatName('John', 'Doe')).toBe('John Doe');
  });

  it('should handle first name only', () => {
    expect(formatName('John', null)).toBe('John');
  });

  it('should handle last name only', () => {
    expect(formatName(null, 'Doe')).toBe('Doe');
  });

  it('should return empty string when both are null', () => {
    expect(formatName(null, null)).toBe('');
  });

  it('should trim whitespace', () => {
    expect(formatName('  John  ', '  Doe  ')).toBe('John Doe');
  });
});

describe('Unit: clamp', () => {
  it('should return value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('should clamp to minimum', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('should clamp to maximum', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('should handle equal min and max', () => {
    expect(clamp(5, 3, 3)).toBe(3);
  });
});

describe('Unit: slugify', () => {
  it('should convert to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should replace special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
  });

  it('should handle multiple spaces', () => {
    expect(slugify('hello   world')).toBe('hello-world');
  });

  it('should strip leading and trailing hyphens', () => {
    expect(slugify('  hello world  ')).toBe('hello-world');
  });
});

describe('Unit: Table-driven tests', () => {
  const addCases = [
    [0, 0, 0],
    [1, 1, 2],
    [-1, 1, 0],
    [100, 200, 300],
    [Number.MAX_SAFE_INTEGER, 0, Number.MAX_SAFE_INTEGER],
  ];

  test.each(addCases)(
    'add(%i, %i) should equal %i',
    (a, b, expected) => {
      expect(add(a, b)).toBe(expected);
    }
  );
});
