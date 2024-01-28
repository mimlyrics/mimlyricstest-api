const mongoose = require("mongoose");

const pictureSchema = mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId
    },
    image: {
        type: String,
        required: true,
        default: () => ""
    },
})

const Picture = mongoose.model('Picture', pictureSchema);
module.exports = Picture;