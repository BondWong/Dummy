const _ = require('lodash');

const initData = [
  {
    id: 1,
    firstName: 'Joe',
    lastName: 'Johnson'
  }, {
    id: 2,
    firstName: 'Jake',
    lastName: 'Brandon'
  }, {
    id: 3,
    firstName: 'Amy',
    lastName: 'Elena'
  }, {
    id: 4,
    firstName: 'Muller',
    lastName: 'Milo'
  }
];

const doctors = {};

_.map(initData, data => {
  doctors[data.id] = data;
});

function getAllDoctors() {
  return doctors;
}

module.exports = {
  getAllDoctors
};
