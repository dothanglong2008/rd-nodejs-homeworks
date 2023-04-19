const express = require('express');
const logger = require('morgan');
const cors = require('cors')
const fs = require('fs');
const path = require('path');

const port = 8080;

const app = express();
app.use(logger('dev'));
app.use(cors());
app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());

const folderName = 'files';

// Create File
app.post('/api/files', (req, res, next) => {
    try {
        const filename = req.body.filename;
        const content = req.body.content;
        if (!filename) {
            throw new Error("Please specify 'filename' parameter")
        } else if (!content) {
            throw new Error("Please specify 'content' parameter")
        }
        if (!fs.existsSync(folderName)) {
            fs.mkdir(`./${folderName}`, (err) => {
                if (err) {
                    throw new Error();
                }
            })
        }
        fs.writeFile(`./${folderName}/${filename}`, content, (err) => {
            if (err) {
                next(err);
            }
            res.status(200).send(
                {
                    message: "File created successfully"
                }
            )
        })
    } catch (err) {
        if (err.message !== "Please specify 'filename' parameter"
            && err.message !== "Please specify 'content' parameter") {
            err.message = 'Server error'
        }
        next(err);
    }
});

// Get Files
app.get('/api/files', (req, res, next) => {
    try {
        fs.readdir(`./${folderName}`, (err, files) => {
            if (err) {
                err.message = "Client error";
                next(err);
            } else {
                try {
                    if (files.length === 0) {
                        throw new Error('Client error');
                    } else {
                        res.status(200).send({
                            message: "Success",
                            files: files
                        });
                    }
                } catch (err) {
                    if (err.message !== "Client error") {
                        err.message = 'Server error'
                    }
                    next(err);
                }
            }
        })
    } catch (err) {
        err.message = 'Server error'
        next(err);
    }
});

// Get file content
app.get('/api/files/:filename', (req, res, next) => {
    try {
        const filename = req.params.filename;
        const filePath = `./${folderName}/${filename}`;
        fs.stat(filePath, (err, stats) => {
            if (err) {
                err.message = `No file with \'${filename}\' filename found`;
                next(err);
            } else {
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        err.message = `No file with \'${filename}\' filename found`;
                        next(err);
                    } else {
                        res.status(200);
                        res.append('Content-Type', 'application/json', 'text/plain', 'application/javascript', 'application/xml');
                        res.send(
                            {
                                message: "Success",
                                filename: filename,
                                content: data.toString(),
                                extension: path.extname(filename).slice(1),
                                uploadedDate: stats.birthtime
                            }
                        );
                    }
                })
            }
        })
    } catch (err) {
        err.message = 'Server error'
        next(err);
    }
})

app.use((err, req, res, next) => {
    if (err.message === 'Server error') {
        res.status(500);
    } else {
        res.status(400);
    }
    res.send(
        {
            message: err.message
        });
    next(err);
})

app.listen(port);