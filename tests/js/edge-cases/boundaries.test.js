/**
 * Edge Case Test Template
 *
 * Tests for boundary conditions, empty inputs, unicode, extreme values,
 * and the weird stuff that breaks production at 3 AM.
 */

// ─── Example functions under test ───

const truncate = (str, maxLen) => {
  if (typeof str !== 'string') return '';
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
};

const safeDivide = (a, b) => {
  if (b === 0) return { ok: false, error: 'division by zero' };
  if (!Number.isFinite(a) || !Number.isFinite(b)) return { ok: false, error: 'invalid input' };
  return { ok: true, value: a / b };
};

const parseKeyValue = (str, delimiter = '=') => {
  if (!str || typeof str !== 'string') return null;
  const idx = str.indexOf(delimiter);
  if (idx === -1) return null;
  return { key: str.slice(0, idx), value: str.slice(idx + 1) };
};

// ─── Edge Case Tests ───

describe('Edge Cases: truncate', () => {
  it('should handle empty string', () => {
    expect(truncate('', 10)).toBe('');
  });

  it('should handle string shorter than max', () => {
    expect(truncate('hi', 10)).toBe('hi');
  });

  it('should handle string exactly at max length', () => {
    expect(truncate('1234567890', 10)).toBe('1234567890');
  });

  it('should truncate string longer than max', () => {
    expect(truncate('12345678901', 10)).toBe('1234567...');
  });

  it('should handle max length of 3 (minimum for ellipsis)', () => {
    expect(truncate('hello', 3)).toBe('...');
  });

  it('should handle null input', () => {
    expect(truncate(null, 10)).toBe('');
  });

  it('should handle undefined input', () => {
    expect(truncate(undefined, 10)).toBe('');
  });

  it('should handle numeric input', () => {
    expect(truncate(12345, 10)).toBe('');
  });

  it('should handle unicode characters', () => {
    expect(truncate('héllo wörld', 8)).toBe('héllo...');
  });

  it('should handle emoji', () => {
    // Emoji are 2 UTF-16 code units in JS, so string.length sees them as 2
    expect(truncate('😀😀😀😀😀', 5)).toBe('😀...');
  });
});

describe('Edge Cases: safeDivide', () => {
  it('should divide normally', () => {
    expect(safeDivide(10, 2)).toEqual({ ok: true, value: 5 });
  });

  it('should handle division by zero', () => {
    expect(safeDivide(10, 0)).toEqual({ ok: false, error: 'division by zero' });
  });

  it('should handle zero divided by number', () => {
    expect(safeDivide(0, 5)).toEqual({ ok: true, value: 0 });
  });

  it('should handle Infinity input', () => {
    expect(safeDivide(Infinity, 2)).toEqual({ ok: false, error: 'invalid input' });
  });

  it('should handle NaN input', () => {
    expect(safeDivide(NaN, 2)).toEqual({ ok: false, error: 'invalid input' });
  });

  it('should handle negative numbers', () => {
    expect(safeDivide(-10, 2)).toEqual({ ok: true, value: -5 });
  });

  it('should handle very small numbers', () => {
    const result = safeDivide(1, Number.MAX_SAFE_INTEGER);
    expect(result.ok).toBe(true);
    expect(result.value).toBeGreaterThan(0);
    expect(result.value).toBeLessThan(1);
  });
});

describe('Edge Cases: parseKeyValue', () => {
  it('should parse simple key=value', () => {
    expect(parseKeyValue('name=Alice')).toEqual({ key: 'name', value: 'Alice' });
  });

  it('should handle value containing delimiter', () => {
    expect(parseKeyValue('eq=a=b=c')).toEqual({ key: 'eq', value: 'a=b=c' });
  });

  it('should handle empty value', () => {
    expect(parseKeyValue('key=')).toEqual({ key: 'key', value: '' });
  });

  it('should handle empty key', () => {
    expect(parseKeyValue('=value')).toEqual({ key: '', value: 'value' });
  });

  it('should return null for no delimiter', () => {
    expect(parseKeyValue('nope')).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(parseKeyValue('')).toBeNull();
  });

  it('should return null for null input', () => {
    expect(parseKeyValue(null)).toBeNull();
  });

  it('should return null for undefined input', () => {
    expect(parseKeyValue(undefined)).toBeNull();
  });

  it('should support custom delimiter', () => {
    expect(parseKeyValue('key:value', ':')).toEqual({ key: 'key', value: 'value' });
  });

  it('should handle whitespace in key and value', () => {
    expect(parseKeyValue('  key  =  value  ')).toEqual({
      key: '  key  ',
      value: '  value  ',
    });
  });
});

describe('Edge Cases: Type Coercion Traps', () => {
  it('should distinguish 0 from false', () => {
    expect(0).not.toBe(false);
    expect(0 === false).toBe(false);
  });

  it('should distinguish empty string from false', () => {
    expect('' === false).toBe(false);
  });

  it('should handle null vs undefined', () => {
    expect(null == undefined).toBe(true);
    expect(null === undefined).toBe(false);
  });

  it('should handle NaN comparisons', () => {
    expect(NaN === NaN).toBe(false);
    expect(Number.isNaN(NaN)).toBe(true);
  });
});
