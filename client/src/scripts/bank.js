import Chart from 'chart.js/auto'
import axios from 'axios';
import { MonthPicker } from 'monthpicker-lite-js';
import 'monthpicker-lite-js/dist/monthpicker-lite-js.css';

const convertDate = function(d) {
  return d.getFullYear() * 1e4 + (d.getMonth() + 1) * 100 + d.getDate() + '';
}

async function getData(firstDate, lastDate) {
  //const baseURL = "http://localhost:3001/api/users/payments";
  const baseURL = "https://tmklb.onrender.com/api/users/payments"
  const res = await axios.get(baseURL + `?firstDate=${firstDate}&lastDate=${lastDate}`);
  return res.data;
}

const chart = new Chart(
  document.getElementById('bank'),
  {
      type: 'doughnut',
      data: {},
  }
);

const monthpicker = new MonthPicker(document.getElementById('calendar'));
monthpicker.setTheme('light');
monthpicker.setCloseOnSelect(true);
monthpicker.addCallback(function() {

  const currentDate = monthpicker.getDate()
  const firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  getData(convertDate(firstDate), convertDate(lastDate)).then((data) => {
    const total = data.total;
    console.log(total);
  
    const events = (total * 0.4).toFixed(2);
    const investments = (total * 0.3).toFixed(2);
    const emergency = (total * 0.2).toFixed(2);
    const donations = (total * 0.1).toFixed(2);
  
    const payments = [events, investments, emergency, donations];
    console.log(payments);
  
    chart.data = {
      labels: [
        'Events',
        'Investments',
        'Emergency',
        'Donations'
      ],
      datasets: [{
        label: 'Bank',
        data: payments,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(150, 150, 205)'
        ],
        hoverOffset: 4
      }]
    };

    chart.update();
  });
});
