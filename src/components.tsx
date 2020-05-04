import React, { useState, useEffect, useRef } from 'react';
import * as path from 'path';

import { isDir, getDirContents, getBasename, sec2hms, movieFiles } from './utils';

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
    paused: boolean;
    onLoadMetadata: any;
    onTimeChange: any;
    onPlayPause: any;
    videos: Array<VideoFile>;
    onVideoRemoval: any;
};

type VideoProps = {
    video: React.MutableRefObject<any>;
    paused: boolean;
    onLoadMetadata: any;
    onTimeChange: any;
    onPlayPause: any;
};

type VideoDetailsProps = {
    videos?: Array<VideoFile>;
    videoRef?: React.MutableRefObject<any>;
    onVideoRemoval: any;
};

type TabProps = {
    label: string;
    activeTab: string;
    onClickTab: any;
    onVideoRemoval: any;
};

type TimelineProps = {
    duration: number;
    currentTime: number;
    videos: Array<string>;
    timelineScale: number;
    videoRef: React.MutableRefObject<any>;
};

type FooterProps = {
    duration: number;
    currentTime: number;
    currentDir: string;
};

interface Disposition {
    default: number;
    dub: number;
    original: number;
    comment: number;
    lyrics: number;
    karaoke: number;
    forced: number;
    hearing_impaired: number;
    visual_impaired: number;
    clean_effects: number;
    attached_pic: number;
    timed_thumbnails: number;
}

interface Tags {
    major_brand: string;
    minor_version: string;
    compatible_brands: string;
    encoder?: string;
    creation_time?: Date;
}

interface VideoStream {
    index: number;
    codec_name: string;
    codec_long_name: string;
    profile: string;
    codec_type: string;
    codec_time_base: string;
    codec_tag_string: string;
    codec_tag: string;
    width: number;
    height: number;
    coded_width: number;
    coded_height: number;
    has_b_frames: number;
    sample_aspect_ratio: string;
    display_aspect_ratio: string;
    pix_fmt: string;
    level: number;
    chroma_location: string;
    refs: number;
    is_avc: string;
    nal_length_size: string;
    r_frame_rate: string;
    avg_frame_rate: string;
    time_base: string;
    start_pts: number;
    start_time: string;
    duration_ts: number;
    duration: string;
    bit_rate: string;
    bits_per_raw_sample: string;
    nb_frames: string;
    disposition: Disposition;
    tags: Tags;
}

interface AudioStream {
    index: number;
    codec_name: string;
    codec_long_name: string;
    profile: string;
    codec_type: string;
    codec_time_base: string;
    codec_tag_string: string;
    codec_tag: string;
    sample_fmt: string;
    sample_rate: string;
    channels: number;
    channel_layout: string;
    bits_per_sample: number;
    r_frame_rate: string;
    avg_frame_rate: string;
    time_base: string;
    start_pts: number;
    start_time: string;
    duration_ts: number;
    duration: string;
    bit_rate: string;
    max_bit_rate: string;
    nb_frames: string;
    disposition: Disposition;
    tags: Tags;
}

interface VideoFormat {
    filename: string;
    nb_streams: number;
    nb_programs: number;
    format_name: string;
    format_long_name: string;
    start_time: string;
    duration: string;
    size: string;
    bit_rate: string;
    probe_score: string;
    tags: Tags;
}

interface VideoFile {
    streams: [VideoStream, AudioStream];
    format: VideoFormat;
}

const generateDirectories = (pathName: string, e: string, onVideoChange: any): JSX.Element => {
    if (isDir(path.join(pathName, e.toString()))) {
        return <Dir key={e.toString()} dirPath={path.join(pathName, e.toString())} onVideoChange={onVideoChange} />;
    }
    if (movieFiles.includes(path.extname(e))) {
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
                {toggled && contents?.map((e) => generateDirectories(dirPath, e, onVideoChange))}
            </ul>
        </>
    );
};

export const Explorer = ({ currentDir, onVideoChange }: ExplorerProps) => {
    return (
        <div className="directory">
            <h6 id="directory-header">EXPLORER</h6>
            <div id="directory-value">{path.basename(currentDir)}</div>
            <ul id="directory-contents">
                {getDirContents(currentDir)?.map((e) => generateDirectories(currentDir, e, onVideoChange))}
            </ul>
        </div>
    );
};

const Tab = ({ label, activeTab, onClickTab, onVideoRemoval }: TabProps) => {
    return (
        <li
            onClick={() => onClickTab(label)}
            style={{
                borderBottom: label === activeTab ? '3px solid rebeccapurple' : 'none',
                color: label === activeTab ? 'white' : 'inherit',
            }}
        >
            <span>{getBasename(label)}</span>
            {label === activeTab && (
                <button onClick={() => onVideoRemoval(label)} className="video-details-button">
                    X
                </button>
            )}
        </li>
    );
};

const VideoDetails = ({ videos, videoRef, onVideoRemoval }: VideoDetailsProps) => {
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        setActiveTab(videos[videos.length - 1]?.format.filename);
    }, [videos]);

    const onClickTab = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div className="video-details">
            <ol className="video-details-tabs">
                {videos.map((e) => (
                    <Tab
                        label={e.format.filename}
                        activeTab={activeTab}
                        key={e.format.filename}
                        onClickTab={onClickTab}
                        onVideoRemoval={onVideoRemoval}
                    />
                ))}
            </ol>

            <div className="video-details-content">
                {videos.map((video) => {
                    if (video.format.filename !== activeTab) return undefined;
                    return (
                        <React.Fragment key={video.format.filename}>
                            <div className="video-details-text" key={video.format.filename}>
                                <p>File name: {getBasename(video.format.filename)}</p>
                                <p>Video type type: {video.format.format_long_name}</p>
                                <p>Video duration: {sec2hms(parseFloat(video.format.duration))}</p>
                            </div>
                            <button
                                className="video-details-button"
                                onClick={() => (videoRef.current.src = video.format.filename)}
                            >
                                Add to timeline
                            </button>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

const Video = ({ video, paused, onLoadMetadata, onTimeChange, onPlayPause }: VideoProps) => {
    return (
        <div className="live-container">
            <video
                ref={video}
                id="live-video"
                onLoadedMetadata={() => onLoadMetadata(video.current.duration)}
                onTimeUpdate={() => onTimeChange(video.current.currentTime)}
                preload="auto"
            ></video>
            <div id="live-control" className="live-control">
                <svg
                    onClick={() => {
                        video.current.currentTime = 0;
                    }}
                    id="skip-back"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                >
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" fill="#d6d6d6" />
                    <path d="M0 0h24v24H0z" fill="none" />
                </svg>
                <svg id="rewind" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" fill="#d6d6d6" />
                    <path d="M0 0h24v24H0z" fill="none" />
                </svg>
                <svg
                    onClick={() => onPlayPause()}
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

export const Live = ({
    video,
    paused,
    onLoadMetadata,
    onTimeChange,
    onPlayPause,
    videos,
    onVideoRemoval,
}: LiveProps) => {
    return (
        <div className="live">
            <VideoDetails videos={videos} videoRef={video} onVideoRemoval={onVideoRemoval} />
            <Video
                video={video}
                paused={paused}
                onLoadMetadata={onLoadMetadata}
                onTimeChange={onTimeChange}
                onPlayPause={onPlayPause}
            />
        </div>
    );
};

export const Timeline = ({ duration, currentTime, videos, timelineScale, videoRef }: TimelineProps) => {
    const verticalLine = useRef(null);
    const currentOverflow = useRef(null);

    const mouseHandler = (e: React.MouseEvent<any>, offset: number, videoRef: React.MutableRefObject<any>) => {
        e.preventDefault();

        // Typescript complains about getBoundingClientRect()...it does exist, in fact!
        // @ts-ignore
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;

        // Set the cursor to the right place
        verticalLine.current.style.left = `${x}px`;
        verticalLine.current.style.top = `${offset * 80 + 20}px`;

        // Set the current time to match the new position
        // Because everything is in percentages, we need to calc the
        // percentage of a current row
        let percentRow = x / rect.width;
        videoRef.current.currentTime = percentRow * 60 + offset * 60;
    };

    const generateTimeline = (duration: number) => {
        let timelineElements: Array<React.ReactElement> = [];
        let overflow: number = duration % 60;
        let rows: number = ~~(duration / 60);
        for (let i: number = 0; i < rows; i++) {
            timelineElements.push(
                <div key={i} className="timeline-element-wrapper">
                    <div onDoubleClick={(e) => mouseHandler(e, i, videoRef)} className="timeline-video-element"></div>
                </div>
            );
        }

        if (overflow) {
            timelineElements.push(
                <div key={overflow} className="timeline-element-wrapper">
                    <div
                        onDoubleClick={(e) => mouseHandler(e, rows, videoRef)}
                        className="timeline-video-element"
                        style={{ width: `${(overflow / 60) * 100}%` }}
                        ref={currentOverflow}
                    ></div>
                </div>
            );
        }

        return timelineElements;
    };

    const generateGuidelines = (scale: number, separator: string = '.') => {
        const divisions = ~~(60 / scale);
        let guidelines: Array<React.ReactElement> = [];

        for (let i: number = 0; i < divisions; i++) {
            guidelines.push(
                <span key={i} className="tick-container">
                    <span>{i * scale}</span>
                    <span>{separator}</span>
                    <span>{separator}</span>
                    <span>{separator}</span>
                    <span>{separator}</span>
                </span>
            );
        }
        return (
            <div className="timeline-header" style={{ gridTemplateColumns: `repeat(${divisions}, 1fr)` }}>
                {guidelines}
            </div>
        );
    };

    return (
        <div className="timeline">
            <div id="timeline-content" className="timeline-content">
                <div className="vertical-line-container">
                    <div
                        id="vertical-line"
                        className="vertical-line"
                        ref={verticalLine}
                        style={{
                            left: `${(currentTime % 60) * 1.6666666}%`,
                            top: `${~~(currentTime / 60) * 80 + 20}px`,
                        }}
                    ></div>
                </div>
                {generateGuidelines(timelineScale, '|')}
                {generateTimeline(duration)}
            </div>
        </div>
    );
};

export const Footer = ({ duration, currentTime, currentDir }: FooterProps) => {
    return (
        <div className="footer">
            <span id="pwd">{currentDir}</span>
            <div id="video-length">{`${sec2hms(currentTime)} / ${sec2hms(duration)}`}</div>
        </div>
    );
};