const router = require("express").Router();
const multer = require("multer");
const {GridFsStorage} = require("multer-gridfs-storage");

const Picture = require('../models/Picture');

const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    filename: function(req, file, cb) {
        //cb(null, file.originalname + uniqueSuffix + "." + file.mimetype.split("/")[1]);
        const filename = file.originalname + uniqueSuffix + "." + file.mimetype.split("/")[1];
        const fileInfo = {
            filename: filename,
            bucketName: "images"
        }
        return fileInfo;
    } 
})
const upload = multer({storage, fileFilter});

function fileFilter(req, file, cb) {
    if(file.mimetype.split("/")[0] === "image") {
        cb(null, true);
    }
    else {
        cb(new Error('File not of the correct type'), false);
    }
}
const fs = require('fs');
const path = require('path');

router.route("/upload/profilepicture").post(upload.single('picture'), async function(req, res) {
    try {        
        // create a new MongoDB GridFS file
        const writeStream = gfs.createWriteStream({
        filename: file.filename,
        contentType: file.mimetype,
        mode: 'w'
        });
        // pipe the file data to the GridFS file
        readStream.pipe(writeStream);

        writeStream.on('close', (file) => {
        // file is saved, return the file details
        return res.json({ message: 'File uploaded successfully', file });
    });
    }
    catch(err) {
        throw new Error(`Upload failed`);
    }
});

router.get("/", () => {})

module.exports = router