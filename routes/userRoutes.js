const multer = require("multer");
const Picture = require('../models/Picture');
const DIR = "./public/profilePicture";
const path = require('path');
const fs = require("fs");
const User = require('../models/User');

createProfilePictureFolder(DIR);
async function createProfilePictureFolder(DIR) {
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

const router = require("express").Router()
const {protect, protectAdmin, protectEditor} = require("../middlewares/authMiddleware");
const {register, EditRole, auth, logout, AdminUpdateUser, getUserProfile, searchProfile,
    getUser, getUsersProfile, deleteUser, updateUserProfile, postAvatar, getAvatar, 
    deleteAvatar, protectAdminx, protectEditorx} = require("../controllers/usercontroller");
router.post("/jwt/register", register);
router.post("/jwt/auth", auth);
router.post("/jwt/logout", logout);
router.route("/admin/jwt/profile/:userId").get(getUser);
router.route("/jwt/profile").get( getUsersProfile).put(protect, updateUserProfile);
//router.route("/jwt/profile").get(protect, getUserProfile);
router.route("/upload/avatar/:userId").put(upload.single("avatar"), postAvatar).get(getAvatar).delete(deleteAvatar);
router.route("/jwt/delete/:userId").delete(deleteUser);
router.route("/jwt/profile/:searchId").get(searchProfile);
router.route("/jwt/profile/:userId/:hisId").put(upload.single("avatar"), AdminUpdateUser);
router.route("/jwt/role/:id").put(EditRole);
router.route("/jwt/protectAdmin").get(protectAdminx);
router.route("/jwt/protectEditor").get(protectEditorx);
module.exports = router;