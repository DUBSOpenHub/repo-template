function createFixture(overrides = {}) {
  return {
    id: 'test-id-001',
    name: 'Test Item',
    createdAt: '2024-01-15T12:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
    status: 'active',
    metadata: {},
    ...overrides,
  };
}

async function assertThrowsAsync(fn, expectedMessage) {
  let threw = false;
  try {
    await fn();
  } catch (err) {
    threw = true;
    if (expectedMessage && !err.message.includes(expectedMessage)) {
      throw new Error(`Expected error containing "${expectedMessage}", got "${err.message}"`);
    }
  }
  if (!threw) {
    throw new Error(`Expected function to throw${expectedMessage ? ` with "${expectedMessage}"` : ''}, but it did not`);
  }
}

function createMockLogger() {
  return {
    calls: { info: [], warn: [], error: [], debug: [] },
    info(...args) { this.calls.info.push(args); },
    warn(...args) { this.calls.warn.push(args); },
    error(...args) { this.calls.error.push(args); },
    debug(...args) { this.calls.debug.push(args); },
    reset() { this.calls = { info: [], warn: [], error: [], debug: [] }; },
  };
}

function createMockResponse(status, body, headers = {}) {
  return {
    status,
    statusText: status >= 400 ? 'Error' : 'OK',
    headers: new Map(Object.entries(headers)),
    json: async () => body,
    text: async () => JSON.stringify(body),
    ok: status >= 200 && status < 300,
  };
}

function createFixtureList(count, template = {}) {
  return Array.from({ length: count }, (_, i) => ({
    ...createFixture(template),
    id: `test-id-${String(i + 1).padStart(3, '0')}`,
    name: `Test Item ${i + 1}`,
  }));
}

module.exports = {
  createFixture,
  assertThrowsAsync,
  createMockLogger,
  createMockResponse,
  createFixtureList,
};
