const socket = new WebSocket('ws://localhost:3000');

type WSPubSubMessage = {
    type: "subscribe" | "unsubscribe" | "publish";
    channels: string[];
    data?: string;
};

socket.onopen = function (e) {
    console.log('Connected to server');
    socket.send(JSON.stringify({ type: 'subscribe', channels: ['test'] }));
};

export default socket;

export const publishEvent = (channels: string[], data: object) => {
    socket.send(JSON.stringify({ type: 'publish', channels: channels, data: JSON.stringify(data)}));
}

