import { system } from "../config/system";

const rateLimiter: Record<string, {
  lastRequest: Date;
  count: number;
}> = {};

export function isRequestAllowed(ip: string, limit: number = system.apiLimit, interval: number = system.apiInterval): boolean {
  const now: any = new Date();
  const lastRequest: any = rateLimiter[ip]?.lastRequest;
  const count = rateLimiter[ip]?.count ?? 0;

  if (!lastRequest || (now - lastRequest) >= interval) {
    rateLimiter[ip] = {
      lastRequest: now,
      count: 1,
    };
    return true;
  }

  if (count < limit) {
    rateLimiter[ip].count++;
    return true;
  }

  return false;
}