import {strict as assert} from 'assert';
import { JSONDate, Counter, DateCounter, Logger } from '../src/lib.js';
import localStorage from './localStorage.js';

describe('JSONDate', function() {
  describe('Date.prototype.toJSON()', function() {
    it('should return a string representation of the Date object', function() {
      const event = new Date(1995, 11, 17, 3, 24, 0);
      const jsonDate = event.toJSON();
      assert.equal(jsonDate, "1995-12-17T02:24:00.000Z");
    });
  });

  describe('now', function() {
    it('should return a jsonDate string', function() {
      assert.ok(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(JSONDate.now()));
    });
  });

  describe('getDate', function() {
    it('should return the yyyy-mm-dd part of the jsonDate string', function() {
      assert.ok(/9999-99-99/.test(JSONDate.getDate("9999-99-99")));
      assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(JSONDate.getDate("1995-12-17T02:24:00.000Z")));
      assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(JSONDate.getDate("2000-01-02T12:02:00.000Z")));
      assert.ok(/1995-12-17/.test(JSONDate.getDate("1995-12-17T02:24:00.000Z")));
      assert.ok(/2000-01-02/.test(JSONDate.getDate("2000-01-02T12:02:00.000Z")));
    });
  });

  describe('getTime', function() {
    it('should return the hh:mm:ss part of the jsonDate string', function() {
      assert.ok(/00:00:00/.test(JSONDate.getTime("9999-99-99X00:00:00.XXXXX")));
      assert.ok(/^\d{2}:\d{2}:\d{2}$/.test(JSONDate.getTime("1995-12-17T02:24:00.000Z")));
      assert.ok(/^\d{2}:\d{2}:\d{2}$/.test(JSONDate.getTime("2000-01-02T12:02:00.000Z")));
      assert.ok(/02:24:00/.test(JSONDate.getTime("1995-12-17T02:24:00.000Z")));
      assert.ok(/12:02:00/.test(JSONDate.getTime("2000-01-02T12:02:00.000Z")));
    });
  });
});

describe('Counter', function() {
  describe('count', function() {
    it('should count the frequency of each element (number)', function() {
      const array = [1, 2, 1, 3];
      const freq = Counter.count(array);
      assert.equal(freq[1], 2);
      assert.equal(freq[2], 1);
      assert.equal(freq[3], 1);
      assert.equal(freq[4], undefined);
    });

    it('should count the frequency of each element (string)', function() {
      const array = ['1', '2', '1', '3'];
      const freq = Counter.count(array);
      assert.equal(freq[1], 2);
      assert.equal(freq[2], 1);
      assert.equal(freq[3], 1);
      assert.equal(freq[4], undefined);
    });
  });
});

describe('DateCounter', function() {
  describe('count', function() {
    it('should count the frequency of each date string (yyyy-mm-dd)', function() {
      const array = ['2001-01-01', '1995-01-10', '1991-10-02', '1995-01-10'];
      const freq = Counter.count(array);
      assert.equal(freq['2001-01-01'], 1);
      assert.equal(freq['1995-01-10'], 2);
      assert.equal(freq['1991-10-02'], 1);
      assert.equal(freq['1990-10-02'], undefined);
    });

    it('should count the frequency of each JSONDate string (0000-00-00T00:00:00.000Z)', function() {
      const array = [
        '2001-01-01T02:24:00.000Z', 
        '1995-01-10T02:24:00.000Z', 
        '1991-10-02T02:24:00.000Z', 
        '1995-01-10T13:00:12.000Z'
      ];
      const freq = DateCounter.count(array);
      assert.equal(freq['2001-01-01'], 1);
      assert.equal(freq['1995-01-10'], 2);
      assert.equal(freq['1991-10-02'], 1);
      assert.equal(freq['1990-10-02'], undefined);
    });
  });
});

describe('Logger', function() {
  describe('log', function() {
    it('should add one element to the beginning of an array', function() {
      const logger = new Logger(localStorage);
      // inserting 1
      logger.log(1);
      assert.deepEqual(logger.getLogs(), [1]);
      // inserting 2
      logger.log(2);
      assert.deepEqual(logger.getLogs(), [2, 1]);
    });
  });
});

/*
describe('', function() {
  it('should ', function() {

  });
});
*/