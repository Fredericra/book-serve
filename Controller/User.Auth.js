import { db } from '../Database/DB.js'
import bcrypt, { hash } from 'bcryptjs'
import { ACCESS_TOKEN_SECRET, generateToken, hasing, message, secretcode } from '../Utility/Code.js'
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
        await db.write();
        
        const messages = message('inscrire bien enregistre',true,'',findEmail,generateToken(findEmail),code)
        res.status(201).send(await hasing(messages))
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
        const messages = message('user trouve',true,'',findEmail,generateToken(findEmail),'',findUserParams)
        res.status(201).send(await hasing(messages))
    }
    else
    {
        const messages = message('user non trouve',false,'','','','','')
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
                     const messages = message('connexion valide',true,'',findEmail,generateToken(findEmail),'','',true)
                     await db.write(await hasing(messages))
                }
                else{
                    const newCode = secretcode();
                    userparams = [...userparams.map(element=>{
                        if(findEmail.id===element.user_id) element.code = newCode;
                        return element;
                    })]
                    // const code = userparams.find(item=>item.user_id===findEmail.id)?.code;
                    // await transport.sendMail(setEMail(code,email.trim()));
                    const messages = message('veuillez confirme votre compte',true,'',findEmail,generateToken(findEmail),'','',false)
                    await db.write(await hasing(messages));
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
        const messages = message('code valide',true,'',findUser,generateToken(findUser))
        res.status(201).send(await hasing(messages))
        await db.write();
    }
    else
    {
        const messages = message('invalid code, veuillez entre nouveau',false,'',findUser,generateToken(findUser))
        res.status(201).send(await hasing(messages))
        return;
    }
}

export const logout = async (req, res) => {
    const { email } = req.body
    const token = req.headers.authorizatin?.split(' ')[1]
    if(token)
    {
        blacklist.add(token)
    }
    await db.read();
    let { users } = db.data
    users = [...users.map(element => {
        if (element.email === email) element.connexion =false;
        return element;
    })]
    await db.write();
    const messages = message('deconnexion',true,'deconnexion')
    res.status(201).send(await hasing(messages))
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
    
    res.status(201).send({message:'message envoyer',success:true})
    await db.write();
    
}



export const authVerify = async(req,res)=>{
   const data = await hasing({name:'frederic',age:28});
   res.status(201).send({message:'',hash:data,success:true})
}