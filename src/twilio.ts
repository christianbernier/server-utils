import { Twilio } from 'twilio';

/**
 * @description Initialize the Twilio text message service.
 * @returns A reference to the service.
 */
export const initTwilio = (): Twilio => {
  const dotenv = require('dotenv');
  dotenv.config();

  return new Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

/**
 * @description Sends the provided text message using the provided Twilio client.
 * @param client - The Twillio service cleint.
 * @param message - The message to be sent via SMS.
 */
export const sendTextMessage = async (client: Twilio, message: string): Promise<void> => {
  const messageInstance = await client.messages.create({
    body: message,
    to: process.env.TWILIO_RECEIVE_PHONE_NUMBER!,
    from: process.env.TWILIO_SEND_PHONE_NUMBER,
  });

  if (messageInstance.errorMessage) {
    console.log(`[TWILIO] Failed to send SMS message with error: ${messageInstance.errorMessage}`);
  }
}