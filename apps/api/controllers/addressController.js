const Address=require('../models/Address');
exports.list=async(req,res,next)=>{try{res.json(await Address.find({user:req.user.id}))}catch(e){next(e)}};
exports.create=async(req,res,next)=>{try{const {line1,city}=req.body;if(!line1||!city)return res.status(400).json({error:'line1 and city are required'});res.status(201).json(await Address.create({...req.body,user:req.user.id}))}catch(e){next(e)}};
