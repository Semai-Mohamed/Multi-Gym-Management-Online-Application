import express from "express"
import { getClub, updateGymClub, updateWaitingList } from "./function.js"
const clubRouter = express.Router()
clubRouter.get('/club',getClub)
clubRouter.patch('/club',updateGymClub)
clubRouter.patch('/waitingList',updateWaitingList)
export default clubRouter