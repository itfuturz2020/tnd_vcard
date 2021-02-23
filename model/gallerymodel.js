const mongoose = require("mongoose");

const gallery = mongoose.Schema({
    memberId:{
        type: mongoose.Types.ObjectId, 
        ref: "User",
    },
    images :[
        {
            type:String,
            default : "",
        }
    ],
    videos :[{
        type:String,
        default : "",
    }]
});

module.exports = mongoose.model("Gallery", gallery);