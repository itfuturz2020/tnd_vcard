const mongoose = require("mongoose");

const service = mongoose.Schema({
    memberId:{
        type: mongoose.Types.ObjectId, 
        ref: "User",
    },
    title :{
        type:String,
    },
    description :{
        type:String
    },
});

module.exports = mongoose.model("Service", service);