import {
  DatabaseService,
  EmailService,
  EnvService,
  IpService,
} from '../services';
import { Util } from './util';

const THIRTY_MINUTES_IN_MILLISECONDS = 1000 * 60 * 30;

export class IpTrackingUtil implements Util {
  private static readonly singleton = new IpTrackingUtil();
  private lastKnownIpAddress = '';

  // Prevent further instantiations.
  private constructor() {}

  /**
   * @description Get the instance of this util.
   * @returns A reference to this util.
   */
  public static of(): IpTrackingUtil {
    return this.singleton;
  }

  /**
   * @description Begin running the service.
   */
  public start(): void {
    setInterval(this.performCheck, THIRTY_MINUTES_IN_MILLISECONDS);
  }

  /**
   * @description Check the current IP address and process it.
   * @private
   */
  private async performCheck(): Promise<void> {
    const currentIpAddress = await IpService.of().getIpAddress();

    // Always save the current IP address, just in case
    this.saveDatabaseEntry(currentIpAddress);

    // If the address is different than the last one, send an
    // email notification with the new IP address
    if (currentIpAddress !== this.lastKnownIpAddress) {
      this.sendEmailNotification(currentIpAddress);
    }

    // Update the record
    this.lastKnownIpAddress = currentIpAddress;
  }

  /**
   * @description Save an entry in the database with the current IP address.
   * @param ipAddress - The current IP address.
   * @private
   */
  private saveDatabaseEntry(ipAddress: string): void {
    // Get time info
    const now = new Date();
    const iso = now.toISOString();
    const timestamp = now.getTime();

    // Set up data to be saved
    const documentTitle = `address_${iso}`;
    const data = {
      timestamp,
      time: now.toLocaleString(),
      ipAddress,
    };

    // Add the data to the database
    DatabaseService.of().saveEntry('ip', documentTitle, data);
  }

  /**
   * @description Send an email notification with the current
   * IP address, using the SendGrid template.
   * @param ipAddress - The current IP address.
   * @private
   */
  private sendEmailNotification(ipAddress: string): void {
    EmailService.of().sendEmail(
      EnvService.of().getVar('SENDGRID_TEMPLATE_ID'),
      {
        ip_address: ipAddress,
      }
    );
  }
}
