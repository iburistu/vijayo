import * as React from 'react';

export function App() {
    return (
        <>
            <div className="directory">
                <h6 id="directory-header">EXPLORER</h6>
                <div id="directory-value"></div>
                <ul id="directory-contents"></ul>
                <button id="directory-button">Change Directory</button>
            </div>
            <div className="live">
                <div className="video-details">
                    <div className="video-details-tabs">
                        <div>big_buck_bunny_720p.mp4</div>
                        <div>big_buck_bunny_720p.mp4</div>
                        <div>big_buck_bunny_720p.mp4</div>
                    </div>
                </div>
                <div className="live-container">
                    <video id="live-video"></video>
                    <div id="live-control" className="live-control">
                        <svg
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
                            id="play-pause"
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 0 24 24"
                            width="24"
                        >
                            <path d="M8 5v14l11-7z" fill="#d6d6d6" />
                            <path d="M0 0h24v24H0z" fill="none" />
                        </svg>
                        <svg
                            id="fast-forward"
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 0 24 24"
                            width="24"
                        >
                            <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" fill="#d6d6d6" />
                            <path d="M0 0h24v24H0z" fill="none" />
                        </svg>
                        <svg
                            id="skip-forward"
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 0 24 24"
                            width="24"
                        >
                            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" fill="#d6d6d6" />
                            <path d="M0 0h24v24H0z" fill="none" />
                        </svg>
                    </div>
                </div>
            </div>
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
            <div className="footer">
                <span id="pwd"></span>
                <div id="video-length">00:00:00 / 00:00:00</div>
            </div>
        </>
    );
}
