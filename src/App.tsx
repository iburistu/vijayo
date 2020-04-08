import React, { useState, useRef } from 'react';
import { Explorer, Live, Timeline, Footer } from './components';

export function App() {
    const [videos, setVideos] = useState([]);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const video = useRef(null);

    const handleVideoChange = (vid: string) => {
        if (!videos.includes(vid)) {
            setVideos([...videos, vid]);
            video.current.src = vid;
        }
    };

    const handleLoadMetadata = (seconds: number) => {
        console.log(seconds);
        setDuration(seconds);
    };

    const handleTimeChange = (time: number) => {
        setCurrentTime(time);
    };

    return (
        <>
            <Explorer currentDir={'vijayo'} onVideoChange={handleVideoChange} />
            <Live video={video} onLoadMetadata={handleLoadMetadata} onTimeChange={handleTimeChange} />
            <Timeline />
            <Footer duration={duration} currentTime={currentTime} />
        </>
    );
}
