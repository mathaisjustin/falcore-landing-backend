import { UAParser } from 'ua-parser-js';

export const parseUserAgent = (
  userAgent: string
) => {
  const parser = new UAParser(
    userAgent
  );

  const result = parser.getResult();

  return {
    browser:
      result.browser.name || null,

    os:
      result.os.name || null,

    deviceType:
      result.device.type || 'desktop',
  };
};