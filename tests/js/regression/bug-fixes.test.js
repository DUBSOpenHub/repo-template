/**
 * Regression Test Template
 *
 * Each test documents a specific bug that was found and fixed.
 * Format: describe block names the bug, test proves the fix holds.
 */

// ─── Example functions with historical bugs ───

const parseVersion = (versionStr) => {
  if (!versionStr || typeof versionStr !== 'string') return null;
  const match = versionStr.match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
};

const mergeDefaults = (userConfig, defaults) => {
  const result = { ...defaults };
  for (const [key, value] of Object.entries(userConfig || {})) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
};

const buildUrl = (base, path, params = {}) => {
  let url = base.replace(/\/+$/, '');
  if (path) url += '/' + path.replace(/^\/+/, '');
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  if (qs) url += '?' + qs;
  return url;
};

// ─── Regression Tests ───

describe('Regression: parseVersion with leading "v"', () => {
  // Bug: parseVersion("v1.2.3") returned null — regex missed "v" prefix
  // Fixed in: #142

  it('should parse version without v prefix', () => {
    expect(parseVersion('1.2.3')).toEqual({ major: 1, minor: 2, patch: 3 });
  });

  it('should parse version WITH v prefix (the regression)', () => {
    expect(parseVersion('v1.2.3')).toEqual({ major: 1, minor: 2, patch: 3 });
  });

  it('should reject invalid formats', () => {
    expect(parseVersion('1.2')).toBeNull();
    expect(parseVersion('v1.2')).toBeNull();
    expect(parseVersion('abc')).toBeNull();
  });
});

describe('Regression: mergeDefaults preserving explicit falsy values', () => {
  // Bug: mergeDefaults({retries: 0}, {retries: 3}) returned {retries: 3}
  //      because `if (value)` was used instead of `if (value !== undefined)`
  // Fixed in: #187

  it('should preserve explicit zero values (the regression)', () => {
    const result = mergeDefaults({ retries: 0 }, { retries: 3 });
    expect(result.retries).toBe(0);
  });

  it('should preserve explicit false values', () => {
    const result = mergeDefaults({ verbose: false }, { verbose: true });
    expect(result.verbose).toBe(false);
  });

  it('should preserve explicit empty string', () => {
    const result = mergeDefaults({ prefix: '' }, { prefix: 'default' });
    expect(result.prefix).toBe('');
  });

  it('should use default when value is undefined', () => {
    const result = mergeDefaults({ retries: undefined }, { retries: 3 });
    expect(result.retries).toBe(3);
  });

  it('should use default when key is missing', () => {
    const result = mergeDefaults({}, { retries: 3 });
    expect(result.retries).toBe(3);
  });
});

describe('Regression: buildUrl double-slash between base and path', () => {
  // Bug: buildUrl("https://api.example.com/", "/users") produced double slash
  // Fixed in: #203

  it('should handle trailing slash on base + leading slash on path', () => {
    expect(buildUrl('https://api.example.com/', '/users')).toBe(
      'https://api.example.com/users'
    );
  });

  it('should handle no slashes between base and path', () => {
    expect(buildUrl('https://api.example.com', 'users')).toBe(
      'https://api.example.com/users'
    );
  });

  it('should handle multiple trailing slashes on base', () => {
    expect(buildUrl('https://api.example.com///', '/users')).toBe(
      'https://api.example.com/users'
    );
  });

  it('should include query params', () => {
    expect(buildUrl('https://api.example.com', 'users', { page: 1 })).toBe(
      'https://api.example.com/users?page=1'
    );
  });

  it('should exclude null/undefined params', () => {
    expect(
      buildUrl('https://api.example.com', 'users', { page: 1, q: null, sort: undefined })
    ).toBe('https://api.example.com/users?page=1');
  });

  it('should encode special characters in params', () => {
    expect(
      buildUrl('https://api.example.com', 'search', { q: 'hello world' })
    ).toBe('https://api.example.com/search?q=hello%20world');
  });
});
