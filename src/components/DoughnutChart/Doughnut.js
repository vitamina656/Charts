import React, { Component } from "react";
import Chart from "chart.js";
import styles from "./Doughnut.module.css";

class Doughnut extends Component {
  chartRef = React.createRef();

  componentDidMount() {
    this.initialChart();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.initialChart();
    }
  }
  initialChart() {
    const ctx = this.chartRef.current.getContext("2d");

    let originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
    Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
      draw: function () {
        originalDoughnutDraw.apply(this, arguments);

        let chart = this.chart.chart;
        let ctx = chart.ctx;
        let width = chart.width;
        let height = chart.height;
        chart.config.data.radius = "100%";
        chart.config.data.innerRadius = "80%";

        ctx.textAlign = "center";

        ctx.font = 40 + "px Verdana";
        ctx.imageSmoothingEnabled = false;
        ctx.lineWidth = 2;

        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";

        let meta = this.chart.getDatasetMeta(0);
        let text = 0;

        this.chart.config.data.datasets[0].data.map((item, index) => {
          let hide = meta.data[index].hidden;
          if (hide === true) {
            return;
          } else {
            return (text = text + item);
          }
        });

        ctx.fillText(text, width / 2 - 70, height / 2 + 25);
      },
    });

    let myChart = this.props.id;
    if (window[myChart] !== undefined) window[myChart].destroy();
    window[myChart] = new Chart(ctx, {
      type: "doughnut",
      data: this.props.data,
      options: {
        cutoutPercentage: 70,
        responsive: true,

        elements: {
          arc: {
            borderWidth: 0,
          },
        },
        title: {
          display: true,
          text: this.props.title,
          position: "top",
          fontColor: "#fff",
          horizontalAlign: "right",
          fontSize: 20,
        },
        legend: {
          display: true,
          onClick: function (e, legendItem) {
            Chart.defaults.doughnut.legend.onClick.call(this, e, legendItem);
          },

          position: "right",
          align: "center",
          fullWidth: false,
          legendHitBoxes: {
            left: 0,
          },
          labels: {
            fontColor: "#fff",
            fontSize: 14,
            padding: 30,
            boxWidth: 4,
            boxHeight: 15,
          },
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return data["datasets"][0]["data"][tooltipItem["index"]];
            },
          },
          backgroundColor: "rgba(29, 62, 78,1)",
        },
      },
    });
  }
  render() {
    return (
      <div className={styles.DoughnutChart}>
        <canvas id="mycanvas" ref={this.chartRef}></canvas>
      </div>
    );
  }
}
export default Doughnut;
