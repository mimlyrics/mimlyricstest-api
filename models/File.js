const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
    conversationId: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    from: {
        type: String,
        default: () => "",
    },
    to: {
        type: String,
        default: () => ""
    },
    description: {
        type: String,
        default: () => ""
    }
})

const File = mongoose.model("File", fileSchema);
module.exports=File;