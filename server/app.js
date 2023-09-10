import { db } from './firebase-config.js';
import { doc, collection, query, where, getDoc, getDocs } from 'firebase/firestore';
import cors from 'cors';
import express from 'express';
import { scheduler, job } from './scheduler.js';

const app = express();
app.use(cors());

const port = process.env.PORT || 3001;

async function setup() {
  // start server
  app.listen(port);

  // start database update scheduler
  scheduler.addSimpleIntervalJob(job);
}

await setup();

app.get("/api/users/payments/total", async (req, res) => {
  try {
    const totalRef = doc(db, 'banks', 'total');
    const totalDoc = await getDoc(totalRef);
    if (totalDoc.exists()) {
      res.json({
        status: 'success',
        total: totalDoc.data().amount,
      });
    } else {
      res.json({
        status: 'error',
      });
    }
  } catch (e) {
    console.error(e);
    res.json({status: 'exception'});
  }
});

app.get("/api/users/payments", async (req, res) => {
  try {
    // validate the parameter
    const firstDate = req.query.firstDate;
    const lastDate = req.query.lastDate;
    if (!(firstDate && firstDate.length === 8) || !(lastDate && lastDate.length === 8)) {
      throw new Error(`Invalid period: First Date: ${firstDate}, Last Date: ${lastDate}`);
    }

    if (parseInt(firstDate) === NaN || parseInt(lastDate) === NaN) {
      throw new Error(`Period is NaN: First Date: ${firstDate}, Last Date: ${lastDate}`);
    }

    const usersCollection = collection(db, "payments");
    const q = query(usersCollection, 
      where("date", ">=", parseInt(firstDate)),
      where("date", "<=", parseInt(lastDate)));

    const qs = await getDocs(q); // query snapshot
    let payees = [];

    qs.forEach((doc) => {
      payees.push(doc.data());
    });

    res.json({
      status: 'success',
      payees: payees,
      firstDate: firstDate,
      lastDate: lastDate
    });
  } catch (e) {
    console.error(e);
    res.json({status: 'exception'});
  }
});