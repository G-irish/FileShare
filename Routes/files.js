const express=require('express');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const File=require('../models/file');
const {v4:uuid4}=require('uuid');
let storage= multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb)=>{
        const uniqueName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);

    }
});
let upload=multer({
    storage,
    limit:{fileSize:1000000*100}
}).single('myfile');
router.post('/',(req,res)=>{
    
    //Store File
    upload(req,res,async (err)=>{
        //Validate Req
        if(!req.file){
            return res.json({error:"All fields are required"});
        }
        if(err){
            return res.status(500).json({error:err.message});
        }
        const { filename } = req.file; // Get original filename
        const { path, size } = req.file;
        const uuid = uuid4();

        try {
            const file = new File({
                filename,
                uuid,
                path,
                size
            });
            const response=await file.save() ;
            return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`})
        }catch (error) {
            // Log the error for debugging purposes
            console.error('Error saving file to database:', error);
            // Respond with a more detailed error message
            const errorMessage = error.message || 'An unexpected error occurred while saving the file.';
            return res.status(500).json({ error: errorMessage });
        }

    });

});
router.post('/send',async (req,res)=>{
    const {uuid,emailTo,emailFrom,expiresIn}=req.body;
    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error:"All fields are required"});
    }
    try{
    const file=await File.findOne({uuid:uuid});
    if(file.sender){
        return res.status(422).send({error:"email already sent"});
    }
    fileSender=emailFrom;
    fileRec=emailTo;
    const response=await file.save();
    //send email
    const sendMail=require('../Services/Email');
    sendMail({from:emailFrom,to:emailTo,subject:"File Share Test",text:`From ${emailFrom}`,html:require('../Services/Emailtemplate')({
        emailFrom,
        downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}?source=email`,
        size:parseInt(file.size/1000)+'KB',
        expires:'24 hours'
        })
    }).then(()=>{
        return res.send({success:true})
    }).catch(err=>{
        return res.status(500).json({error: 'Error in email sending.'});
    })
    }
    catch(err) {
        return res.status(500).send({ error: 'Something went wrong.'});
    }

});


module.exports=router;