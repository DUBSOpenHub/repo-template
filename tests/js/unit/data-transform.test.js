/**
 * Unit Test Template — Data Transformation
 *
 * Tests for functions that transform data structures:
 * filtering, mapping, sorting, aggregating, reshaping.
 */

const { createFixture, createFixtureList } = require('../helpers');

// ─── Example transformation functions ───

const filterActive = (items) => items.filter((item) => item.status === 'active');
const groupBy = (items, key) => {
  return items.reduce((groups, item) => {
    const val = item[key];
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});
};
const pluck = (items, key) => items.map((item) => item[key]);
const unique = (arr) => [...new Set(arr)];
const sortByField = (items, field, order = 'asc') => {
  return [...items].sort((a, b) => {
    if (order === 'asc') return a[field] > b[field] ? 1 : -1;
    return a[field] < b[field] ? 1 : -1;
  });
};

// ─── Tests ───

describe('Unit: filterActive', () => {
  it('should return only active items', () => {
    const items = [
      createFixture({ id: '1', status: 'active' }),
      createFixture({ id: '2', status: 'inactive' }),
      createFixture({ id: '3', status: 'active' }),
    ];
    const result = filterActive(items);
    expect(result).toHaveLength(2);
    expect(result.every((i) => i.status === 'active')).toBe(true);
  });

  it('should return empty array when no active items', () => {
    const items = [createFixture({ status: 'inactive' })];
    expect(filterActive(items)).toEqual([]);
  });

  it('should return empty array for empty input', () => {
    expect(filterActive([])).toEqual([]);
  });
});

describe('Unit: groupBy', () => {
  it('should group items by a key', () => {
    const items = [
      { type: 'a', value: 1 },
      { type: 'b', value: 2 },
      { type: 'a', value: 3 },
    ];
    const groups = groupBy(items, 'type');
    expect(Object.keys(groups)).toEqual(['a', 'b']);
    expect(groups['a']).toHaveLength(2);
    expect(groups['b']).toHaveLength(1);
  });

  it('should handle single item', () => {
    const groups = groupBy([{ type: 'a' }], 'type');
    expect(groups).toEqual({ a: [{ type: 'a' }] });
  });

  it('should handle empty array', () => {
    expect(groupBy([], 'type')).toEqual({});
  });
});

describe('Unit: pluck', () => {
  it('should extract values for a key', () => {
    const items = [{ name: 'a' }, { name: 'b' }, { name: 'c' }];
    expect(pluck(items, 'name')).toEqual(['a', 'b', 'c']);
  });

  it('should return undefined for missing keys', () => {
    const items = [{ name: 'a' }, { other: 'b' }];
    expect(pluck(items, 'name')).toEqual(['a', undefined]);
  });
});

describe('Unit: unique', () => {
  it('should deduplicate values', () => {
    expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
  });

  it('should handle empty array', () => {
    expect(unique([])).toEqual([]);
  });

  it('should handle all unique values', () => {
    expect(unique([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('should handle strings', () => {
    expect(unique(['a', 'b', 'a'])).toEqual(['a', 'b']);
  });
});

describe('Unit: sortByField', () => {
  const items = [
    { name: 'Charlie', age: 30 },
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 35 },
  ];

  it('should sort ascending by default', () => {
    const sorted = sortByField(items, 'name');
    expect(pluck(sorted, 'name')).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('should sort descending when specified', () => {
    const sorted = sortByField(items, 'age', 'desc');
    expect(pluck(sorted, 'age')).toEqual([35, 30, 25]);
  });

  it('should not mutate original array', () => {
    const original = [...items];
    sortByField(items, 'name');
    expect(items).toEqual(original);
  });
});
