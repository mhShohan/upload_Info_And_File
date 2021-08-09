const express = require('express');
const multer = require('multer');
const path = require('path');
const { create, list, read, randomId } = require('./lib/operation');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// file upload
const UPLOAD_FOLDER = './public/image/';
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, UPLOAD_FOLDER);
    },
    filename: (req, file, callback) => {
        const fileExt = path.extname(file.originalname);
        const fileName =
            file.originalname
                .replace(fileExt, '')
                .toLowerCase()
                .split(' ')
                .join('-') +
            '-' +
            Date.now();

        callback(null, fileName + fileExt);
    },
});
let upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000000000000,
    },
    fileFilter: (req, file, callback) => {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
            callback(null, true);
        } else {
            callback(new Error('Only Image file allowed..'));
        }
    },
});

//POST route
app.post('/database', upload.single('avater'), (req, res) => {
    const id = randomId(30);
    const image = `/image/${req.file.filename}`;
    const { yourName, email, phone, university, hometown, bloodGroup } =
        req.body;
    const data = {
        id,
        yourName,
        email,
        phone,
        university,
        hometown,
        bloodGroup,
        image,
    };
    create(id, data, (msg) => {
        return false;
    });
    res.redirect('/database');
});

//GET Route for the page
app.get('/database', (req, res) => {
    list((nameArr) => {
        let mainData = [];

        nameArr.map((item) => {
            let output = read(item);
            mainData.push(JSON.parse(output));
        });
        res.render('database.ejs', { data: mainData });
    });
});

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('*', (req, res) => {
    res.json({
        message: 'You hit wrong route...',
    });
});

//default error handler
app.use((err, req, res, next) => {
    if (err) {
        res.status(500).send(err.message);
    } else {
        res.send('Success');
    }
});

app.listen(8000, () => {
    console.log('http://localhost:8000');
});
