import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

type OrbitSyncSubscription = {
  channels: string[];
};

export function useOrbitSync(initialSubscription: OrbitSyncSubscription) {
  const WS_URL = process.env.NEXT_PUBLIC_SYNC_URL || 'ws://localhost:3000';
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [subscription, setSubscription] =
    useState<OrbitSyncSubscription>(initialSubscription);
  const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } =
    useWebSocket(WS_URL, {
      share: true,
      shouldReconnect: () => true,
    });

  useEffect(() => {
    if (readyState === 1) {
      sendJsonMessage({ type: 'subscribe', channels: subscription.channels });
    }
  }, [readyState, subscription]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastJsonMessage) {
      setLastMessage({
        data: lastJsonMessage.data,
        event: lastJsonMessage.event,
      });
    }
  }, [lastJsonMessage]);

  return {
    lastMessage,
    sendJsonMessage,
    readyState,
    getWebSocket,
    setSubscription,
  };
}
