import { Client } from '@sendgrid/client';
const sgMail = require('@sendgrid/mail');

/**
 * @description Initialize the SendGrid email service.
 */
export const initSendgrid = (): void => {
  const dotenv = require('dotenv');
  dotenv.config();

  sgMail.setClient(new Client());
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * @description Send an email using the SendGrid email service.
 * @param ipAddress - The IP address to include in the template.
 */
export const sendEmail = (ipAddress: string): void => {
  const dotenv = require('dotenv');
  dotenv.config();

  sgMail.send({
    from: process.env.SENDGRID_FROM_EMAIL_ADDRESS!,
    to: process.env.SENDGRID_TO_EMAIL_ADDRESS,
    templateId: process.env.SENDGRID_TEMPLATE_ID!,
    dynamicTemplateData: {
      'ip_address': ipAddress,
    }
  })
}
