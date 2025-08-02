import { carts } from "../Database/carts.js";
import { db } from "../Database/DB.js"
import { hasing, LockHash, message } from "../Utility/Code.js";


export const bussness = async(req,res)=>{
    const {user,data} = req.body

    await db.read();
    await carts.read();
    const { users } = db.data
    carts.data.profiles ||= []
    const { profiles } = carts.data
    const lockUser = await LockHash(user)
    const lockData = await LockHash(data)

    const findCart = profiles.find(item=>item.user_id===lockUser.id)
    if(findCart)
    {
        const messages = message('deja confirmée',false,'validate',lockData)
        res.status(201).send(await hasing(messages))
    }else
    {
        lockData.user_id = lockUser.id;
        carts.data.profiles.push(lockData);
        const messages = message('success',true,'validate',lockData)
        res.status(201).send(await hasing(messages))
        await carts.write();
        await db.write();
    }
}


export const setting = async(req,res)=>{
    const { id } = req.body;
    const idDecrypt = await LockHash(id);
    await carts.read();

    const { profiles } = carts.data;
    const find = profiles.find(item=>item.user_id===idDecrypt)

    if(find)
    {
        const messages = message('votre profiles',true,'profiles',find)
        res.status(201).send(await hasing(messages))
    }
    else
    {
        const messages = message('votre profiles',false,'profiles',find)
        res.status(201).send(await hasing(messages))
    }

}