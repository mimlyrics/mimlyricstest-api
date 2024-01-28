const Room = require("../models/Room");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const createRoom = asyncHandler( async (req, res) => {
    const {name} = req.body;
    const roomExists = await Room.findOne({name});
    if(roomExists) {
        return res.status(404).json(`${name} already exists`);
    }
    if(req.file) {
        const logo = req.protocol + "://" + req.get("host") + "/public/room/" + req.file.filename;
        const room = await Room.create({name:name, logo: logo});
    }else {
        const room = await Room.create({ name });
    }
    return res.status(201).json({room});
})

const getAllRooms = asyncHandler( async (req, res) => {
    const rooms = await Room.find({});
    if(rooms) {
        res.status(201).json({rooms});
    }
    else{
        res.status(404);
        throw new Error(`No room exists`);
    }
})

const getRoom = asyncHandler (async (req, res) => {
    const {name} = req.params;
    const roomx = await Room.findOne({name:name});
    if(roomx) {
        return res.status(201).json({roomx});
    }
    else {
        return res.status(404).json({message: `No room with such name`});
    }
})

const deleteRoom = asyncHandler(async (req, res) => {
    const {name} = req.params;
    const roomx = await Room.findOneAndDelete({name:name});
    // delete logo from the server
    if(roomx.logo) {
        const roomSplit = roomx.logo.split(":5000");
        const deleteLogo = "." + roomSplit[1];   
        fs.unlink(deleteLogo, (err) => {
            if(err) return res.status(400).json({message: `file doesn't exist or could not found available path`});
            console.log("Deleted File successfully");
        })
    }
    else {
        return res.status(404).json({msg: `No room with such name: ${roomx}`});
    }
    return res.status(200).json(`Successfully deleted ${roomx.name}`);
})

const EditRoom = asyncHandler(async (req, res) => {
    const {searchId} = req.params;
    const {name} = req.body;
    const roomx = await Room.findOne({name:searchId});
    console.log(req.file);

    if(roomx && req.file) {
        const logo = req.protocol + "://" + req.get("host") + "/public/room/" + req.file.filename;
        roomx.name = req.body.name || roomx.name;
        if(roomx.logo) {
            const roomSplit = roomx.logo.split(":5000");
            const deleteLogo = "." + roomSplit[1]; 
            console.log(roomSplit);
            console.log(deleteLogo);
            fs.unlink(deleteLogo, (err) => {
                if(err) return res.status(400).json({message: `file doesn't exist or could not found available path`});
                console.log("Deleted File successfully");
            })
        }
        roomx.logo = logo || roomx.logo; 
    }else {
        roomx.name = req.body.name || roomx.name;
    }
    const updatedRoom = await roomx.save();
    console.log(updatedRoom);
    return res.status(201).json({updatedRoom});
})

const searchRoom = asyncHandler(async (req, res) => {
    const {searchId} = req.params;
    var roomx = await Room.find({});
    if(roomx) {
        const room = roomx.filter(room => room.name.toLowerCase().includes(searchId.toLowerCase()));
        return res.status(201).json({roomx: room});
    }
    else{
        return res.status(404).json({message: 'No similar entry found'});
    }
})

module.exports = {createRoom, deleteRoom, getAllRooms, getRoom, EditRoom, searchRoom};