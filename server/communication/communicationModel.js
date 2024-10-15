import mongoose from "mongoose";
const {Schema} = mongoose
const communicationSchema = new Schema({
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member'
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member' 
        },
        message: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },  
})
const communications = mongoose.model('communication',communicationSchema)
export default communications