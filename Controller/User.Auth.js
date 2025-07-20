import { db } from '../Database/DB.js'
import bcrypt from 'bcryptjs'
import { time } from 'console'
import jwt from 'jsonwebtoken'

const SECRET_KEY = 'book-shop-mora'

export const Sigin = async (req, res) => {
    const { name, lastname, email, password, confirm, accept } = req.body;

    await db.read()
    let { users } = db.data
    const id = users.length
    const findEmail = users.find(item => item.email === email)
    if (typeof findEmail === "object" || findEmail === 'undefined') {
        res.status(202).send({ message: 'email deja exists, essaye nouveau', props: 'email', access: false })
        return
    }
    else {
        const hash = await bcrypt.hash(password, 10)
        const admin = email === "bokymora@gmail.com" ? true : false;
        db.data.userparams ||= [];
        const { userparams } = db.data;
        userparams.push({
            id: userparams.length,
            user_id: id,
            type:0,
            admin:admin,
            verified:false,
        })
        const Auth = {
            id: id, name: name, lastname: lastname, email: email, password: hash, check: accept, connexion: true, admin: admin, type: 0
        }
        users.push(Auth)
        await db.write()
        res.status(201).send({ message: 'inscrire bien enregistre', access: true, user: Auth })
    }

}


export const Login = async (req, res) => {
    const { email, password } = req.body
    await db.read()
    let { users } = db.data
    const findEmail = users.find(item => item.email === email)
    if (findEmail) {
        const compare = await bcrypt.compare(password, findEmail.password)
        if (compare) {
           users = [...users.map(element => {
                if (element.email === email) element.connexion = true;
                return element;
            })]
            res.status(201).send({ message: "connexion valide", access: true, user: findEmail })
            await db.write()
        }
        else {
            res.status(201).send({ message: "mots de pass incorrect", access: false, props: 'password' })
        }

    }
    else {
        res.status(201).send({ message: "email n'exite pas !", access: false, props: 'email' })
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