require('dotenv').config();
const mongoose =require('mongoose');
function connectDB(){
    try{
        mongoose.connect(process.env.MONGO_CONNECTION_URL,{useNewUrlParser:true ,useUnifiedTopology:true});
        const connection=mongoose.connection;
        // console.log(process.env.APP_BASE_URL);
        console.log('Database Connected');

    }catch(err){
        console.log("Connection Failed");
    }
}
module.exports=connectDB;