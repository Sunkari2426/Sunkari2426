const mongoose = require('mongoose');
module.exports = mongoose.model('Address', new mongoose.Schema({ user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}, label:String, line1:{type:String,required:true}, line2:String, city:{type:String,required:true}, postalCode:String, location:{lat:Number,lng:Number}, isDefault:Boolean },{timestamps:true}));
