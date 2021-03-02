import React from "react";
import styles from "./SelectChartStart.module.css"

export default function SelectChartStart(props) {
  return (
    
      <select className={styles.chartSelect} value={props.value} onChange={props.onChange}>
        <option value="standart">Shose limitation</option>
        <option value="day">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="monthLast">Last Month</option>
        <option value="year">This Year</option>
        <option value="yearLast">Last Year</option>
      </select>
 
  );
}
