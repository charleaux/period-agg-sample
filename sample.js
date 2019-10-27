const moment = require('moment');

const buildSummaryPeriods = require('./buildSummaryPeriods');
const getPerformanceData = require('./getPerformanceData');

const demoStartDate = '2019-02-01';
const demoEndDate = '2020-07-10';
const demoUnitOfTime = 'quarter';
const summaryPeriods = buildSummaryPeriods(
  demoStartDate,
  demoEndDate,
  demoUnitOfTime
);

// console.log({ summaryPeriods });
const performanceData = getPerformanceData(demoStartDate, demoEndDate);
const formatString = 'YYYY-MM-DD';

// console.log(summaryPeriods);
// console.log(performanceData);
const summaryPerformanceData = [];
for (const data of performanceData) {
  // get the summary period that matches this data
  const summaryPeriod = summaryPeriods.find(
    sp =>
      moment
        .utc(sp.startDate, formatString)
        .isSameOrBefore(moment.utc(data.period.startDate)) &&
      moment
        .utc(sp.endDate, formatString)
        .isSameOrAfter(moment.utc(data.period.endDate))
  );
  let obj = {
    ...data,
    period: summaryPeriod,
    id: undefined
  };
  Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
  //   console.log({ obj, data, summaryPeriod, summaryPeriods });
  const foundIndex = summaryPerformanceData.findIndex(
    spd =>
      spd.measure.id === obj.measure.id &&
      spd.period.startDate === obj.period.startDate &&
      spd.period.endDate === obj.period.endDate
  );
  if (foundIndex === -1) {
    summaryPerformanceData.push({ ...obj });
  } else {
    summaryPerformanceData[foundIndex].actual += obj.actual;
  }
}

console.log(summaryPerformanceData);
