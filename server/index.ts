import  { PubSubManager } from "./pubsubManager";
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
        } else {
          console.log("Upgrade failed");
          // console.log(req);
        }
        // handle HTTP request normally
        return new Response(null, {
          status: 301,
          headers: {
            Location: "https://bun.red",
          },
        });
      },

      websocket: {
        open(ws) {
          console.log("Websocket opened");
          ws.send(JSON.stringify({ event: "connected" }));
        },
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

