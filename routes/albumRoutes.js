const router = require("express").Router();
const {createAlbum, audioAlbum , getRecentAlbum, getAlbums, clearAlbums, deleteAlbum,
    editAlbum2, editAlbum, searchAlbums } = require("../controllers/albumController");
const multer = require("multer");
const fs = require("fs");
const DIR = "./public/album";
const path = require("path");
createFolder(DIR);
async function createFolder(DIR) {
    try {
        if(!fs.existsSync(DIR)) {
            fs.mkdirSync(DIR);
        }
    }catch(err) {
        console.log(err);
    }
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, DIR);
    },
    filename: function(req,file,cb) {
        const uniqueSuffix = Date.now() + Math.round(Math.random() *1E9);
        cb(null, file.fieldname + uniqueSuffix + path.extname(file.originalname));
    }
})

function fileFilter(req, file, cb) {
    if(file.mimetype.split("/")[0] === 'audio' || file.mimetype.split("/")[1] === 'image') {
        cb(null, true);
    }else {
        cb(new Error('file not of correct type'), false);
    }
}

const upload = multer({storage});
router.route("/album").post(upload.single("file"), createAlbum).get(getRecentAlbum);
router.route("/album/audios/:albumId").put(upload.array("files", 12), audioAlbum);
router.route("/album/edit2/:albumId").put(editAlbum2);
router.route("/album/edit/:albumId").put( upload.single("file"), editAlbum);
router.route("/album/audio").put(audioAlbum);
router.route("/album/:albumId").delete(deleteAlbum);
router.route("/album/:category").get(getAlbums).delete(clearAlbums);
router.route("/album/search/:searchId").put(searchAlbums)
module.exports = router;