const noop = () => {};

class JSONDate {
  // return a string like "2000-12-17T02:24:00.000Z"
  static now() {
    const date = new Date();
    // local time adjustment
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    const jsonDate = date.toJSON(); // UTC 
    return jsonDate;
  }

  // Given "2000-12-17T02:24:00.000Z" return "2000-12-17"
  static getDate(jsonDate) {
    return jsonDate.substring(0, 10);
  }

  // Given "2000-12-17T02:24:00.000Z" return "02:24:00"
  static getTime(jsonDate) {
    return jsonDate.substring(11, 19);
  }
}

class Counter {
  /*
  * Given the array [ 1, 2, 1, 3 ]
  * it returns { '1': 2, '2': 1, '3': 1 }
  */
  static count(array) {
    return array.reduce((map, el) => {
      map[el] = map[el] ? (map[el] + 1) : 1;
      return map;
    }, {});
  }
}

class DateCounter extends Counter {
  static count(array) {
    return Counter.count(array.map(jsonDate => JSONDate.getDate(jsonDate)));
  }
}

class Logger {
  constructor(storage, id = 'log') {
    this.storage = storage;
    this.id = id;
  }

  getLogs() {
    const array = this.storage.getItem(this.id);
    return array && JSON.parse(array) || [];
  }

  log(value, onUpdated = noop) {
    const logs = this.getLogs();
    logs.unshift(value); // prepend the value
    this.storage.setItem(this.id, JSON.stringify(logs));
    onUpdated();
  }
}

export { 
  JSONDate, 
  Counter, 
  DateCounter, 
  Logger 
}; 