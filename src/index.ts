import { Firestore } from "firebase-admin/firestore";
import { initFirebase, saveToFirebase } from "./firebase";
import { getIpAddress } from "./ip";

/**
 * @description Run the service.
 */
const run = (): void => {
  const db = initFirebase();

  saveIpAddressEntry(db);
}

/**
 * @description Save an IP address entry to the database.
 * @param db - The database where the entry should be saved.
 */
const saveIpAddressEntry = async (db: Firestore): Promise<void> => {
  // Get time info
  const now = new Date();
  const iso = now.toString
  const timestamp = now.getTime();

  // Set up data to be saved
  const documentTitle = `address_${iso}`;
  const ipAddress = await getIpAddress();
  const data = {
    timestamp,
    time: now.toLocaleString(),
    ipAddress,
  }

  // Add the data to the database
  saveToFirebase(db, 'ip', documentTitle, data);
}

run();
