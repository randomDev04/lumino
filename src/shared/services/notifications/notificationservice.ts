import { storage } from "@/shared/storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/* ---------------------------------- */
/* Storage Keys */
/* ---------------------------------- */
// Keep keys centralized to avoid typos
const KEYS = {
  LAST_OPENED: "last_opened_timestamp",
  PERMISSION_REQUESTED: "notification_permission_requested",
};

/* ---------------------------------- */
/* Notification Types */
/* ---------------------------------- */
// Helps avoid magic strings across the codebase
const TYPES = {
  BOOKMARK: "bookmark_milestone",
  INACTIVITY: "inactivity_reminder",
};

/* ---------------------------------- */
/* Notification Behavior (Foreground) */
/* ---------------------------------- */
// Controls how notifications behave when app is open
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const type = notification.request.content.data?.type;

    // Only show UI for milestone notifications
    const isMilestone = type === TYPES.BOOKMARK;

    return {
      shouldShowBanner: isMilestone,
      shouldShowList: isMilestone,
      shouldPlaySound: isMilestone,
      shouldSetBadge: false,
    };
  },
});

/* ---------------------------------- */
/* Helper: Check Permission */
/* ---------------------------------- */
async function hasPermission() {
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
}

/* ---------------------------------- */
/* Notification Service */
/* ---------------------------------- */
export const notificationService = {
  /* ---------- Permissions ---------- */

  // Request notification permissions from user
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      // Ask only if not already granted
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") return false;

      // Store that we already asked (MMKV = sync)
      storage.set(KEYS.PERMISSION_REQUESTED, true);

      // Android requires a notification channel
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#3B82F6",
        });
      }

      return true;
    } catch (error) {
      console.error("Permission error:", error);
      return false;
    }
  },

  // Check if we have already asked the user for permission
  hasRequestedPermissions(): boolean {
    return storage.getBoolean(KEYS.PERMISSION_REQUESTED) ?? false;
  },

  // Check if permission is currently granted
  async hasPermissions(): Promise<boolean> {
    return hasPermission();
  },

  /* ---------- Bookmark Notification ---------- */

  // Triggered when user hits a bookmark milestone
  async showBookmarkMilestoneNotification(
    bookmarkCount: number,
  ): Promise<void> {
    try {
      if (!(await hasPermission())) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🎉 Bookmark Milestone!",
          body: `You've bookmarked ${bookmarkCount} courses! Keep learning.`,
          data: { type: TYPES.BOOKMARK, count: bookmarkCount },
          sound: true,
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error("Bookmark notification error:", error);
    }
  },

  /* ---------- Inactivity Reminder ---------- */

  // Schedule a reminder after 24 hours of inactivity
  async scheduleInactivityReminder(): Promise<void> {
    try {
      if (!(await hasPermission())) return;

      // Remove any existing reminders first
      await this.cancelInactivityReminder();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📚 Continue Your Learning Journey",
          body: "You haven't checked your courses today.",
          data: { type: TYPES.INACTIVITY },
          sound: true,
        },
        trigger: {
          seconds: 24 * 60 * 60, // 24 hours
          channelId: "default",
        },
      });
    } catch (error) {
      console.error("Schedule reminder error:", error);
    }
  },

  // Cancel all inactivity reminders
  cancelInactivityReminder(): Promise<void> {
    // Simpler approach: clear all scheduled notifications
    return Notifications.cancelAllScheduledNotificationsAsync();
  },

  /* ---------- Activity Tracking ---------- */

  // Save last app open time (sync, no await needed)
  updateLastOpened(): void {
    storage.set(KEYS.LAST_OPENED, Date.now());
  },

  // Get last app open time
  getLastOpened(): number | null {
    return storage.getNumber(KEYS.LAST_OPENED) ?? null;
  },

  // Check if user inactive for X hours (default 24)
  checkInactivity(hours = 24): boolean {
    const lastOpened = this.getLastOpened();
    if (!lastOpened) return false;

    const diff = Date.now() - lastOpened;

    return diff >= hours * 60 * 60 * 1000;
  },

  /* ---------- Debug / Utility ---------- */

  // Get all scheduled notifications
  async getScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Fetch notifications error:", error);
      return [];
    }
  },

  // Cancel everything
  cancelAllNotifications(): Promise<void> {
    return Notifications.cancelAllScheduledNotificationsAsync();
  },

  /* ---------- Listeners ---------- */

  // Fires when notification arrives (foreground)
  addNotificationReceivedListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
  },

  // Fires when user taps notification
  addNotificationResponseListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  },
};
