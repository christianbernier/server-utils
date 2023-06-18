const fetch = require('node-fetch');

/**
 * @description Gets the current public-facing IP address.
 * @returns The IP address.
 */
export const getIpAddress = async (): Promise<string> => {
  const response = await fetch('http://api.ipify.org:80');
  const ipAddress = await response.text();
  
  return ipAddress;
}