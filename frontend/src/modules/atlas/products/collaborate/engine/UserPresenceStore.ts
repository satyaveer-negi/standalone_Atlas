export interface ActivePresence {
  userId: string;
  name: string;
  color: string;
  cursor: { x: number; y: number };
  selectedNodes: string[];
  status: "ONLINE" | "TYPING" | "IDLE";
}

export const DEMO_ONLINE_USERS: ActivePresence[] = [
  {
    userId: "usr-dev-1",
    name: "Alex Dev (Lead)",
    color: "#38bdf8",
    cursor: { x: 420, y: 180 },
    selectedNodes: ["srv-backend"],
    status: "ONLINE",
  },
  {
    userId: "usr-dev-2",
    name: "Sarah Architect",
    color: "#c084fc",
    cursor: { x: 610, y: 340 },
    selectedNodes: ["srv-db"],
    status: "TYPING",
  },
];
