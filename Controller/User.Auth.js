import { db } from '../Database/DB.js'
import bcrypt, { hash } from 'bcryptjs'
import {  generateToken, hasing, LockHash, message, secretcode } from '../Utility/Code.js'
import { setEMail, transport } from '../Utility/email.js'





export const Sigin = async (req, res) => {
    const { name, lastname, email, password, confirm, accept } = req.body;
    await db.read()
    const secret = secretcode();
    let { users } = db.data
    const id = users.length
    const findEmail = users.find(item => item.email === email)
    if (typeof findEmail === "object" || findEmail === 'undefined') {
        const hashingMessage = await hasing(
            message(
            'email deja exists essaye nouveau',
            false,
            'email',
            '',
            '')
        )
        res.status(202).send(hashingMessage)
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
        const messages = message('inscrire bien enregistre',true,'',Auth,'',secretcode)
        res.status(201).send(await hasing(messages))
        await db.write();
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
        const messages = message('user trouve',true,'',findEmail,'','',findUserParams)
        res.status(201).send(await hasing(messages))
    }
    else
    {
        const messages = message('user non trouve',false)
        res.status(201).send(await hasing(messages) )
        return;
    }
}

export const Login = async (req, res) => {
    const { email, password } = req.body
    await db.read()
    let { users,userparams } = db.data
    const findEmail = users.find(item => item.email === email)
    if (findEmail) {
            const compare = await bcrypt.compare(password, findEmail.password)
            if (compare) {
                if(findEmail.checked)
                {
                    users = [...users.map(element => {
                         if (element.email === email) element.connexion = true;
                         return element;
                     })]
                     const messages = message('connexion valide',true,'',findEmail,'','','',true)
                     res.status(201).send(await hasing(messages))
                     await db.write()
                }
                else{
                    const newCode = secretcode();
                    userparams = [...userparams.map(element=>{
                        if(findEmail.id===element.user_id) element.code = newCode;
                        return element;
                    })]
                    const code = userparams.find(item=>item.user_id===findEmail.id)?.code;
                    await transport.sendMail(setEMail(code,email.trim()));
                    const messages = message('veuillez confirme votre compte',true,'',findEmail,'',code,'',false)
                    res.status(201).send(await hasing(messages))
                    await db.write();
                }
            }
            else {
                const messages = message('mots de pass incorrect',false,'password')
                res.status(201).send(await hasing(messages))
            }

    }
    else {
        const messages = message("email n'exit pas",false,'email')
        res.status(201).send(await hasing(messages))
    }




}



export const logout = async (req, res) => {
    const { email } = req.body
    const decryptEmail = await LockHash(email)
    await db.read();
    let { users } = db.data
    users = [...users.map(element => {
        if (element.email === decryptEmail) element.connexion =false;
        return element;
    })]
    const messages = message('deconnexion',true,'deconnexion')
    res.status(201).send(await hasing(messages))
    await db.write();
}


export const sendMessage = async (req,res)=>{
    const {email,message} = req.body;
    console.log(email)
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
    
    res.status(201).send({message:'message envoyer',success:true})
    await db.write();
    
}



