import mongoose from "mongoose";
const {Schema} = mongoose
const clubSchema = new Schema({
    gymName : {
        minlength: 3,
        maxlength: 30,
        type:String,
        trim:true,
        require:true,
        unique:true,
    },
    coaches : [{
        type:Schema.Types.ObjectId,
        ref:'Member'
    }],
    members:  [{
        type:Schema.Types.ObjectId,
        ref:'Member'
    }],
    coachesWaitingList : [{
        type:Schema.Types.ObjectId, 
        ref:'Member'
    }],
    membersWaitingList : [{
        type:Schema.Types.ObjectId,
        ref:'Member'
    }],
    maxCoaches:{
        type:Number,
        require:true
    },
    maxMembers:{
        type:Number,
        require:true
    },
    photoData: {
        type: Buffer, 
        contentType: String
      },
    price:{
        Daily:{
            type : Number,
            default : 200
        },
        Monthly:{
           type:Number,
           default:2000
        }
    
    },
    payment:{
           Monthly:{
             type:Number,
             default : 30000
          },
       
    }

})
export const moveToActiveList = async (gymName, memberId, type) => {
    let update;
    if (type === 'coach') {
        update = {
            $pull: { coachesWaitingList: memberId },
            $push: { coaches: memberId }
        };
    } else if (type === 'member') {
        update = {
            $pull: { membersWaitingList: memberId },
            $push: { members: memberId }
        };
    } else {
        throw new Error('Invalid type specified. It should be either "coach" or "member".');
    }

    await Club.updateOne({ gymName: gymName }, update,{ new: true } );
};

const Club =  mongoose.model('Club',clubSchema)
export default Club

