const router = require("express").Router();
const multer = require("multer");
const Picture = require('../models/Picture');
const DIR = "public/profilePicture/";
const path = require('path');
const fs = require("fs");
const User = require('../models/User');
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

module.exports = router