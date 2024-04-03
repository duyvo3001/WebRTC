import React from 'react'
import './App.css'
import { Device } from 'mediasoup-client';
let btnSub;
let btnCam: HTMLElement | null;
let btnScreen;
let textPublish;
let textWebcam: HTMLElement | null;
let textScreen: HTMLElement | null;
let textSubcribe;
let localVideo: HTMLElement | null;
let remoteVideo: HTMLElement | null;
// let remoteStream;
// let device : unknown;
// let producer;
// let consumeTransport;
// let userId;
let isWebcam;
// let produceCallback, produceErrback;
// let consumerCallback, consumerErrback;
let device: Device;
const socketUrl: string = "ws://localhost:8000/ws";

document.addEventListener("DOMContentLoaded", () => {
  btnCam = document.getElementById("btn_webcam")
  btnScreen = document.getElementById("btn_screen")
  btnSub = document.getElementById("btn_subcribe")
  textWebcam = document.getElementById("webcam_status")
  textScreen = document.getElementById("screen_status")
  textSubcribe = document.getElementById("Subcribe_status")
  localVideo = document.getElementById("localVideo")
  remoteVideo = document.getElementById("remoteVideo")

  btnCam?.addEventListener('click', publish);
  btnScreen?.addEventListener('click', publish);
  btnSub?.addEventListener('click', () => console.log("btn cam click"));
})

const ws = new WebSocket(socketUrl);
ws.onopen = function () {
  const msg = {
    type: "getRouterRtpCapabilities",
  }
  const rep = JSON.stringify(msg);
  ws.send(rep);
};

ws.onmessage = function (event) {
  const jsonValidation = IsJsonString(message)
  if (!jsonValidation) {
    console.error("error")
    return
  }

  const resp = JSON.parse(event.data)
  switch (resp.type) {
    case "routerCapabilities":
      onrouterCapabilities(resp)
      break;

    default:
      break;
  }


};
const onrouterCapabilities = (resp: { data: unknown; }) => {
  loadDevice(resp.data);
}

const IsJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (error) {
    return false;
  }
  return true;
}
class CustomError extends Error {
  constructor(message: string) {
    super(message); // call the parent constructor
    this.name = "CustomError"; // set the name property
  }
}
const loadDevice = async (routerRtpCapabilities: unknown) => {
  try {
    device = new Device()
  } catch (error) {
    if (error instanceof CustomError) {
      console.log("browser not supported")
    }
    else {
      // Handle other potential errors or rethrow
      console.error("Error initializing device:", error);
      return;
    }
  }
  try {
    await device.load({ routerRtpCapabilities });
  } catch (loadError) {
    console.error("Error loading device capabilities:", loadError);
  }
}

const publish = (e: React.ChangeEvent<HTMLInputElement>) => {
  isWebcam = (e.target.id === 'btn_webcam');
  textPublish = isWebcam ? textWebcam : textScreen
  btnScreen = true
  // btnCam?.disabled = true

  const message = {
    type: 'createProducerTransport',
    forceTcp: false,
    rtpCapabilities: device.rtpCapabilities
  }

  const resp = JSON.stringify(message);
  ws.send(resp) 
}

function App() {

  return (
    <>
      <div>
        <video id="localVideo"></video>
        <button id="btn_webcam"></button>
        <span id="webcam_status"></span>
        <button id="btn_screen"></button>
        <span id="screen_status"></span>
        <button id="btn_subcribe"></button>
        <span id="subcribe_status"></span>
      </div>
      <div className="card">
        <video id="remoteVideo"></video>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
