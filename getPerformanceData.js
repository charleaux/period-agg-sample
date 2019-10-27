const uuidv4 = require('uuid/v4');
const buildSummaryPeriods = require('./buildSummaryPeriods');

module.exports = (start, end) => {
  const performanceData = [];
  const measure = { id: uuidv4(), name: 'CT Miami' };
  const periods = buildSummaryPeriods(start, end, 'month');
  for (const period of periods) {
    performanceData.push({ id: uuidv4(), measure, period, actual: 1 });
  }
  return performanceData;
};
