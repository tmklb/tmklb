import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

const absolutePath = path.resolve(process.cwd(), './payees.json');
console.log(absolutePath);

const serviceAccount = {}; // secret

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const firestore = admin.firestore();
const batch = firestore.batch();
let counter = 0;
let totalCounter = 0;
const promises = [];

async function populate() {
  let data = [];
  // read the data
  try {
      data = JSON.parse(fs.readFileSync(absolutePath, {}), 'utf8');
  } catch (e) {
      console.log(e);
  }
  // traverse the data
  for (const item of data) {
    console.log(item);
    const docRef = firestore.collection('payments').doc('2023');
    batch.set(docRef, Object.assign({}, item), {merge: true});
    counter++;
    if (counter === 500) {
      console.log(`Committing batch of ${counter}`);
      promises.push(batch.commit());
      totalCounter += counter;
    }
  }
  // remaining items to commit
  if (counter) {
    console.log(`Committing batch of ${counter}`);
    promises.push(batch.commit());
    totalCounter += counter;
  }
  await Promise.all(promises);
  console.log(`Committed total of ${totalCounter}`);
}

await populate();