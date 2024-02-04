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


// async function commandMapper(message: WSMessage) {
//   switch (message.command) {
//     case "getIssues":
//       return QueryEngine.getIssues(message.content);
//     case "getIssue": 
//       return QueryEngine.getIssue(message.content);
//     case "getProjects":
//       return {
//         event: "getProjects",
//         data: await QueryEngine.getProjects(message.content),
//         status: "success",
//       }
//     case "getTeams": {
//       return {
//         event: "getTeams",
//         data: await QueryEngine.getTeams(message.content),
//         status: "success",
      
//       }
//     }
//     case "getLabels": {
//       return {
//         event: "getLabels",
//         data: await QueryEngine.getLabels(),
//         status: "success",
//       }
//     }
//     case "getStatuses": {
//       return {
//         event: "getStatuses",
//         data: await QueryEngine.getStatuses(),
//         status: "success",
//       }
//     }
//     case "getProject":
//       return QueryEngine.getProject(message.content);
//     default:
//       return "Command not found";
//   }
// }