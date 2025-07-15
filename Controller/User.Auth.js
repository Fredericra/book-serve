import { db } from '../Database/DB.js'
import  bcrypt from 'bcryptjs'



export const Sigin = async(req,res)=>{
    const { name,lastname,email,password,confirm,accept } = req.body;
    console.log(name)
    db.read()
    const { users } = db.data 
    const id = users.length
    const findEmail = users.find(item=>item.email===email)
    if(findEmail) 
    {
        res.status(201).send({message:'email deja exists, essaye nouveau',access:false})
        return
    }
    const hash =  await bcrypt.hash(password,20)
    users.push({
        id:id,name:name,email:email,password:hash,check:accept
    })
    res.status(201).send({message:'inscrire bien enregistre',access:true})


    db.write()

    
}


export const Login = async(req,res)=>{
    const { email,password } = req.body

    db.read()
    const { users } = db.data
    const findEmail = users.find(item=>item.email===email)
    if(!findEmail)
    {
        res.status(201).send({message:"email n'exite pas !",access:false})
        return
    }
    const inputPass = findEmail.password
    const compare = compareSync(password,inputPass)
    if(compare===false)
    {
        res.status(201).send({message:"mots de pass incorect",access:false})
        return
    }
    res.status(201).send({message:"connexion valide",access:true})

    db.write()
}