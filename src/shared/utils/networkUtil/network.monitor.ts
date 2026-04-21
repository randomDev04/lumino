import { useNetworkStore } from "@/shared/hooks";
import NetInfo from "@react-native-community/netinfo";
import { classifyNetwork } from "./network.utils";
import { NETWORK_TIMEOUTS, NetworkType } from "./types/network.types";

let currentNetworkType: NetworkType = "unknown";
let subscription: (() => void) | null = null;

export const NetworkMonitor = {
  start: () => {
    if (subscription) return;

    // initial fetch
    NetInfo.fetch().then((state) => {
      const type = classifyNetwork(state);
      currentNetworkType = type;

      useNetworkStore.getState().setNetwork(type);
    });

    // listener
    subscription = NetInfo.addEventListener((state) => {
      const prev = currentNetworkType;
      const next = classifyNetwork(state);

      if (prev === next) return;

      currentNetworkType = next;

      useNetworkStore.getState().setNetwork(next);

      if (__DEV__) {
        console.log(
          `[Network] ${prev} → ${next} | timeout: ${NETWORK_TIMEOUTS[next]}ms`,
        );
      }
    });
  },

  stop: () => {
    subscription?.();
    subscription = null;
  },

  // Sync-safe getters (VERY IMPORTANT for axios)
  getNetworkType: (): NetworkType => currentNetworkType,

  getTimeout: (): number => NETWORK_TIMEOUTS[currentNetworkType],

  isOffline: (): boolean => currentNetworkType === "none",

  isSlowConnection: (): boolean =>
    currentNetworkType === "2g" || currentNetworkType === "3g",
};
