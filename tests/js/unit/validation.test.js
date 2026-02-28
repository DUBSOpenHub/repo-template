/**
 * Unit Test Template — Validation Logic
 *
 * Tests for input validation, schema checking, and guard clauses.
 */

// ─── Example validators ───

const isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str || '');
const isInRange = (n, min, max) => typeof n === 'number' && !isNaN(n) && n >= min && n <= max;
const isNonEmptyString = (s) => typeof s === 'string' && s.trim().length > 0;
const validateConfig = (config) => {
  const errors = [];
  if (!config) { errors.push('Config is required'); return { valid: false, errors }; }
  if (!isNonEmptyString(config.name)) errors.push('name is required');
  if (!isInRange(config.port, 1, 65535)) errors.push('port must be between 1 and 65535');
  if (config.retries !== undefined && !isInRange(config.retries, 0, 10)) {
    errors.push('retries must be between 0 and 10');
  }
  return { valid: errors.length === 0, errors };
};

// ─── Tests ───

describe('Unit: isEmail', () => {
  const validEmails = ['user@example.com', 'a@b.co', 'test+tag@domain.org'];
  const invalidEmails = ['', 'not-an-email', '@missing.com', 'no@', null, undefined];

  test.each(validEmails)('should accept valid email: %s', (email) => {
    expect(isEmail(email)).toBe(true);
  });

  test.each(invalidEmails)('should reject invalid email: %s', (email) => {
    expect(isEmail(email)).toBe(false);
  });
});

describe('Unit: isInRange', () => {
  it('should accept value within range', () => {
    expect(isInRange(5, 1, 10)).toBe(true);
  });

  it('should accept boundary values (inclusive)', () => {
    expect(isInRange(1, 1, 10)).toBe(true);
    expect(isInRange(10, 1, 10)).toBe(true);
  });

  it('should reject value below range', () => {
    expect(isInRange(0, 1, 10)).toBe(false);
  });

  it('should reject value above range', () => {
    expect(isInRange(11, 1, 10)).toBe(false);
  });

  it('should reject NaN', () => {
    expect(isInRange(NaN, 1, 10)).toBe(false);
  });

  it('should reject non-number types', () => {
    expect(isInRange('5', 1, 10)).toBe(false);
    expect(isInRange(null, 1, 10)).toBe(false);
  });
});

describe('Unit: validateConfig', () => {
  it('should accept valid config', () => {
    const result = validateConfig({ name: 'myapp', port: 3000 });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject null config', () => {
    const result = validateConfig(null);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Config is required');
  });

  it('should reject empty name', () => {
    const result = validateConfig({ name: '', port: 3000 });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('name is required');
  });

  it('should reject whitespace-only name', () => {
    const result = validateConfig({ name: '   ', port: 3000 });
    expect(result.valid).toBe(false);
  });

  it('should reject port out of range', () => {
    const result = validateConfig({ name: 'app', port: 0 });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('port must be between 1 and 65535');
  });

  it('should reject port above max', () => {
    const result = validateConfig({ name: 'app', port: 70000 });
    expect(result.valid).toBe(false);
  });

  it('should accept optional retries within range', () => {
    const result = validateConfig({ name: 'app', port: 3000, retries: 3 });
    expect(result.valid).toBe(true);
  });

  it('should reject retries out of range', () => {
    const result = validateConfig({ name: 'app', port: 3000, retries: 99 });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('retries must be between 0 and 10');
  });

  it('should accumulate multiple errors', () => {
    const result = validateConfig({ name: '', port: -1, retries: 99 });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });
});
