import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { db }  from './Database/DB.js'
import useRoute from './Route/User.route.js'

const Port = 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api',useRoute)


app.listen(Port,()=>{
    console.log(`application run in port ${Port}`)
})


