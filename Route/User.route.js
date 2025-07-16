import express from 'express'
import { Login, Sigin } from '../Controller/User.Auth.js';


const route = express.Router();

route.post('/sigin',Sigin)
route.post('/login',Login)


export default route 