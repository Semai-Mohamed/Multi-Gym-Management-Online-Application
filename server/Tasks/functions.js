import member from "../authentification/memberModel.js"
import task from "./taskmodel.js"
const getTasksReceived= async(req,res)=>{
    try {
     const role = req.userRole
     const userId = req.userId
     if(role == 'admin'){
       return res.status(403).json({msg:'admin has no task recivied'})
     }

     const tasks = await task.find({assignedTo:userId})
     if(tasks.length === 0||!tasks){
       return res.status(404).json({msg:'Tasks not found'})
     } 
     res.status(200).json({msg:'Tasks Received',data:tasks})
    } catch (error) {
        res.status(500).json(error)
    }
}
const getTasksPosted = async (req,res)=>{
    try {
     const userId = req.userId
     const role = req.userRole
     if(role == 'member'){
       return res.status(401).json({msg:'the member cant send tasks'})
     }
     const tasks = await task.find({sender:userId}).populate([
        { path: 'assignedTo' },
        { path: 'sender' }
      ])
     if(tasks.length === 0|| !tasks){
        return res.status(404).json({msg:'Tasks not found'})
     }
     res.status(200).json({msg:'Tasks posted',data:tasks})

    } catch (error) {
        res.status(500).json(error)
    }
}
const getAllTasks = async (req,res)=>{
    try {
      const role = req.userRole
      if(role!=="admin"){
        return res.status(401).json({msg:'can not do this operation'})
      }
      const tasks = await task.find({gymName:req.gymName})
    //   .populate([
    //     { path: 'assignedTo' },
    //     { path: 'sender' }
    //   ])
      if(!tasks||tasks.length===0){
      return  res.status(404).json({msg:'Tasks not found'})
      }
      res.status(200).json({msg:'All tasks',data:tasks})
    } catch (error) {
        
    }
}
const sendTaskToAll = async (req, res) => {
    try {
        const users = await member.find({coachInfo:req.userId})
        if (!users||users.length===0) {
          return res.status(404).json({msg:'users not found'})
        }
        const time = Date.now()
        const tasks = await Promise.all(users.map(async (user) => {
            try {
                const Task = await task.create({ ...req.body, timestamp: time, assignedTo: user._id, sender: req.userId, gymName: req.gymName });
                return Task; 
            } catch (error) {
                console.error(`Error creating task for user ${user._id}:`, error);
                return null;
            }
        }));
          const Task = await task.find({sender:req.userId})
        return res.status(201).json({msg:'task has been created for all',Task})
    } catch (error) {
res.status(500).json(error) 
    } 
};
const sendTaskToMember = async (req, res) => {
    try {
        const userId = req.body.assignedTo
        const user  = await member.findById(userId)
        if(!user){
            return res.status(404).json({msg:'User not found'})
        }
        if(user.coachInfo!=req.userId){
            return res.status(403).json("can't do this operation")   
        }
        const Task = await task.create({ ...req.body, timestamp: new Date(),sender:req.userId})
        res.status(201).json({msg:"task has been created for this user",data:Task})
    } catch (error) {
        res.status(500).json(error)
    }
}
const updateOneTask = async(req,res)=>{
    try {
    const userId = req.userId
    const taskId = req.params.id
    const Task = await task.findById(taskId)
    if(!Task){
        return res.status(404).json({msg:'Task not found '})
    }
    console.log(Task.assignedTo,'\d',userId)
    if(Task.sender != userId && Task.assignedTo!=userId){
        return res.status(401).json("can't do this operation")
    }

    if(Task.sender == userId){
        const { 
            description,
            timestamp,
            dueDate,
            type,
            priority,
            tags,
            attachments,
            comments,
            reminders,
            recurrence,
            dependencies,
            history} = req.body
        const Task = await task.findByIdAndUpdate(taskId,{description:description,
            timestamp,
            dueDate,
            type,
            priority,
            tags,
            attachments,
            comments,
            reminders,
            recurrence,
            dependencies,
            history
        },{new:true})
       return res.status(200).json({msg:'Task has been updated',data:Task})
    }
    if(Task.assignedTo == userId){
        const {
            completed,
            progress
        } = req.body
            const Task = await task.findByIdAndUpdate(taskId,{ 
            completed,
            progress
        },
        {new : true})
            return res.status(200).json({msg:'Task has been updated',data:Task})}
    } catch (error) {
        res.status(500).json(error)}}
const updateManytask = async (req,res)=>{
    try {
        const { 
            description,
            dueDate,
            type,
            priority,
            tags,
            attachments,
            comments,
            reminders,
            recurrence,
            dependencies,
            history,
            timestamp} = req.body
      const  userId = req.userId
      const  tasks = await task.find({sender:userId,timestamp:timestamp})
      if(tasks.length===0){
        return  res.status(404).json({msg:'Tasks not found'})}
      const tasksUpdate = await task.updateMany({sender:userId},{
        description,
        dueDate,
        type,
        priority,
        tags,
        attachments,
        comments,
        reminders,
        recurrence,
        dependencies,
        history
    },{new : true})
    res.status(200).json({msg:'Tasks has been updated'})
    } catch (error) {
        res.status(500).json(error)
    }
}
const deleteTask = async(req,res)=>{
    try {
        const userId = req.userId
        const time = req.params.t
        const Task = await task.find({timestamp:time,sender:req.userId})
        if(!Task||Task.length === 0){
            return res.status(404).json({msg:'Tasks not found'})
        }       
        await task.deleteMany({timestamp:time,sender:req.userId})
        res.status(200).json({msg:'task has been deleted'})
    } catch (error) {
        res.status(500).json(error)
    }}
export {sendTaskToAll,sendTaskToMember,getAllTasks,getTasksPosted,getTasksReceived,updateManytask,updateOneTask,deleteTask}
