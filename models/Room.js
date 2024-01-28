const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    logo: {
        type: String,
        default: () => ""
    }
}, {
    timestamps: true
})

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;