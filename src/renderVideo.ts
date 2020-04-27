/* import ffmpeg from 'ffmpeg.js/ffmpeg-mp4';
import fs from 'fs';
import path from 'path';
import { remote } from 'electron'

let args = 'C:\\Users\\zack\\Videos\\zoom.mp4';
let videoData = new Uint8Array(fs.readFileSync(args));
let result = ffmpeg({
    MEMFS: [{ name: `${path.basename(args)}`, data: videoData }],
    TOTAL_MEMORY: 128 * 1024 * 1024,
    arguments: ["-i", `${path.basename(args)}`, "-c:v", "libx264", "-an", "out.mp4"],
    stdin: () => {},
    onExit: console.log
})
let out = result.MEMFS[0];
fs.writeFileSync(path.join(remote.app.getPath('videos'), out.name), Buffer(out.data));

remote.getCurrentWindow().close(); */
