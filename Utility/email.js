import nodeMailer from 'nodemailer';
import { db } from '../Database/DB.js';

const user = 'bokyshoping@gmail.com';
const pass = 'rmafskktnxlbsnpc'

export const transport = nodeMailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: user.trim(),
        pass: pass.trim()
    }
})

export async function sendingCode(to,subject,text,html='<div>hello</div>'){
    try {
        await transport.sendMail({
            from:user,
            to,
            subject,
            text,
            html
        })
        console.log('yes')
    } catch (error) {
        console.log(error)
    }
}

export const setEMail = (code,email)=>{
    const name = email.split('@')[0];
    const mail = {
        from: user,
        to: email.trim(),
        subject: 'Verification de compte',
        html:`<h1>Bonjour, <span style='color:blue;font-size:16px'> ${name}</span></h1> <hr></hr>
        <div>Votre code de verification est: <strong>${code}</strong></div>
        <hr></hr>
        <div>
        <p>cordialement </p>
        </div>
        `
    }
    return mail
}

