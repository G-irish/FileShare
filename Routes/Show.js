require('dotenv').config();
const express=require('express');
const router=express.Router();
const File=require('../models/file');
router.get('/:uuid',async (req,res)=>{
    try{
        const file=await File.findOne({uuid:req.params.uuid});
        
            return res.render('download',{
                uuid:file.uuid,
                filename:file.filename,
                size:file.size,
                downloadLink:`${process.env.APP_BASE_URL}/files/download/${file.uuid}`
            });
            // console.log(process.env.APP_BASE_URL);
        
    }
    catch(err){
        console.log(err);
        return res.render('download',{error:err.message});
    }
});
module.exports=router;
