//depedencies
const fs = require('fs');
const path = require('path');

//module scafolding
const lib = {};

//base direvtory of data folder
lib.basedir = path.join(__dirname, '/../.data/');

////generate random ID
lib.randomId = (lengthOfStr) => {
    let str =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@$';
    let output = '';
    for (let i = 0; i <= lengthOfStr; i++) {
        output += str.charAt(Math.floor(Math.random() * str.length));
    }
    return output;
};

//create file and write data
lib.create = (fileName, data, callback) => {
    fs.open(`${lib.basedir}/${fileName}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringedData = JSON.stringify(data);

            fs.writeFile(fileDescriptor, stringedData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(
                                'Successfully create the file and write data..'
                            );
                        } else {
                            callback('cannot close the file');
                        }
                    });
                } else {
                    callback('Cannot write the file..');
                }
            });
        } else {
            callback('Cannot wirtefile , file may already exists');
        }
    });
};

//read the existing file
lib.read = (fileName, callback) => {
    let output = fs.readFileSync(`${lib.basedir}/${fileName}`, 'utf8');
    return output;
};

//list all the files in the directory
lib.list = (callback) => {
    fs.readdir(`${lib.basedir}/`, (err, filesName) => {
        if (!err && filesName && filesName.length > 0) {
            let trimmedFileNames = [];
            filesName.forEach((fileName) => {
                trimmedFileNames.push(fileName);
            });
            callback(trimmedFileNames);
        } else {
            callback('No File found...');
        }
    });
};

///exprot the module
module.exports = lib;
