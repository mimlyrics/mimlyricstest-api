const mongoose = require("mongoose");

const lyricSchema = mongoose.Schema({
    path: {
        type: String,
    },
    photo: {
        type: String
    },
    originalname: {
        type: String,
        required: true
    },
    lyric: String,
    extension: {
        type: String,
    },
    size: {
        type: Number
    },
    category: {
        type: String,
        required: true
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    artistName: {
        type: String,
    },
    downloads: {
        type: Number,
        default: () => 0
    },
    points: {
        type: Number,
        default: () => 0
    },
    country: {
        type: String,
        default: () => ""
    },
    views: {
        type: Number,
        default: () => 0
    },
    shares: {
        type: Number,
        default: () => 0
    },
    comments: {
        type: Number,
        default: () => 0
    },
    likes: [
        {type: mongoose.SchemaTypes.ObjectId,ref: 'User'},  
    ],
    isReviewed: {
        type: Boolean,
        default: () => false   
    },
    isPopular: {
        type: Boolean,
        default: () => false  
    }
}, {
    timestamps: true
})
const Lyric = mongoose.model('Lyric', lyricSchema);
module.exports = Lyric;