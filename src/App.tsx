import React, { useState, useRef } from 'react';
import { Explorer, Live, Timeline, Footer } from './components';

export function App() {
    const [videos, setVideos] = useState([]);
    const [duration, setDuration] = useState('00:00:00');
    const [currentTime, setCurrentTime] = useState('00:00:00');

    const video = useRef(null);

    const handleVideoChange = (vid: string) => {
        if (!videos.includes(vid)) {
            setVideos([...videos, vid]);
            video.current.src = vid;
        }
    };

    return (
        <>
            <Explorer currentDir={'vijayo'} handleVideoChange={handleVideoChange} />
            <Live video={video} />
            <Timeline />
            <Footer video={video} />
        </>
    );
}
