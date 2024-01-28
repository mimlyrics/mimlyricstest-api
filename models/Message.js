const mongoose = require('mongoose');
const messageSchema = mongoose.Schema({
    conversationId: {
        type: String,
    },
    from: {
        type: String,
        required: false,
    },
    to: {
        type: String,
        required: false
    },
    text: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    response: [
        {
            from: String,
            to: mongoose.SchemaTypes.ObjectId,
            oldText: String,
            newText: String,
            mediaId: [{path:String, mimetype:String}],            
            avatar: String,
            username: String,
        }
    ],
    media: [
       {
        path: String,
        mimetype: String
       }
    ]
}, {
    timestamps: true
})

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;