import { parseUserAgent } from './user-agent';

export const extractAnalyticsData = (
  request: Request
) => {
  const userAgent =
    request.headers.get(
      'user-agent'
    ) || '';

  const referrerUrl =
    request.headers.get(
      'referer'
    );

  const ipAddress =
    request.headers.get(
      'CF-Connecting-IP'
    ) ||
    request.headers.get(
      'x-forwarded-for'
    ) ||
    null;

  const url = new URL(
    request.url
  );

  const utmSource =
    url.searchParams.get(
      'utm_source'
    );

  const utmMedium =
    url.searchParams.get(
      'utm_medium'
    );

  const utmCampaign =
    url.searchParams.get(
      'utm_campaign'
    );

  const utmTerm =
    url.searchParams.get(
      'utm_term'
    );

  const utmContent =
    url.searchParams.get(
      'utm_content'
    );

  const parsedUserAgent =
    parseUserAgent(userAgent);

  const cf =
    (request as Request & {
      cf?: Record<
        string,
        unknown
      >;
    }).cf || {};

  return {
    ipAddress,

    country:
      (cf.country as string) ||
      null,

    city:
      (cf.city as string) ||
      null,

    region:
      (cf.region as string) ||
      null,

    timezone:
      (cf.timezone as string) ||
      null,

    userAgent,

    browser:
      parsedUserAgent.browser,

    os:
      parsedUserAgent.os,

    deviceType:
      parsedUserAgent.deviceType,

    referrerUrl,

    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
  };
};