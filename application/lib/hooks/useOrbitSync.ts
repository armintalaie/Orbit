import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";


type OrbitSyncSubscription = {
    channels: string[];
};
  
  
export function useOrbitSync(initialSubscription: OrbitSyncSubscription) {
    const WS_URL = "ws://127.0.0.1:3000";
    const [lastMessage, setLastMessage] = useState<any>(null);
    const [subscription, setSubscription] = useState<OrbitSyncSubscription>(initialSubscription);
    const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } = useWebSocket(
      WS_URL,
      {
        share: true,
        shouldReconnect: () => true,
      },
    );

    useEffect(() => {
        console.log('subscription', subscription);
        if (readyState === 1) {
          sendJsonMessage({ type: "subscribe", channels: subscription.channels });
        }
      }, [readyState, subscription]);
  
    // Handle incoming WebSocket messages
    useEffect(() => {
        console.log('lastJsonMessage', lastJsonMessage);
      if (lastJsonMessage) {
        setLastMessage(lastJsonMessage.data);
      }
    }, [lastJsonMessage]);
  
  
    return { lastMessage , sendJsonMessage, readyState, getWebSocket, setSubscription };
  }