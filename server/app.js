import { db } from './firebase-config.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
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
    let total = 0;

    qs.forEach((doc) => {
      console.log(doc.data());
      const amount = doc.data().amount;
      total += amount;
    });

    res.json({
      status: 'success',
      total: total,
      firstDate: firstDate,
      lastDate: lastDate
    });
  } catch (e) {
    console.error(e);
    res.json({status: 'exception'});
  }
});