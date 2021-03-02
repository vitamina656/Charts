import moment from "moment";
export function getAllChartData(data) {
  let datesFullList = [];
  let allMonths = [];
  let allDays = [];
  let allHours = [];
  let startDay = [];
  let chartData = [];
  data.forEach((item) => {
    return (
      (datesFullList = [...datesFullList, { x: new Date(item.date), y: 1 }]),
      (allMonths = [...allMonths, moment(new Date(item.date)).format("M-YY")]),
      (allDays = [...allDays, moment(new Date(item.date)).format("DD-MM-YY")]),
      (allHours = [
        ...allHours,
        moment(new Date(item.date)).format("DD-MM-YY-hA"),
      ]),
      (startDay = [...startDay, new Date(item.date)])
    );
  });

  let uniqMonths = [];
  allMonths.map((item, index) => {
    if (allMonths.indexOf(item) === index) {
      return (uniqMonths = [
        ...uniqMonths,
        { x: datesFullList[index].x, y: 1 },
      ]);
    } else {
      uniqMonths.find((element, i) => {
        let el = moment(new Date(element.x)).format("M-YY");

        if (el === item) {
          return (uniqMonths[i] = {
            x: datesFullList[index].x,
            y: element.y + 1,
          });
        }
      });
    }
  });

  let uniqDates = [];

  allDays.map((item, index) => {
    if (allDays.indexOf(item) === index) {
      return (uniqDates = [...uniqDates, { x: datesFullList[index].x, y: 1 }]);
    } else {
      uniqDates.find((element, i) => {
        let el = moment(new Date(element.x)).format("DD-MM-YY");

        if (el === item) {
          return (uniqDates[i] = {
            x: datesFullList[index].x,
            y: element.y + 1,
          });
        }
      });
    }
  });

  let uniqHours = [];
  allHours.map((item, index) => {
    if (allHours.indexOf(item) === index) {
      return (uniqHours = [...uniqHours, { x: datesFullList[index].x, y: 1 }]);
    } else {
      uniqHours.find((element, i) => {
        let el = moment(new Date(element.x)).format("DD-MM-YY-hA");
        if (el === item) {
          return (uniqHours[i] = {
            x: datesFullList[index].x,
            y: element.y + 1,
          });
        }
      });
    }
  });
  startDay = new Date(Math.min.apply(null, startDay));
  chartData = {
    allDays: [...datesFullList],
    uniqMonths: [...uniqMonths],
    uniqDates: [...uniqDates],
    uniqHours: [...uniqHours],
    startDay: startDay,
  };

  return chartData;
}

export function getDougChartData(itemData) {
  let a = 0;
  itemData.map((item) => {
    return (a = a + item.y);
  });

  return a;
}
