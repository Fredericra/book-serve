import express from 'express'
import { Login, logout, sendMessage, Sigin } from '../Controller/User.Auth.js';


const route = express.Router();

route.post('/sigin',Sigin)
route.post('/login',Login)
route.post('/logout',logout)
route.post('/send',sendMessage)

export default route 