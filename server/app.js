import { db } from './firebase-config.js';
import { doc, collection, query, where, getDoc, addDoc, getDocs } from 'firebase/firestore';
import cors from 'cors';
import express from 'express';
import { scheduler, job } from './scheduler.js';

const app = express();
app.use(cors());
app.use(express.json());

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

app.get("/api/users/payments/total/:user", async (req, res) => {
  try {
    const paymentsCollection = collection(db, "payments");
    const q = query(paymentsCollection, where("name", "==", req.params.user));
    const qs = await getDocs(q); // query snapshot
    let total = 0;
    qs.forEach((doc) => {
      total += doc.data().amount;
    });
    res.json({
      status: 'success',
      total: total,
      name: req.params.user
    });
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

app.get("/api/events/thanks/entries", async (req, res) => {
  try {
    const year = req.query.year || '';
    console.log(year);
    const collectionRef = collection(db, "thanks");
    const q = query(collectionRef, where("year", "==", parseInt(year)))
    const qs = await getDocs(q); // query snapshot
    const entries = [];
    qs.forEach((doc) => {
      entries.push(doc.data());
    });

    res.json({status: 'success', entries: entries});
  } catch (e) {
    console.error(e);
    res.json({status: 'exception'});
  }
});

app.post("/api/events/thanks/submit", async (req, res) => {
  try {
    const year = req.query.year || '';
    // reject past dates
    if (year && (year < new Date().getFullYear())) {
      res.json({
        status: 'invalid',
        field: 'year'
      });
      return;
    }

    // validate the parameter
    const name = req.body.name;
    const entry = req.body.entry;
    if (name.trim() === '') {
      res.json({
        status: 'invalid',
        field: 'name'
      });
      return;
    }
    if (entry.trim() === '') {
      res.json({
        status: 'invalid',
        field: 'entry'
      });
      return;
    }
    if (!year) {
      res.json({
        status: 'invalid',
        field: 'year'
      });
      return;
    }

    // todo add submission to database
    await addDoc(collection(db, "thanks"), {
      name: name.trim(),
      entry: entry.trim(),
      year: parseInt(year)
    }).then(() => {
      res.json({
        status: 'success',
        name: name.trim(),
        entry: entry.trim(),
        year: year
      });
    }, () => {
      res.json({
        status: 'error',
      });
    });
  } catch (e) {
    console.error(e);
    res.json({status: 'exception'});
  }
});