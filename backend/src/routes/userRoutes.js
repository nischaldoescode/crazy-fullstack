import express from 'express';
import { adminLogin, checkUserExists, loginUser, registerUser } from '../controllers/UserController.js';


const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/check-code', checkUserExists);

export default userRouter;
