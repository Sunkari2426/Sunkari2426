const mongoose = require('mongoose');
module.exports = mongoose.model('ScrapRate', new mongoose.Schema({ category:{type:mongoose.Schema.Types.ObjectId,ref:'ScrapCategory',required:true}, pricePerKg:{type:Number,required:true,min:0}, effectiveFrom:{type:Date,default:Date.now}, active:{type:Boolean,default:true} },{timestamps:true}));
