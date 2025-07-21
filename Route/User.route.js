import express from 'express'
import { getUser, Login, logout, Sigin, verify } from '../Controller/User.Auth.js';
import { newLetter } from '../Controller/sendMail.js';
import { getLetter } from '../Controller/Admin.js';


const route = express.Router();

route.post('/sigin',Sigin)
route.post('/login',Login)
route.post('/logout',logout)
route.post('/send',newLetter)
route.post('/verify',verify)
route.get('/message',getLetter)
route.get('/user/:id',getUser);

export default route 