const mongoose = require("mongoose");

const offer = mongoose.Schema({
    memberId:{
        type: mongoose.Types.ObjectId, 
        ref: "User",
    },
    title :{
        type:String,
        default:"",
    },
    description :{
        type:String,
        default:"",
    },
    imagecode:{
        type:String,
        default:"",
    },
    validtilldate:{
        type:String,
        default:"",
    }
});

module.exports = mongoose.model("Offer", offer);