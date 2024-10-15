import mongoose from 'mongoose';

const { Schema } = mongoose;

const notificationSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  type:{
    type:String,
    enum:['task','add user','message','product reserve']
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;