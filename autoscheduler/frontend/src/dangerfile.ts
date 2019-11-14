import {message, warn, danger} from 'danger';

const modified = danger.git.modified_files.join('- ');
message('Number of modified files in this PR: \n - ' + modified);
