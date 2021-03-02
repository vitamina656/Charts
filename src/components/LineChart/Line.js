import React, { Component } from "react";
import Chart from "chart.js";
import moment from "moment";
import styles from "./Line.module.css";

class Line extends Component {
  chartRef = React.createRef();

  componentDidMount() {
    this.initialChart();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.data.startDate !== this.props.data.startDate) {
      this.initialChart();
    }
  }
  initialChart() {
    const ctx = this.chartRef.current.getContext("2d");

    const setGradientColor = (canvas, color,i) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 320);

      gradient.addColorStop(0.6, color);
      gradient.addColorStop(1, this.props.gradient[i]);

      return gradient;
    };

    const getChartData = (canvas) => {
      const data = this.props.data;

      if (data.datasets) {
        let colors = this.props.colors;
        data.datasets.forEach((set, i) => {
          set.backgroundColor = setGradientColor(canvas, colors[i],i);

          set.borderColor = colors[i];

          set.borderWidth = 0.5;

          set.pointHoverBackgroundColor = colors[i];
          set.radius = 0.5;
          set.pointStyle = "cross";
        });
        let originalLineDraw = Chart.controllers.line.prototype.draw;
        Chart.helpers.extend(Chart.controllers.line.prototype, {
          draw: function () {
            originalLineDraw.apply(this, arguments);

            ////tooltipFormat/////
            if (this.chart.options.scales.xAxes[0].time.unit === "month") {
              this.chart.options.scales.xAxes[0].time.tooltipFormat = "MMM'YY";
              this.chart.options.scales.xAxes[0].ticks.maxTicksLimit = 12;
            } else {
              this.chart.options.scales.xAxes[0].time.tooltipFormat =
                "DD'MMM  hA";
            }
          },
        });
      }

      /////////////////////////////////////

      return data;
    };
    let myChart = this.props.id;
    if (window[myChart] !== undefined) window[myChart].destroy();
    window[myChart] = new Chart(ctx, {
      type: "line",
      options: {
        responsive: true,
        hover: {
          mode: "nearest",

          intersect: false,
          animationDuration: 100,
          onHover: function (e, item) {
            if (item.length) {
              let x = item[0]._model.x;
              let y = item[0]._model.y;
              let bottomY = item[0]._yScale.bottom;
              let leftX = item[0]._xScale.left;

              ctx.save();

              ctx.beginPath();
              ctx.moveTo(x, y - 100);
              ctx.lineTo(x, bottomY);
              ctx.moveTo(x + 30, y);
              ctx.lineTo(leftX, y);
              ctx.globalAlpha = 0.6;
              ctx.lineWidth = 1;
              ctx.strokeStyle = item[0]._options.hoverBackgroundColor;
              ctx.stroke();

              ctx.beginPath();
              ctx.arc(x, y, 6, 0, 2 * Math.PI);
              ctx.lineWidth = 1;
              ctx.strokeStyle = item[0]._options.hoverBackgroundColor;
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(x, y, 3, 0, 2 * Math.PI);
              ctx.lineWidth = 1;
              ctx.strokeStyle = item[0]._options.hoverBackgroundColor;
              ctx.stroke();
              ctx.restore();
            }
          },
        },
        legend: {
          display: this.props.legend,
          labels: {
            fontColor: "#fff",
            padding: 30,
          },
        },

        title: {
          display: true,
          text: this.props.title,
          fontColor: "#fff",
          fontSize: 20,
          position: "top",
          padding: 0,
        },

        scales: {
          xAxes: [
            {
              type: "time",

              time: {
                unit: this.props.unit,

                displayFormats: {
                  year: "MMM'YY",
                  month: "MMM'YY",
                  week: "ddd'DD",
                  day: "DD'MMM",
                  hour: "DD' hA",
                },
              },
              parser: function (date) {
                return moment(date).utcOffset("+0100");
              },

              ticks: {
                beginAtZero: true,
                fontColor: "#fff",
                min: this.props.start,
                max: this.props.maxDate,

                padding: 20,
                labelOffset: 2,
              },

              gridLines: {
                drawOnChartArea: false,
                drawTicks: false,

                color: "#fff",
              },
            },
          ],
          yAxes: [
            {
              type: "linear",

              stacked: true,
              gridLines: {
                display: false,
              },
              ticks: {
                beginAtZero: true,
                min: 0,
                stepSize: this.props.stepSize,
                fontColor: "#fff",

                padding: 20,
              },
              gridLines: {
                drawOnChartArea: false,
                drawTicks: false,

                color: "#fff",
              },
            },
          ],
        },

        layout: {
          padding: {
            left: 10,
            right: 0,
            top: 50,
            bottom: 0,
          },
        },
        tooltips: {
          intersect: false,
          displayColors: false,
          callbacks: {
            title: function (tooltipItem, data) {
              return tooltipItem[0].value + ",0";
            },
            label: function (tooltipItem) {
              return tooltipItem.xLabel;
            },
          },
          backgroundColor: "transparent",
          titleFontSize: 15,
        },
      },
      data: getChartData(),
    });
  }
  render() {
    return (
      <div className={styles.ChartLine}>
        <canvas id={"mycanvas"} ref={this.chartRef}></canvas>
      </div>
    );
  }
}
export default Line;
