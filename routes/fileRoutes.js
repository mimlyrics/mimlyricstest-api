const router = require('express').Router();
const fs = require('fs');
const multer = require('multer');
const DIR = "./public/mimlyrics/post";
createRoomFolder(DIR);
async function createRoomFolder(DIR) {
    try {
        if(!fs.existsSync(DIR)) {
            fs.mkdirSync(DIR);
        }
    }catch(err) {
        console.log(err);
    }
}

const path = require('path');
const {postFile, getFile, deleteFile} = require("../controllers/fileController")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIR);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + uniqueSuffix + path.extname(file.originalname));
    }
})

function fileFilter(req, file, cb) {
    if(file.mimetype.split("/")[0] === "image" || file.mimetype.split("/")[0] === 'video' || file.mimetype.split("/")[0] === 'audio') {
        cb(null, true);
    }else {
        cb(new Error('Not an accepted file type. must only be an audio/image/video'), false);
    }
} 

const upload = multer({storage, fileFilter, limits: {fileSize: 200_000_000}});

router.post("/upload/file/:conversationId", upload.array("files", 10), postFile);
router.get("upload/file/:conversationId", getFile);
router.delete("upload/file/:conversationId", deleteFile);