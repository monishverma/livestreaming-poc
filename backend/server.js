const NodeMediaServer = require('node-media-server');
const express = require('express');
const cors = require('cors');
const path = require('path');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },
  http: {
    port: 8000, // Node-Media-Server internal HTTP & WebSocket port
    mediaroot: './media',
    allow_origin: '*'
  },
  trans: {
    ffmpeg: 'C:/ffmpeg/bin/ffmpeg.exe',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: false
      }
    ]
  }
};

const nms = new NodeMediaServer(config);
nms.run();

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath}`);
});

// ✅ Now define and use Express properly
const app = express();
app.use(cors());
app.use('/streams', express.static(path.join(__dirname, 'media')));

app.listen(8001, () => {
  console.log('HLS server running at http://localhost:8001');
});
