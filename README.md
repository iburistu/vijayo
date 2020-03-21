# vijayo (vih-JAY-oh) ![Test CI](https://github.com/iburistu/vijayo/workflows/Test%20CI/badge.svg) ![Build CI](https://github.com/iburistu/vijayo/workflows/Build%20CI/badge.svg)

![vijayo](static/icon.png)

Icon by [Spencer Goulette](https://github.com/SpencerGoulette)

vijayo is an open source video editor written in Electron and powered by FFmpeg ported to WebAssembly.

vijayo is **not**:

-   Windows Movie Maker circa Windows XP
-   Sony Vegas Pro
-   Shotcut

vijayo aims to be simple and easy to use. Nothing more, nothing less.

## Building vijayo:

`yarn` is preferred.

```sh
$ yarn install
$ yarn start
```

`electron-forge` is the build tool for vijayo. To package vijayo for release, run

```sh
$ yarn package
$ yarn make
```

I still haven't added icons yet. I'll get to that eventually.

## Testing vijayo:

You can test vijayo with

```sh
$ yarn test
```

`mocha` and `spectron` are used to test vijayo. These tests cannot currently be run inside of the Github action CI/CD pipeline. Don't know how to fix that!

## Roadmap:

I'd like to get vijayo to MVP status eventually.

Pressing additions:

-   [x] File I/O
-   [x] Loading in \*.mp4 files
-   [x] Video controls
-   [ ] Timeline view
-   [ ] Exporting

### File I/O:

File I/O is _effectively_ done. It's hanging on by a thread though. Right now there's some janky code that's enabling the I/O to work, and I'd like to fix it up eventually. Additionally, it could use some styling flair. Drag and drop maybe?

### Loading in \*.mp4 files:

This is primarily done. I'd like to add tabs of all the currently open files with details about each. This might require `FFmpeg` to get all the metadata I want. Right now all it does is basic (think very basic) metadata scanning.

### Video Controls:

There are very basic video controls. Play/pause works, rewind works, and fast-forward works. I'm not a huge fan of the implementation, but it just needs to work. Refactoring is necessary.

### Timeline View:

N/A

### Exporting:

N/A

## Contributing:

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

`prettier` is used to enforce the code style. Please honor it :).

## License

vijayo is under the MIT license.
