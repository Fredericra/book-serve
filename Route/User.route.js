import express from 'express'
import { authVerify, getUser, Login, logout, Sigin, verify } from '../Controller/User.Auth.js';
import { newLetter } from '../Controller/sendMail.js';
import { getLetter } from '../Controller/Admin.js';
import { translate } from '../Controller/translate.js';


const route = express.Router();

route.get('/message',getLetter)
route.get('/user/:id',getUser);
route.get('/auth/verify',authVerify)



route.post('/sigin',Sigin)
route.post('/login',Login)
route.post('/logout',logout)
route.post('/send',newLetter)
route.post('/verify',verify)
route.post('/translate',translate)


export default route 