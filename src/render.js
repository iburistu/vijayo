const { remote } = require('electron');
const { dialog } = require('electron').remote;
const fs = require('fs');
const path = require('path');
const process = require('process');
const ffmpeg = require('ffmpeg.js');

const main_win = remote.getCurrentWindow();
const video = document.getElementById('live-video');
const playPause = document.getElementById('play-pause');
const playPauseSVG = playPause.childNodes[1];
const fastForward = document.getElementById('fast-forward');
const rewind = document.getElementById('rewind');

video.controls = false;

// Get the current directory name (only the folder name)
const set_directory_header = directory => {
    document.getElementById('directory-value').innerText = directory.split('\\').slice(-1)[0];
};

// Footer has entire directory string
const set_footer_text = text => {
    document.getElementById('pwd').innerText = text;
};

// Get sub directory contents
// !TODO create generic directory generation function
const get_sub_directory_contents = sub_dir => {
    return () => {
        fs.readdir(sub_dir, (err, files) => {
            if (err) return console.error(`Unable to scan sub-directory: ${err}`);
            let parent = document.getElementById(sub_dir.split('\\').slice(-1)[0]);
            let span = parent.childNodes[0];
            span.onclick = remove_sub_directory_contents(sub_dir);
            let ul = document.createElement('ul');
            ul.classList.add('sub-directory');
            files.sort().forEach(file => {
                let li = document.createElement('li');
                let text = document.createElement('span');
                text.innerText = file.toString();
                // !TODO make directory detection less flakey
                if (!path.extname(path.join(__dirname, file.toString())) && !file.toString().includes('.')) {
                    li.classList.add('directory-dir');
                    // Add ID so that the directory can be selected later
                    li.id = file.toString();
                    // Add click event listener
                    //text.addEventListener('click', get_sub_directory_contents(path.join(process.cwd(), file.toString())));
                    text.onclick = get_sub_directory_contents(path.join(sub_dir, file.toString()));
                    // Is this the best way to add more text?
                    text.innerText = ' - ' + text.innerText + '/';
                    text.classList.add('directory-text');
                }
                // !TODO add additional movie file extensions here?
                // Should I be checking MIME types?
                if (path.extname(path.join(__dirname, file.toString())) === '.mp4') {
                    li.classList.add('movie-file');
                    text.onclick = open_movie_file(path.join(sub_dir, file.toString()));
                }

                li.appendChild(text);
                ul.appendChild(li);
            });
            parent.appendChild(ul);
        });
    };
};

const remove_sub_directory_contents = sub_dir => {
    return () => {
        const current_dir = sub_dir.split('\\').slice(-1)[0];
        let parent = document.getElementById(current_dir);
        if (parent.childNodes[1] !== undefined) parent.removeChild(parent.childNodes[1]);
        parent.childNodes[0].onclick = get_sub_directory_contents(path.join(process.cwd(), current_dir));
    };
};

// Get the current directory contents and add them to the sidebar
const get_current_directory_contents = dir => {
    fs.readdir(dir, function(err, files) {
        if (err) {
            return console.error('Unable to scan directory: ' + err);
        }
        // Sort the files
        files.sort().forEach(file => {
            let li = document.createElement('li');
            let text = document.createElement('span');
            text.innerHTML = file.toString();
            // !TODO make directory detection less flakey
            if (!path.extname(path.join(__dirname, file.toString())) && !file.toString().includes('.')) {
                li.classList.add('directory-dir');
                // Add ID so that the directory can be selected later
                li.id = file.toString();
                // Add click event listener
                //text.addEventListener('click', get_sub_directory_contents(path.join(process.cwd(), file.toString())));
                text.onclick = get_sub_directory_contents(path.join(process.cwd(), file.toString()));
                // Is this the best way to add more text?
                text.innerText = ' - ' + text.innerText + '/';
                text.classList.add('directory-text');
            }
            // !TODO add additional movie file extensions here?
            // Should I be checking MIME types?
            if (path.extname(path.join(process.cwd(), file.toString())) === '.mp4') {
                li.classList.add('movie-file');
                text.onclick = open_movie_file(path.join(process.cwd(), file.toString()));
            }

            li.appendChild(text);
            document.getElementById('directory-contents').appendChild(li);
        });
    });
};

const open_directory_dialog = () => {
    let options = {
        title: 'Open directory...',
        properties: ['openDirectory'],
    };

    dialog.showOpenDialog(main_win, options).then(dir => {
        if (dir.filePaths !== undefined) {
            document.getElementById('directory-contents').innerHTML = '';
            process.chdir(dir.filePaths[0]);
            set_directory_header(dir.filePaths[0]);
            set_footer_text(dir.filePaths[0]);
            get_current_directory_contents(dir.filePaths[0]);
        }
    });
};

const open_movie_file = file => {
    return () => {
        video.setAttribute('src', file);
        video.setAttribute('type', `video/${file.split('.').slice(-1)[0]}`);
    };
};

document.getElementById('directory-button').addEventListener('click', open_directory_dialog);

playPause.addEventListener('click', () => {
    video.playbackRate = 1;
    if (video.paused || video.ended) {
        playPauseSVG.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');
        video.play().catch(console.warn);
    } else {
        playPauseSVG.setAttribute('d', 'M8 5v14l11-7z');
        video.pause();
    }
});

fastForward.addEventListener('click', () => {
    video.playbackRate *= 2;
});

rewind.addEventListener('click', () => {
    if (video.currentTime >= 5) {
        video.currentTime -= 5;
    } else {
        video.currentTime = 0;
    }
});

const convert_secs_to_hms = duration => {
    let hours = ~~(duration / 3600);
    let minutes = ~~(duration / 60) - 60 * hours;
    let seconds = ~~(duration % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
};

/* function getVideoImage(path, secs, callback) {
    var me = this, video = document.createElement('video');
    video.onloadedmetadata = function() {
      if ('function' === typeof secs) {
        secs = secs(this.duration);
      }
      this.currentTime = Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration);
    };
    video.onseeked = function(e) {
      var canvas = document.createElement('canvas');
      canvas.height = video.videoHeight * 0.125;
      canvas.width = video.videoWidth * 0.15;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      var img = new Image();
      img.crossOrigin = "anonymous"
      img.src = canvas.toDataURL();
      callback.call(me, img, this.currentTime, e);
    };
    video.onerror = function(e) {
      callback.call(me, undefined, undefined, e);
    };
    video.src = path;
}

function showImageAt(secs, div, src) {
    var duration;
    getVideoImage(
      src,
      function(totalTime) {
        duration = totalTime;
        return secs;
      },
      function(img, secs, event) {
        if (event.type == 'seeked') {
            div.appendChild(img);
        }
      }
    );
  } */

video.addEventListener('loadedmetadata', () => {
    document.getElementById('video-length').innerText = `00:00:00 / ${convert_secs_to_hms(video.duration)}`;
    let timeline = document.getElementById('timeline-content');
    // Each row is 60 seconds
    // Generate a new row for each 60 second break
    let overflow = video.duration % 60;
    let rows = ~~(video.duration / 60);
    let div, timeline_wrapper, span;
    //let last_time = 0;
    for (let i = 0; i < rows; i++) {
        timeline_wrapper = document.createElement('div');
        timeline_wrapper.classList.add('timeline-element-wrapper');

        div = document.createElement('div');
        div.classList.add('timeline-video-element');
        /* for (let j = 0; j < 5; j++) {
            last_time = (60 * i) + j;
            showImageAt(last_time, div, video.src); 
        } */
        /*         span = document.createElement('span');
        span.innerText = i;
        
        timeline_wrapper.appendChild(span); */
        timeline_wrapper.appendChild(div);
        timeline.appendChild(timeline_wrapper);
    }

    // If overflow is not zero, append the last row
    if (overflow) {
        timeline_wrapper = document.createElement('div');
        timeline_wrapper.classList.add('timeline-element-wrapper');

        div = document.createElement('div');
        div.classList.add('timeline-video-element');
        div.setAttribute('style', `width: ${~~((overflow / 60) * 100)}%`);
        /*         for (let i = 0; i < 5; i++) {
            showImageAt(last_time + i, div, video.src);
        }  */

        /*         span = document.createElement('span');
        span.innerText = rows;
        
        timeline_wrapper.appendChild(span); */
        timeline_wrapper.appendChild(div);
        timeline.appendChild(timeline_wrapper);
    }
});

const update_scrubber = () => {
    document
        .getElementById('vertical-line')
        .setAttribute(
            'style',
            `left: min(${(video.currentTime % 60) * 1.6666666}%, 100%); top: ${~~(video.currentTime / 60) * 80 + 20}px`
        );
    //document.getElementById('vertical-line').setAttribute('style', `left: 100%; top: ${~~(video.currentTime / 60) * 80 + 20}px`);
};

video.addEventListener('timeupdate', () => {
    document.getElementById('video-length').innerText = `${convert_secs_to_hms(
        video.currentTime
    )} / ${convert_secs_to_hms(video.duration)}`;

    window.requestAnimationFrame(update_scrubber);
});
