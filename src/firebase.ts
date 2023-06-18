import { initializeApp, cert } from 'firebase-admin/app';
import { Firestore, WriteResult, getFirestore } from 'firebase-admin/firestore';

const dotenv = require('dotenv');

/**
 * @description Initialize the Firebase database.
 * @returns A reference to the database.
 */
export const initFirebase = (): Firestore => {
  dotenv.config();

  initializeApp({
    credential: cert({
      projectId: process.env.PROJECT_ID,
      privateKey: process.env.PRIVATE_KEY,
      clientEmail: process.env.CLIENT_EMAIL,
    })
  });
  
  return getFirestore();
}

/**
 * @description Saves an entry to a firebase database.
 * @param db - The database.
 * @param collection - The name of the collection.
 * @param document - The name of the document.
 * @param data - The data to be saved.
 * @returns The result of the write process.
 */
export const saveToFirebase = async (db: Firestore, collection: string, document: string, data: object): Promise<WriteResult> => {
  return await db.collection(collection).doc(document).set(data);
}
