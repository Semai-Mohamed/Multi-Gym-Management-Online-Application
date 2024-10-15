import { verifyRefreshToken } from "../middleware/verifyToken.js";
import { login, requestPasswordReset, resetPassword, signUp, verifyResetCode } from "./functions.js";
import express from 'express'
const  routerAuth = express.Router()
routerAuth.post('/signUp',signUp)
routerAuth.post('/login',login)
routerAuth.get('/refresh',verifyRefreshToken)
routerAuth.post('/requestPasswordReset', requestPasswordReset)
routerAuth.post('/verifyResetCode', verifyResetCode)
routerAuth.post('/resetPassword', resetPassword)
export default routerAuth 