import { db } from '../Database/DB.js'
import bcrypt from 'bcryptjs'
import { secretcode } from '../Utility/Code.js'
import { setEMail, transport } from '../Utility/email.js'


export const Sigin = async (req, res) => {
    const { name, lastname, email, password, confirm, accept } = req.body;
    await db.read()
    const secret = secretcode();
    let { users } = db.data
    const id = users.length
    const findEmail = users.find(item => item.email === email)
    if (typeof findEmail === "object" || findEmail === 'undefined') {
        res.status(202).send({ message: 'email deja exists, essaye nouveau', props: 'email', access: false })
        return
    }
    else {
       
        const hash = await bcrypt.hash(password, 10)
        const admin = email === "bokyshoping@gmail.com" ? true : false;
        db.data.userparams ||= [];
        const { userparams } = db.data;
        userparams.push({
            id: userparams.length,
            user_id: id,
            type:0,
            admin:admin,
            verified:false,
            date: new Date().toLocaleString(),
            time: new Date().toLocaleTimeString(),
            code: secret,
        })
        const Auth = {
            id: id, 
            name: name, 
            lastname: lastname, 
            email: email,
            password: hash,
            check: accept,
            connexion: false,
            admin: admin,
            checked:false
        }
        const userMail = email.split('@')[0]
        users.push(Auth);
        await transport.sendMail(setEMail(secret,email))
        await db.write();
        res.status(201).send({ message: 'inscrire bien enregistre', access: true, user: Auth,code:secret })
    }

}


export const getUser = async (req,res)=>{
    const { id } = req.params;
    await db.read();
    let { users,userparams } = db.data;
    const findUser = users.find(item => item.id === parseInt(id));
    const findUserParams = userparams.find(item => item.user_id === parseInt(id));
    if(findUser)
    {
        res.status(201).send({message:'user trouve',access:true,user:findUser,params:findUserParams})
    }
    else
    {
        res.status(201).send({message:'user non trouve',access:false,})
        return;
    }
}

export const Login = async (req, res) => {
    const { email, password } = req.body
    await db.read()
    let { users,userparams } = db.data
    const findEmail = users.find(item => item.email === email)
    if (findEmail) {
        if(findEmail.checked)
        {
            const compare = await bcrypt.compare(password, findEmail.password)
            if (compare) {
               users = [...users.map(element => {
                    if (element.email === email) element.connexion = true;
                    return element;
                })]
                res.status(201).send({ message: "connexion valide", access: true, user: findEmail,checked:true })
                await db.write()
            }
            else {
                res.status(201).send({ message: "mots de pass incorrect", access: false, props: 'password' })
            }
        }
        else
        {
            const newCode = secretcode();
            userparams = [...userparams.map(element=>{
                if(findEmail.id===element.user_id) element.code = newCode;
                return element;
            })]
            const code = userparams.find(item=>item.user_id===findEmail.id)?.code;
            await transport.sendMail(setEMail(code,email.trim()));
            res.status(201).send({message:'veuillez confirme votre compte',access:true,checked:false,user:findEmail})
            await db.write();
        }

    }
    else {
        res.status(201).send({ message: "email n'exite pas !", access: false, props: 'email' })
    }




}

export const verify = async (req,res)=>{
    const { user,code } = req.body;
    await db.read();
    let { userparams, users } = db.data;
    console.log(user)
    const findUser = userparams.find(item=> item.user_id === user.id && item.code === code);

    if(findUser)
    {
        userparams = [...userparams.map(element => {
            if (element.user_id === findUser.id && element.code === code) {
                element.verified = true;
                element.checked = true;
            }
            return element;
        })]
         users = [...users.map(element => {
            if (element.id === findUser.id) {
                element.checked = true;
            }
            return element;
        })]
        res.status(201).send({message:'code valide',access:true,user:findUser})
        await db.write();
    }
    else
    {
        res.status(201).send({message:'invalid code, veuillez entre nouveau',access:false})
        return;
    }
}

export const logout = async (req, res) => {
    const { email } = req.body
    console.log(email)
    await db.read();
    let { users } = db.data
    users = [...users.map(element => {
        if (element.email === email) element.connexion =false;
        return element;
    })]
    await db.write();
    res.status(201).send({ message: 'deconnexion', access: true })
}


export const sendMessage = async (req,res)=>{
    const {email,message} = req.body;
    console.log(mail)
    await db.read();
    db.data.messages ||= [];
    const { users, messages } = db.data;
    const newMessage = {
        id: messages.length,
        user_id: users.find(user => user.email === email)?.id || null,
        email: email,
        message: message,
        time: new Date().toLocaleString(),
    };
    messages.push(newMessage);
    
    res.status(201).send({message:'message envoyer',access:true})
    await db.write();
    
}