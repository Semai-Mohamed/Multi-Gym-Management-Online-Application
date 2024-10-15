import mongoose from "mongoose";
const {Schema} = mongoose
const taskSchema = new Schema({
    gymName:{
        type:String,
    },

    description: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
       
    },
    dueDate: {
        type: Date,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    completed: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['workout', 'diet', 'assessment', 'appointment']
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low']
    },
    attachments: [{
        type: String, 
    }],
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
});

const task = mongoose.model('task',taskSchema)
export default task