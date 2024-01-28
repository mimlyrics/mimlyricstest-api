const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const postComment = asyncHandler(async (req, res) => {
    console.log("post comment");
    const {mediaId, userId, text, username, userprofile, type} = req.body;
    //console.log(mediaId, userId, text, username, userprofile, type);
    const comment = new Comment({mediaId: mediaId, userId: userId, text: text, username:username, userprofile: userprofile, type:type});
    await comment.save();
    return res.status(201).json({comment});
})

const postCommentResponse = asyncHandler(async (req, res) => {
    console.log("put comment");
    const {txt, username, userprofile, userId} = req.body;
    const {responseCommentId: commentId} = req.params;
    console.log(txt, commentId);
    //console.log(txt, commentId, username, userprofile);
    const comment = await Comment.findById({_id: commentId});
    const _id = new mongoose.mongo.ObjectId();
    console.log(_id);
    let obj = {_id:_id,text:txt, userId: userId, username:username, userprofile: userprofile};
    if(comment) {
        console.log("yepp");
        comment.response.push(obj);
        await comment.save();
    }
    console.log(comment);
    return res.status(201).json({comment});
})

const getCommentResponse = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    const comment = await Comment.findById({_id: commentId});
    const {response} = comment;
    if(comment) {
        return res.status(201).json({response});
    }
})

const getComment = asyncHandler(async (req, res) => {
    const {mediaId} = req.params;
    const comments = await Comment.find({mediaId: mediaId});
    //console.log(comments);
    return res.status(201).json({comments});
    
})

const likeComment = asyncHandler (async (req, res) => {
    const {commentId} = req.params;
    const {userId} = req.body;
    console.log("Heyyy");
    console.log(commentId, userId);
    const likeExists = await Comment.findOne({_id:commentId}).where({'likes':userId});
    if(likeExists ) {
        console.log(likeExists);
        console.log("existed and has been pulled");
        const comment = await Comment.updateOne( {_id:commentId},{$pull: {likes: userId}}, {new: true, validator: true});
        return res.status(201).json({comment});
    }else {
        console.log("not existed and has been pushed");
        const comment = await Comment.updateOne({_id:commentId}, {$push: {likes:userId}}, {new: true, validator: true});
        return res.status(201).json({comment});
    }
})

const likeCommentResponse = asyncHandler (async (req, res) =>  {
    const {responseCommentId} = req.params;
    const {userId} = req.body;
    console.log(userId, responseCommentId);
    console.log("heyy");
    const likeExists = await Comment.findOne({"response._id": responseCommentId}).where({ "response.$.likes": userId});
    //const likeExists = await Comment.findOne({response});
    console.log(likeExists);
    if(likeExists) {
        //const video = await Comment.updateOne({"response._id": responseCommentId}, {$pull: {"response.$.likes": userId}});
        //console.log(video);
        console.log("existed and has been pulled");
        return res.status(201).json({video});
    }else {
        //const video = await Comment.updateOne({"response._id": responseCommentId}, {$push: {"response.$.likes": userId}} );
        //console.log(video);
        console.log("not existed and has been pushed");
        //return res.status(201).json({video});
    }
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    const comment = await Comment.findByIdAndDelete({_id:commentId});
    if(comment) {
        return res.status(200).json({message: `Comment has been deleted`});
    }
})

const deleteCommentResponse = asyncHandler(async (req, res) => {
    const { commentResponseId} = req.params;
    console.log(commentResponseId);
    const comment = await Comment.updateOne({"response._id": commentResponseId}, {$pull: {"response": {_id:commentResponseId}}});
    if(comment) {
        return res.status(201).json({comment});
    }
})

const editComment = asyncHandler(async (req, res) => {
    console.log("YEEAH")
    const {commentId} = req.params;
    const {text} = req.body;
    const comment = await Comment.findById({_id: commentId});
    if(comment) {
        comment.text = text || comment.text;
        await comment.save();
        return res.status(201).json({comment});
    }
})

const sortComment = asyncHandler(async (req, res) => {
    const {mediaId} = req.params;
    const {by} = req.body;
    if(by ==1 || by === "recent") {
        const comment = await Comment.findOne({mediaId: mediaId}).sort({updatedAt: -1});
        return res.status(201).json({comment});
    }else if(by==2 || by === "popular") {
        const comment = await Comment.findById({mediaId: mediaId}).sort({likes: {$gte:2}})
    }
})

module.exports = {getComment, sortComment, deleteComment, deleteCommentResponse, editComment, postComment, likeComment, likeCommentResponse, postCommentResponse, getCommentResponse};