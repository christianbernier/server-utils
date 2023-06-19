const dotenv = require('dotenv');

interface IEnvService {
  getVar(key: string): string;
}

export class EnvService implements IEnvService {
  private static readonly singleton = new EnvService();

  // Prevent further instantiation of this class
  private constructor() {
    dotenv.config();
  }

  /**
   * @description Gets the singleton instance of this service.
   * @returns An instance of the service.
   */
  public static of(): EnvService {
    return EnvService.singleton;
  }

  public getVar(key: string): string {
    return process.env[key]!;
  }
}
