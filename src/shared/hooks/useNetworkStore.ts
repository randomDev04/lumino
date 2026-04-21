import { create } from "zustand";
import {
    NETWORK_TIMEOUTS,
    NetworkType,
} from "../utils/networkUtil/types/network.types";

type NetworkState = {
  type: NetworkType;
  isOffline: boolean;
  timeout: number;

  setNetwork: (type: NetworkType) => void;
};

export const useNetworkStore = create<NetworkState>((set) => ({
  type: "unknown",
  isOffline: false,
  timeout: NETWORK_TIMEOUTS.unknown,

  setNetwork: (type) =>
    set({
      type,
      isOffline: type === "none",
      timeout: NETWORK_TIMEOUTS[type],
    }),
}));
