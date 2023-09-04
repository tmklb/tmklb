import Chart from 'chart.js/auto'
import axios from 'axios';

const convertDate = function(d) {
  return d.getFullYear() * 1e4 + (d.getMonth() + 1) * 100 + d.getDate() + '';
}

//const baseURL = "http://localhost:3001/api/users/payments";
const baseURL = "https://tmklb.onrender.com/api/users/payments"

const currentDate = new Date();
// const firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
// const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
const firstDate = new Date(2023, 7, 1);
const lastDate = new Date(2023, 8, 0);

const fd = convertDate(firstDate);
const ld = convertDate(lastDate);

async function getData() {
  const res = await axios.get(baseURL + `?firstDate=${fd}&lastDate=${ld}`);
  return res.data;
}

getData().then((data) => {
  const total = data.total;
  console.log(total);

  const events = (total * 0.4).toFixed(2);
  const investments = (total * 0.3).toFixed(2);
  const emergency = (total * 0.2).toFixed(2);
  const donations = (total * 0.1).toFixed(2);

  const payments = [events, investments, emergency, donations];
  console.log(payments);

  createChart(payments);
});

async function createChart(payments) {
    const data = {
        labels: [
          'Events - 40%',
          'Investments - 30%',
          'Emergency - 20%',
          'Donations - 10%'
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

  new Chart(
    document.getElementById('bank'),
    {
        type: 'doughnut',
        data: data,
    }
  );
};
