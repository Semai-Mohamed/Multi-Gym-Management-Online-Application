import express from 'express'
import { deleteMessage, getChat, sendMessage } from './functions.js'
const chatRouter = express.Router()
chatRouter.get('/chat/:id',getChat) // id of the recipient
chatRouter.post('/chat',sendMessage)
chatRouter.delete('/chat/:id',deleteMessage) // id of the message
export default chatRouter