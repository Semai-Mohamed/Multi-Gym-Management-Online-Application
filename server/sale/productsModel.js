import mongoose from "mongoose"
const {Schema} = mongoose
const productSchema = new Schema({
    gymName : {
        type:String,
        required : true,
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: String,
        required: true
    },
   owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
       
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    ,
    photoData: {
        type: Buffer, 
        contentType: String
      },
      quantity:{
        type:Number,
        default: 1
    }
})
const Product = mongoose.model('Product',productSchema)
export default Product