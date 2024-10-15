import express from 'express'
import { sendTaskToAll, sendTaskToMember,getAllTasks,getTasksPosted,getTasksReceived,updateManytask,updateOneTask,deleteTask } from './functions.js'
const taskRouter = express.Router()
taskRouter.post('/tasks',sendTaskToAll) // group
taskRouter.patch('/tasks',updateManytask) // group
taskRouter.post('/tasks/user',sendTaskToMember)
taskRouter.patch('/tasks/:id',updateOneTask) // task id
taskRouter.delete('/tasks/:t',deleteTask) // time 
taskRouter.get('/allTasks',getAllTasks) // all
taskRouter.get('/tasksPosted',getTasksPosted) // posted
taskRouter.get('/tasksReceived',getTasksReceived) // recieved
taskRouter
export default taskRouter 