const directory_header = document.getElementById('directory-value');
const directory_contents = document.getElementById('directory-contents');
const footer_pwd = document.getElementById('pwd');

const fs = require('fs');
const path = require('path');
const process = require('process');

// Get the current directory name (only the folder name)
directory_header.innerText = process
    .cwd()
    .split('\\')
    .slice(-1)[0];

// Footer has entire directory string
footer_pwd.innerText = process.cwd();

// Get the current directory contents and add them to the sidebar
fs.readdir(process.cwd(), function(err, files) {
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
            li.classList.add('directory-file');
        }
        // !TODO add additional movie file extensions here?
        // Should I be checking MIME types?
        if (path.extname(path.join(__dirname, file.toString())) === '.mp4') {
            li.classList.add('movie-file');
        }

        li.appendChild(text);
        directory_contents.appendChild(li);
    });
});
