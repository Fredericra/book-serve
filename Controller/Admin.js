import { db } from "../Database/DB.js"


export const getLetter = async (req,res)=>{
    await db.read();
    db.data.messages = db.data.messages || [];
    const { messages } = db.data;
    res.status(201).json({message:messages,access:true})
}