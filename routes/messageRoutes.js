const router = require('express').Router();
const multer = require('multer');
const DIR = "./public/messages";
const path = require('path');
const fs = require('fs');


const messagesFolder = async (DIR) => {
    try {
        if(!fs.existsSync(DIR)) {
            fs.mkdirSync(DIR) 
        }
    }catch(err) {
        console.error(err);
    }
}
messagesFolder(DIR);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIR);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + uniqueSuffix + path.extname(file.originalname));
    }
})

async function createMessageFolder(DIR) {
    try {
        if(!fs.existsSync(DIR)) {
            fs.mkdirSync(DIR);    
        }
    }catch(err) {
        console.log(err);
    }
}
createMessageFolder(DIR);


/*function fileFilter(req, file, cb) {
    if(file.mimetype.split("/")[0] === "image" || file.mimetype.split("/")[0] === "audio" || file.mimetype.split("/")[0] === "video") {
        cb(null, true);
    }else {
        cb(new Error('Not a audio/video/image file type'), false);
    }
}*/ 

const upload = multer({storage, limits: {fileSize: 200_000_000}});
const {addMessage, deleteMessage, getAllMessages, getAllMessagesInRoom} = require('../controllers/chatUserController');

router.route('/message').post(upload.array("files", 10),addMessage);
router.route('/message/:messageId').delete(deleteMessage).get(getAllMessages);
router.route("/message/:room/:phone").get(getAllMessagesInRoom);
module.exports = router;