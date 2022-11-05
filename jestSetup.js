const path = require('path');

require('dotenv').config({ path: path.resolve(`${__dirname}/.test.env`) });

jest.mock('./src/service', () => ({
  getOrdersFromEfoodAsync: jest.fn(),
}));
