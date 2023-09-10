import { useState, useEffect } from 'react';

import styles from "../styles/DatePicker.module.css";

export default function DatePicker(props) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = new Date();

  let currMonth = -1;

  const state = {};
  months.forEach((month, index) => {
    const thisMonth = months[date.getMonth()];
    const active = thisMonth == month ? styles.active : '';
    state[index] = active;
    if (active) {
      currMonth = index;
    }
  });

  const [year, setYear] = useState(date.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(currMonth);
  const [selected, setSelected] = useState(state);

  function selectMonth(index) {
    if (index !== currentMonth) {
      setSelected((prevState) => {
        const newState = Object.assign({}, prevState);
        newState[index] = styles.active;
        newState[currentMonth] = '';
        return newState;
      });
      setCurrentMonth(index);
    }
    if (props.onMonthSelected) {
      props.onMonthSelected(index, year);
    }
  }

  useEffect(() => {
    function setup() {
      async function getData() {
        if (props.onMonthSelected) {
          props.onMonthSelected(date.getMonth(), date.getFullYear());
        }
      }
      getData();
    }
    setup();
  }, []);

  return (
    <div className={styles.container}>
      <div id="datepicker" className={styles.months_box + ' ' + styles.content}>
        <div className={styles.header}>
          {/* <i class="ph-bold ph-caret-left"></i> */}
          <span>{year}</span>
          {/* <i class="ph-bold ph-caret-right"></i> */}
        </div>
        <div className={styles.main_months + ' ' + styles.main}>
          {months.map((month, index) => {
            return <div key={index} className={selected[index]} onClick={() => selectMonth(index)}>{month}</div>
            // return <div key={index} className={newArr[index]} onClick={() => selectMonth(index)}>{month}</div>
          })}
        </div>
      </div>
    </div>
  );
}
