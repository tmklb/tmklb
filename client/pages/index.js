import { useEffect, useState } from 'react';
import axios from 'axios';

import Table from '../components/Table';
import DatePicker from '../components/DatePicker';
import Loader from '../components/Loader';

import NavBar from '../components/NavBar';

import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.landing}>
        </div>
      </div>
    </div>
  );
}
