# vijayo (vih-JAY-oh)

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
$ yarn publish
```

I still haven't added icons yet. I'll get to that eventually.

## Roadmap:

I'd like to get vijayo to MVP status eventually.

Pressing additions:

-   [ ] File I/O
-   [ ] Loading in \*.mp4 files
-   [ ] Timeline view
-   [ ] Exporting

## Contributing:

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

`prettier` is used to enforce the code style. Please honor it :).

## License

vijayo is under the MIT license.
