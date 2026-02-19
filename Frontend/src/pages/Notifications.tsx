import { useEffect, useState } from "react";
import { connectWebSocket } from "../services/websockets";

const Notifications = () => {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    connectWebSocket((msg: string) => {
      setNotifications((prev) => [...prev, msg]);
    });
  }, []);

  return (
    <div>
      <h2>Live Notifications</h2>

      {notifications.map((n, index) => (
        <div key={index}>{n}</div>
      ))}
    </div>
  );
};

export default Notifications;