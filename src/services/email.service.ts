import { Client } from '@sendgrid/client';
import { EnvService } from './env.service';
const sgMail = require('@sendgrid/mail');

interface IEmailService {
  sendEmail(templateId: string, templateData: object): void;
}

export class EmailService implements IEmailService {
  private static readonly singleton = new EmailService();

  /**
   * @description Initialize the SendGrid client.
   * @private
   */
  private constructor() {
    sgMail.setClient(new Client());
    sgMail.setApiKey(EnvService.of().getVar('SENDGRID_API_KEY'));
  }

  /**
   * @description Gets the singleton instance of this service.
   * @returns An instance of the service.
   */
  public static of(): EmailService {
    return EmailService.singleton;
  }

  /**
   * @description Send a email using the provided template.
   * @param templateId - The ID of the SendGrid template.
   * @param templateData - Any data that should be injected.
   */
  public sendEmail(templateId: string, templateData?: object): void {
    sgMail.send({
      from: EnvService.of().getVar('SENDGRID_FROM_EMAIL_ADDRESS'),
      to: EnvService.of().getVar('SENDGRID_TO_EMAIL_ADDRESS'),
      templateId,
      dynamicTemplateData: templateData,
    });
  }
}
