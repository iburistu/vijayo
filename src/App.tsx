import React from 'react';
import { Directory, Live, Timeline, Footer } from './components';

export function App() {
    return (
        <>
            <Directory directoryContents={['static', 'text.exe']} />
            <Live />
            <Timeline />
            <Footer />
        </>
    );
}
