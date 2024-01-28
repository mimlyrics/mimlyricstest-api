const mongoose = require("mongoose");
const Video = require("./Video");
const User = require("./User");
const commentSchema = mongoose.Schema({
    mediaId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Video'
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    text: {
        type: String
    },
    userprofile: {
        type: String
    },
    likes: [{type: mongoose.SchemaTypes.ObjectId, ref: 'User'}],
    kind: {
        type: String,
        enum: ['lyric', 'video'],
    },
    response: [
    {   
        _id: {
            type: mongoose.SchemaTypes.ObjectId,
        },
        userId: {
            type: mongoose.SchemaTypes.ObjectId
        },
        text: {
            type: String,
        },
        username: {
            type: String,
        },
        userprofile: {
            type: String,
        },
        likes: [{type:mongoose.SchemaTypes.ObjectId, ref: 'User'}]
    }
    ],
    username: {
        type: String,
    },
}, {
    timeStamps: true
})

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;