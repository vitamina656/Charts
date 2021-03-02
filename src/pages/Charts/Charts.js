import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import SelectChartStart from "../../components/SelectChartStart/SelectChartStart";
import Line from "../../components/LineChart/Line";
import Doughnut from "../../components/DoughnutChart/Doughnut";
import { getAllChartData, getDougChartData } from "./functionsCharts";
import styles from "./Charts.module.css";

function Charts() {
  const [ordersSubscData, setOrdersSubscData] = useState([]);
  const [visitorsData, setVisitorsData] = useState([]);
  const [dougChartData, setDougChartData] = useState();
  const [daySelect, setSelectDay] = useState([]);
  const [optionState, setOptionState] = useState([]);
  const [cheCked, setChecked] = useState();

  useEffect(() => {
    initialData();
  }, []);

  function initialData() {
    axios({
      method: "get",
      url: "dates.json",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((result) => {
        ///////////////visitors chart data/////////////////////////////
        let visitors = getAllChartData(result.data.visitors);
        let today = new Date("2021-03-01 00:00:00"); ////just for test, change to new Date()
        setVisitorsData({
          legend: false,
          startDate: visitors.startDay,
          standartStart: visitors.startDay,
          maxDate: new Date(moment(today)),
          datasets: [
            {
              data: visitors.uniqMonths,
            },
          ],
        });
        ///////////////orders chart data/////////////////////////////
        let orders = getAllChartData(result.data.orders);

        ///////////////subscriptions chart data/////////////////////////////
        let subscriptions = getAllChartData(result.data.subscriptions);
        let OrdersSubscStartDay = new Date(
          Math.min.apply(null, [orders.startDay, subscriptions.startDay])
        );

        /////multi chart///////
        setOrdersSubscData({
          legend: true,
          startDate: OrdersSubscStartDay,
          standartStart: OrdersSubscStartDay,
          maxDate: new Date(moment(today)),
          datasets: [
            {
              label: "Subscriptions",
              data: subscriptions.uniqMonths,
            },
            {
              label: "Orders",
              data: orders.uniqMonths,
            },
          ],
        });

        setChecked("standart");

        setDougChartData({
          data: {
            labels: ["Visitors", "Orders", "Subscriptions"],
            datasets: [
              {
                data: [
                  getDougChartData(visitors.uniqMonths),
                  getDougChartData(orders.uniqMonths),
                  getDougChartData(subscriptions.uniqMonths),
                ],

                backgroundColor: ["cyan", "#80c342", "#d1d859"],
                hoverBackgroundColor: ["cyan", "#80c342", "#d1d859"],
              },
            ],
          },
        });

        setOptionState({
          visitors: {
            allDays: [...visitors.allDays],
            dataDays: [...visitors.uniqDates],
            dataMonth: [...visitors.uniqMonths],
            dataHour: [...visitors.uniqHours],
          },
          orders: {
            allDays: [...orders.allDays],
            dataDays: [...orders.uniqDates],
            dataMonth: [...orders.uniqMonths],
            dataHour: [...orders.uniqHours],
          },
          subscriptions: {
            allDays: [...subscriptions.allDays],
            dataDays: [...subscriptions.uniqDates],
            dataMonth: [...subscriptions.uniqMonths],
            dataHour: [...subscriptions.uniqHours],
          },
        });
      })
      .catch(function (error) {
        console.error(error);
      });

    let today = new Date("2021-02-17 00:00:00"); // fixed just for testing, use new Date();
    let thisMonth = new Date(moment(today).startOf("month")); // fixed just for testing, use new moment();
    let lastMonth = new Date(
      moment(today).subtract(1, "months").startOf("month")
    );

    let thisWeek = new Date(moment(today).startOf("isoweek"));
    let thisYear = new Date(moment(today).startOf("year"));

    let lastYear = new Date(moment(today).subtract(1, "year").startOf("year"));

    setSelectDay({
      unit: "month",
      today: new Date(moment(today).startOf("day")),
      thisWeek: thisWeek,
      thisMonth: thisMonth,
      lastMonth: lastMonth,
      thisYear: thisYear,
      lastYear: lastYear,
    });
  }
  const newStartDay = (checked) => {
    function getNewDays(selectedDay,maxDay) {
     
      let newDays = [];
      return (newDays = {
        newDaysVisitors: optionState.visitors.allDays.filter(
          (item) => item.x >= selectedDay && item.x<=maxDay
        ),

        newDaysOrders: optionState.orders.allDays.filter(
          (item) => item.x >= selectedDay && item.x<=maxDay
        ),
        newDaysSubscriptions: optionState.subscriptions.allDays.filter(
          (item) => item.x >= selectedDay && item.x<=maxDay
        ),
      });
    };
    // function getNewData(name,selectedDay,maxDay) {
    //   console.log(name);
    //   let newDays = [];
    //   return [name].filter(
    //       (item) => item.x >= selectedDay && item.x<=maxDay
    //     )
      
    // }
    if (checked === "day") {
      setSelectDay({
        ...daySelect,
        unit: "hour",
      });

      let newDays = getNewDays(daySelect.today,new Date(moment(daySelect.today).endOf("day")));

      setVisitorsData({
        ...visitorsData,
        startDate: daySelect.today,
        maxDate: new Date(moment(daySelect.today).endOf("day")),
        datasets: [
          {
            data: optionState.visitors.dataHour,
          },
        ],
      });
      setOrdersSubscData({
        ...ordersSubscData,
        startDate: daySelect.today,

        maxDate: new Date(moment(daySelect.today).endOf("day")),

        datasets: [
          {
            label: "Subscriptions",
            data: optionState.subscriptions.dataHour,
          },
          {
            label: "Orders",
            data: optionState.orders.dataHour,
          },
        ],
      });

      setDougChartData({
        data: {
          labels: ["Visitors", "Orders", "Subscriptions"],
          datasets: [
            {
              data: [
                getDougChartData(newDays.newDaysVisitors),
                getDougChartData(newDays.newDaysOrders),

                getDougChartData(newDays.newDaysSubscriptions),
              ],
              backgroundColor: ["cyan", "#80c342", "#d1d859"],
              hoverBackgroundColor: ["cyan", "#80c342", "#d1d859"],
            },
          ],
        },
      });
    } else if (checked === "week") {
      setSelectDay({
        ...daySelect,
        unit: "day",
      });
      let newDays = getNewDays(daySelect.thisWeek,new Date(moment(daySelect.today).endOf("isoweek")));

      setVisitorsData({
        ...visitorsData,
        startDate: daySelect.thisWeek,
        maxDate: new Date(moment(daySelect.today).endOf("isoweek")),
        datasets: [
          {
            data: optionState.visitors.dataDays,
          },
        ],
      });
      setOrdersSubscData({
        ...ordersSubscData,
        startDate: daySelect.thisWeek,
        maxDate: new Date(moment(daySelect.today).endOf("isoweek")),

        datasets: [
          {
            label: "Subscriptions",
            data: optionState.subscriptions.dataDays,
          },
          {
            label: "Orders",
            data: optionState.orders.dataDays,
          },
        ],
      });

      setDougChartData({
        data: {
          labels: ["Visitors", "Orders", "Subscriptions"],
          datasets: [
            {
              data: [
                getDougChartData(newDays.newDaysVisitors),
                getDougChartData(newDays.newDaysOrders),

                getDougChartData(newDays.newDaysSubscriptions),
              ],
              backgroundColor: ["cyan", "#80c342", "#d1d859"],
              hoverBackgroundColor: ["cyan", "#80c342", "#d1d859"],
            },
          ],
        },
      });
    } else if (checked === "month") {
      setSelectDay({
        ...daySelect,
        unit: "day",
      });

      let newDays = getNewDays(daySelect.thisMonth, new Date(moment(daySelect.today).endOf("month")));

      setVisitorsData({
        ...visitorsData,
        startDate: daySelect.thisMonth,
        maxDate: new Date(moment(daySelect.today).endOf("month")),
        datasets: [
          {
            data: optionState.visitors.dataDays,
          },
        ],
      });
      setOrdersSubscData({
        ...ordersSubscData,
        startDate: daySelect.thisMonth,
        maxDate: new Date(moment(daySelect.today).endOf("month")),

        datasets: [
          {
            label: "Subscriptions",
            data: optionState.subscriptions.dataDays,
          },
          {
            label: "Orders",
            data: optionState.orders.dataDays,
          },
        ],
      });

      setDougChartData({
        data: {
          labels: ["Visitors", "Orders", "Subscriptions"],
          datasets: [
            {
              data: [
                getDougChartData(newDays.newDaysVisitors),
                getDougChartData(newDays.newDaysOrders),

                getDougChartData(newDays.newDaysSubscriptions),
              ],
              backgroundColor: ["cyan", "#80c342", "#d1d859"],
              hoverBackgroundColor: ["cyan", "#80c342", "#d1d859"],
            },
          ],
        },
      });
    } else if (checked === "monthLast") {
      setSelectDay({
        ...daySelect,
        unit: "day",
      });

      let newDays = getNewDays(daySelect.lastMonth,new Date( moment(daySelect.today).subtract(1, "months").endOf("month")));

      setVisitorsData({
        ...visitorsData,
        startDate: daySelect.lastMonth,
        maxDate: new Date( moment(daySelect.today).subtract(1, "months").endOf("month")),
        datasets: [
          {
            data: optionState.visitors.dataDays,
          },
        ],
      });
      setOrdersSubscData({
        ...ordersSubscData,
        startDate: daySelect.lastMonth,
        maxDate: new Date(
          moment(daySelect.today).subtract(1, "months").endOf("month")
        ),

        datasets: [
          {
            label: "Subscriptions",
            data: optionState.subscriptions.dataDays,
          },
          {
            label: "Orders",
            data: optionState.orders.dataDays,
          },
        ],
      });

      setDougChartData({
        data: {
          labels: ["Visitors", "Orders", "Subscriptions"],
          datasets: [
            {
              data: [
                getDougChartData(newDays.newDaysVisitors),
                getDougChartData(newDays.newDaysOrders),

                getDougChartData(newDays.newDaysSubscriptions),
              ],
              backgroundColor: ["cyan", "#80c342", "#d1d859"],
              hoverBackgroundColor: ["cyan", "#80c342", "#d1d859"],
            },
          ],
        },
      });
    } else if (checked === "year") {
      setSelectDay({
        ...daySelect,
        unit: "month",
      });

      let newDays = getNewDays(daySelect.thisYear,new Date(moment(daySelect.today).add(1, "M")));

      setVisitorsData({
        ...visitorsData,
        startDate: daySelect.thisYear,
        maxDate: new Date(moment(daySelect.today).add(1, "M")),
        datasets: [
          {
            data: optionState.visitors.dataMonth,
          },
        ],
      });
      setOrdersSubscData({
        ...ordersSubscData,
        startDate: daySelect.thisYear,
        maxDate: new Date(moment(daySelect.today).add(1, "M")),

        datasets: [
          {
            label: "Subscriptions",
            data: optionState.subscriptions.dataMonth,
          },
          {
            label: "Orders",
            data: optionState.orders.dataMonth,
          },
        ],
      });

      setDougChartData({
        data: {
          labels: ["Visitors", "Orders", "Subscriptions"],
          datasets: [
            {
              data: [
                getDougChartData(newDays.newDaysVisitors),
                getDougChartData(newDays.newDaysOrders),

                getDougChartData(newDays.newDaysSubscriptions),
              ],
              backgroundColor: ["cyan", "#80c342", "#d1d859"],
              hoverBackgroundColor: ["cyan", "#80c342", "#d1d859"],
            },
          ],
        },
      });
    } else if (checked === "yearLast") {
      setSelectDay({
        ...daySelect,
        unit: "month",
      });

      let newDays = getNewDays(daySelect.lastYear,new Date(moment(daySelect.lastYear).endOf("year")));

      setVisitorsData({
        ...visitorsData,
        startDate: daySelect.lastYear,

        maxDate: new Date(moment(daySelect.lastYear).endOf("year")),
        datasets: [
          {
            data: optionState.visitors.dataMonth,
          },
        ],
      });
      setOrdersSubscData({
        ...ordersSubscData,
        startDate: daySelect.lastYear,

        maxDate: new Date(moment(daySelect.lastYear).endOf("year")),

        datasets: [
          {
            label: "Subscriptions",
            data: optionState.subscriptions.dataMonth,
          },
          {
            label: "Orders",
            data: optionState.orders.dataMonth,
          },
        ],
      });

      setDougChartData({
        data: {
          labels: ["Visitors", "Orders", "Subscriptions"],
          datasets: [
            {
              data: [
                getDougChartData(newDays.newDaysVisitors),
                getDougChartData(newDays.newDaysOrders),

                getDougChartData(newDays.newDaysSubscriptions),
              ],
              backgroundColor: ["cyan", "#80c342", "#d1d859"],
              hoverBackgroundColor: ["cyan", "#80c342", "#d1d859"],
            },
          ],
        },
      });
    } else if (checked === "standart") {
      setSelectDay({
        ...daySelect,
        unit: "month",
      });

      

      setVisitorsData({
        ...visitorsData,
        startDate: visitorsData.standartStart,
        maxDate: new Date(moment(daySelect.today)),
        datasets: [
          {
            data: optionState.visitors.dataMonth,
          },
        ],
      });
      setOrdersSubscData({
        ...ordersSubscData,
        startDate: ordersSubscData.standartStart,
        maxDate: new Date(moment(daySelect.today)),

        datasets: [
          {
            label: "Subscriptions",
            data: optionState.subscriptions.dataMonth,
          },
          {
            label: "Orders",
            data: optionState.orders.dataMonth,
          },
        ],
      });

      setDougChartData({
        data: {
          labels: ["Visitors", "Orders", "Subscriptions"],
          datasets: [
            {
              data: [
                getDougChartData(optionState.visitors.dataMonth),
                getDougChartData(optionState.orders.dataMonth),

                getDougChartData(optionState.subscriptions.dataMonth),
              ],
              backgroundColor: ["cyan", "#80c342", "#d1d859"],
              hoverBackgroundColor: ["cyan", "#80c342", "#d1d859"],
            },
          ],
        },
      });
    }
  };

  return (
    <div className={styles.wrapperCharts}>
      <div className={styles.optionsChart}>
        <div className={styles.ChartSelect}>
          <SelectChartStart
            value={cheCked}
            onChange={(e) => {
              setChecked(e.target.value);

              newStartDay(e.target.value);
            }}
          />
          <div>Today:{" "}{moment(daySelect.today).format("MMM Do YY")}</div>
        </div>
        
        
      </div>
      <div className={styles.leftChartsColumn}>
        {visitorsData && visitorsData.startDate && (
          <Line
            id="visitors"
            stepSize={3}
            unit={daySelect.unit}
            legend={visitorsData.legend}
            start={new Date(visitorsData.startDate)}
            maxDate={visitorsData.maxDate}
            data={visitorsData}
            title={"Visitors"}
            colors={["rgb(0, 255, 255)"]}
            gradient={["rgba(0, 255, 255,0)"]}
          />
        )}
        {ordersSubscData && ordersSubscData.startDate && (
          <Line
            id="multi"
            stepSize={3}
            unit={daySelect.unit}
            legend={ordersSubscData.legend}
            start={new Date(ordersSubscData.startDate)}
            maxDate={ordersSubscData.maxDate}
            data={ordersSubscData}
            title={"Multi Data"}
            colors={["rgb(209, 216, 89)", "rgb(128, 195, 66)"]}
            gradient={["rgba(209, 216, 89,0)", "rgba(128, 195, 66,0)"]}
          />
        )}
      </div>
      <div className={styles.rightChartsColumn}>
        {dougChartData && (
          <Doughnut
            id="doughnut"
            data={dougChartData.data}
            title="Total Events"
          />
        )}
      </div>
    </div>
  );
}

export default Charts;
