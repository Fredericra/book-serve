import { db } from '../Database/DB.js'
import bcrypt from 'bcryptjs'



export const Sigin = async (req, res) => {
    const { name, lastname, email, password, confirm, accept } = req.body;
   
    await db.read()
    const { users } = db.data
    const id = users.length
    const findEmail = users.find(item => item.email === email)
    console.log(findEmail)
    if (typeof findEmail === "object" || findEmail === 'undefined') {
        res.status(202).send({ message: 'email deja exists, essaye nouveau',props:'email', access: false })
        return
    }
    else {
        const hash = await bcrypt.hash(password, 10)
        let admin = null;
        admin === "bokymora@gmail.com"?true:false;
        const Auth = {
            id: id, name: name, email: email, password: hash, check: accept,connexion:true,admin:admin
        }
        users.push(Auth)
        await db.write()
        res.status(201).send({ message: 'inscrire bien enregistre', access: true,user:Auth })
    }

}


export const Login = async (req, res) => {
    const { email, password } = req.body
    await db.read()
    const { users } = db.data
    const findEmail = users.find(item => item.email === email)
    if(findEmail)
    {
        const compare = await bcrypt.compare(password,findEmail.password)
        if(compare)
        {
            res.status(201).send({ message: "connexion valide", access: true,user:findEmail })
        }
        else
        {
            res.status(201).send({ message: "mots de pass incorrect", access: false,props:'password' })
        }

    }
    else
    {
        res.status(201).send({ message: "email n'exite pas !", access: false,props:'email' })
    }

         
    

    await db.write()
}



export const logout = async(req,res)=>{
    const { email } = req.body

    db.read();

    const { users } = db.data
    users.connexion = false;
    res.status(201).send({message:'deconnexion'})
    db.write();
}