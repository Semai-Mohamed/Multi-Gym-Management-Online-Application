import Event from "./calendarModel.js"

const addEvent = async (req, res) => {
    try {
        const {startFrom, endIn, description } = req.body;
        if (req.userRole != "admin") {
            return res.status(401).json({ msg: 'Unauthorized: Not authorized to perform this operation' })
        }

        if (!startFrom || !endIn || !description) {
            return res.status(400).json({ msg: "Fill in the necessary fields" })
        }
        if (new Date(startFrom) >= new Date(endIn) || Date.now() > new Date(startFrom)) {
            return res.status(400).json({ msg: 'Error in entering information' })
        }
        const event = await Event.create({ gymName:req.gymName, startFrom, endIn, description })
        res.status(201).json({ msg: "The event created successfully", event })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
};
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.body;
        if (req.userRole != "admin") {
            return res.status(401).json({ msg: 'Unauthorized: Not authorized to perform this operation' })
        }
        const event = await Event.findOneAndDelete({ _id: id, gymName: req.gymName })
        if (!event) {
            return res.status(404).json({ msg: "Event not found" })
        }
        res.status(200).json({ msg: "The event deleted successfully" })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
};

const getAllEvents = async (req, res) => {
    try {
        if (req.userRole != "admin") {
            return res.status(401).json({ msg: 'Unauthorized: Not authorized to perform this operation' });
        }
        const events = await Event.find({ gymName: req.gymName });
        if (!events || events.length == 0) {
            return res.status(404).json({ msg: "Events not found" });
        }
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
export {deleteEvent,addEvent,getAllEvents}