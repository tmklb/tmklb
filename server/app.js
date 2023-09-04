import { db } from './firebase-config.js';
import { collection, doc, query, where, getDoc } from 'firebase/firestore';
import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors());

const port = process.env.PORT || 3001;

async function setup() {
  // start server
  app.listen(port);
}

await setup();

app.get("/api/users/payments/:period", async (req, res) => {
  try {
    const period = req.params.period;
    // validate the parameter
    if (!(period && period.length === 8)) {
      throw new Error(`Invalid period: ${period}`);
    }

    if (parseInt(period) === NaN) {
      throw new Error(`Period is NaN: ${period}`);
    }

    const year = period.substring(0, 4);
    const month = parseInt(period.substring(4, 6)) + '';

    const docRef = doc(db, "payments", year);
    const paymentsDoc = await getDoc(docRef);
    const data = paymentsDoc.data();
    let total = 0;

    if (data && data[month]) {
      data[month].forEach((payment) => {
        total += payment.amount;
      });
    }

    res.json({
      status: 'success',
      total: total,
      period: period
    });
  } catch (e) {
    console.error(e);
    res.json({status: 'exception'});
  }
});