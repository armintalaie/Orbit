import { db } from "./db/handler";
import  { PubSubManager } from "./pubsubManager";
import type { WSMessage } from "./types/message";
import { QueryEngine } from "./util/queryHelper";



class SyncServer {
  private server;

  constructor() {
   
    this.server = Bun.serve<{ authToken: string }>({
      fetch(req, server) {
        const success = server.upgrade(req);
        if (success) {
          // Bun automatically returns a 101 Switching Protocols
          // if the upgrade succeeds
          return undefined;
        }
        // handle HTTP request normally
        return new Response("Hello world!");
      },

      websocket: {
        // this is called when a message is received
        async message(ws, message) {
          return PubSubManager.message(ws, message);
        },
      },
    });
  }

  get hostname() {
    return this.server.hostname;
  }


  get port() {
    return this.server.port;
  }

}


const server = new SyncServer();

console.log(`Listening on ${server.hostname}:${server.port}`);
