import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { IMessage } from "@stomp/stompjs";

let stompClient: Client | null = null;

export const connectWebSocket = (
  onMessageReceived: (message: string) => void
) => {
  const socket = new SockJS("http://localhost:8090/ws");

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("WebSocket connected");

      stompClient?.subscribe("/topic/orders", (message: IMessage) => {
        onMessageReceived(message.body);
      });
    },
  });

  stompClient.activate();
};