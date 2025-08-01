import jsonwebtoken from 'jsonwebtoken'
import pkg from 'simple-crypto-js'


export const ACCESS_TOKEN_SECRET = 'bokyshoping-1234'
const key = 'shopping-2025'
const SimpleCrypto = pkg.default
const CryptKey = new SimpleCrypto(key);

export const hasing = async(data)=>{
    return CryptKey.encrypt(data);
}


export const message = (message,success,props,user,token,code,params,checked)=>{
    return {
        message:message,
        success:success,
        user:user,
        props:props,
        token:token,
        code:code,
        params:params,
        checked:checked
    }
}

export const secretcode = ()=>{
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
}


export const generateToken = (user)=>{
    return jsonwebtoken.sign({user:user},ACCESS_TOKEN_SECRET,{expiresIn:'1d'});
}
