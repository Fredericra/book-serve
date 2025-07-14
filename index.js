import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import { db }  from './Database/DB.js'

dotenv.config()



const app = express()
app.use(cors())


app.listen(3001,()=>{
    console.log(`application run in port 3000`)
})


