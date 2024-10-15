import express from 'express'
import  { Profile, getUser , updateProfile, deleteProfile,getAllCoach,getAllStudents,searchUsers,deleteOtherProfile,updateOtherProfile} from './functions.js'
const userRouter = express.Router()
userRouter.get('/Profile',Profile)
userRouter.patch('/Profile',updateProfile)
userRouter.delete('/Profile',deleteProfile)
userRouter.get('/user/:id',getUser)
userRouter.get('/coaches',getAllCoach)
userRouter.get('/students',getAllStudents)
userRouter.delete('/user/:id',deleteOtherProfile) 
userRouter.patch('/user/:id',updateOtherProfile) 
userRouter.get('/search',searchUsers) 
export default userRouter