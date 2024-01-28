const File = require("../models/File");
const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const postFile =  asyncHandler ( async (req, res) => {
    try {
        console.log("file has been posted");
        console.log(req.files);
        console.log(req.file);
        const {conversationId, from, to, description} = req.body;
        for(let i=0; i<req.files.length; i++) {
            const pathx = req.protocol + "://" + req.get("host") + `/public/${to}/` + req.files[i].filename;
        }
        const pathx = req.protocol + "://" + req.get("host") + `/public/${to}/` + req.file.filename;
        const file = new File({ conversationId: conversationId, from: from, to: to, path:pathx, description: description });
        await File.save();
        return res.status(201).json({file});
    }catch(err) {
        console.log(err);
    }
})

const getFile = asyncHandler(async (req, res) => {
    try {
        const {to} = req.params;
        const files = await File.find({to: to});
        return res.status(201).json({files});
    }catch(err) {
        throw new Error(`Something went wrong, while trying get request for our videos`);
    }
})

const deleteFile = asyncHandler(async (req, res) => {
    try {
        const {conversationId, from} = req.params;
        const file = await File.findOneAndDelete({conversationId: conversationId,from: from});
        return res.status(201).json("Files successfully deleted");
    }catch(err) {
        throw new Error('Somwething went wrong, while trying to delete the FIles');
    }
})

module.exports = {postFile, getFile};