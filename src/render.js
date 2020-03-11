const { remote } = require('electron');
const { dialog } = require('electron').remote;
const fs = require('fs');
const path = require('path');
const process = require('process');

const main_win = remote.getCurrentWindow();

// Get the current directory name (only the folder name)
const set_directory_header = directory => {
    document.getElementById('directory-value').innerText = directory.split('\\').slice(-1)[0];
};

// Footer has entire directory string
const set_footer_text = text => {
    document.getElementById('pwd').innerText = text;
};

// Get the current directory contents and add them to the sidebar
const get_current_directory_contents = dir => {
    fs.readdir(dir, function(err, files) {
        if (err) {
            return console.error('Unable to scan directory: ' + err);
        }
        // Sort the files
        files.sort().forEach(function(file) {
            let li = document.createElement('li');
            let text = document.createElement('span');
            text.innerText = file.toString();
            // !TODO make directory detection less flakey
            if (!path.extname(path.join(__dirname, file.toString())) && !file.toString().includes('.')) {
                li.classList.add('directory-dir');
                // Is this the best way to add more text?
                text.innerText = ' - ' + text.innerText + '/';
            } else {
                text.classList.add('directory-file');
            }
            // !TODO add additional movie file extensions here?
            // Should I be checking MIME types?
            if (path.extname(path.join(__dirname, file.toString())) === '.mp4') {
                li.classList.add('movie-file');
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
            console.log(dir.filePaths);
            set_directory_header(dir.filePaths[0]);
            set_footer_text(dir.filePaths[0]);
            get_current_directory_contents(dir.filePaths[0]);
            process.chdir(dir.filePaths[0]);
        }
    });
};

open_directory_dialog();
