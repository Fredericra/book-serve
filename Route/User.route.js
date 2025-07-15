import express from 'express'
import { Login, Sigin } from '../Controller/User.Auth.js';


const Router = express.Router();

Router.post('/sigin',Sigin)
Router.post('/login',Login)

export { Router }