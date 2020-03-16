const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
const path = require('path');

describe('Application launch', () => {
    this.timeout(10000);

    beforeEach(function() {
        this.app = new Application({
            path: electronPath,
            args: [path.join(__dirname, '..', 'src', 'index.js')],
        });
        return this.app.start();
    });

    afterEach(() => {
        if (this.app && this.app.isRunning()) {
            return this.app.stop();
        }
    });

    it('shows an initial window', () => {
        return this.app.client.getWindowCount().then(function(count) {
            assert.equal(count, 1);
        });
    });
});
