import express from 'express'
import {  getUser, Login, logout, Sigin } from '../Controller/User.Auth.js';
import { getMessage, newLetter } from '../Controller/sendMail.js';
import { getLetter } from '../Controller/Admin.js';
import { translate } from '../Controller/translate.js';
import { authVerify, verify } from '../Controller/verify.controller.js';
import { bussness, setting } from '../Controller/Admin.controlleur.js';
import { getProduct, productUpload } from '../Controller/Product.controlleur.js';
import multer from 'multer'

const store = multer.memoryStorage
const upload = multer({store})

const route = express.Router();

route.get('/message',getLetter)
route.get('/user/:id',getUser);
route.get('/getMessage',getMessage)
route.get('/getProduct',getProduct)


route.post('/product',upload.single('file'),productUpload)
route.post('/setting',setting)
route.post('/auth/verify',authVerify)
route.post('/sigin',Sigin)
route.post('/login',Login)
route.post('/logout',logout)
route.post('/send',newLetter)
route.post('/verify',verify)
route.post('/translate',translate)
route.post('/ajouter/vente',bussness)


export default route 