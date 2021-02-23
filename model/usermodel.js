const mongoose = require("mongoose");

const user = mongoose.Schema({
    name : {
        type:String,
        require: true,
    },
    mobile :{
        type:String,
        require: true,
        unique : true,
    },
    company_name:{
        type:String,
        require: true,
    },
    email:{
        type:String,
        require: true,
    },
    faceBook : {
        type: String,
        default : ""
    },
    instagram : {
        type: String,
        default : ""
    },
    linkedIn : {
        type: String,
        default: ""
    },
    twitter : {
        type: String,
        default: ""
    },
    youTube : {
        type: String,
        default: ""
    },
    company_website:{
        type:String,
        default:"",
    },
    company_mobile :{
        type: String,
        default:"",   
    },
    company_address:{
        type:String,
        default:"",
    },
    company_email:{
        type:String,
        default:"",
    },
    imagecode:{
        type:String,
        default:"https://res.cloudinary.com/dc6ouyypu/image/upload/v1614057054/vcard/user/user-profile_nxo5gq.png",
    },
    referalcode:{
        type:String,
    },
    myreferalcode:{
        type:String,
    },
    coverimg:{
        type:String,
        default:"https://res.cloudinary.com/dc6ouyypu/image/upload/v1614056361/vcard/user/The-National-Dawn_scxuio.jpg",
    }
    
});

module.exports = mongoose.model("User", user);