import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { IMessage } from "@stomp/stompjs";

export function useLiveUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let stompClient: Client | null = null;
    let isMounted = true;

    const getWebSocketUrl = () => {
      const apiBase = import.meta.env.VITE_API_BASE_URL;
      if (apiBase) {
        if (apiBase.startsWith("http")) {
          return `${apiBase}/ws`;
        }
        // If relative, prefix host
        const cleanBase = apiBase.startsWith("/") ? apiBase : `/${apiBase}`;
        return `${window.location.origin}${cleanBase}ws`.replace(/([^:]\/)\/+/g, "$1");
      }
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return "http://localhost:8080/ws";
      }
      return "/ws";
    };

    const socketUrl = getWebSocketUrl();
    console.log("[useLiveUpdates] Initializing SockJS client at:", socketUrl);

    try {
      const socket = new SockJS(socketUrl);

      stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
          if (!isMounted) return;
          console.log("[useLiveUpdates] STOMP Client connected successfully!");

          // Subscribe to general entity updates (product, category, subcategory, stock, banners, coupons, etc.)
          stompClient?.subscribe("/topic/updates", (message: IMessage) => {
            try {
              const payload = JSON.parse(message.body);
              const type = payload.type;
              console.log("[useLiveUpdates] Received update notification:", type);

              // 1. Invalidate Tanstack React Query caches
              if (type === "PRODUCT_UPDATE" || type === "STOCK_UPDATE") {
                queryClient.invalidateQueries({ queryKey: ["products"] });
              } else if (type === "CATEGORY_UPDATE") {
                queryClient.invalidateQueries({ queryKey: ["categories"] });
              }

              // 2. Dispatch global event for other components using local state (Banners, Coupons, Stock)
              window.dispatchEvent(
                new CustomEvent("munchz-update", { detail: { type } })
              );
            } catch (err) {
              console.error("[useLiveUpdates] Failed to parse message body:", err);
            }
          });

          // Subscribe to order notifications
          stompClient?.subscribe("/topic/orders", (message: IMessage) => {
            console.log("[useLiveUpdates] Received order notification:", message.body);
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            window.dispatchEvent(
              new CustomEvent("munchz-update", { detail: { type: "ORDER_UPDATE", message: message.body } })
            );
          });
        },
        onStompError: (frame) => {
          console.warn("[useLiveUpdates] STOMP error:", frame.headers["message"], frame.body);
        },
        onWebSocketClose: () => {
          console.log("[useLiveUpdates] WebSocket connection closed.");
        },
      });

      stompClient.activate();
    } catch (err) {
      console.warn("[useLiveUpdates] WebSocket initialization error:", err);
    }

    return () => {
      isMounted = false;
      if (stompClient) {
        console.log("[useLiveUpdates] Deactivating STOMP client...");
        stompClient.deactivate();
      }
    };
  }, [queryClient]);
}
