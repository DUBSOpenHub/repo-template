/**
 * Integration Test Template — Component Interaction
 *
 * Tests how modules work together. External dependencies are fully mocked.
 * No real network, database, or filesystem calls.
 */

const { createFixture, createMockResponse, createMockLogger } = require('../helpers');

// ─── Example: Service that depends on a data store and logger ───

class UserService {
  constructor(store, logger) {
    this.store = store;
    this.logger = logger;
  }

  async getUser(id) {
    this.logger.info(`Fetching user ${id}`);
    const user = await this.store.findById(id);
    if (!user) {
      this.logger.warn(`User ${id} not found`);
      return null;
    }
    return user;
  }

  async createUser(data) {
    if (!data.name) throw new Error('Name is required');
    const user = { id: `usr-${Date.now()}`, ...data, createdAt: new Date().toISOString() };
    await this.store.save(user);
    this.logger.info(`Created user ${user.id}`);
    return user;
  }

  async listUsers(filter = {}) {
    const users = await this.store.findAll(filter);
    this.logger.info(`Listed ${users.length} users`);
    return users;
  }
}

// ─── Tests ───

describe('Integration: UserService', () => {
  let service;
  let mockStore;
  let mockLogger;

  beforeEach(() => {
    mockStore = {
      findById: jest.fn(),
      findAll: jest.fn().mockResolvedValue([]),
      save: jest.fn().mockResolvedValue(undefined),
    };
    mockLogger = createMockLogger();
    service = new UserService(mockStore, mockLogger);
  });

  describe('getUser', () => {
    it('should return user when found', async () => {
      const user = createFixture({ id: 'usr-1', name: 'Alice' });
      mockStore.findById.mockResolvedValue(user);

      const result = await service.getUser('usr-1');

      expect(result).toEqual(user);
      expect(mockStore.findById).toHaveBeenCalledWith('usr-1');
      expect(mockLogger.calls.info).toHaveLength(1);
    });

    it('should return null and log warning when user not found', async () => {
      mockStore.findById.mockResolvedValue(null);

      const result = await service.getUser('nonexistent');

      expect(result).toBeNull();
      expect(mockLogger.calls.warn).toHaveLength(1);
    });

    it('should propagate store errors', async () => {
      mockStore.findById.mockRejectedValue(new Error('DB connection failed'));

      await expect(service.getUser('usr-1')).rejects.toThrow('DB connection failed');
    });
  });

  describe('createUser', () => {
    it('should create and persist a user', async () => {
      const result = await service.createUser({ name: 'Bob', email: 'bob@test.com' });

      expect(result.name).toBe('Bob');
      expect(result.email).toBe('bob@test.com');
      expect(result.id).toBeDefined();
      expect(mockStore.save).toHaveBeenCalledTimes(1);
    });

    it('should throw when name is missing', async () => {
      await expect(service.createUser({ email: 'no-name@test.com' })).rejects.toThrow(
        'Name is required'
      );
      expect(mockStore.save).not.toHaveBeenCalled();
    });
  });

  describe('listUsers', () => {
    it('should return all users from store', async () => {
      const users = [createFixture({ id: '1' }), createFixture({ id: '2' })];
      mockStore.findAll.mockResolvedValue(users);

      const result = await service.listUsers();

      expect(result).toHaveLength(2);
      expect(mockStore.findAll).toHaveBeenCalledWith({});
    });

    it('should pass filter to store', async () => {
      mockStore.findAll.mockResolvedValue([]);
      await service.listUsers({ status: 'active' });

      expect(mockStore.findAll).toHaveBeenCalledWith({ status: 'active' });
    });
  });
});

// ─── Example: API Client Integration ───

describe('Integration: API Client Pattern', () => {
  class ApiClient {
    constructor(httpFn) {
      this.http = httpFn;
    }

    async fetchData(endpoint) {
      const response = await this.http(`/api/${endpoint}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return response.json();
    }
  }

  it('should parse successful response', async () => {
    const mockHttp = jest.fn().mockResolvedValue(
      createMockResponse(200, { data: [1, 2, 3] })
    );
    const client = new ApiClient(mockHttp);

    const result = await client.fetchData('items');

    expect(result).toEqual({ data: [1, 2, 3] });
    expect(mockHttp).toHaveBeenCalledWith('/api/items');
  });

  it('should throw on error response', async () => {
    const mockHttp = jest.fn().mockResolvedValue(createMockResponse(500, {}));
    const client = new ApiClient(mockHttp);

    await expect(client.fetchData('items')).rejects.toThrow('API error: 500');
  });

  it('should throw on network failure', async () => {
    const mockHttp = jest.fn().mockRejectedValue(new Error('Network timeout'));
    const client = new ApiClient(mockHttp);

    await expect(client.fetchData('items')).rejects.toThrow('Network timeout');
  });
});
