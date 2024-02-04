import type { ServerWebSocket } from "bun";


type WSPubSubMessage = {
    channels: string[];
    type: "subscribe" | "unsubscribe" | "publish";
    data: any;
};


export  class  PubSubManager {
    static async message(ws: ServerWebSocket<{
        authToken: string;
    }>, message: string | Buffer) {

        console.log(`Received ${message}`);

        try {
            const messageString = message.toString(); // Convert message to string
            const wsMessage = JSON.parse(messageString) as WSPubSubMessage; // Parse message to WSMessage type
            switch (wsMessage.type) {
                case "publish":
                    await this.publishToChannels(ws, wsMessage.channels, wsMessage.data);
                    break;
                case "subscribe":
                    await this.subscribeToChannels(ws, wsMessage.channels);
                    break;
                case "unsubscribe":
                    await this.unsubscribeFromChannels(ws, wsMessage.channels);
                    break;
            }

        } catch (e) {
            console.error(e);
        }
    }

    static async publishToChannels(ws: ServerWebSocket<{
        authToken: string;
    }>, channels: string[], data: any) {
        for (const channel of channels) {
            ws.publish(channel, JSON.stringify({
                data: data,
            }));
        }
    }

    static async subscribeToChannels(ws: ServerWebSocket<{
        authToken: string;
    }>, channels: string[]) {
        for (const channel of channels) {
            ws.subscribe(channel);
            ws.send(JSON.stringify({
                event: "subscribed",
                channel: channel,
            }));
        }
    }

    static async unsubscribeFromChannels(ws: ServerWebSocket<{
        authToken: string;
    }>, channels: string[]) {
        for (const channel of channels) {
            ws.unsubscribe(channel);
            ws.send(JSON.stringify({
                event: "unsubscribed",
                channel: channel,
            }));
        }
    }



}