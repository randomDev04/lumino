import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";

export interface PickImageOptions {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
  multiple?: boolean;
  maxSelection?: number;
}

// ─── Permission helpers ───────────────────────────────────────────────────────

const showPermissionDeniedAlert = (type: "camera" | "library") => {
  const label = type === "camera" ? "Camera" : "Photo Library";

  // Alert is correct here — user needs to take an action (open settings)
  // Toast cannot host a button — Alert can
  Alert.alert(
    `${label} Access Denied`,
    `Please enable ${label} access in your device settings to continue.`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Open Settings",
        onPress: () => Linking.openSettings(),
      },
    ],
  );
};

const requestLibraryPermission = async (): Promise<boolean> => {
  const { status, canAskAgain } =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status === "granted") return true;

  console.log("Permission denied");

  if (!canAskAgain) {
    // User permanently denied — needs to go to Settings
    showPermissionDeniedAlert("library");
    return false;
  }

  // First denial — soft warning is enough
  return false;
};

const requestCameraPermission = async (): Promise<boolean> => {
  const { status, canAskAgain } =
    await ImagePicker.requestCameraPermissionsAsync();

  if (status === "granted") return true;

  if (!canAskAgain) {
    showPermissionDeniedAlert("camera");
    return false;
  }

  return false;
};

// ─── Pick from library ────────────────────────────────────────────────────────

export const pickImages = async (options?: PickImageOptions) => {
  const hasPermission = await requestLibraryPermission();
  if (!hasPermission) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"] as ImagePicker.MediaType[],
    allowsEditing: options?.multiple ? false : (options?.allowsEditing ?? true),
    allowsMultipleSelection: options?.multiple ?? false,
    selectionLimit: options?.maxSelection ?? 10,
    aspect: options?.aspect ?? [1, 1],
    quality: options?.quality ?? 0.8,
  });

  if (result.canceled) return null;

  return options?.multiple ? result.assets : result.assets[0];
};

// ─── Take photo ───────────────────────────────────────────────────────────────

export const takePhoto = async (
  options?: Omit<PickImageOptions, "multiple" | "maxSelection">,
) => {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) return null;

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: options?.allowsEditing ?? true,
    aspect: options?.aspect ?? [1, 1],
    quality: options?.quality ?? 0.8,
  });

  if (result.canceled) return null;

  return result.assets[0];
};
