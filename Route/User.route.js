import express from 'express'
import {  getUser, Login, logout, Sigin } from '../Controller/User.Auth.js';
import { newLetter } from '../Controller/sendMail.js';
import { getLetter } from '../Controller/Admin.js';
import { translate } from '../Controller/translate.js';
import { authVerify, verify } from '../Controller/verify.controller.js';


const route = express.Router();

route.get('/message',getLetter)
route.get('/user/:id',getUser);



route.post('/auth/verify',authVerify)
route.post('/sigin',Sigin)
route.post('/login',Login)
route.post('/logout',logout)
route.post('/send',newLetter)
route.post('/verify',verify)
route.post('/translate',translate)


export default route 