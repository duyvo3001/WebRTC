import { Router } from "mediasoup/node/lib/types";
import { createWorker } from "./worker"
import WebSocket from "ws";

const Websocketconnection = async (websocket: WebSocket.Server) => {
  let mediasoupRouter: Router;
  try {
    mediasoupRouter = await createWorker()
  } catch (error) {
    throw error
  }

  websocket.on("connection", (ws: WebSocket) => {
    ws.on("message", (message: string) => {
      const jsonValidation = IsJsonString(message)
      if (!jsonValidation) {
        console.error("error")
        return
      }

      const event = JSON.parse(message)

      switch (event.type) {
        case 'getRouterRtpCapabilities':
          onRouterRtpCapabilities(event, ws)
          break;
        case 'createProducerTransport':
          onCreateProducerTransport(event, ws)
          break;
        case 'produce':
          onProduce(event, ws , websocket)
          break;
        default:
          break;
      }
    });
  });

  const onProduce = (event : string, ws : WebSocket, websocket : WebSocket.Server) => {}

  const onCreateProducerTransport = (event: string, ws: WebSocket) => {
    send(ws, "routerCapabilities", mediasoupRouter.rtpCapabilities)
  }

  // const onRouterRtpCapabilities = (event : string , ws : WebSocket) =>{

  // }

  const onRouterRtpCapabilities = (event: String, ws: WebSocket) => {
    send(ws, "routerCapabilities", mediasoupRouter.rtpCapabilities)
  }

  const IsJsonString = (str: string) => {
    try {
      JSON.parse(str);
    } catch (error) {
      return false;
    }
    return true;
  }

  const send = (ws: WebSocket, type: string, msg: any) => {
    const message = {
      type,
      data: msg
    }
    const resp = JSON.stringify(message)
    ws.send(resp)
  }
};

export { Websocketconnection };
