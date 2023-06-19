import { Firestore } from "firebase-admin/firestore";
import { initFirebase, saveToFirebase } from "./firebase";
import { getIpAddress } from "./ip";
import { initTwilio, sendTextMessage } from "./twilio";
import { Twilio } from "twilio";

const THIRTY_MINUTES_IN_MILLISECONDS = 1000 * 60 * 30;

/**
 * @description Initialize the service.
 */
const init = (): void => {
  const db = initFirebase();
  const twilioClient = initTwilio();
  
  let ipAddress = '';
  setInterval(async () => {
    ipAddress = await checkIpAddress(ipAddress, db, twilioClient);
  }, THIRTY_MINUTES_IN_MILLISECONDS);
}

/**
 * @description Checks if the IP address has changed, and updates the database. If the IP address has
 * changed from the previous call, a text message notification will be sent as well.
 * @param lastIpAddress - The IP address the last time this method was called.
 * @param db - The database client.
 * @param twilioClient - The Twilio text message client.
 * @returns The current IP address.
 */
const checkIpAddress = async (lastIpAddress: string, db: Firestore, twilioClient: Twilio): Promise<string> => {
  const currentIpAddress = await getIpAddress();

  // Always save the current IP address, just in case.
  saveIpAddressEntry(db);

  // If the IP address changes, send a text notification.
  if (currentIpAddress !== lastIpAddress) {
    sendIpAddressUpdateText(twilioClient);
  }

  return currentIpAddress;
}

/**
 * @description Save an IP address entry to the database.
 * @param db - The database where the entry should be saved.
 */
const saveIpAddressEntry = async (db: Firestore): Promise<void> => {
  // Get time info
  const now = new Date();
  const iso = now.toISOString();
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

/**
 * @description Sends a text notification with the current IP address.
 * @param twilioClient - A reference to the Twilio text message client.
 */
const sendIpAddressUpdateText = async (twilioClient: Twilio): Promise<void> => {
  const ipAddress = await getIpAddress();
  const message = `Home IP address has changed. The new IP address is ${ipAddress}`;

  sendTextMessage(twilioClient, message);
}

init();
