import mongoose from "mongoose"
const {Schema} = mongoose 
const categorySchema = new Schema({
    gymName:{
        type:String
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    photoData: {
        type: Buffer, 
        contentType: String
      },
    products : [
        {
            type:Schema.Types.ObjectId,
            ref : 'Product'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
  
 
});

const Category = mongoose.model('Category', categorySchema);

export default Category