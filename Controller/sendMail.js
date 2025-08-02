import nodeMailer from 'nodemailer';
import { db } from '../Database/DB.js';
import { hasing, LockHash, message } from '../Utility/Code.js';
import { newLetters } from '../Database/Message.js';

const user = 'bokyshoping@gmail.com';
const pass = 'rmafskktnxlbsnpc'

const transport = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    service: 'gmail',
    secure: false,
    auth: {
        user: user,
        pass: pass.trim()
    }
})

export const newLetter = async (req, res) => {
    const { email, sending } = req.body;
    const emailDecrypt = await LockHash(email)
    const messageDecrypt = await LockHash(sending)
    await db.read();
    await newLetters.read()
    const { users } = db.data;
    newLetters.data.messages ||= [];
    const { messages } = newLetters.data
    const findUser = users.find(item=>item.email===emailDecrypt)
    const newMailer = {
        id: messages.length,
        user_id: findUser?findUser.id:null,
        email: emailDecrypt,
        message: messageDecrypt,
        date: new Date().toISOString()
    }
    messages.push(newMailer);
    const send = message('message envoyée',true,'send')
    res.status(201).send(await hasing(send));
    await newLetters.write()
}

export const send = async (req, res) => {
    const { email, message } = req.body;
    const mail = {
        from: user,
        to: email.trim(),
        subject: 'Message de boky mora',
        text: message
    }
    transport.sendMail(mail, (errors, infos) => {
        if (errors) {
            console.log(erros);
            res.status(500).send({ message: 'Erreur lors de l\'envoi du mail', error: errors, access: false });
        } else {
            res.status(200).send({ message: 'Mail envoyé avec succès', info: infos, access: true });
        }
    });
}


export const getMessage = async(req,res)=>{
    await newLetters.read();
    const { messages } = newLetters.data
    const send = message('new letters',true,'letters',messages)
    res.status(201).send(await hasing(send))
    await newLetters.write();
}