import nodeMailer from 'nodemailer';
import { db } from '../Database/DB.js';

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
    const { email, message } = req.body;
    await db.read();
    db.data.messages ||= [];
    const { users, messages } = db.data;
    const newMailer = {
        id: messages.length,
        user_id: users.find(user => user.email === email)?.id || null,
        email: email,
        message: message,
        date: new Date().toISOString()
    }
    messages.push(newMailer);
    await db.write();
    res.status(201).send({ message: 'Message envoyé avec succès', access: true });
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