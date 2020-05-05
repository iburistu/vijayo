import React, { useEffect, useState, useRef } from 'react';
import { ipcRenderer, remote } from 'electron';
import { Explorer, Live, Timeline, Footer } from './components';
import { useInterval } from './utils';

export function App() {
    const [videos, setVideos] = useState([]);
    const [paused, setPaused] = useState(true);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentDir, setCurrentDir] = useState(remote.app.getPath('videos'));

    // Video reference that is used to modify the video element in different contexts
    const video = useRef(null);

    // When adding a video to the tab queue, we only want to add new videos
    const handleVideoChange = (vid: string) => {
        ipcRenderer.send('new-video', vid);
    };

    // When the metadata is done loading for a video, we want to grab that duration
    const handleLoadMetadata = (seconds: number) => {
        setDuration(seconds);
    };

    // When a video is removed from the tab list, we want to remove it globally
    const handleVideoRemoval = (video: string) => {
        setVideos((c) => c.filter((e) => e.format.filename !== video));
    };

    // This handles time changes when paused (user control)
    const handleTimeChange = (time: number) => {
        if (paused) setCurrentTime(time);
    };

    // This toggles between play and pause
    const handlePlayPause = () => {
        setPaused((c) => {
            if (!c) {
                video?.current.pause();
                return true;
            } else {
                video?.current.play();
                return false;
            }
        });
    };

    // This polls the current time very frequently
    useInterval(() => {
        if (!paused) {
            setCurrentTime(video.current.currentTime);
            if (video.current.currentTime === duration) setPaused(true);
        }
    }, 51);

    useEffect(() => {
        ipcRenderer.on('chdir', (event, arg) => {
            setCurrentDir(arg);
        });

        ipcRenderer.on('video', (event, arg) => {
            if (arg === 'playPause') handlePlayPause();
            if (arg === 'restart') video.current.currentTime = 0;
            if (arg === 'forwardFrame') video.current.currentTime += 1 / 24;
            if (arg === 'backwardFrame') video.current.currentTime -= 1 / 24;
        });

        ipcRenderer.on('video-metadata', (event, arg) => {
            let obj = JSON.parse(arg);
            setVideos((c) => {
                if (c.filter((e) => e.format.filename === obj.format.filename).length === 0) return [...c, obj];
                else return c;
            });
        });

        // @ts-ignore
        return () => ipcRenderer.removeAllListeners();
    }, [handlePlayPause, video]);

    return (
        <>
            <Explorer currentDir={currentDir} onVideoChange={handleVideoChange} />
            <Live
                video={video}
                paused={paused}
                onLoadMetadata={handleLoadMetadata}
                onTimeChange={handleTimeChange}
                onPlayPause={handlePlayPause}
                videos={videos}
                onVideoRemoval={handleVideoRemoval}
            />
            <Timeline
                duration={duration}
                currentTime={currentTime}
                videos={videos}
                timelineScale={5}
                videoRef={video}
            />
            <Footer duration={duration} currentTime={currentTime} currentDir={currentDir} />
        </>
    );
}
