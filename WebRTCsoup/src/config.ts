import { RtpCodecCapability } from 'mediasoup/node/lib/RtpParameters'
import { TransportListenIp, WorkerLogTag } from 'mediasoup/node/lib/types'
import os from 'os'

export const config = {
    listenIp: '0.0.0.0',
    listenPort: 3016,
    mediasoup: {
        numWorkers: Object.keys(os.cpus()).length,
        worker: {
            rtcMinPort: 10000,
            rtcMaxPort: 10100,
            logLevel: 'debug',
            logTags: [
                'info',
                'ice',
                'dtls',
                'rtp',
                'srtp',
                'rtcp'
            ] as WorkerLogTag[],
        },
        router: {
            mediaCodes: [
                {
                    kind: 'audio',
                    mineType: 'audio/opus',
                    clockRate: 48000,
                    channels: 2
                },
                {
                    kind: 'video',
                    mimeType: 'video/VP8',
                    clockRate: 90000,
                    parameters: {
                        'x-google-start-bitrate': 1000
                    }
                }
            ] as RtpCodecCapability[]
        },
        // webRtcTransport:{
        //     listenIps:[
        //         {
        //             ip:'0.0.0.0',
        //             announcedIp: '127.0.0.1'
        //         }
        //     ] as TransportListenIp
        // }
    }
} as const;

