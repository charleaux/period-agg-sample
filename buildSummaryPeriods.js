const moment = require('moment');

module.exports = (start, end, unit) => {
  const formatString = 'YYYY-MM-DD';
  const unitOfTime = unit === 'half' ? 'quarter' : unit;
  const dateStart = moment.utc(start, formatString);
  const dateEnd = moment.utc(end, formatString);
  let summaryPeriods = [];

  if (!dateStart.isValid() || !dateEnd.isValid()) {
    return undefined;
  }
  if (unit !== 'half') {
    for (
      let d = dateStart.clone();
      d
        .clone()
        .startOf(unitOfTime)
        .isSameOrBefore(dateEnd);
      d.add(1, unitOfTime)
    ) {
      const startDate = d
        .clone()
        .startOf(unitOfTime)
        .format(formatString);
      const endDate = d
        .clone()
        .endOf(unitOfTime)
        .format(formatString);

      let summaryPeriod = {
        startDate,
        endDate
      };

      if (
        !summaryPeriods.some(
          p =>
            p.startDate === summaryPeriod.startDate &&
            p.endDate === summaryPeriod.endDate
        )
      ) {
        summaryPeriods.push(summaryPeriod);
      }
    }
  } else {
    summaryPeriods = [];
    const numberOfYears = dateEnd.get('year') - dateStart.get('year') + 1;
    const years = [];
    if (numberOfYears === 1) {
      years.push(dateStart.get('year'));
    }
    if (numberOfYears > 1) {
      for (let i = dateStart.get('year'); i <= dateEnd.get('year'); i += 1) {
        years.push(i);
      }
    }
    for (let year of years) {
      const firstHalfStart = moment.utc(`${year}-01-01`, 'YYYY-MM-DD');
      const firstHalfEnd = moment.utc(`${year}-06-30`, 'YYYY-MM-DD');
      const secondHalfStart = moment.utc(`${year}-07-01`, 'YYYY-MM-DD');
      const secondHalfEnd = moment.utc(`${year}-12-31`, 'YYYY-MM-DD');
      if (dateStart.isBefore(firstHalfEnd)) {
        summaryPeriods.push({
          startDate: firstHalfStart.format(),
          endDate: firstHalfEnd.format()
        });
      }

      if (dateEnd.isAfter(secondHalfStart)) {
        summaryPeriods.push({
          startDate: secondHalfStart.format(),
          endDate: secondHalfEnd.format()
        });
      }
    }
  }

  return summaryPeriods;
};
