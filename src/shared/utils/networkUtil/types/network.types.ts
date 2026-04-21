export const NETWORK_TIMEOUTS = {
  wifi: 10000,
  "5g": 10000,
  "4g": 15000,
  "3g": 25000,
  "2g": 40000,
  none: 5000,
  unknown: 15000,
} as const;

export type NetworkType = keyof typeof NETWORK_TIMEOUTS;
