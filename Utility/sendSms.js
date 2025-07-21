import twilio from 'twilio'



const user = 'bokyshoping@gmail.com';
const pass = 'pqskurtwdprhjnws'


const twilioNumer = '+261334518889'


export const sendSms = async(code,to)=>{
    try{
        const message = await twilio.Client.message.create({
            body:`votre code de validation est ${code}`,
            from:twilioNumer,
            to:to
        })
        console.log('okay')
    }
    catch(error){
        console.error(error.message)
    }
}