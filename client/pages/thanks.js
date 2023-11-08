import { useEffect, useState } from 'react';
import axios from 'axios';
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import NavBar from '../components/NavBar';

import styles from '../styles/Thanks.module.css';

import {Reenie_Beanie} from 'next/font/google';
const reenieBeanie = Reenie_Beanie({
  weight: '400',
  subsets: ['latin']
})

import {Rubik} from 'next/font/google';
const rubik = Rubik({
  weight: '400',
  subsets: ['latin']
})

const rubikBold = Rubik({
  weight: '600',
  subsets: ['latin']
})

import {IoIosAddCircle} from 'react-icons/io';
import {IoIosCloseCircleOutline} from 'react-icons/io';

export default function Thanks() {
  const [formOpen, setFormOpen] = useState(false);
  const [formSubmit, setFormSubmit] = useState(false);
  const [entries, setEntries] = useState([]);

  const baseUrl = "https://tmklb.onrender.com/api/events/thanks";
  // const baseUrl = "http://localhost:3001/api/events/thanks";

  const rows = [];
  (entries).map((data, index) => {
    rows.push(<div key={index} className={`${styles.item}`}>
      <div className={`${styles.name} ${rubikBold.className}`}>{data.name}</div>
      <div className={`${styles.text}`}>
        <p>
          {data.entry}
        </p>
      </div>
    </div>);
  });

  useEffect(() => {
    function setup() {
      async function getData() {
        axios.get(baseUrl + '/entries')
          .then((data) => {
            setEntries(data.data.entries || []);
          });
      }
      getData();
    }
    setup();
  }, []);

  return (
    <div>
      <NavBar thanks={true} />
      <div className={`${styles.container} ${rubik.className}`}>
        <div className={`${styles.header} ${reenieBeanie.className}`}>
          ThanksMKLB
        </div>
        <div className={`${styles.links}`}>
          <div>Thanks?</div>
        </div>
        <div className={`${styles.header_small} ${rubikBold.className}`}>
          Food & Drinks
        </div>
        <div className={`${styles.dishes} ${formOpen ? styles.hide : ''}`}>
          {
            rows.map((item, index) => {
              return <div>{item}</div>
            })
          }
        </div>

        <div className={`${styles.form} ${!formOpen ? styles.hide : ''}`}>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!formSubmit) {
              const form = e.target;
              const formData = new FormData(form);
              const formJson = Object.fromEntries(formData.entries());
              if (!formJson.name.trim()) {
                toast.error('Enter your name', {
                  position: "bottom-center",
                  autoClose: 3000,
                  hideProgressBar: true,
                  draggable: false,
                  pauseOnHover: false,
                  pauseOnFocusLoss: false
                });
              } else if (!formJson.entry.trim()) {
                toast.error('Enter a food and/or beverage', {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    draggable: false,
                    pauseOnHover: false,
                    pauseOnFocusLoss: false
                });
              } else {
                const loadToast = toast.loading("Submitting", {
                  position: "bottom-center",
                  autoClose: 3000,
                  hideProgressBar: true,
                  draggable: false,
                  pauseOnHover: false,
                  pauseOnFocusLoss: false
                });

                axios.post(baseUrl + '/submit', formJson)
                  .then((data) => {
                    console.log(data);
                    const status = data.data.status;
                    if (status === 'success') {
                      toast.update(loadToast, { render: 'Submitted!', type: "success", isLoading: false, autoClose: 5000 });
                      setFormSubmit(true);
                      setFormOpen(false);
                      const tmp = [...entries];
                      tmp.push({name: data.data.name, entry: data.data.entry});
                      setEntries(tmp);
                    } else if (status === 'invalid' || status === 'exception') {
                      toast.update(loadToast, { render: 'Error occurred!', type: "error", isLoading: false, autoClose: 5000 });
                    }
                  });
              }
              console.log(formJson);
            }
          }}>
            <label htmlFor="name">What is your name?</label>
            <input type="text" id="name" name="name"/>
            <p><label htmlFor="entry">What food and/or beverage will you bring?</label></p>
            <textarea id="entry" name="entry" rows="6" cols="50"></textarea>
            <div className={styles.submit}>
              <button type="submit" className={`${styles.submit_btn} ${formSubmit ? styles.disabled : ''} ${rubik.className}`}>
                Submit
              </button>
            </div>
          </form>
        </div>
        <IoIosAddCircle className={`${styles.add} ${formOpen ? styles.hide : ''}`} onClick={() => {
          setFormOpen(true);
        }} />
        <IoIosCloseCircleOutline className={`${styles.add} ${!formOpen ? styles.hide : ''}`} onClick={() => {
          setFormOpen(false);
        }} />
      </div>
      <ToastContainer />
    </div>
  );
}
