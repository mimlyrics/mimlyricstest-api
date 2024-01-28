const mongoose = require("mongoose");

const albumSchema = mongoose.Schema({
    name: {
        type: String,
    },
    photo: {
        type: String,
        default: () => ''
    },
    category: String,
    title: String,
    artistName: String,
    points: Number,
    country: String,
    isPopular: Boolean,
    description: String,
    lyric: [ { 
        title: {type: String, default: () => ''},      
        artistName: {type:[String], default: []},
        text: {type: String, default: () => ''},
        audio: {type: String, default: () => ''},
        originalname: {type: String, default: ()=> ''},
        views: {type: Number, default: () => 0},
        likes: {type: [mongoose.SchemaTypes.ObjectId], default: () => []}
    }]    
}, 
{
    timeStamps: true
})

const Album = mongoose.model('Album', albumSchema);
module.exports = Album;