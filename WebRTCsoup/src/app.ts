import express, { Express, Request, Response } from "express";
// import dotenv from "dotenv";
import http from 'http';
import { Server } from "socket.io";
import { createWorker } from 'mediasoup';
import cors from 'cors';
import * as Websocket from 'ws'
import { Websocketconnection } from "./lib/ws";

const main = async () => {
  
  const app = express();
  const server = http.createServer(app);
  const websocket = new Websocket.Server({ server, path: '/ws' });

  Websocketconnection(websocket);

  const port = 8000
  server.listen(port, () => {
    console.log('server listening on port 8000');
  });
}
main()
export {main}

