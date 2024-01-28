const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const Lyric = require("../models/Lyric");
const DIR = "/public/mimlyrics";

const postLyric =  asyncHandler ( async (req, res) => {
    try {
        console.log("lyrics has been posted");
        //console.log(req.files);
        let photoy = {};
        let destination2 = "";
        let photox = "";
        let path = "";
        if(req.files) {
            const audio = req.files[0];
            for(let i=0; i<req.files.length;i++) {
                if(req.files[i].mimetype.split("/")[0] === 'image' ) {
                    photoy = req.files[i];
                    destination2 = req.files[i].destination.split(".")[1];
                    photox = req.protocol + "://" + req.get("host") + destination2 + "/" + req.files[i].filename
                }
                else if(req.files[i].mimetype.split("/")[0] === 'audio') {
                    const extension = path.extname(req.files[i].originalname);
                    const size = req.files[i].size;
                    const destination1 = req.files[i].destination.split(".")[1];
                    const pathx = req.protocol + "://" + req.get("host") + destination1 + "/" + req.files[i].filename
                    console.log(pathx);
                    console.log(photox);
                    const originalname = req.files[i].originalname;                    
                }
            }
            console.log(photoy, audio)
            const {category, title, lyric, description, artistName,
             points, country, isPopular, isReviewed, photo} = req.body;
            const lyricx = await Lyric.create({path:pathx, photo:photox, originalname: originalname, lyric:lyric, extension: extension, 
                    size: size, category: category, title:title, description: description, artistName: artistName, points: points, country: country,
                    isPopular: isPopular, isReviewed: isReviewed });
            await lyricx.save();
            console.log("has been posted");
            return res.status(201).json({lyricx});
        }
        }catch(err) {
            console.log(err);
            console.log("An error occured ");
        }
})

const getLyric =  async (req, res) => {
    try {
        const {category} = req.params;
        const lyrics = await Lyric.find({category: category});
        return res.status(201).json({lyrics});
    }catch(err) {
        return res.status(404).json({message: `No lyric exist`})
    }
}

const getLyricById = async (req, res) => {
    const {id} = req.params;
    try {
        const lyric = await Lyric.findOne({_id: id});
        return res.status(201).json({lyric});
    }catch(err) {
        return res.status(404).json({message: `No lyric with such id`});
    }
}

const searchLyrics = asyncHandler(async (req, res) => {
    const {searchId} = req.params;
    //const searchlyrics = await Lyric.find({$or: [{title:searchId}, {category:searchId}, {artistName:searchId}, {description: searchId}]});
    const lyrics = await Lyric.find({});
    if(lyrics) {
        let searchlyrics = lyrics.filter(lyric => lyric.title.toLowerCase().includes(searchId.toLowerCase()));
        if(!searchlyrics) {
            searchlyrics = lyrics.filter(lyric => lyric.artistName.toLowerCase().includes(searchId.toLowerCase()));
            if(!searchlyrics) {
               searchlyrics = lyrics.filter(lyric => lyric.category.toLowerCase().includes(searchId.toLowerCase())); 
            }
        }
        return res.status(201).json({searchlyrics});
    }else{
        return res.status(404).json({message:'Lyric has not been found'});
    }
})

const deleteLyric =  asyncHandler( async (req, res) => {
    const {id} = req.params;
    console.log("Hey bro");
    const lyric = await Lyric.findByIdAndDelete({_id: id});
    console.log(lyric.pathx);
    
    if(lyric.path && lyric.photo) {
        console.log(lyric)
        const splitLyric = lyric.path.split(":5000");
        const deletelyric = "." + splitLyric[1];
        const splitPhoto = lyric.photo.split(":5000");
        const deletePhoto = "." + splitPhoto[1]
        console.log(deletelyric);
        fs.unlink(deletelyric, (err) => {
            if (err) throw err;
            fs.unlink(deletePhoto, (err)=> {
                if (err) throw err;
            })
            console.log("file has been deleted successfully");
        });
    }
    return res.status(200).json('successfully deleted file'); 
})


const EditLyric = async (req, res) => {
    const {id} = req.params
    const lyric = await Lyric.findById({_id:id});
    if(lyric) {
        let photoy = {};
        let destination2 = "";
        let destination1 = "";
        let photox = "";
        let path = "";
        if(req.files) {
            if(lyric.path && lyric.photo) {
                //console.log(lyric)
                const splitLyric = lyric.path.split(":5000");
                const deletelyric = "." + splitLyric[1];
                const splitPhoto = lyric.photo.split(":5000");
                const deletePhoto = "." + splitPhoto[1]
                console.log(deletelyric);
                fs.unlink(deletelyric, (err) => {
                    if (err) console.log("No file with such name");
                    console.log("file has been deleted successfully");
                });
                fs.unlink(deletePhoto, (err) => {
                    if (err) console.log("No file with such name");
                    console.log("file has been deleted successfully");
                });
            }

            const audio = req.files[0];
            for(let i=0; i<req.files.length;i++) {
                if(req.files[i].mimetype.split("/")[0] === 'image' ) {
                    photoy = req.files[i];
                    destination2 = req.files[i].destination.split(".")[1];
                    lyric.photo = req.protocol + "://" + req.get("host") + destination2 + "/" + req.files[i].filename
                    console.log(lyric.photo);
                }
               
                else if(req.files[i].mimetype.split("/")[0] === 'audio') {
                    const size = req.files[i].size;
                    const destination1 = req.files[i].destination.split(".")[1];
                    lyric.path = req.protocol + "://" + req.get("host") + destination1 + "/" + req.files[i].filename
                    console.log(lyric.path);
                    const originalname = req.files[i].originalname;                    
                }
            }
            //console.log(lyric.photo, lyric.path);
        }
        lyric.path = lyric.path;;
        lyric.photo = lyric.photo;
        lyric.artistName = req.body.artistName || lyric.artistName,
        lyric.title = req.body.title || lyric.title,
        lyric.description = req.body.description || lyric.description
        lyric.country = req.body.country || lyric.country
        lyric.category = req.body.category || lyric.category
        lyric.points = req.body.points || lyric.points
        lyric.famous = req.body.famous || lyric.famous
        lyric.lyric = req.body.lyric || lyric.lyric
        console.log("lyrics has been posted");
        //console.log(req.files);

        const updatedLyric = await lyric.save();
        console.log(updatedLyric);
        return res.status(201).json({updatedLyric});

    }else {
        return res.status(404).json({message: `No video with such id`});
    }
}

// Likes and views

const likeLyric = asyncHandler (async (req, res) => {
    const {userId} = req.body;
    const {mediaId} = req.params;
    const likeExists = await Lyric.findOne({_id:mediaId}).where({'likes': userId });
    //console.log(likeExists);
    if(likeExists) {
        const lyric = await Lyric.findByIdAndUpdate({_id: mediaId}, {$pull: {likes: userId}}, {new: true, validator: true});
        console.log('existed and has been pulled');
        if(lyric) {
            return res.status(201).json({lyric});
        }
    }else {
        const lyric = await Lyric.findByIdAndUpdate({_id: mediaId}, {$push: {likes: userId}}, {new: true, validator: true});
        console.log(lyric);
        console.log("not existed and has been pushed");
        if(lyric) {
            return res.status(201).json({lyric});
        }
    }

})

const lyricViews = asyncHandler(  async (req, res) => {
    const {mediaId} = req.params;
    const like = await Lyric.updateOne({_id: mediaId}, {$inc: {views:1}}, {new:true, validator: true});
    console.log(like);
    if(like) {
        return res.status(201).json({like});
    }
})

module.exports = {postLyric, EditLyric, getLyric, getLyricById, 
    deleteLyric, searchLyrics, likeLyric, lyricViews }