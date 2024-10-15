import mongoose from "mongoose";
mongoose.Promise = global.Promise;

const connectDb = async (url)=>{
    try{
await mongoose.connect(url,{

})
console.log('connect to the db')
    }
    catch(err){
        console.log({msg:err})
    }
}
export default connectDb
