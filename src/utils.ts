import * as fs from 'fs';
import * as path from 'path';
import React, { useState, useEffect, useRef } from 'react';

export const isDir = (path: string): Boolean => {
    try {
        return fs.lstatSync(path).isDirectory();
    } catch (e) {
        return false;
    }
};

export const getDirContents = (path: string): Array<string> => {
    const directories: Array<string> = [];
    const files: Array<string> = [];

    try {
        fs.readdirSync(path).forEach(e => {
            if (isDir(e)) directories.push(e);
            else files.push(e);
        });
    } catch (e) {
        return [];
    }

    return [...directories.sort(), ...files.sort()];
};

export const getBasename = (dir: string): string => {
    return path.basename(dir);
};

export const sec2hms = (duration: number): string => {
    let hours = ~~(duration / 3600);
    let minutes = ~~(duration / 60) - 60 * hours;
    let seconds = ~~(duration % 60);
    let ms = ~~(((duration % 100) - seconds) * 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
};

export const movieFiles: Array<string> = ['.mp4', '.webm'];

export function useInterval(callback: any, delay: number) {
    const savedCallback: React.MutableRefObject<any> = useRef(null);

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
