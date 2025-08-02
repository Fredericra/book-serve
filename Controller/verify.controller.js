import { db } from "../Database/DB.js";
import { hasing, LockHash, message } from "../Utility/Code.js";

export const verify = async (req,res)=>{
    const { user,code } = req.body;
    await db.read();
    const decrypt = await LockHash(user)
    const decyptCode = await LockHash(code)
    let { userparams, users } = db.data;
    const findUser = userparams.find(item=> item.user_id === decrypt.id && item.code == decyptCode);
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
        const messages = message('code valide',true,'valid',decrypt)
        res.status(201).send(await hasing(messages))
        await db.write();
    }
    else
    {
        const messages = message('invalid code, veuillez entre nouveau',false,'invalid',decrypt)
        res.status(201).send(await hasing(messages))
        return;
    }
}

export const authVerify = async(req,res)=>{
    const { email } = req.body
    const decrypt = await LockHash(email);
    await db.read(); 
    const { users,userparams } = db.data
    const findUser = users.find(item=>item.email===decrypt)
    const findCode = userparams.find(item=>item.user_id===decrypt.id);
    if(findCode)
    {
        res.status(201).send(await hasing({code:findCode.code,user:decrypt,success:true,message:'find code'}))
    }
        res.status(201).send(await hasing({user:findUser,success:false,message:'find code'}))

    await db.write();
}