import {
    NetInfoCellularGeneration,
    NetInfoState,
} from "@react-native-community/netinfo";
import { NetworkType } from "./types/network.types";

export const classifyNetwork = (state: NetInfoState): NetworkType => {
  if (!state.isConnected) return "none";

  if (state.type === "wifi" || state.type === "ethernet") return "wifi";

  if (state.type === "cellular") {
    const gen = state.details
      ?.cellularGeneration as NetInfoCellularGeneration | null;

    switch (gen) {
      case "5g":
        return "5g";
      case "4g":
        return "4g";
      case "3g":
        return "3g";
      case "2g":
        return "2g";
      default:
        return "unknown";
    }
  }

  return "unknown";
};
