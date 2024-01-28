const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const Video = require("../models/Video");
const postVideo =  asyncHandler ( async (req, res) => {
    try {
        console.log("video has been posted");
        console.log(req.file);
        const {category, title, description, artistName, points, isPopular, 
            country, isReviewed, isShort} = req.body;
        const extension = path.extname(req.file.originalname);
        const size = req.file.size;
        const pathx = req.protocol + "://" + req.get("host") + "/public/mimlyrics/" + req.file.filename;
        const originalname = req.file.originalname;
        const video = new Video({path:pathx, originalname: originalname, extension: extension, size: size, 
             category: category, title:title, description: description, artistName: artistName, points: points,
              country: country, isPopular: isPopular, isReviewed: isReviewed, isShort: isShort });
        await video.save();
        return res.status(201).json({video});
    }catch(err) {
        console.log(err);
        console.log("An error occured ");
    }
})

const getVideo =  async (req, res) => {
    try {
        const {category} = req.params;
        const videos = await Video.find({category: category});
        return res.status(201).json({videos});
    }catch(err) {
        throw new Error(`Something went wrong, while trying get request for our videos`);
    }
}

const getVideoById = async (req, res) => {
    const {id} = req.params;
    try {
        const video = await Video.findById({_id: id});
        return res.status(201).json({video});
    }catch(err) {
        throw new Error( {message: `Something went wrong, while trying get request for our videos`});
    }
}

/*const searchVideo = asyncHandler(async (req, res) => {
    const {searchId} = req.params;
    const searchvideos = await Video.find({$or: [{title:searchId}, {category:searchId}, {artistName:searchId}, {description: searchId}]});
    if(searchvideos) {
        return res.status(201).json({searchvideos});
    }else{
        return res.status(404).json({message:`No videos with such id`});
    }
})*/

const searchVideo = asyncHandler(async (req, res) => {
    const {searchId} = req.params;
    const videos = await Video.find({});
    if(videos) {
        const searchvideos = videos.filter(video => video.title.toLowerCase().includes(searchId.toLowerCase()));
        if(!searchvideos) {
            searchvideos = videos.filter(video => video.artistName.toLowerCase().includes(searchId.toLowerCase()));
        }
        if(!searchvideos) {
            searchvideos = videos.filter(video => video.category.toLowerCase().includes(searchId.toLowerCase()));
        }if(!searchvideos) {
            console.log("humm");
            searchvideos = videos.filter(video => video.country.toLowerCase().includes(searchId.toLowerCase()));
        }
        console.log(searchvideos);
        return res.status(201).json({searchvideos});
    }
})

const deleteVideo =  asyncHandler( async (req, res) => {
    const {id} = req.params;
    console.log("Hey bro");
    const video = await Video.findByIdAndDelete({_id: id});
    console.log(video.pathx);
    if(video.path) {
        const splitVideo = video.path.split(":5000");
        const deletevideo = "." + splitVideo[1];
        console.log(deletevideo);
        fs.unlink(deletevideo, (err) => {
            if (err) throw err;
            console.log("file has been deleted successfully");
        });
    }
    return res.status(200).json('successfully deleted file'); 
})

const likeVideo = asyncHandler (async (req, res) => {
    const {userId} = req.body;
    const {mediaId} = req.params;
    const likeExists = await Video.findOne({_id:mediaId}).where({'likes': userId });
    console.log(likeExists);
    if(likeExists) {
        const video = await Video.findByIdAndUpdate({_id: mediaId}, {$pull: {likes: userId}}, {new: true, validator: true});
        console.log('existed and has been pulled');
        if(video) {
            return res.status(201).json({video});
        }
    }else {
        const video = await Video.findByIdAndUpdate({_id: mediaId}, {$push: {likes: userId}}, {new: true, validator: true});
        console.log(video);
        console.log("not existed and has been pushed");
        if(video) {
            return res.status(201).json({video});
        }
    }

})

const videoViews = asyncHandler(  async (req, res) => {
    const {mediaId} = req.params;
    const video = await Video.updateOne({_id: mediaId}, {$inc: {views:1}}, {new:true, validator: true});
    console.log(video);
    if(video) {
        return res.status(201).json({video});
    }
})

const downloadVideo = async (req, res) => {
    const {id} = req.params;
    const video = await Video.findById({_id:id});
    if(video) {
        const splitVideo = video.path.split(":5000");
        const downloadVideoPath = "." + splitVideo[1];
        res.download(downloadVideoPath, function(err) {
            console.log(err);
        })
    }else {
        return res.status(400).json({message: `Error while trying to download the file`});
    }
}

const EditVideo = async (req, res) => {
    const {id} = req.params
    const video = await Video.findById({_id:id});
    console.log(video);
    if(video) {
        video.artistName = req.body.artistName || video.artistName,
        video.title = req.body.title || video.title,
        video.description = req.body.description || video.description
        video.country = req.body.country || video.country
        video.category = req.body.category || video.category
        video.points = req.body.points || video.points
        video.famous = req.body.famous || video.famous
        await video.save();
        return res.status(201).json({video});
    }else {
        return res.status(404).json({message: `No video with such id`});
    }
}

const similarVideo = asyncHandler(async (req, res) => {
    const {mediaId} = req.params;
    const video = await Video.findById({_id: mediaId});
    if(video) {
        const sVideo = await Video.find({country: video.country }).sort({createdAt: 1}).limit(15);
        return res.status(201).json({sVideo});
    }
})

const putVideos = async () => {
    const {id} = req.params;
    const {views} = req.body;
    parseInt(views);
    views +=views;
    const video = await Video.findById({_id: id});
    if(video) {
        video.views = parseInt(video.views) + 1 || views
    }
    return res.status(201).json({video});
}

module.exports = {postVideo, similarVideo, videoViews, likeVideo, getVideo, 
    putVideos, deleteVideo, searchVideo, getVideoById, EditVideo, downloadVideo};