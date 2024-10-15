import mongoose from "mongoose"
const { Schema } = mongoose;
const EventSchema = new Schema({
    gymName: {
        type: String,
        required: true,
    },
    startFrom: {
        type: Date,
        required: true
    },
    endIn: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
})
const Event = mongoose.model('Event', EventSchema)
export default Event;
