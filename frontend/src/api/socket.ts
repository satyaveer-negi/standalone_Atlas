// src/api/socket.ts

let socket: WebSocket | null = null;
let currentTaskId: string | null = null;
let reconnectTimeout: any = null;
let isManuallyClosed = false;
let isConnecting = false;

/* ============================
   JWT EXPIRATION CHECK
============================ */
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;
    if (!exp) return false;
    return Date.now() >= exp * 1000;
  } catch (e) {
    return true;
  }
}

/* ============================
   CONNECT COMMENTS SOCKET
============================ */
export const connectCommentsSocket = (
  taskId: string,
  onMessage: (data: any) => void,
) => {
  const token = localStorage.getItem("access");

  // ❌ No token or expired → skip
  if (!token || token === "undefined" || isTokenExpired(token)) {
    console.warn("⚠️ No valid or unexpired token → skipping WS");
    return;
  }

  // 🔥 Prevent duplicate open connection
  if (
    socket &&
    socket.readyState === WebSocket.OPEN &&
    currentTaskId === taskId
  ) {
    return;
  }

  // 🔥 Prevent reconnect spam
  if (isConnecting) {
    console.log("⏳ Already connecting...");
    return;
  }

  isConnecting = true;
  isManuallyClosed = false;
  currentTaskId = taskId;
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";

  // 🔥 DO NOT close if still connecting (important fix)
  if (socket && socket.readyState !== WebSocket.CONNECTING) {
    socket.close();
  }

  socket = new WebSocket(
    `${protocol}://127.0.0.1:8000/ws/comments/${taskId}/?token=${token}`,
  );

  /* ============================
     ON OPEN
  ============================ */
  socket.onopen = () => {
    console.log("🟢 Comments WebSocket connected");

    isConnecting = false;

    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
  };

  /* ============================
     ON MESSAGE
  ============================ */
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (!data) return;

      console.log("📩 Comment WS:", data);

      onMessage(data);
    } catch (err) {
      console.error("❌ WS parse error:", err);
    }
  };

  /* ============================
     ON CLOSE
  ============================ */
  socket.onclose = (event) => {
    console.log("🔴 Comments WS disconnected", event.code);

    socket = null;
    isConnecting = false;

    // ❌ Don't reconnect if manually closed
    if (isManuallyClosed) return;

    // 🔥 Prevent reconnect storm
    if (reconnectTimeout) return;

    reconnectTimeout = setTimeout(() => {
      reconnectTimeout = null;

      if (currentTaskId === taskId) {
        console.log("🔄 Reconnecting comments socket...");
        const freshToken = localStorage.getItem("access") || token;
        if (freshToken && !isTokenExpired(freshToken)) {
          connectCommentsSocket(taskId, onMessage);
        }
      }
    }, 2000);
  };

  /* ============================
     ON ERROR
  ============================ */
  socket.onerror = (err) => {
    console.error("❌ WS error:", err);
  };
};

/* ============================
   SEND COMMENT
============================ */
export const sendCommentSocket = (data: any) => {
  if (!socket) {
    console.warn("⚠️ Socket not initialized");
    return;
  }

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    console.warn("⚠️ Socket not open");
  }
};

/* ============================
   DISCONNECT SOCKET
============================ */
export const disconnectCommentsSocket = () => {
  if (!socket) return;

  // 🔥 DO NOT close while connecting (CRITICAL FIX)
  if (socket.readyState === WebSocket.CONNECTING) {
    console.warn("⚠️ Skip closing (still connecting)");
    return;
  }

  console.log("🛑 Closing comments socket");

  isManuallyClosed = true;

  socket.close();
  socket = null;
  currentTaskId = null;

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
};
