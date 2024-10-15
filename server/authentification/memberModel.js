import mongoose from "mongoose";
import cron from 'node-cron';
const {Schema} = mongoose
const memberSchema = new Schema({
    gymName : {
      type:String,
    }
    ,
    firstName: {
        type: String,
        required: true,
        trim:true
    },
    lastName: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true
    }, 
    photoData: {
        type: Buffer, 
        contentType: String
      },
    interaction:{
        reservation : {
           type:Schema.Types.ObjectId,
           ref:'Product'
        },
        save :[ {
            type:Schema.Types.ObjectId,
            ref:'Product'
        }]
       },
    password: {
        type: String,
        required: true,
        minlength : [6,'to short password']
    },
    phoneNumber: {
        type: String,
        trim:true
    },
    dateOfBirth: {
        type: Date,
        trim:true
    },
    address: {
        type: String,
        trim:true
    },
    experience: {
        type: String
    },
    coachInfo: {
        type: Schema.Types.ObjectId,
        ref:'member'
    },
    friends: [{  type: Schema.Types.ObjectId, ref: 'Member' } ],
    Duration: {
        type:Number,
        min:0
    },
    role:{
        type : String,
        default : 'member',
        enum:['member','coach','admin']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    OTP: {
        code: { type: String },
        createdAt: { type: Date, default: Date.now }
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
})
const member = mongoose.model('Member',memberSchema)
const decrementDuration = async () => {
    try {
        await member.updateMany(
            { Duration: { $gt: 0 } },
            { $inc: { Duration: -1 } } 
        );
        console.log('Duration decremented successfully')
    } catch (error) {
        console.error('Error decrementing duration:', error)
    }
};
cron.schedule('0 0 * * *', () => {
    decrementDuration()
});

export default member