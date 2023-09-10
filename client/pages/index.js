import { useEffect, useState } from 'react';
import axios from 'axios';

import Table from '../components/Table';
import DatePicker from '../components/DatePicker';
import Loader from '../components/Loader';

import styles from '../styles/Bank.module.css';

export default function Home() {
  const [total, setTotal] = useState('');
  const [payees, setPayees] = useState([]);
  const [loadPayees, setLoadPayees] = useState(false);

  const baseUrl = "https://tmklb.onrender.com/api/users/payments";
  // const baseUrl = "http://localhost:3001/api/users/payments";

  const convertDate = function(date) {
    return date.getFullYear() * 1e4 + (date.getMonth() + 1) * 100 + date.getDate() + '';
  }

  useEffect(() => {
    function setup() {
      async function getData() {
        
        axios.get(baseUrl + '/total')
          .then((data) => {
            setTotal('$' + data.data.total);
          });
      }
      getData();
    }
    setup();
  }, []);

  return (
    <div className={styles.container}>
      <Loader hide={total !== ''}/>
      <div className={styles.total + ' ' + (total === '' ? styles.hide : '')}>
        {total}
      </div>
      <DatePicker onMonthSelected={async (month, year) => {

        const firstDate = convertDate(new Date(year, month, 1));
        const lastDate = convertDate(new Date(year, month + 1, 0));

        setPayees([]);
        setLoadPayees(true);

        axios.get(baseUrl + `?firstDate=${firstDate}&lastDate=${lastDate}`)
        .then((data) => {
          const p = [];
          if (data.data.payees) {
            data.data.payees.forEach(item => {
              const date = item.date + '';
              const _year = date.substring(0, 4);
              const _month = date.substring(4, 6);
              const _day = date.substring(6);
              p.push([item.name, `$${item.amount.toFixed(2)}`, new Date(_year, _month - 1, _day).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })]);
            });
          }
          setPayees(p);
          setLoadPayees(false);
        });
      }} />
      <Table 
        data={{
          headers: ['Name', 'Amount', 'Date'], 
          rows: payees
        }}
      />
      <Loader hide={!loadPayees}/>
    </div>
  );
}
