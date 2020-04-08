import * as fs from 'fs';

export const isDir = (path: string): Boolean => {
    try {
        return fs.lstatSync(path).isDirectory();
    } catch (e) {
        return false;
    }
};

export const getDirContents = (path: string): Array<string> => {
    return fs.readdirSync(path).sort();
};
