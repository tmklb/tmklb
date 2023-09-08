import { db } from './firebase-config.js';
import { collection, addDoc, getCountFromServer } from 'firebase/firestore';
import { google } from "googleapis";
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

/**
 * Configure databaser update scheduler
 */
const auth = await google.auth.getClient({
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const sheets = google.sheets({ version: "v4", auth });

const scheduler = new ToadScheduler();
const task = new AsyncTask(
  "simple-task",
  () => {
    const coll = collection(db, "payments");
    return getCountFromServer(coll)
      .then((snapshot) => {
        const count = snapshot.data().count;
        console.log(`Payments: ${count}`);
        return sheets.spreadsheets.values.get({
          spreadsheetId: process.env.GOOGLE_SHEETS_ID,
          range: `Sheet1!A${count + 2}:C`, // ignore header, and get next row
        })
      })
      .then((res) => {
        // populate data into the database
        const values = res.data.values || [];

        const add = function(data) {
          return new Promise(function(resolve) {
            addDoc(collection(db, 'payments'), data)
             .then(resolve);
          });
        };

        (function loop(i) {
          if (i < values.length) {
            const date = new Date(values[i][2]);
            add({
              name: values[i][0], 
              amount: parseFloat((values[i][1]).replace('$', '')), 
              date: date.getFullYear() * 1e4 + (date.getMonth() + 1) * 100 + date.getDate()
            })
            .then(() => {
              loop(i + 1);
            })
          }
        })(0);
      })
  },
  (err) => {
    console.error(err);
  }
);

const job = new SimpleIntervalJob({ hours: 1, runImmediately: true}, task, {
  id: 'id_1',
  preventOverrun: true
});

export {scheduler, job};