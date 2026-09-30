const mongoose = require('mongoose');
module.exports = mongoose.model('ScrapCategory', new mongoose.Schema({ name:{type:String,required:true,unique:true}, description:String, active:{type:Boolean,default:true} },{timestamps:true}));
