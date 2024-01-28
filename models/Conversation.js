const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema({
    room: {
        type: String
    },
    sender: {
        type: String,        
    },
    recipient: {
        type: Array,
        default: () => ''
    },    
}, {
    timestamps: true
})

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;