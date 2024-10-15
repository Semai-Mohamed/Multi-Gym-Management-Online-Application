import express from 'express'
import connectDb from './db/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import routerAuth from './authentification/routes.js'
import {verifyAccessToken,verifyRefreshToken} from './middleware/verifyToken.js'
import errorHandler from './middleware/errorHandler.js'
import userRouter from './user/routes.js'
import chatRouter from './communication/routes.js'
import taskRouter from './Tasks/routes.js'
import clubRouter from './gymClub/routes.js'
import productRouter from './sale/routes.js'
import eventRouter from './calendar/routes.js'
dotenv.config()
const app = express()
const port = 3000
app.use(express.json())
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true 
};
app.use(cors(corsOptions));
app.use(cookieParser())
app.use('/Auth',routerAuth)
app.use(verifyAccessToken)
app.use(clubRouter)
app.use(productRouter)
app.use(userRouter)
app.use(chatRouter)
app.use(taskRouter)
app.use(eventRouter)
app.use(errorHandler)
app.listen(port, async () => {
  try {
    await connectDb(process.env.url);
    console.log(`Server listening on port ${port}!`);
  } catch (err) {
    console.error('Database connection error:', err);
  }
});



  