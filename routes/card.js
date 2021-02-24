var express = require('express');
var router = express.Router();
var cors = require("cors");
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var mongoose = require('mongoose');
require("dotenv");
// var multer = require('multer');
// const isEmpty = require('lodash.isempty');
var moment = require('moment');
var usermodel = require("../model/usermodel");
var servicemodel = require("../model/servicemodel");
const gallerymodel = require('../model/gallerymodel');
const offerschema = require("../model/offermodel");
const { Mongoose } = require('mongoose');
const { exit } = require('process');
var vCardsJS = require('vcards-js');

var userimage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/user");   
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
    },
});

var Userimg = multer({ storage: userimage });

router.post("/checkDigitalCardMember",Userimg.single('imagecode'), async function(req,res,next){
    const { name, mobile, company_name,email,imagecode,referalcode,myreferalcode} = req.body;
    const file = req.file;

    const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: 'dc6ouyypu',
          api_key: '296773621645811',
          api_secret: 'yrCG_ZiUgIUIvXU782fAeCv2L_g'
    });

    try{
        let isData = await usermodel.find({mobile : req.body.mobile});
        if(isData.length == 1){
            res.status(200).json({ IsSucess:true, Data : [isData], Message : "User logged in successfully"});
            // res.status(200).json({IsSucess:true, Data:[], Message:"User Already register"});
        }
        else{
            f=[];
            if(req.file){
                var uniqaudio = "";
                uniqaudio = moment().format('MMMM Do YYYY, h:mm:ss a');
                var v = await cloudinary.uploader.upload(file.path,{ public_id: `vcard/user/${uniqaudio}`, tags: `user` },function(err,result) {
                    console.log("Error : ", err);
                    console.log("Resilt : ", result);
                    f[0] = result.url;
                });
            }
            let addmember = await new usermodel({
                name : name,
                mobile : mobile,
                company_name : company_name,
                email : email,
                imagecode : f[0],
                referalcode : req.body.referalcode = undefined ? "" : req.body.referalcode,
                myreferalcode : req.body.myreferalcode = undefined ? "" : req.body.myreferalcode,
            });

            if(addmember){
                addmember.save();
                res.status(200).json({ IsSucess:true, Data : [addmember], Message : "New user Registered"});
            }
            else{
                res.status(200).json({ IsSucess:true, Data : [], Message : "New user not Registered"});
            }
        }
    }
    catch(error){
        res.status(500).json({IsSucess : false, Message: error.message});
    }
});

router.post("/login", async function(req,res,next){
    const mobile = req.body.mobile;
    try {
        let isuser = await usermodel.find({mobile : mobile});
        if(isuser.length != 0){
            res.status(200).json({ IsSucess:true, Data : [isuser], Message : "User logged in successfully"});
        }
        else{
            res.status(200).json({ IsSucess:true, Data : [], Message : "Enter proper credentials"});
        }
    } catch (error) {
        res.status(500).json({IsSucess : false, Message: error.message});
    }
});

router.post("/addservice",async function(req,res,next){
    const{title,memberid,description} = req.body;
    try {
        let newservice = await new servicemodel({
            title : title,
            description : description,
            memberId : memberid,
        });
        if(newservice){
            newservice.save();
            res.status(200).json({IsSucess : true, Data : [newservice], Message: "New service added" });
        }
        else{
            res.status(200).json({IsSucess : true, Data : [], Message: "Service not added" });
        }
    } catch (error) {
        res.status(500).json({IsSucess : false, Message : error.message });
    }
});

router.post("/addimages", Userimg.fields([{name:'images'},{name:'videos'} ]), async function(req,res,next){
    const {memberid,images,videos} = req.body;
    let g_image = [];
    let g_video = [];
    console.log(req.body);
    let fileinfo = req.files.images;
    let filevideo = req.files.videos;
    console.log(fileinfo);
    console.log(filevideo);
    try {
        let isuser = await usermodel.findById(memberid);
        if(isuser){
            if(req.files.images || req.files.videos){
                const cloudinary = require('cloudinary').v2;
                    cloudinary.config({
                    cloud_name: 'dc6ouyypu',
                    api_key: '296773621645811',
                    api_secret: 'yrCG_ZiUgIUIvXU782fAeCv2L_g'
                });

                if(req.files.images){
                    for(let j =0; j < fileinfo.length; j++){
                        let uniqname = "";
                        uniqname = moment().format('MMMM Do YYYY,h:mm:ss a');
                        let c = await cloudinary.uploader.upload(fileinfo[j].path,{ public_id: `vcard/user/${uniqname}`, tags: `vcard` },function(err,result) {
                            // console.log("Error : ", err);
                            // console.log("Resilt : ", result);
                            g_image[j] =result.url;
                        });
                    }
                }
    
                if(req.files.videos){
                    let uniqvideo = "";
                    uniqvideo = moment().format('MMMM Do YYYY,h:mm:ss a');
                    let v = await cloudinary.uploader.upload(filevideo[0].path, {resource_type:"video", public_id: `vcard/user/${uniqvideo}`, tags: `blog` },function(err,result) {
                    // console.log("Error : ", err);
                    // console.log("Resilt : ", result);
                    g_video[0] = result.url;
                    });
                }

                let galleryupload = await new gallerymodel({
                    memberId : memberid,
                    images : g_image,
                    videos : g_video
                });
                if(galleryupload){
                    galleryupload.save();
                    res.status(200).json({IsSucess : true, Data : [galleryupload], Message : "Uploaded successfully"});
                }
                else{
                    res.status(200).json({IsSucess : true, Data : [], Message : "Not uploaded successfully"});
                }
            }
        }
        else{
            res.send("enter proper details");
        }
    } catch (error) {
        res.status(500).json({IsSucess : false, Message : error.message });
    }
});

router.post("/getsingleuserdata", async function(req,res,next){
    const { userid } = req.body;
    try {
        let isUser = await usermodel.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(userid),
                },
            },
            {
                $lookup:
                        {
                            from: "galleries",
                            localField: "_id",
                            foreignField: "memberId",
                            as: "gallery"
                        }
            },
            {
                $lookup:
                        {
                            from: "services",
                            localField: "_id",
                            foreignField: "memberId",
                            as: "services"
                        }
            },
        ]);
        if(isUser){
            res.status(200).json({IsSucess:true, Data: [isUser], Message:"User data found"});
        }
        else{
            res.status(200).json({IsSucess:true, Data: [], Message:"User not found"});
        }
    } catch (error) {
        res.status(500).json({IsSucess : false, Message : error.message });
    }
});

router.post("/updateprofile", Userimg.fields([{name:'imagecode'},{name:'coverimg'}]) ,async function(req,res,next){
        const {name,email,mobile,company_name,faceBook,instagram,linkedIn,twitter,youTube,
                company_website,company_mobile,company_address,company_email,imagecode} = req.body;
        let user_img=[];
        let cover_img=[];
        let fileimg;
        let filecover;
        if(req.files != undefined){
            console.log("1");
            fileimg = req.files.imagecode;
            filecover = req.files.coverimg;    
        }
        else{
            // console.log("2");
            fileimg = null;
            filecover = null;
        }
        try {
            let isuser = await usermodel.aggregate([
                {
                    $match:{
                        mobile: mobile,
                    }
                }
            ]);
            console.log(isuser);
            console.log(isuser[0]._id);
            if(isuser){
                if(req.files){
                    console.log("1");
                    const cloudinary = require('cloudinary').v2;
                    cloudinary.config({
                        cloud_name: 'dc6ouyypu',
                        api_key: '296773621645811',
                        api_secret: 'yrCG_ZiUgIUIvXU782fAeCv2L_g'
                    });
                    
                    if(req.files.imagecode){
                        let uniqimg = "";
                        uniqimg = moment().format('MMMM Do YYYY, h:mm:ss a');
                        let v = await cloudinary.uploader.upload(fileimg[0].path, { public_id: `vcard/user/${uniqimg}`, tags: `vcard` },function(err,result) {
                        // console.log("Error : ", err);
                        // console.log("Resilt : ", result);
                        user_img[0] = result.url;
                        });
                    }

                    if(req.files.coverimg){
                        let uniqimg = "";
                        uniqimg = moment().format('MMMM Do YYYY, h:mm:ss a');
                        let v = await cloudinary.uploader.upload(filecover[0].path, { public_id: `vcard/user/${uniqimg}`, tags: `vcard` },function(err,result) {
                        // console.log("Error : ", err);
                        // console.log("Resilt : ", result);
                        cover_img[0] = result.url;
                        });
                    }

                    let updateuser = {
                        name:name,
                        mobile:mobile,
                        email:email,
                        faceBook:faceBook,
                        instagram:instagram,
                        youTube:youTube,
                        linkedIn:linkedIn,
                        twitter:twitter,
                        company_name:company_name,
                        company_website:company_website,
                        company_address: company_address,
                        company_email:company_email,
                        company_mobile:company_mobile,
                        imagecode : user_img[0],
                        cover_img:coverimg[0],
                    };
                    let updateprofile = await usermodel.findByIdAndUpdate(isuser[0]._id,updateuser);
                    if(updateprofile){
                        // updateuser.save();
                        res.status(200).json({IsSucess:true, Data : [updateuser], Message:"User updated"});
                    }
                    else{
                        res.status(200).json({IsSucess:true, Data : [], Message:"User not updated"});
                    }
                }
                else{
                    console.log("2");
                    let updateuser = {
                        name:name,
                        mobile:mobile,
                        email:email,
                        faceBook:faceBook,
                        instagram:instagram,
                        youTube:youTube,
                        linkedIn:linkedIn,
                        twitter:twitter,
                        company_name:company_name,
                        company_website:company_website,
                        company_address: company_address,
                        company_email:company_email,
                        company_mobile:company_mobile,
                        imagecode : isuser[0].imagecode,
                        cover_img: isuser[0].coverimg,
                    }
                    let updateprofile = await usermodel.findByIdAndUpdate(isuser[0]._id, updateuser);
                    if(updateprofile){
                        // updateuser.save();
                        res.status(200).json({IsSucess:true, Data : [updateuser], Message:"User updated"});
                    }
                    else{
                        res.status(200).json({IsSucess:true, Data : [], Message:"User not updated"});
                    }
                }
            }

        } catch (error) {
            res.status(500).json({IsSucess : false, Message : error.message });
        }
});

router.post("/addoffer", Userimg.single('imagecode'), async function(req,res,next){
    const {memberId,title,description,imagecode,validtilldate} = req.body;
    let fileimg=req.file;

    let off_img=[];
    try{
        let userIs = await usermodel.find({_id:memberId});
        console.log(userIs);
        if(userIs){
            if(req.file){
                console.log("1");
                const cloudinary = require('cloudinary').v2;
                cloudinary.config({
                    cloud_name: 'dc6ouyypu',
                    api_key: '296773621645811',
                    api_secret: 'yrCG_ZiUgIUIvXU782fAeCv2L_g'
                });

                offerimg = "";
                offerimg = moment().format('MMMM Do YYYY, h:mm:ss a');
                let v = await cloudinary.uploader.upload(fileimg.path, { public_id: `vcard/offer/${offerimg}`, tags: `vcard` },function(err,result) {
                    off_img[0] = result.url;
                });

                let offerdata = await new offerschema({
                    memberId:memberId,
                    title:title,
                    description:description,
                    imagecode:off_img[0],
                    validtilldate:validtilldate,
                })
                if(offerdata){
                    offerdata.save();
                    res.status(200).json({IsSucess:true, Data: [offerdata], Message:"Offer added"});
                }
                else{
                    res.status(200).json({IsSucess:true, Data: [], Message:"Offer not added"});
                }
            }
        }
    }
    catch(error){
        res.status(500).json({IsSucess : false, Message : error.message });
    }
});

router.post("/savevcard" ,async function(req,res,next){
    const {firstName,organization,workPhone,title,url,email} =req.body;
    try{
        var vCard = vCardsJS();

        vCard.firstName = firstName;
        vCard.organization = organization;
        vCard.workPhone = workPhone;
        vCard.title = title;
        vCard.url = url;
        vCard.email = email;

        vCard.saveToFile('vcf/demo.vcf');
        console.log(vCard.getFormattedString());
        res.download('vcf/demo.vcf');
        // res.status(200).json({IsSucess:true, Data; })
    }
    catch(error){
        res.status(500).json({IsSucess : false, Message : error.message });
    }
});

module.exports = router;