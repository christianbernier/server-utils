import { initializeApp, cert } from 'firebase-admin/app';
import { Firestore, WriteResult, getFirestore } from 'firebase-admin/firestore';

/**
 * @description Initialize the Firebase database.
 * @returns A reference to the database.
 */
export const initFirebase = (): Firestore => {
  const dotenv = require('dotenv');
  dotenv.config();

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
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
