const fetch = require('node-fetch');

interface IIpService {
  getIpAddress(): Promise<string>;
}

export class IpService implements IIpService {
  private static readonly singleton = new IpService();

  // Prevent further instantiation of this class
  private constructor() {}

  /**
   * @description Gets the singleton instance of this service.
   * @returns An instance of the service.
   */
  public static of(): IpService {
    return IpService.singleton;
  }

  /**
   * @description Gets the current public-facing IP address.
   * @returns The IP address.
   */
  public async getIpAddress(): Promise<string> {
    const response = await fetch('http://api.ipify.org:80');
    const ipAddress = await response.text();
    
    return ipAddress;
  }
}
