const Room = require("../models/Room");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const asyncHandler = require("express-async-handler");
const path = require("path");
const fs  = require("fs");
const addConversation = asyncHandler( async (req, res) => {
    console.log("ok");
    const {sender, room} = req.body;
    const conversationExists = await Conversation.findOne({sender, room});
    if(conversationExists) {
        return res.status(400).json({message: 'conversation already exists'});
    }
    var conversation = new Conversation({
        sender: sender,
        room: room,
    })
    await conversation.save();
    console.log("conversation", conversation);
    if(conversation) {
        console.log("conversation has been created");
    }
    return res.status(201).json({conversation});
})

const addMessage = asyncHandler(  async (req, res) => {
    const { conversationId, from, to, text, avatar, username} = req.body;
    let mediax = [];
    let mimetypex = [];
    let mediaObject = {}
    console.log(req.files);
    const files = req.files
    if(files) {
        const destination = files[0].destination.split(".")[1];
        for(let i =0; i<files.length; i++) {
            console.log("humm");
            const mediaObject =  {path: req.protocol + "://" + req.get("host") + destination + "/" + files[i].filename, mimetype: files[i].mimetype}
            mediax.push(mediaObject);
        }
        const newMessage = new Message({conversationId: conversationId, from: from, to: to, 
            text: text, avatar: avatar, username: username, media:mediax})
        await newMessage.save();
        console.log(newMessage);
        return res.status(201).json({newMessage});    
    }else {
        const newMessage = new Message({conversationId: conversationId, from: from, to: to, text: text, avatar: avatar, username: username})
        await newMessage.save();
        return res.status(201).json({newMessage});           
    }
})

const deleteMessage = asyncHandler( async (req, res) => {
    const {messageId} = req.params;
    const message = await Message.findByIdAndDelete({_id:messageId});
    if(message.media) {
        const mediaSplit = message.media.split(":5000")[1];
        const deleteMessage = "." + mediaSplit
        fs.unlink(deleteMessage, (err) => {
            if (err) return res.status(404).json({message: "not correct path or file doesn't exist"});
        });
        return res.status(200).json('Successfully deleted');
    }    
})

const getAllMessages = asyncHandler( async (req, res) => {
    const {conversationId} = req.params;
    const messages = await Message.find({conversationId: conversationId});
    //console.log(messages);
    return res.status(201).json({messages});
})

const getAllMessagesInRoom = asyncHandler(async (req, res) => {
    const {room, phone} = req.params
    console.log(room, phone);
    var dayJoined = await Conversation.find({sender: phone, room:room}).limit(1).select("createdAt");
    dayJoined = dayJoined[0].createdAt;
    //console.log(dayJoined)
    const messages = await Message.find({to: room, createdAt:{$gt: dayJoined}}).sort({updatedAt: 1});
    //console.log(messages);
    return res.status(201).json({messages});
})

const deleteConversation = asyncHandler( async (id) => {
    const index = await Conversation.findIndex(conversation => conversation.id );
    if(index !== -1 ) {
        return Conversation.splice(index, 1)[0]
    }
})

const getConversation = asyncHandler( async (req, res) => {
    const {sender} = req.params;
    const conversation = await Conversation.find({sender: sender});
    return res.status(201).json({conversation})
});

const getConversationInRoom = (room) => Conversation.findOne({room});

module.exports = {addConversation, deleteConversation, addMessage, deleteMessage, getAllMessages, getConversation, getConversationInRoom, getAllMessagesInRoom};