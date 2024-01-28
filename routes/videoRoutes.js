const router = require('express').Router();
const multer = require('multer');
const DIR = "./public/mimlyrics/videos";
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

createVideoFolder(DIR);
async function createVideoFolder(DIR) {
    try {
        if(!fs.existsSync(DIR)) {
            fs.mkdirSync(DIR);
        }
    }catch(err) {
        console.log(err);
    }
}

const Video = require('../models/Video');
const asyncHandler = require("express-async-handler");
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
    if(file.mimetype.split("/")[0] === "video") {
        cb(null, true);
    }else {
        cb(new Error('Not a video file type'), false);
    }
} 

const upload = multer({storage,fileFilter, limits: {fileSize: 200_000_000}});

const {deleteVideo, similarVideo, putVideos, videoViews, likeVideo, getVideo, postVideo, searchVideo, getVideoById, EditVideo, downloadVideo } = require("../controllers/videoController");

router.route("/upload/video").post(upload.single("video"),postVideo);
router.route("/upload/video/:category").get(getVideo);
router.route("/upload/video/get/:id").get(getVideoById);
router.route("/upload/video/edit/:id").put(upload.single("video"),EditVideo);
router.route("/upload/video/similar/:mediaId").get(similarVideo);
router.route("/upload/video/:id").put(putVideos).delete(deleteVideo);
router.route("/upload/video/search/:searchId").get(searchVideo);
router.route("/video/download/:id").get(downloadVideo);
router.route("/video/views/:mediaId").put(videoViews);
// like and dislike
router.route("/video/like/:mediaId").put(likeVideo);;

module.exports = router;