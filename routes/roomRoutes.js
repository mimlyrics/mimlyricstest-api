const router = require("express").Router();
const multer = require("multer");
const Picture = require('../models/Picture');
const DIR = "./public/mimlyrics/rooms";
const path = require('path');
const fs = require("fs");
const Room = require("../models/Room");

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

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, DIR);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
        cb(null,  file.fieldname + uniqueSuffix + path.extname(file.originalname));
    }
})

const upload = multer({storage: storage, fileFilter});
//const upload = multer({dest: "uploads/"});
function fileFilter(req, file, cb) {
    if(file.mimetype.split("/")[0] === "image") {
        cb(null, true);
    }
    else {
        cb(new Error('File not of the correct type'), false);
    }
}

const {createRoom, getAllRooms, getRoom, EditRoom, deleteRoom, searchRoom} = require("../controllers/roomController")

router.route("/room").post(upload.single("logo"), createRoom);
router.route("/room").get(getAllRooms);
router.route("/room/:name").get(getRoom).delete(deleteRoom);
router.route("/room/search/:searchId").get(searchRoom);
router.route("/room/:searchId").put(upload.single("logo"),EditRoom);
module.exports = router