import React, { useState, useRef, useEffect } from 'react';
import * as path from 'path';

import { isDir, getDirContents, getBasename, sec2hms } from './utils';

type DirProps = {
    dirPath: string;
    onVideoChange: any;
};

type ExplorerProps = {
    currentDir?: string;
    onVideoChange: any;
};

type LiveProps = {
    video: React.MutableRefObject<any>;
    onLoadMetadata: any;
    onTimeChange: any;
};

const generateDirectories = (pathName: string, e: string, onVideoChange: any): JSX.Element => {
    if (isDir(path.join(pathName, e.toString()))) {
        return <Dir dirPath={path.join(pathName, e.toString())} onVideoChange={onVideoChange} />;
    }
    if (path.extname(e) === '.mp4') {
        return (
            <li
                className={'movie-file'}
                onClick={() => onVideoChange(path.join(pathName, e.toString()))}
                key={e.toString()}
            >
                {e}
            </li>
        );
    } else return <li key={e.toString()}>{e}</li>;
};

const Dir = ({ dirPath, onVideoChange }: DirProps) => {
    const [contents, setContents] = useState(getDirContents(dirPath));
    const [toggled, setToggled] = useState(false);

    return (
        <>
            <span className={'directory-text directory-dir'} onClick={() => setToggled(!toggled)}>
                {`${getBasename(dirPath)}/`}
            </span>
            <ul className={'directory-contents'}>
                {toggled && contents?.map(e => generateDirectories(dirPath, e, onVideoChange))}
            </ul>
        </>
    );
};

export const Explorer = ({ currentDir, onVideoChange }: ExplorerProps) => {
    return (
        <div className="directory">
            <h6 id="directory-header">EXPLORER</h6>
            <div id="directory-value">{currentDir}</div>
            <ul id="directory-contents">
                {getDirContents(process.cwd())?.map(e => generateDirectories(process.cwd(), e, onVideoChange))}
            </ul>
            <button id="directory-button">Change Directory</button>
        </div>
    );
};

type VideoDetailsProps = {
    videos?: Array<string>;
};

const VideoDetails = ({ videos }: VideoDetailsProps) => {
    return (
        <div className="video-details">
            <div className="video-details-tabs">
                {videos?.map(e => (
                    <div>{getBasename(e)}</div>
                ))}
            </div>
        </div>
    );
};

type VideoProps = {
    video: React.MutableRefObject<any>;
    onLoadMetadata: any;
    onTimeChange: any;
};

const Video = ({ video, onLoadMetadata, onTimeChange }: VideoProps) => {
    const [paused, setPaused] = useState(true);

    return (
        <div className="live-container">
            <video
                ref={video}
                id="live-video"
                onLoadedMetadata={() => onLoadMetadata(video.current.duration)}
                onTimeUpdate={() => onTimeChange(video.current.currentTime)}
            ></video>
            <div id="live-control" className="live-control">
                <svg id="skip-back" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" fill="#d6d6d6" />
                    <path d="M0 0h24v24H0z" fill="none" />
                </svg>
                <svg id="rewind" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" fill="#d6d6d6" />
                    <path d="M0 0h24v24H0z" fill="none" />
                </svg>
                <svg
                    onClick={() => {
                        if (paused) {
                            video.current.play();
                            setPaused(false);
                        } else {
                            video.current.pause();
                            setPaused(true);
                        }
                    }}
                    id="play-pause"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                >
                    <path d={paused ? 'M8 5v14l11-7z' : 'M6 19h4V5H6v14zm8-14v14h4V5h-4z'} fill="#d6d6d6" />
                    <path d="M0 0h24v24H0z" fill="none" />
                </svg>
                <svg id="fast-forward" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" fill="#d6d6d6" />
                    <path d="M0 0h24v24H0z" fill="none" />
                </svg>
                <svg id="skip-forward" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" fill="#d6d6d6" />
                    <path d="M0 0h24v24H0z" fill="none" />
                </svg>
            </div>
        </div>
    );
};

export const Live = ({ video, onLoadMetadata, onTimeChange }: LiveProps) => {
    return (
        <div className="live">
            <VideoDetails />
            <Video video={video} onLoadMetadata={onLoadMetadata} onTimeChange={onTimeChange} />
        </div>
    );
};

export const Timeline = ({ ...props }) => {
    return (
        <div className="timeline">
            <div id="timeline-content" className="timeline-content">
                <div className="vertical-line-container">
                    <div id="vertical-line" className="vertical-line "></div>
                </div>
                <div className="timeline-header">
                    <span className="tick-container">
                        <span>0</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                    <span className="tick-container">
                        <span>5</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                    <span className="tick-container">
                        <span>10</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                    <span className="tick-container">
                        <span>15</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                    <span className="tick-container">
                        <span>20</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                    <span className="tick-container">
                        <span>25</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                    <span className="tick-container">
                        <span>30</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                    <span className="tick-container">
                        <span>35</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                    <span className="tick-container">
                        <span>40</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                    <span className="tick-container">
                        <span>45</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                    <span className="tick-container">
                        <span>50</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                    <span className="tick-container">
                        <span>55</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

type FooterProps = {
    duration: number;
    currentTime: number;
};

export const Footer = ({ duration, currentTime }: FooterProps) => {
    return (
        <div className="footer">
            <span id="pwd"></span>
            <div id="video-length">{`${sec2hms(currentTime)} / ${sec2hms(duration)}`}</div>
        </div>
    );
};
