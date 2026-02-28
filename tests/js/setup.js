const FROZEN_TIME = new Date('2024-01-15T12:00:00.000Z');

beforeEach(() => {
  jest.useFakeTimers({ now: FROZEN_TIME });
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

process.on('unhandledRejection', (reason) => {
  throw new Error(`Unhandled rejection in test: ${reason}`);
});
