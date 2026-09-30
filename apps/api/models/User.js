const mongoose = require('mongoose'); const { ROLES } = require('../config/constants');
module.exports = mongoose.model('User', new mongoose.Schema({ phone:{type:String,required:true,unique:true,trim:true}, role:{type:String,enum:ROLES,default:'customer'}, name:String, otpHash:String, otpExpiresAt:Date },{timestamps:true}));
