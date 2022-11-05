const { orderByHigherCost, getTotalExpenses, getOderDateByIndex } = require('../src/transformer');

const data = [
  {
    price: 1,
    submission_date: '2020-01-01 00:00:00',
    restaurant: {
      id: 1,
      name: 'name',
    },
  },
  {
    price: 2,
    submission_date: '2020-01-02 00:00:00',
    restaurant: {
      id: 2,
      name: 'othername',
    },
  },
  {
    price: 4,
    submission_date: '2020-01-03 00:00:00',
    restaurant: {
      id: 1,
      name: 'name',
    },
  },
];

describe('transformer.js', () => {
  describe('orderByHigherCost', () => {
    test('should return an array of objects from another object', () => {
      const ordered = orderByHigherCost(data);
      expect(ordered).toEqual([
        { id: 1, restaurant: 'name', orders: 2, price: 5 },
        { id: 2, restaurant: 'othername', orders: 1, price: 2 },
      ]);
    });
  });

  describe('getTotalExpenses', () => {
    test('should return the sum of all price attributes in an object', () => {
      const sum = getTotalExpenses(data);
      expect(sum).toEqual('7.00');
    });
  });

  describe('getOderDateByIndex', () => {
    test('should return the date attribute for a given index from an object', () => {
      const date = getOderDateByIndex(data, 0);
      expect(date).toEqual('2020-01-01');
    });
  });
});
