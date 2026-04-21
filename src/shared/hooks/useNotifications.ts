import { useEffect } from "react";
import { notificationService } from "../services";

export function useNotifications() {
  useEffect(() => {
    const init = async () => {
      const hasRequested = await notificationService.hasRequestedPermissions();

      if (!hasRequested) {
        await notificationService.requestPermissions();
      }

      await notificationService.updateLastOpened();
      await notificationService.cancelInactivityReminder();
      await notificationService.scheduleInactivityReminder();
    };

    init();

    const notificationListener =
      notificationService.addNotificationReceivedListener((notification) => {
        console.log("Received:", notification.request.content.title);
      });

    const responseListener =
      notificationService.addNotificationResponseListener((response) => {
        console.log("Tapped:", response.notification.request.content.title);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);
}
