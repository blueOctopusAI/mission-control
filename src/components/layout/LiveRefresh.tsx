"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LiveRefresh() {
  const router = useRouter();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    function connect() {
      try {
        const ws = new WebSocket("ws://localhost:3001");
        wsRef.current = ws;

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "file-change") {
            router.refresh();
          }
        };

        ws.onclose = () => {
          // Reconnect after 3 seconds
          setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch {
        // WebSocket server not running — silent fail
        setTimeout(connect, 5000);
      }
    }

    connect();

    return () => {
      wsRef.current?.close();
    };
  }, [router]);

  return null;
}
