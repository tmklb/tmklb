import { db } from './firebase-config.js';
import { collection, doc, addDoc, writeBatch, getCountFromServer, getDoc } from 'firebase/firestore';
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
          range: `Sheet1!A${count + 2}:C`, // ignore header, get next row
        })
      })
      .catch((err) => {
        
      })
      .then((res) => {
        // populate data into the database
        const values = res.data.values || [];

        const bank = {
          total: 0,
          events: 0,
          investments: 0,
          emergency: 0,
          donations: 0
        }

        const add = function(data) {
          return new Promise(function(resolve, reject) {
            addDoc(collection(db, 'payments'), data)
             .then(resolve, reject);
            resolve();
          });
        };

        const loop = function(i) {
          return new Promise(function(resolve, reject) {
            if (i < values.length) {
              const name = values[i][0];
              const amount = parseFloat((values[i][1]).replace('$', ''));
              const date = new Date(values[i][2]);
              add({
                name: name,
                amount: amount, 
                date: date.getFullYear() * 1e4 + (date.getMonth() + 1) * 100 + date.getDate()
              })
              .then(() => {
                bank.total += amount;
                if (!(name === 'investments' || name === 'emergency' || name === 'donations')) {
                  bank.events += (name === 'events' ? amount : amount * 0.4);
                }
                if (!(name === 'events' || name === 'emergency' || name === 'donations')) {
                  bank.investments += (name === 'investments' ? amount : amount * 0.3);
                }
                if (!(name === 'events' || name === 'investments' || name === 'donations')) {
                  bank.emergency += (name === 'emergency' ? amount : amount * 0.2);
                }
                if (!(name === 'events' || name === 'investments' || name === 'emergency')) {
                  bank.donations += (name === 'donations' ? amount : amount * 0.1);
                }
                console.log(bank);
  
                loop(i + 1)
                  .catch((err) => {
                    console.log(`Error ${i}`);
                    console.log(err);
                    throw new Error('Error during loop')
                  })
                  .then(() => {
                    console.log(`Loop ${i} resolved`);
                    resolve();
                  }, () => {
                    console.log(`Loop ${i} rejected`);
                    reject();
                  });
              }, () => {
                console.log('Add function rejected');
                console.log(`i = ${i}`);
                console.log(bank);
                reject();
              })
            } else {
              resolve();
            }
          });
        };

        loop(0)
          .catch((err) => {
            console.log('Loop completed - Error');
            console.log(err);
          })
          .then(() => {
            console.log('Loop completed - Resolved');
            
            if (values.length > 0) {
              const batch = writeBatch(db);

              const updateBank = function(name, amount) {
                return new Promise(function(resolve) {
                  const bankRef = doc(db, 'banks', name);
                  getDoc(bankRef)
                    .then((bankDoc) => {
                      const oldAmount = bankDoc.data().amount;
                      batch.set(bankRef, {amount: oldAmount + amount});
                      resolve();
                    });
                }) 
              };

              // update the bank records
              return new Promise(function(resolve) {
                updateBank('total', bank.total)
                  .then(resolve)
              })
              .then(() => {
                return updateBank('events', bank.events);
              })
              .then(() => {
                return updateBank('investments', bank.investments);
              })
              .then(() => {
                return updateBank('emergency', bank.emergency);
              })
              .then(() => {
                return updateBank('donations', bank.donations);
              })
              .then(() => {
                return batch.commit();
              })
              .then(() => {
                console.log('Batch complete')
              });
            }
          }, () => {
            console.log('Loop completed - Rejected');
          });
      })
      .catch((err) => {

      });
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