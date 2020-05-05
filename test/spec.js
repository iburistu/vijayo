const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
const path = require('path');

const app = new Application({
    path: electronPath,
    args: [path.join(__dirname, '..', '.webpack', 'main', 'index.js')],
});

describe('Application launch', function () {
    this.timeout('60s');

    this.beforeAll(() => {
        return app.start();
    });

    this.afterAll(() => {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });

    it('shows an initial window', async () => {
        const count = await app.client.getWindowCount();
        return assert.equal(count, 1);
    });

    it('does not have the developer tools open', async () => {
        const devToolsAreOpen = await app.client.waitUntilWindowLoaded().browserWindow.isDevToolsOpened();
        return assert.equal(devToolsAreOpen, false);
    });
});
