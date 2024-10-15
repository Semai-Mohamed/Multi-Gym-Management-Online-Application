import express from 'express'
import { addEvent, deleteEvent, getAllEvents } from './function.js'
const eventRouter = express.Router()
eventRouter.get('/events', getAllEvents);
eventRouter.delete('/event', deleteEvent);
eventRouter.post('/event', addEvent);
export default eventRouter;
