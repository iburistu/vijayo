import './main.css';

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
            document.getElementById('directory-contents').innerHTML = '';
            set_directory_header(dir.filePaths[0]);
            set_footer_text(dir.filePaths[0]);
            get_current_directory_contents(dir.filePaths[0]);
            process.chdir(dir.filePaths[0]);
        }
    });
};

document.querySelector('#directory-button').addEventListener('click', open_directory_dialog);
