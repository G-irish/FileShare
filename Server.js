const express=require('express');
const app=express();
const path=require('path');
const PORT=process.env.PORT || 3000;
const cors=require('cors');
app.use(express.json());
app.use(cors());
app.set('views',path.join(__dirname,'/Views'));
app.set('view engine','ejs');
const connectDB=require("./config/db");
connectDB();

app.use('/api/files',require('./Routes/files'));
app.use('/files',require('./Routes/Show'));
app.use('/files/download',require('./Routes/download'));
app.listen(PORT,()=>{
    console.log(`Server Running on ${PORT}`);
})