import React, { useState, useRef } from 'react';
import { Explorer, Live, Timeline, Footer } from './components';
import { ipcRenderer, remote } from 'electron';

export function App() {
    const [videos, setVideos] = useState([]);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentDir, setCurrentDir] = useState(remote.app.getPath('videos'));

    const video = useRef(null);

    const handleVideoChange = (vid: string) => {
        if (!videos.includes(vid)) {
            setVideos([...videos, vid]);
            video.current.src = vid;
        }
    };

    const handleLoadMetadata = (seconds: number) => {
        setDuration(seconds);
    };

    const handleTimeChange = (time: number) => {
        setCurrentTime(time);
    };

    ipcRenderer.on('chdir', (event, arg) => {
        setCurrentDir(arg);
    });

    return (
        <>
            <Explorer currentDir={currentDir} onVideoChange={handleVideoChange} />
            <Live video={video} onLoadMetadata={handleLoadMetadata} onTimeChange={handleTimeChange} />
            <Timeline duration={duration} currentTime={currentTime} />
            <Footer duration={duration} currentTime={currentTime} currentDir={currentDir} />
        </>
    );
}
