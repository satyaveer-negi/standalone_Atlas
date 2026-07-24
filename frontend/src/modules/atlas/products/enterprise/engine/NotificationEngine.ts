export type NotificationChannel = "HUD" | "EMAIL" | "SLACK" | "TEAMS" | "WEBHOOK";

export interface EnterpriseNotificationEvent {
  id: string;
  source: "AI_AGENT" | "WORKFLOW" | "DEPLOYMENT" | "DRIFT_RADAR" | "INCIDENT";
  title: string;
  message: string;
  channels: NotificationChannel[];
  timestamp: number;
  read: boolean;
}

export class NotificationEngine {
  getNotifications(): EnterpriseNotificationEvent[] {
    return [
      {
        id: "notif-1",
        source: "AI_AGENT",
        title: "AI Plan Verification Required: Redis Cache Sync",
        message: "AI Agent submitted plan to reconcile undocumented Redis tier.",
        channels: ["HUD", "SLACK"],
        timestamp: Date.now() - 60000,
        read: false,
      },
      {
        id: "notif-2",
        source: "DEPLOYMENT",
        title: "Staging Kubernetes Deployment Success",
        message: "Revision rev-stag-88 deployed and verified 100% healthy.",
        channels: ["HUD", "EMAIL", "TEAMS"],
        timestamp: Date.now() - 360000,
        read: true,
      },
    ];
  }
}
